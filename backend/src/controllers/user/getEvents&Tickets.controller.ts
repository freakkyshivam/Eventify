import { Request, Response } from "express";

import { events } from "../../db/schema/event.model";
import { event_registration_table } from "../../db/schema/event_registration.schema";
import db from "../../db/db"
import { desc, eq } from "drizzle-orm";

import {payment_table} from '../../db/schema/payment_schema'

export const getAllUserJoinedEvent = async(req:Request, res:Response)=>{
    try {

        const user = req.user;
        console.log(user);
        

        if(!user?.id){
            return  res.status(401).json({
                success :  false,
                msg : "Unauthorized"
            })
        }
        
        const result = await db.select(
            {
                eventId: events.id,
                title: events.title,
                price : events.price,
                slug : events.slug,
                description : events.description,
                event_mode : events.event_mode,
                event_status : events.event_status ,
                registration_status : event_registration_table.registration_status,
                registration_deadline : events.registration_deadline,
                bannerUrls : events.bannerUrls,
            }
        )
                .from(event_registration_table)
                .rightJoin(
                    events,
                    eq(event_registration_table.event_id, events.id)
                ).where(
                    eq(event_registration_table.user_id, user.id)
                )
                .orderBy(desc(event_registration_table.created_at))
                
                if(result.length === 0){
                    console.log("Not found any events");
                    return res.status(400).json({
                        success : true,
                        msg : "No events found"
                    })
                }
            
                const upcomingEvents = result.filter((a)=>a.event_status === 'upcoming' )
                const completedEvents = result.filter((a)=> a.event_status === 'completed')
                return res.status(200).json({
                    success : true,
                    results : {
                        upcomingEvents,
                        completedEvents,
                        totalEvents : result
                    }
                })

    } catch (error) {
        console.error("User joined event fetching error ", error)
        return res.status(500).json({
            success : false,
            msg : "User joined event fetching error"
        })
    }
}


export const getAllTickets = async (req: Request, res: Response) => {
  try {
    const user = req.user;

    if (!user?.id) {
      return res.status(401).json({
        success: false,
        msg: "Unauthorized",
      });
    }

    if (user.role !== "attendee") {
      return res.status(403).json({
        success: false,
        msg: "Forbidden",
      });
    }

    const results = await db
      .select({
        payment_status: payment_table.payment_status,
        registration_id: payment_table.registration_id,
        payment_id: payment_table.payment_id,
        razorpay_order_id: payment_table.razorpay_order_id,

        ticket_code: event_registration_table.ticket_code,
        registration_status: event_registration_table.registration_status,

        title: events.title,
        description: events.description,
        start_time: events.start_time,
        end_time: events.end_time,
        registration_deadline: events.registration_deadline,
        event_status: events.event_status,
      })
      .from(event_registration_table)
      .leftJoin(
        payment_table,
        eq(payment_table.registration_id, event_registration_table.id)
      )
      .leftJoin(events, eq(events.id, event_registration_table.event_id))
      .where(eq(event_registration_table.user_id, user.id))
      .orderBy(desc(event_registration_table.created_at));

    if (results.length === 0) {
      return res.status(404).json({
        success: false,
        msg: "No tickets found",
      });
    }

    return res.status(200).json({
      success: true,
      results,
    });
  } catch (error) {
    console.error("User Ticket fetching error", error);

    return res.status(500).json({
      success: false,
      msg: "User Ticket fetching error",
    });
  }
};