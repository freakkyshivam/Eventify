import { Request, Response } from "express";
import db from "../../db/db";
import events from "../../db/schema/event.model";
import { eventsValidation,updateEventValidation } from "../../validation/validation";
import { and, eq } from "drizzle-orm";
import { generateSlug } from "../../utils/slug";

export const createEvent = async (req: Request, res: Response) => {
  try {
    const user = req.user;
    console.log(user);
    
    if (!user?.id) {
      console.log("Here");
      
      return res.status(401).json({
        success: false,
        msg: "Unoauthorized",
      });
    }

    if (user?.role === "attendee") {
      return res.status(403).json({
        success: false,
        msg: "Unaothorized",
      });
    }

    const validationResult = eventsValidation.safeParse(req.body);

    if (validationResult.error) {
      console.log(validationResult.error);
      
      return res.status(400).json({
        success: false,
        msg: validationResult?.error?.flatten,
      });
    }

    const {
      title,
      description,
      start_time,
      end_time,
      registration_deadline,
      location,
      event_mode,
      capacity,
      event_category,
      payment_type,
      price,
    } = validationResult.data;

    // const {bannerUrls} = req.file()

    const slug = await generateSlug(title)
    await db.insert(events).values({
      title,
      description,
      slug,
      // bannerUrls,
      start_time: new Date(start_time),
      end_time: new Date(end_time),
      registration_deadline: new Date(registration_deadline),
      location,
      event_mode,
      capacity,
      event_category,
      payment_type,
      price: Number(price),
      authorId: req.user!.id,
    });

    return res.status(200).json({
        success:true,
        msg : "Event successfully created"
    })

  } catch (error: any) {
    console.error("Event creation error ", error);
    res.status(500).json({
      success: false,
      msg: "Internal server error",
    });
  }
};


export const updateEvent = async(req:Request, res:Response)=>{
    try {
        
        const {eventId} = req.params;
         const user = req.user;
    
    if (!user?.id) {
      return res.status(401).json({
        success: false,
        msg: "Unoauthorized",
      });
    }

    if (user?.role === "attendee") {
      return res.status(403).json({
        success: false,
        msg: "Unaothorized",
      });
    }
    ;
    
    const validationResult = updateEventValidation.safeParse(req.body);

    if (validationResult.error) {
      return res.status(400).json({
        success: false,
        msg: validationResult?.error,
      });
    }

    const data = validationResult.data;
 

      const updatedData: any = {
      ...data,
      ...(data.start_time && { start_time: new Date(data.start_time) }),
      ...(data.end_time && { end_time: new Date(data.end_time) }),
      ...(data.registration_deadline && {
        registration_deadline: new Date(data.registration_deadline),
      }),
    };

    await db.update(events)
            .set(updatedData)
            .where(
                and(
                    eq(events.id, eventId),
                    eq(events.authorId, user?.id)
                )
            )

            return res.status(200).json({
                success:true,
                msg : "Event details updated"
            })

    } catch (error: any) {
    console.error("Event creation error ", error);
    res.status(500).json({
      success: false,
      msg: "Internal server error",
    });
  }
}