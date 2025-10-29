import { Request, Response } from "express";
import Razorpay from "razorpay";
import crypto from "crypto";
interface AuthRequest extends Request {
  user?: { id: string; email?: string; name?: string };
}

export const createOrder = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { amount, eventId } = req.body;
    const user = req.user;

    if (!user) {
      res.status(401).json({ success: false, message: "Unauthorized" });
      return;
    }

    if (!amount || !eventId) {
      res.status(400).json({ success: false, message: "Amount and Event ID are required" });
      return;
    }

    if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
      throw new Error("Razorpay keys not configured in environment variables");
    }

    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    const options = {
      amount: amount * 100, 
      currency: "INR",
      receipt: `order_${Date.now()}`,
      notes: {
        eventId,
        userId: user.id,
      },
    };

    const order = await razorpay.orders.create(options);

    res.status(201).json({
      success: true,
      message: "Order created successfully",
      orderId: order.id,
      currency: order.currency,
      amount: order.amount,
      key: process.env.RAZORPAY_KEY_ID,
    });
  } catch (error: any) {
    console.error("Order creation error:", error.message);
    res.status(500).json({ success: false, message: "Order creation failed", error: error.message });
  }
};

 

export const verifyPayment = async (req: Request, res: Response): Promise<void> => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

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
      // (Optional) Save payment details to database here
      // Example: await Payment.create({ razorpay_order_id, razorpay_payment_id, userId, status: "paid" });

      res.status(200).json({
        success: true,
        message: "Payment verified successfully",
        redirectUrl: "",
      });
    } else {
      res.status(400).json({
        success: false,
        message: "Invalid signature",
        redirectUrl: "",
      });
    }
  } catch (error: any) {
    console.error("Payment verification failed:", error.message);
    res.status(500).json({
      success: false,
      message: "Server error during payment verification",
    });
  }
};
