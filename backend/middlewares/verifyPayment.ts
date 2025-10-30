
import { Request, Response,NextFunction } from "express";
import Razorpay from "razorpay";
import crypto from "crypto";
import EventRegistrationModel from "../models/EventRegistration.model";
interface AuthRequest extends Request {
  user?: any;
}


export const verifyPayment = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
    const user = (req as AuthRequest).user 
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      res.status(400).json({
        success: false,
        message: "Missing payment verification fields",
      });
      return;
    }

    if (!process.env.RAZORPAY_KEY_SECRET) {
      throw new Error("Razorpay key secret not configured");
    }

    
    const sign = `${razorpay_order_id}|${razorpay_payment_id}`;
    const expectedSign = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(sign)
      .digest("hex");
 
    if (expectedSign === razorpay_signature) {
      res.status(200).json({
        success: true,
        message: "Payment verified successfully",
        redirectUrl: "",
      });
      EventRegistrationModel.findByIdAndUpdate(user.id, {
        paymentStatus:"completed"
      },{
        new:true,
        runValidators:true,
      })
    }  
    (req as any).paymentVerified = true;
    (req as any).payment = {
      order_id: razorpay_order_id,
      payment_id: razorpay_payment_id,
    };

    next();
  } catch (error: any) {
    console.error("Payment verification failed:", error.message);
    res.status(500).json({
      success: false,
      message: "Server error during payment verification",
    });
  }
};
