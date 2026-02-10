import { Request, Response } from "express";

import { events } from "../../db/schema/event.model";
import { event_registration_table } from "../../db/schema/event_registration.schema";
import db from "../../db/db"
import { eq } from "drizzle-orm";

export const getAllEvent = async (req : Request, res : Response)=>{
    try {
        const result = await db.select().from(events);

        if(result.length < 0){
            return res.status(400).json({
                success :false,
                msg : "No event found"
            })
        }

        return res.status(200).json({
            success : true,
             result,
        })
    } catch (error) {
        console.error("Fetch all events failed ", error);
        return res.status(500).json({
            success : false,
            msg : "Fetch all events failed"
        })
    }
}

export const getAllUserJoinedEvent = async(req:Request, res:Response)=>{
    try {

        const user = req.user;

        if(!user?.id){
            return  res.status(401).json({
                success :  false,
                msg : "Unauthorized"
            })
        }
        
        if(user?.role != "attendee"){
            return res.status(401).json({
                success : false,
                msg : "Only user can access own joined events"
            })
        }

        const result = await db.select()
                .from(event_registration_table)
                .innerJoin(
                    events,
                    eq(event_registration_table.id, events.id)
                ).where(
                    eq(event_registration_table.user_id, user.id)
                )
        
                if(!result){
                    return res.status(400).json({
                        success : true,
                        msg : "No events found"
                    })
                }

                return res.status(200).json({
                    success : true,
                    events : result
                })

    } catch (error) {
        console.error("User joined event fetching error ", error)
        return res.status(500).json({
            success : false,
            msg : "User joined event fetching error"
        })
    }
}