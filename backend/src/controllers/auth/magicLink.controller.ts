import { Request, Response } from "express";

import { generateMagicLinkToken } from "../../utils/generateToken";
import { magicLinkValidation } from "../../validation/validation";
import db from "../../db/db";

import { findUserByEmail } from "../../services/user/user.service";
import { eq } from "drizzle-orm";
import {
  sendLoginMagicLink,
  sendMagicLinkMail,
} from "../../services/mail/sendMail.service";
import magiclink from "../../db/schema/magicLink.schema";
import crypto from "node:crypto";

import { handleNewUserRegistration } from "../../helper/handleNewUserRegistration";
import { handleLogin } from "../../helper/handleLoginHelper";

// Constants
const MAGIC_LINK_EXPIRY_MS = 10 * 60 * 1000; // 10 minutes

export const magicLink = async (req: Request, res: Response): Promise<void> => {
  try {
    const validationResult = await magicLinkValidation.safeParseAsync(req.body);

    if (validationResult.error) {
      res.status(400).json({
        success: false,
        msg: validationResult.error.format(),
      });
      return;
    }

    const { email } = validationResult.data;
    const existingUser = await findUserByEmail(email);
    const token = await generateMagicLinkToken();
    const magicLinkUrl = `${process.env.SERVER_URL}/api/v1/auth/verify?token=${token}`;
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    if (existingUser) {
      // Delete any existing magic links for this email
      await db.delete(magiclink).where(eq(magiclink.email, email));

      await db.insert(magiclink).values({
        hashed_token: hashedToken,
        email,
        purpose: "login",
        expired_at: new Date(Date.now() + MAGIC_LINK_EXPIRY_MS),
      });

      await sendLoginMagicLink(email, magicLinkUrl, existingUser.name);
    } else {
  
      await db.delete(magiclink).where(eq(magiclink.email, email));

      await db.insert(magiclink).values({
        hashed_token: hashedToken,
        email,
        purpose: "register",
        expired_at: new Date(Date.now() + MAGIC_LINK_EXPIRY_MS),
      });

      await sendMagicLinkMail(email, magicLinkUrl);
    }

    res.status(200).json({
      success: true,
      msg: "Magic link sent to your email",
    });
  } catch (error: any) {
    console.error("Magic link error:", error?.message ?? error);
    res.status(500).json({ success: false, msg: "Server error" });
  }
};

export const verifyMagicLink = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { token } = req.query;

    if (!token || typeof token !== "string") {
      res.status(400).json({ success: false, msg: "Token missing" });
      return;
    }

    const tokenHash = crypto.createHash("sha256").update(token).digest("hex");

    const [data] = await db
      .select()
      .from(magiclink)
      .where(eq(magiclink.hashed_token, tokenHash));

    if (!data) {
      res.status(401).json({
        success: false,
        msg: "Invalid or expired token",
      });
      return;
    }

    // Check expiration
    if (new Date(data.expired_at) < new Date()) {
      await db.delete(magiclink).where(eq(magiclink.hashed_token, tokenHash));
      res.status(401).json({
        success: false,
        msg: "Magic link expired",
      });
      return;
    }
 
    await db.delete(magiclink).where(eq(magiclink.hashed_token, tokenHash));

    // Handle registration
    if (data.purpose === "register") {
      await handleNewUserRegistration(data, res);
      return;
    }

    // Handle login
    if (data.purpose === "login") {
      await handleLogin(data, req, res);
      return;
    }

    // Unknown purpose
    res.status(400).json({
      success: false,
      msg: "Invalid magic link purpose",
    });
  } catch (error: any) {
    console.error("Magic link verification error:", error?.message ?? error);
    res.status(500).json({ success: false, msg: "Server error" });
  }
};