import { Request, Response } from "express";
import { events } from "../../db/schema/event.model";
import { event_registration_table } from "../../db/schema/event_registration.schema";
import db from "../../db/db";
import { eq, sql, and, gt } from "drizzle-orm";
import { generateTicketCode } from "../../utils/generateTicket";
import { payment_table } from "../../db/schema/payment_schema";

interface PaymentRequest extends Request {
  payment?: {
    order_id: string;
    payment_id: string;
  };
}

export const confirmPayment = async (
  req: PaymentRequest,
  res: Response
): Promise<void> => {
  try {
    // Validate payment data from middleware
    if (!req.payment?.order_id || !req.payment?.payment_id) {
      res.status(400).json({
        success: false,
        msg: "Payment verification data missing",
      });
      return;
    }

    const { order_id, payment_id } = req.payment;

    const result = await db.transaction(async (tx) => {
      // Fetch payment record
      const [payment] = await tx
        .select()
        .from(payment_table)
        .where(eq(payment_table.razorpay_order_id, order_id))
        .for("update"); // Lock row to prevent race conditions

      // Validate payment exists
      if (!payment) {
        throw new Error("PAYMENT_NOT_FOUND");
      }

      // Check for duplicate processing (idempotency)
      if (payment.payment_status === "completed") {
        return {
          alreadyProcessed: true,
          registration_id: payment.registration_id,
        };
      }

      // Fetch event registration to get event_id
      const [registration] = await tx
        .select()
        .from(event_registration_table)
        .where(eq(event_registration_table.id, payment.registration_id))
        .for("update"); // Lock row

      if (!registration) {
        throw new Error("REGISTRATION_NOT_FOUND");
      }

      // Validate event_id exists
      if (!registration.event_id) {
        throw new Error("REGISTRATION_MISSING_EVENT_ID");
      }

      // Fetch event to validate capacity
      const [event] = await tx
        .select()
        .from(events)
        .where(eq(events.id, registration.event_id))
        .for("update"); // Lock row

      if (!event) {
        throw new Error("EVENT_NOT_FOUND");
      }

      if (event.capacity <= 0) {
        throw new Error("EVENT_FULL");
      }

      // Generate unique ticket code
      const ticketCode = generateTicketCode();

      // Update payment status
      await tx
        .update(payment_table)
        .set({
          payment_status: "completed",
          payment_id: payment_id,
          updated_at: new Date(),
        })
        .where(eq(payment_table.razorpay_order_id, order_id));

      // Update registration status with ticket code
      await tx
        .update(event_registration_table)
        .set({
          registration_status: "registered",
          ticket_code: ticketCode,
          registration_date: new Date(),
        })
        .where(eq(event_registration_table.id, payment.registration_id));

      // Decrement event capacity
      const [updatedEvent] = await tx
        .update(events)
        .set({
          capacity: sql`${events.capacity} - 1`,
          updatedAt: new Date(),
        })
        .where(
          and(
            eq(events.id, registration.event_id), // TypeScript now knows this is string, not string | null
            gt(events.capacity, 0)
          )
        )
        .returning();

      // Verify capacity was actually decremented
      if (!updatedEvent) {
        throw new Error("EVENT_CAPACITY_UPDATE_FAILED");
      }

      return {
        alreadyProcessed: false,
        registration_id: payment.registration_id,
        event_id: registration.event_id,
        ticket_code: ticketCode,
      };
    });

    // Handle already processed payments
    if (result.alreadyProcessed) {
      res.status(200).json({
        success: true,
        msg: "Payment already processed",
        registration_id: result.registration_id,
      });
      return;
    }

    // Success response
    res.status(200).json({
      success: true,
      msg: "Payment verified and registration completed",
      data: {
        registration_id: result.registration_id,
        event_id: result.event_id,
        ticket_code: result.ticket_code,
      },
    });
  } catch (error: any) {
    console.error("Payment confirmation failed:", {
      error: error?.message ?? error,
      order_id: req.payment?.order_id,
      timestamp: new Date().toISOString(),
    });

    // Handle specific error cases
    if (error.message === "PAYMENT_NOT_FOUND") {
      res.status(404).json({
        success: false,
        msg: "Payment record not found",
      });
      return;
    }

    if (error.message === "PAYMENT_ALREADY_PROCESSED") {
      res.status(409).json({
        success: false,
        msg: "Payment has already been processed",
      });
      return;
    }

    if (error.message === "REGISTRATION_NOT_FOUND") {
      res.status(404).json({
        success: false,
        msg: "Registration not found",
      });
      return;
    }

    if (error.message === "REGISTRATION_MISSING_EVENT_ID") {
      res.status(400).json({
        success: false,
        msg: "Registration is missing event reference",
      });
      return;
    }

    if (error.message === "EVENT_NOT_FOUND") {
      res.status(404).json({
        success: false,
        msg: "Event not found",
      });
      return;
    }

    if (error.message === "EVENT_FULL") {
      res.status(409).json({
        success: false,
        msg: "Event is at full capacity",
      });
      return;
    }

    if (error.message === "EVENT_CAPACITY_UPDATE_FAILED") {
      res.status(409).json({
        success: false,
        msg: "Event capacity update failed - event may be full",
      });
      return;
    }

    // Generic error response
    res.status(500).json({
      success: false,
      msg: "Payment confirmation error",
    });
  }
};