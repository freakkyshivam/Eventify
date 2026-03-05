import { Request, Response } from "express";

import { events } from "../../db/schema/event.model";
import { event_registration_table } from "../../db/schema/event_registration.schema";
import db from "../../db/db"
import { desc, eq } from "drizzle-orm";
 
import { event_registration } from "./event_registration.controller";
import {payment_table} from '../../db/schema/payment_schema'

export const getAllEvent = async (req : Request, res : Response)=>{
    try {
        const results = await db.select().from(events).orderBy(desc(events.createdAt));

        if(results.length < 0){
            return res.status(400).json({
                success :false,
                msg : "No event found"
            })
        }

        return res.status(200).json({
            success : true,
             results,
        })
    } catch (error) {
        console.error("Fetch all events failed ", error);
        return res.status(500).json({
            success : false,
            msg : "Fetch all events failed"
        })
    }
}

export const getEventBySlug = async(req:Request, res : Response)=>{
    try {

        const {slug } = req.params;

        if(!slug){
            return res.status(400).json({
                success : false,
                msg : "Slug is required"
            })
        }

        const [results] = await db.select()
                .from(events)
                .where(eq(events.slug, slug));

                if(!results){
                    return res.status(200).json({
                        success : true,
                        msg : "No events found"
                    })
                }

                return res.status(200).json({
                    success : true,
                    results
                })
        
    } catch (error) {
        console.error("Fetch all events failed ", error);
        return res.status(500).json({
            success : false,
            msg : "Fetch all events failed"
        })
    }
}