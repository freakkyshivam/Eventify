import { Request, Response } from "express";
import db from "../../db/db";
import sessions from "../../db/schema/session.schema";
import { eq, and } from "drizzle-orm";
import crypto from "node:crypto";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../../utils/generateToken";
import { users } from "../../db";

const ACCESS_TOKEN_EXPIRY_MS = 5 * 60 * 1000; // 5 minutes
const REFRESH_TOKEN_EXPIRY_MS = 30 * 24 * 60 * 60 * 1000; // 30 days

export const tokenRefresh = async (req: Request, res: Response) => {
  try {
    // const user = req.user;

    // if (!user?.id) {
    //   return res.status(401).json({ success: false, msg: "Unauthorized" });
    // }

    const { refresh_token: incomingRefreshToken, sid } = req.cookies;

    if (!sid || !incomingRefreshToken) {
      console.log("Missing  tokens");

      return res.status(401).json({ success: false, msg: "Missing tokens" });
    }

    const [session] = await db
      .select({
        sid: sessions.sid,
        active: sessions.active,
        hash_refresh_token: sessions.hash_refresh_token,
        user_id: sessions.user_id,
        created_at: sessions.created_at,
      })
      .from(sessions)
      .where(eq(sessions.sid, sid));

    if (!session) {
      console.log("Session not found");

      return res.status(401).json({ success: false, msg: "Session not found" });
    }

    if (!session.active) {
      console.log("Inactive session");
      return res.status(401).json({ success: false, msg: "Session revoked" });
    }

    if (!session.created_at) {
      return res.status(400).json({
        success: false,
        msg: "Missing fields",
      });
    }

    const expiredAt = new Date(
      new Date(session.created_at).getTime() + REFRESH_TOKEN_EXPIRY_MS,
    );

    if (expiredAt) {
      return res.status(401).json({
        success: false,
        msg: "Refresh token is expired",
      });
    }

    const hashedIncoming = crypto
      .createHmac("sha256", process.env.HASH_SECRET!)
      .update(incomingRefreshToken)
      .digest("hex");

    if (hashedIncoming !== session.hash_refresh_token) {
      await db
        .update(sessions)
        .set({ active: false, revoked_at: new Date() })
        .where(eq(sessions.sid, sid));

      res.clearCookie("access_token");
      res.clearCookie("refresh_token");
      res.clearCookie("sid");

      return res
        .status(401)
        .json({ success: false, msg: "Refresh token compromised" });
    }

    const [user] = await db
      .select({
        id: users.id,
        role: users.role,
      })
      .from(users)
      .where(eq(users?.id, session?.user_id));

    if (!user) {
      return res.status(401).json({
        success: false,
        msg: "User not found",
      });
    }

    // Generate new tokens
    const newAccessToken = await generateAccessToken(user.id, user.role);
    const newRefreshToken = await generateRefreshToken();

    const newSid = crypto.randomBytes(32).toString("hex");

    const newHashedRefreshToken = crypto
      .createHmac("sha256", process.env.HASH_SECRET!)
      .update(newRefreshToken)
      .digest("hex");

    // Update session: new sid, new hashed refresh token, last active timestamp
    await db
      .update(sessions)
      .set({
        sid: newSid,
        hash_refresh_token: newHashedRefreshToken,
      })
      .where(and(eq(sessions.sid, sid), eq(sessions.user_id, user.id)));

    const isProduction = process.env.NODE_ENV === "production";

    return res
      .status(200)
      .cookie("access_token", newAccessToken, {
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? "none" : "lax",
        maxAge: ACCESS_TOKEN_EXPIRY_MS,
      })
      .cookie("refresh_token", newRefreshToken, {
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? "none" : "lax",
        maxAge: REFRESH_TOKEN_EXPIRY_MS,
      })

      .cookie("sid", newSid, {
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? "none" : "lax",
        maxAge: REFRESH_TOKEN_EXPIRY_MS,
      })
      .json({
        success: true,
        msg: "Token rotated successfully",
      });
  } catch (error) {
    console.error("Token refresh error:", error);
    return res.status(500).json({
      success: false,
      msg: "Server error",
    });
  }
};
