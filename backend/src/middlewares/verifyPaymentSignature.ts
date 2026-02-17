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
): void => {
  try {
    // Extract payment verification fields from request body
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
      req.body;

    // Validate required fields
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      res.status(400).json({
        success: false,
        message: "Missing payment verification fields",
      });
      return;
    }

    // Validate environment configuration
    if (!process.env.RAZORPAY_KEY_SECRET) {
      console.error("RAZORPAY_KEY_SECRET not configured");
      res.status(500).json({
        success: false,
        message: "Payment system misconfigured",
      });
      return;
    }

    // Validate signature format and length (SHA256 hex = 64 characters)
    if (
      typeof razorpay_signature !== "string" ||
      razorpay_signature.length !== 64 ||
      !/^[a-f0-9]{64}$/i.test(razorpay_signature)
    ) {
      res.status(400).json({
        success: false,
        message: "Invalid signature format",
      });
      return;
    }

    // Generate expected signature
    const generatedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    // Timing-safe comparison to prevent timing attacks
    const isValid = crypto.timingSafeEqual(
      Buffer.from(generatedSignature, "hex"),
      Buffer.from(razorpay_signature, "hex")
    );

    if (!isValid) {
      // Log failed verification attempt (for security monitoring)
      console.warn("Invalid payment signature attempt:", {
        order_id: razorpay_order_id,
        payment_id: razorpay_payment_id,
        timestamp: new Date().toISOString(),
      });

      res.status(401).json({
        success: false,
        message: "Invalid payment signature",
      });
      return;
    }

    // Attach verified payment data to request
    req.payment = {
      order_id: razorpay_order_id,
      payment_id: razorpay_payment_id,
    };

    next();
  } catch (err: any) {
    console.error("Payment verification error:", err?.message ?? err);
    res.status(500).json({
      success: false,
      message: "Payment verification failed",
    });
  }
};