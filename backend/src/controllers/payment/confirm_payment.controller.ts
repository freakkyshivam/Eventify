import { Request, Response } from "express";
import { events } from "../../db/schema/event.model";
import { event_registration_table } from "../../db/schema/event_registration.schema";
import db from "../../db/db";
import { eq, sql,and,gt } from "drizzle-orm";
import { generateTicketCode } from "../../utils/generateTicket";
import { payment_table } from "../../db/schema/payment_schema";

export const confirmPayment = async(req:Request, res : Response)=>{
    try {
        const {order_id, payment_id} = (req as any).payment;

        const result = await db.transaction(async (tx)=>{
            const [payment] = await tx.select()
            .from(payment_table)
            .where(eq(payment_table.razorpay_order_id, order_id));

            if (!payment) {
      throw new Error("PAYMENT_NOT_FOUND");
    }

    if (payment.payment_status === "completed") {
      throw new Error("PAYMENT_ALREADY_PROCESSED");
    }

            await tx.update(payment_table)
            .set({
                payment_status : "completed",
                payment_id : payment_id
            })

            await tx.update(event_registration_table)
            .set({
                registration_status : "registered"
            })
            .where(eq(event_registration_table.id, payment.registration_id));

            await tx
        .update(events)
        .set({ capacity: sql`${events.capacity} - 1` })
        .where(and(eq(events.id, payment.registration_id), gt(events.capacity, 0)));
        })

        return res.status(200).json({
            success : true,
            msg : "Payment verified and registration completed"
        })

    } catch (error) {
        console.error("Payment confirmation failed", error);
        res.status(500).json({
            success : false,
            msg : "Payment confirmation error"
        })
    }
}