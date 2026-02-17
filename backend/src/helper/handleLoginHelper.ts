import { Request, Response } from "express";
 
import {
  generateAccessToken,
 
  generateRefreshToken,
} from "../utils/generateToken";
 
import db from "../db/db";
import Users, { users } from "../db/schema/user.model";
import { findUserByEmail } from "../services/user.service";
import { eq, type InferModel } from "drizzle-orm";
 
import magiclink from "../db/schema/magicLink.schema";
import crypto from "node:crypto";
import sessions from "../db/schema/session.schema";
import { UAParser } from "ua-parser-js";

 

// Constants
 
const ACCESS_TOKEN_EXPIRY_MS = 30 * 24 * 60 * 60 * 1000;; // 5 minutes
const REFRESH_TOKEN_EXPIRY_MS = 30 * 24 * 60 * 60 * 1000; // 30 days

 
export async function handleLogin(
  data: { email: string; hashed_token: string },
  req: Request,
  res: Response
): Promise<void> {
  try {
    const user = await findUserByEmail(data.email);

    if (!user) {
      res.status(401).json({
        success: false,
        msg: "Unauthorized",
      });
      return;
    }

    const accessToken = await generateAccessToken(
      user.id,
      user.role,
      
    );
    const refreshToken = await generateRefreshToken();
    const sid = crypto.randomBytes(32).toString("base64");

    // Parse user agent
    const userAgent = req.headers["user-agent"];
    const parser = new UAParser(userAgent);
    const result = parser.getResult();

    const deviceInfo = {
      device: result.device.type || "desktop",
      os: `${result.os.name || "Unknown"} ${result.os.version || ""}`.trim(),
      browser: `${result.browser.name || "Unknown"} ${result.browser.version || ""}`.trim(),
    };

    const hashedRefreshToken = crypto
      .createHmac("sha256", process.env.HASH_SECRET!)
      .update(refreshToken)
      .digest("hex");

    // Use transaction to ensure atomicity
    await db.transaction(async (tx) => {
      // Create session
      await tx.insert(sessions).values({
        sid,
        user_id: user.id,
        hash_refresh_token: hashedRefreshToken,
        device: deviceInfo.device,
        os: deviceInfo.os,
        browser: deviceInfo.browser,
      });

      // Delete the magic link token
      await tx
        .delete(magiclink)
        .where(eq(magiclink.hashed_token, data.hashed_token));
    });

    // Set cookies and redirect
    const isProduction = process.env.NODE_ENV === "production";
    
    res
      .cookie("access_token", accessToken, {
        httpOnly: true,
        secure: isProduction,
        sameSite: "lax",
        maxAge: ACCESS_TOKEN_EXPIRY_MS,
      })
      .cookie("refresh_token", refreshToken, {
        httpOnly: true,
        secure: isProduction,
        sameSite: "lax",
        maxAge: REFRESH_TOKEN_EXPIRY_MS,
      })
      .cookie("sid", sid, {
        httpOnly: true,
        secure: isProduction,
        sameSite: "lax",
        maxAge: REFRESH_TOKEN_EXPIRY_MS,
      })
      .redirect(process.env.CLIENT_URL ?? "http://localhost:5173");
  } catch (error) {
    console.error("Login error:", error);
    throw error;
  }
}