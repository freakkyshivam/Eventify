import { Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import Event from "../models/Event.model";
import User from "../models/User.model";
import EventRegistration from "../models/EventRegistration.model";
import axios from "axios";
interface AuthRequest extends Request {
  user?: any;
}

// create event
export const createEvent = async (
  req: Request,
  res: Response
): Promise<void> => {
    const user = (req as AuthRequest).user; 
    if (!user || user?.role !== "admin") {
      res.status(401).json({ success: false, message: "Invalide credntials" });
      return;
    }
  try {
    const {
      title,
      description,
      banner,
      startDate,
      endDate,
      location,
      capacity,
      category,
      paymentType,
      price,
      status,
    } = req.body;

    if (!title) {
      res.status(400).json({ success: false, message: "Title is required" });
      return;
    }
    if (!description) {
      res
        .status(400)
        .json({ success: false, message: "Description is required" });
      return;
    }
    if (!banner) {
      res.status(400).json({ success: false, message: "Banner is required" });
      return;
    }

    if (!startDate || !endDate) {
      res
        .status(400)
        .json({
          success: false,
          message: "Start date and end date are required",
        });
      return;
    }


    const newEvent = new Event({
      title,
      description,
      banner,
      startDate,
      endDate,
      location,
      capacity,
      category,
      paymentType,
      price,
      status,
      author: user.id,
    });

    await newEvent.save();
     await User.findByIdAndUpdate(user.id, {
      $push: { createdEvents: newEvent._id },
    });

    res.status(201).json({ success: true, newEvent });
  } catch (error: any) {
    console.error("New Event create error ", error.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// get all events
export const getEvents = async(req:Request, res:Response):Promise<void>=>{
    try {
         
        const event = await Event.find();

        if(!event){
          res.status(400).json({success:false, message:"No event found"});
          return;
        }

        res.status(200).json({success:true, event})
    } catch (error : any) {
        console.error("Register event error ", error.message);
         res.status(500).json({ success: false, message: "Server error" });
    }
}

// get event by id
export const getEventById = async(req:Request, res:Response):Promise<void>=>{
    try {
         const {id} = req.params;
         if(!id){
          res.status(400).json({success:false, message:"Event id is required"})
          return;
         }
         const event = await Event.findOne({id});

         if(!event){
          res.status(400).json({success:false, message:"No event found"});
          return;
         }

         res.status(200).json({success:true, event});
    } catch (error : any) {
        console.error("Register event error ", error.message);
         res.status(500).json({ success: false, message: "Server error" });
    }
}

// join event
export const joinEvent = async(req:Request, res:Response):Promise<void>=>{
  try {
    const user = (req as AuthRequest).user; 
    if (!user) {
      res.status(401).json({ success: false, message: "Unauthorized" });
      return;
    }
    const {eventId} = req.body;
   console.log(eventId);
   
    
    if(!eventId){
      res.status(400).json({success:false, message:"Event id is required"});
      return;
    }

    const existing = await Event.findOne({
      registeredUsers:user.id
    })
    if(existing){
      res.status(400).json({success:false, message:"Already registered in this event"})
      return;
    }

    const event = await Event.findOne({_id:eventId});
    
    
      if (!event) {
      res.status(404).json({ success: false, message: "Event not found" });
      return;
    }

    if(event?.paymentType === "free"){
     await EventRegistration.create({
            event:eventId,
            user:user.id,
            paymentStatus:"completed",
      });
      res.json({ success: true, message: "Joined free event successfully" });
      return;
    }
     
    const response = await axios.post(`${process.env.SERVER_URL}/api/payment/order`, {
      amount: event.price,
      eventId,
      userId: user.id,
    });
    res.json({ success: true, message: "Order created", order: response.data });
  } catch (error : any) {
        console.error("Join event error ", error.message);
         res.status(500).json({ success: false, message: "Server error" });
    }
}