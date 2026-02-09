import { Request, Response, NextFunction } from "express";
import crypto from "crypto";

interface PaymentRequest extends Request {
  payment?: {
    order_id: string;
    payment_id: string;
  };
}

export const verifyRazorpaySignature = (
  req: PaymentRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    // from frontend
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({
        success: false,
        message: "Missing payment verification fields",
      });
    }

    if (!process.env.RAZORPAY_KEY_SECRET) {
      throw new Error("Razorpay secret not configured");
    }

    const generatedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    const isValid = crypto.timingSafeEqual(
      Buffer.from(generatedSignature),
      Buffer.from(razorpay_signature)
    );

    if (!isValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid payment signature",
      });
    }

    req.payment = {
      order_id: razorpay_order_id,
      payment_id: razorpay_payment_id,
    };

    next();
  } catch (err) {
    console.error("Payment verification error:", err);
    return res.status(500).json({
      success: false,
      message: "Payment verification failed",
    });
  }
};
