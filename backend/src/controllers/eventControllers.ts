// import { Request, Response } from "express";
// import jwt, { JwtPayload } from "jsonwebtoken";
// import Event from "../models/Event.model";
// import User from "../models/User.model";
// import EventRegistration from "../models/EventRegistration.model";
// import axios from "axios";
// import uploadOnCoudinary from "../config/cloudinary";
// interface AuthRequest extends Request {
//   user?: any;
// }



// // get all events
// export const getEvents = async(req:Request, res:Response):Promise<void>=>{
//     try {
         
//         const event = await Event.find();

//         if(!event){
//           res.status(400).json({success:false, message:"No event found"});
//           return;
//         }

//         res.status(200).json({success:true, event})
//     } catch (error : any) {
//         console.error("Register event error ", error.message);
//          res.status(500).json({ success: false, message: "Server error" });
//     }
// }

// // get event by id
// export const getEventById = async(req:Request, res:Response):Promise<void>=>{
//     try {
//          const {id} = req.params;
//          if(!id){
//           res.status(400).json({success:false, message:"Event id is required"})
//           return;
//          }
//          const event = await Event.findById(id).lean();

//          if(!event){
//           res.status(400).json({success:false, message:"No event found"});
//           return;
//          }

//          res.status(200).json({success:true, event});
//     } catch (error : any) {
//         console.error("event error ", error.message);
//          res.status(500).json({ success: false, message: "Server error" });
//     }
// }

// // join event
// export const joinEvent = async(req:Request, res:Response):Promise<void>=>{
//   try {
//     const user = (req as AuthRequest).user; 
//     if (!user) {
//       res.status(401).json({ success: false, message: "Unauthorized" });
//       return;
//     }
//     const {eventId} = req.body;

//     console.log(eventId);
    
//    const token = req.cookies?.token || req.headers['authorization']
 
// console.log(token);

    
//     if(!eventId){
//       res.status(400).json({success:false, message:"Event id is required"});
//       return;
//     }

//     const existing = await Event.findOne({
//       registeredUsers:user.id
//     })
//     if(existing){
//       res.status(400).json({success:false, message:"Already registered in this event"})
//       return;
//     }

//     const event = await Event.findOne({_id:eventId});
    
    
//       if (!event) {
//       res.status(404).json({ success: false, message: "Event not found" });
//       return;
//     }

//     if(event?.paymentType === "free"){
//      await EventRegistration.create({
//             event:eventId,
//             user:user.id,
//             paymentStatus:"completed",
//       });
//       res.json({ success: true, message: "Joined free event successfully" });
//       return;
//     }
     
//     const response = await axios.post(`${process.env.SERVER_URL}/api/payment/order`, {
//       amount: event.price,
//       eventId,
//       userId: user.id,
//     },{
//       headers:{
//         Authorization : `Bearer ${token}`
//       }
//     });
//     console.log(response);
    
//     res.json({ success: true, message: "Order created", order: response.data });
//   } catch (error : any) {
//         console.error("Join event error ", error.message);
//          res.status(500).json({ success: false, message: "Server error" });
//     }
// }