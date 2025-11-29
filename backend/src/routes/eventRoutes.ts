import express from 'express'
import UserModel from '../models/User.model';
import { Request, Response } from "express";
import { createEvent,joinEvent,getEvents, getEventById } from '../controllers/eventControllers';
import { authMiddleware } from '../middlewares/authMiddleware';
import EventRegistration from '../models/EventRegistration.model';
import { verifyPayment } from '../middlewares/verifyPayment';
import {upload} from "../middlewares/multer"
const eventRouter = express.Router();

 eventRouter.post('/events',authMiddleware,upload.array("banner", 5), createEvent);
 eventRouter.post('/join-event',authMiddleware,joinEvent)
eventRouter.get('/events', getEvents);
eventRouter.get("/events/:id",getEventById)

interface AuthRequest extends Request{
  user? : any;
}

 eventRouter.post("/verify-payment",authMiddleware, verifyPayment, async (req, res) => {
  try {
    if (!(req as any).paymentVerified) {
      return res.status(400).json({ success: false, message: "Payment not verified" });
    }

    const { eventId } = req.body;
    const user = (req as AuthRequest).user;

  
    await EventRegistration.create({
      event: eventId,
      user: user.id,
      paymentStatus: "completed",
      paymentId: (req as any).payment.payment_id,
      orderId: (req as any).payment.order_id,
    });

    await UserModel.findByIdAndUpdate(
  user.id,
  { $addToSet: { registeredEvents: eventId } },  
  { new: true }
);

    res.json({ success: true, message: "Payment verified and event joined successfully" });
  } catch (err) {
    console.error("Error in payment verification route:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});
export default  eventRouter