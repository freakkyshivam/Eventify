import { Request, Response } from "express";
import { events } from "../../db/schema/event.model";
import { event_registration_table } from "../../db/schema/event_registration.schema";
import db from "../../db/db";
import { eq, sql, and, gt } from "drizzle-orm";
import { generateTicketCode } from "../../utils/generateTicket";
import { payment_table } from "../../db/schema/payment_schema";
import { getRazorpay } from "../../config/razorpay";
 
import { handleFreeEventRegistration } from "../../helper/handleFreeEventRegistraion";
import { handlePaidEventRegistration } from "../../helper/handlePaidEventRegistraion";
 
class EventRegistrationError extends Error {
  constructor(
    message: string,
    public statusCode: number = 400
  ) {
    super(message);
    this.name = "EventRegistrationError";
  }
}

export const event_registration = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { eventId } = req.params;
    const user = req.user;

    // Validate user authentication
    if (!user?.id) {
      res.status(401).json({
        success: false,
        msg: "Unauthorized",
      });
      return;
    }

    if(user.role !== 'attendee'){
       res.status(400).json({
        success : false,
        msg : "Only user can join in events"
      })
      return;
    }

    // Validate event ID
    if (!eventId) {
      res.status(400).json({
        success: false,
        msg: "Event ID is required",
      });
      return;
    }

    // Fetch event details
    const [event] = await db
      .select()
      .from(events)
      .where(eq(events.id, eventId));

    if (!event) {
      res.status(404).json({
        success: false,
        msg: "Event not found",
      });
      return;
    }

    // Validate event availability
    if (event.capacity === 0) {
      res.status(400).json({
        success: false,
        msg: "No seats available",
      });
      return;
    }

    if (event.registration_deadline < new Date()) {
      res.status(400).json({
        success: false,
        msg: "Registration deadline has passed",
      });
      return;
    }

    // Check for existing registration
    const [existingRegistration] = await db
      .select()
      .from(event_registration_table)
      .where(
        and(
          eq(event_registration_table.user_id, user.id),
          eq(event_registration_table.event_id, eventId)
        )
      );

    // Handle existing registrations
    if (existingRegistration) {
      if (existingRegistration.registration_status === "registered") {
        res.status(400).json({
          success: false,
          msg: "Already registered for this event",
        });
        return;
      }

      if (existingRegistration.registration_status === "pending") {
        const [existingPayment] = await db
          .select()
          .from(payment_table)
          .where(eq(payment_table.registration_id, existingRegistration.id));

        if (existingPayment) {
          res.status(200).json({
            success: true,
            msg: "Payment already pending",
            order_id: existingPayment.razorpay_order_id,
            amount: existingPayment.amount,
            currency: existingPayment.currency,
            key: process.env.RAZORPAY_KEY_ID,
          });
          return;
        }
      }
    }

    // Generate unique ticket code
    const ticketCode = generateTicketCode();

    // Handle free events
    if (event.payment_type === "free") {
      await handleFreeEventRegistration(eventId, user.id, ticketCode, res);
      return;
    }

    // Handle paid events
    await handlePaidEventRegistration(eventId, user.id, ticketCode, event.price, res);
  } catch (error: any) {
    console.error("Event registration error:", error?.message ?? error);

    // Handle specific error cases
    if (error.message === "NO_SEATS") {
      res.status(400).json({
        success: false,
        msg: "No seats available",
      });
      return;
    }

    if (error.message === "ALREADY_REGISTERED") {
      res.status(400).json({
        success: false,
        msg: "Already registered for this event",
      });
      return;
    }

    if (error instanceof EventRegistrationError) {
      res.status(error.statusCode).json({
        success: false,
        msg: error.message,
      });
      return;
    }

    res.status(500).json({
      success: false,
      msg: "Event registration failed",
    });
  }
};

 
