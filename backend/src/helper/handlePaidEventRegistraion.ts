import { Request, Response } from "express";
import { events } from "../db/schema/event.model";
import { event_registration_table } from "../db/schema/event_registration.schema";
import db from "../db/db";
import { eq, sql, and, gt } from "drizzle-orm";
import { generateTicketCode } from "../utils/generateTicket";
import { payment_table } from "../db/schema/payment_schema";
import { getRazorpay } from "../config/razorpay";

const razorpay = getRazorpay();

export async function handlePaidEventRegistration(
  eventId: string,
  userId: string,
  ticketCode: string,
  eventPrice: number,
  res: Response
): Promise<void> {
  // Create pending registration and payment order in transaction
  const result = await db.transaction(async (tx) => {
    // Create pending registration
    const [registration] = await tx
      .insert(event_registration_table)
      .values({
        user_id: userId,
        event_id: eventId,
        registration_status: "pending",
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

    // Create Razorpay order
    const order = await razorpay.orders.create({
      amount: Math.round(eventPrice * 100), // Convert to paise and ensure integer
      currency: "INR",
      receipt: `order_${Date.now()}`,
      notes: {
        event_id: eventId,
        user_id: userId,
        registration_id: registration.id,
      },
    });

    // Store payment details
    await tx.insert(payment_table).values({
      registration_id: registration.id,
      razorpay_order_id: order.id,
      amount: eventPrice.toString(),
      currency: "INR",
      payment_status: "pending",
    });

    return {
      registration,
      order,
    };
  });

  res.status(201).json({
    success: true,
    msg: "Payment order created",
    order_id: result.order.id,
    amount: result.order.amount,
    currency: result.order.currency,
    key: process.env.RAZORPAY_KEY_ID,
    registration_id: result.registration.id,
  });
}