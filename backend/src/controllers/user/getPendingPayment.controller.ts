import { Request, Response } from "express";
import db from "../../db/db";
import { events } from "../../db/schema/event.model";
import { event_registration_table } from "../../db/schema/event_registration.schema";
import { payment_table } from "../../db/schema/payment_schema";
import { eq } from "drizzle-orm";

export const getAllPendingPaymentAndEvents = async(req : Request, res : Response)=>{
    try {
        
        const user = req.user;

        if(!user?.id){
            return res.status(401).json({
                success : false,
                msg :"Unauthorized"
            })
        }

        const [result] = await db.select()
        .from(event_registration_table)
        .innerJoin(
            payment_table,
            eq(event_registration_table.id, payment_table.registration_id)
        ).where(eq(event_registration_table.user_id, user.id));

        if(!result){
            return res.status(400).json({
                success : false,
                msg : "No pending payment found"
            })
        }

        return res.status(200).json({
            success : true,
            result
        })

    } catch (error) {
        console.error("User pending payment fetching error ", error);
        res.status(500).json({
            success : false,
            msg : "User pending payment fetching error"
        })
    }
}