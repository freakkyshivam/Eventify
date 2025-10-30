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

 
