import { Request, Response } from "express";

import { events } from "../../db/schema/event.model";
import { event_registration_table } from "../../db/schema/event_registration.schema";
import db from "../../db/db";
import { eq, sql,and,gt } from "drizzle-orm";
import { generateTicketCode } from "../../utils/generateTicket";
import { payment_table } from "../../db/schema/payment_schema";
import { getRazorpay } from "../../config/razorpay";

const razorpay = getRazorpay();

export const event_registration = async (req: Request, res: Response) => {
  try {
    const { eventId } = req.params;
    const user = req.user;

    if (!user?.id) {
      return res.status(401).json({
        suceess: false,
        msg: "Unauthorized",
      });
    }

    if (!eventId) {
      return res.status(400).json({
        success: false,
        msg: "Event id is required",
      });
    }

    const [event] = await db
      .select()
      .from(events)
      .where(eq(events.id, eventId));

    if (!event) {
      return res.status(400).json({
        success: false,
        msg: "Event not found",
      });
    }

    if (event.capacity === 0) {
      return res.status(400).json({
        success: false,
        msg: "Seat is not availble",
      });
    }

    if (event.registration_deadline < new Date()) {
      return res.status(400).json({
        success: false,
        msg: "Registration is closed for this event",
      });
    }

    // generate ticket
    const ticket_code = generateTicketCode();

    // for free event 
    if (event.payment_type === "free") {

  const result = await db.transaction(async (tx) => {
    // decrent event capcity if greater than 0
    const updated = await tx
      .update(events)
      .set({ capacity: sql`${events.capacity} - 1` })
      .where(and(eq(events.id, eventId), gt(events.capacity, 0)))
      .returning({ id: events.id });

    if (updated.length === 0) {
      throw new Error("NO_SEATS");
    }

    const [registration] = await tx
      .insert(event_registration_table)
      .values({
        user_id: user.id,
        event_id: eventId,
        registration_status: "registered",
        ticket_code,
      })
      .onConflictDoNothing()
      .returning({
        id: event_registration_table.id,
        ticket_code: event_registration_table.ticket_code,
      });

    if (!registration) {
      throw new Error("ALREADY_REGISTERED");
    }

    return registration;
  });

  return res.status(201).json({
    success: true,
    msg: "Successfully joined free event",
    data: result,
  });
}

 
const [registration] = await db.transaction(async (tx) => {
  const [r] = await tx
    .insert(event_registration_table)
    .values({
      user_id: user.id,
      event_id: eventId,
      registration_status: "pending",
      ticket_code,
    })
    .onConflictDoNothing()
    .returning({ id: event_registration_table.id });

  if (!r) throw new Error("ALREADY_REGISTERED");
  return [r];
});

 
const order = await razorpay.orders.create({
  amount: event.price * 100,
  currency: "INR",
  receipt: `event_${eventId}_${Date.now()}`,
});

 
await db.insert(payment_table).values({
  registration_id: registration.id,
  razorpay_order_id: order.id,
  amount: event.price.toString(),
  currency: "INR",
  payment_status: "pending",
});



return res.status(201).json({
  success: true,
  order_id: order.id,
  amount: order.amount,
  currency: order.currency,
  key: process.env.RAZORPAY_KEY_ID,
});
  
  } catch (error) {
    console.error("Event registration error ", error);
    res.status(500).json({
      success: false,
      msg: "Event registration error",
    });
  }
};
