
import { Request, Response,NextFunction } from "express";
import Razorpay from "razorpay";
import crypto from "crypto";
import EventRegistrationModel from "../models/EventRegistration.model";
interface AuthRequest extends Request {
  user?: any;
}


export const verifyPayment = (req: Request, res: Response, next: NextFunction) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({
        success: false,
        message: "Missing payment fields (order_id, payment_id, signature)",
      });
    }

    const generatedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_SECRET as string)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    if (generatedSignature !== razorpay_signature) {
      return res.status(401).json({
        success: false,
        message: "Payment verification failed. Invalid signature.",
      });
    }

    (req as any).paymentVerified = true;
    (req as any).payment = {
      order_id: razorpay_order_id,
      payment_id: razorpay_payment_id,
    };

    next();
  } catch (err) {
    console.error("Error verifying payment:", err);
    return res.status(500).json({
      success: false,
      message: "Server error during payment verification.",
    });
  }
};