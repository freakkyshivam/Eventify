import { Request, Response } from "express";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../../utils/generateToken";
import axios from "axios";
import db from "../../db/db";
import Users, { users } from "../../db/schema/user.model";
import { findUserByEmail } from "../../services/user/user.service";
import { sendWelcomeMail } from "../../services/mail/sendMail.service";
import crypto from "node:crypto";
import sessions from "../../db/schema/session.schema";
import { UAParser } from "ua-parser-js";

// Constants
const GOOGLE_AUTH_URL = "https://accounts.google.com/o/oauth2/v2/auth";
const GOOGLE_TOKEN_URL = "https://oauth2.googleapis.com/token";
const ACCESS_TOKEN_EXPIRY_MS = 5 * 60 * 1000; // 5 minutes
const REFRESH_TOKEN_EXPIRY_MS = 30 * 24 * 60 * 60 * 1000; // 30 days

// Google OAuth redirect
export const googleRedirect = (req: Request, res: Response): void => {
  try {
    const redirectUrl = `${GOOGLE_AUTH_URL}?client_id=${process.env.GOOGLE_CLIENT_ID}&redirect_uri=${process.env.GOOGLE_REDIRECT_URI}&response_type=code&scope=openid%20email%20profile&access_type=offline&prompt=consent`;
    res.redirect(redirectUrl);
  } catch (error: any) {
    console.error("Error redirecting to Google:", error?.message ?? error);
    res
      .status(500)
      .json({ success: false, msg: "Failed to redirect to Google" });
  }
};
 
export const googleAuth = async (
  req: Request,
  res: Response,
): Promise<void> => {
   
  const clientUrl = process.env.CLIENT_URL || "http://localhost:5173";

  try {
    const code = req.query.code as string;

    if (!code) {
      res
        .status(400)
        .json({ success: false, msg: "Authorization code missing" });
      return;
    }

 
    const { data } = await axios.post(GOOGLE_TOKEN_URL, {
      code,
      client_id: process.env.GOOGLE_CLIENT_ID,
      client_secret: process.env.GOOGLE_CLIENT_SECRET,
      redirect_uri: process.env.GOOGLE_REDIRECT_URI,
      grant_type: "authorization_code",
    });

    const { id_token } = data;

    if (!id_token) {
      res
        .status(400)
        .json({ success: false, msg: "ID token missing from Google response" });
      return;
    }
 
    let payload: {
      email?: string;
      name?: string;
      picture?: string;
      sub?: string;
    };
    try {
      payload = JSON.parse(
        Buffer.from(id_token.split(".")[1], "base64").toString(),
      );
    } catch {
      res.redirect(`${clientUrl}?error=invalid_token`);
      return;
    }

    const { email, name, picture } = payload;

    if (!email) {
      res
        .status(400)
        .json({ success: false, msg: "Email not provided by Google" });
      return;
    }

    const finalName = name || email.split("@")[0];

    let user = await findUserByEmail(email);

 
    if (!user) {
      await db.transaction(async (tx) => {
        const [newUser] = await tx
          .insert(users)
          .values({
            name: finalName,
            email,
            isAccountVerified: true,
            profileImageUrl: picture,
          })
          .returning();

         
        if (!newUser) throw new Error("Failed to create user");

        user = newUser;
      });
 
      setImmediate(() => {
        sendWelcomeMail(email, finalName).catch((err) =>
          console.error("Failed to send welcome email:", err),
        );
      });

   
      await handleGoogleLogin(
        user,
        req,
        res,
        `${clientUrl}/dashboard?registered=true`,
      );
      return;
    }
 
    await handleGoogleLogin(user, req, res, `${clientUrl}/dashboard`);
  } catch (error: any) {
    console.error("Google authentication error:", error?.message ?? error);
    res.redirect(`${clientUrl}?error=auth_failed`);
  }
};

// Helper: create session, set cookies, redirect
async function handleGoogleLogin(
  user: any,
  req: Request,
  res: Response,
  redirectTo: string, 
): Promise<void> {
   
  try {
    const accessToken = await generateAccessToken(user.id, user.role);
    const refreshToken = await generateRefreshToken();
    const sid = crypto.randomBytes(32).toString("base64");
 
    const parser = new UAParser(req.headers["user-agent"]);
    const result = parser.getResult();

    const deviceInfo = {
      device: result.device.type || "desktop",
      os: `${result.os.name || "Unknown"} ${result.os.version || ""}`.trim(),
      browser:
        `${result.browser.name || "Unknown"} ${result.browser.version || ""}`.trim(),
    };

    const hashedRefreshToken = crypto
      .createHmac("sha256", process.env.HASH_SECRET!)
      .update(refreshToken)
      .digest("hex");

    await db.transaction(async (tx) => {
      await tx.insert(sessions).values({
        sid,
        user_id: user.id,
        hash_refresh_token: hashedRefreshToken,
        device: deviceInfo.device,
        os: deviceInfo.os,
        browser: deviceInfo.browser,
      });
    });

    const isProduction = process.env.NODE_ENV === "production";

    res
      .cookie("access_token", accessToken, {
        httpOnly: true,
        secure: isProduction,
        sameSite: "none",
        maxAge: ACCESS_TOKEN_EXPIRY_MS,
      })
      .cookie("refresh_token", refreshToken, {
        httpOnly: true,
        secure: isProduction,
        sameSite: "none",
        maxAge: REFRESH_TOKEN_EXPIRY_MS,
      })
      .cookie("sid", sid, {
        httpOnly: true,
        secure: isProduction,
        sameSite: "none",
        maxAge: REFRESH_TOKEN_EXPIRY_MS,
      })
      .redirect(redirectTo);
  } catch (error) {
    console.error("Google login error:", error);
    throw error;
  }
}
