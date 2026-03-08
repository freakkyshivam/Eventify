import { Request, Response } from "express";

import { events } from "../../db/schema/event.model";
import { event_registration_table } from "../../db/schema/event_registration.schema";
import db from "../../db/db"
import { desc, eq, and } from "drizzle-orm";
 
import { event_registration } from "./event_registration.controller";
import {payment_table} from '../../db/schema/payment_schema'
import { users } from "../../db";

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

        const [results] = await db.select({
            id : events.id,
            title : events.title,
            description : events.description,
            start_time : events.start_time,
            end_time : events.end_time,
            registration_deadline : events.registration_deadline,
            slug : events.slug,
            location : events.location,
            event_mode : events.event_mode,
            capacity : events.capacity,
            event_category : events.event_category,
            payment_type : events.payment_type,
            price : events.price,
            bannerUrls : events.bannerUrls,
            organizer_name : users.name
        })
                .from(events)
                .leftJoin(users, eq(events.authorId, users.id))
                .where(and(
                    eq(events.slug, slug),
                    eq(users.id, users.id)
                ));

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