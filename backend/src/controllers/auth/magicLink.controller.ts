import { Request, Response } from "express";
import { CustomJwtPayload } from "../../utils/customJwtPayloads";
 
import {
  generateAccessToken,
  generateMagicLinkToken,
  generateRefreshToken
} from "../../utils/generateToken";
 
import {
  magicLinkValidation,
} from "../../validation/validation";
import db from "../../db/db";
import Users, { users } from "../../db/schema/user.model";
import { findUserByEmail } from "../../services/user.service";
import { eq, type InferModel } from "drizzle-orm";
import {
  sendLoginMagicLink,
  sendMagicLinkMail,
  sendWelcomeMail,
} from "../../services/mail/sendMail.service";
import magiclink from "../../db/schema/magicLink.schema";
import crypto from "node:crypto";
import sessions from '../../db/schema/session.schema';
import {UAParser} from 'ua-parser-js';

export const magicLink = async (req: Request, res: Response): Promise<void> => {
  try {
    const validationResult = await magicLinkValidation.safeParseAsync(req.body);

    if (validationResult.error) {
      res
        .status(400)
        .json({ success: false, msg: validationResult.error.format() });
      return;
    }
    const { email } = validationResult.data;

    const existingUser = await findUserByEmail(email);

    if (existingUser) {
      const token = await generateMagicLinkToken();
      const magicLink = `${process.env.SERVER_URL}/api/auth/verify?token=${token}`;

      await db.insert(magiclink).values({
        hashed_token: token,
        email,
        purpose: "login",
        expired_at: new Date(Date.now() + 10 * 60 * 1000),
      });

      sendLoginMagicLink(email,magicLink, existingUser.name)
       res.status(200).json({
        success: true,
        msg : "Magic link send to email if exists"
      })
      return;
    }

    const token = await generateMagicLinkToken();
    const magicLink = `${process.env.SERVER_URL}/api/auth/verify?token=${token}`;

    await db.insert(magiclink).values({
      hashed_token: token,
      email,
      purpose: "register",
      expired_at: new Date(Date.now() + 10 * 60 * 1000),
    });

    await sendMagicLinkMail(email, magicLink);

    res.status(201).json({
      success: true,
      msg: "Magic link send to email if exists",
    });
  } catch (error: any) {
    console.error("Magic link  error:", error?.message ?? error);
    res.status(500).json({ success: false, msg: "Server error" });
  }
};

export const verifyMagicLink = async (req: Request, res: Response) => {
  try {
    const { token } = req.query;

    if (!token) {
      return res.status(400).json({ msg: "Token missing" });
    }

    const tokenHash = crypto
      .createHash("sha256")
      .update(token as string)
      .digest("hex");

    const [data] = await db
      .select()
      .from(magiclink)
      .where(eq(magiclink.hashed_token, token as string));

    if (!data) {
      return res
        .status(401)
        .json({ success: false, msg: "Invalid or expired token" });
    }

    if (new Date(data.expired_at) < new Date()) {
      return res
        .status(401)
        .json({ success: false, msg: "Magic link expired" });
    }

    // Register account
    if(data.purpose === 'register'){
       const name = data.email.split("@")[0];

    await db.insert(users).values({
      email: data.email,
      name,
      isAccountVerified: true,
    });

    await sendWelcomeMail(data.email, name);

    res
      .status(201)
      .json({
        success: true,
        msg: "Registration successful",
      });

    }
    // Login 
    else{
       const user = await findUserByEmail(data.email);

    if(!user){
      return res.status(401).json({
        success:false,
        msg : "Unauthorized"
      })
    }
        const accessToken = await generateAccessToken(user.id, user.email, user.role);
          const refreshToken = await generateRefreshToken();
    const sid = crypto.randomBytes(32).toString('base64');
    
             res
                .cookie("access_token", accessToken,{
                    httpOnly : true,
                    secure : process.env.NODE_ENV === "production",
                    sameSite : "strict",
                    maxAge : 5 * 60 * 1000
                })
                .cookie("refresh_token", refreshToken,{
                    httpOnly : true,
                    secure : process.env.NODE_ENV === "production",
                    sameSite : "strict",
                    maxAge : 30* 24 * 60 * 60 * 1000
                })
                .cookie("sid",sid,{
                 httpOnly : true,
                secure : process.env.NODE_ENV === "production",
                sameSite : "strict",
                maxAge : 30* 24 * 60 * 60 * 1000
            })
                .status(200)
                .json({
                    success : true,
                    msg : "Login successful",
                    accessToken
                })

                const userAgent = req.headers['user-agent'];
        
            const parser = new UAParser(userAgent);
        const result = parser.getResult();
        
            const d = {
          device: result.device.type || "desktop",
          os: result.os.name + " " + result.os.version,
          browser: result.browser.name + " " + result.browser.version,
        }

         
                const hash_refresh_token = crypto
                    .createHmac('sha256',process.env.HASH_SECRET!)
                    .update(refreshToken)
                    .digest('hex')

      await db.insert(sessions).values({
            sid ,
            user_id : user.id,
            hash_refresh_token ,
            device : d.device,
            os : d.os,
            browser : d.browser
        })
    }

   
      await db.delete(magiclink).where(eq(magiclink.id, data.id));

  } catch (error: any) {
    console.error("Magic link verification error:", error?.message ?? error);
    res.status(500).json({ success: false, msg: "Server error" });
  }
};
