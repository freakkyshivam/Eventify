
import { Request, Response } from "express";
import { events } from "../db/schema/event.model";
import { event_registration_table } from "../db/schema/event_registration.schema";
import db from "../db/db";
import { eq, sql, and, gt } from "drizzle-orm";
import { generateTicketCode } from "../utils/generateTicket";
import { payment_table } from "../db/schema/payment_schema";
import { getRazorpay } from "../config/razorpay";

export async function handleFreeEventRegistration(
  eventId: string,
  userId: string,
  ticketCode: string,
  res: Response
): Promise<void> {
  const result = await db.transaction(async (tx) => {
    // Decrement event capacity atomically
    const [updatedEvent] = await tx
      .update(events)
      .set({ capacity: sql`${events.capacity} - 1` })
      .where(and(eq(events.id, eventId), gt(events.capacity, 0)))
      .returning({ id: events.id, capacity: events.capacity });

    if (!updatedEvent) {
      throw new Error("NO_SEATS");
    }

    // Create registration
    const [registration] = await tx
      .insert(event_registration_table)
      .values({
        user_id: userId,
        event_id: eventId,
        registration_status: "registered",
        ticket_code: ticketCode,
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

   res.status(201).json({
    success: true,
    msg: "Successfully registered for free event",
    data: {
      registration_id: result.id,
      ticket_code: result.ticket_code,
    },
  });
  return;
}