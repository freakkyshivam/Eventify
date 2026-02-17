import { Request, Response } from "express";
import db from "../../db/db";
import sessions from "../../db/schema/session.schema";
import { eq, and } from "drizzle-orm";
import crypto from "node:crypto";
import {generateAccessToken, generateRefreshToken} from '../../utils/generateToken'

export const tokenRefresh = async (req: Request, res: Response) => {
  try {
    const user = req.user;

    if (!user?.id) {
      return res.status(401).json({
        success: false,
        msg: "Unauthorized",
      });
    }

      const { refresh_token: incomingRefreshToken, sid } = req.cookies;

      console.log(sid);
      console.log(incomingRefreshToken);
      
      
      if (!sid || !incomingRefreshToken) {
        return res.status(401).json({
          success: false,
          msg: "Missing tokens",
        });
      }

      const [session] = await db
        .select()
        .from(sessions)
        .where(and(eq(sessions.user_id, user?.id), eq(sessions.sid, sid)));

      if (!session) {
        return res
          .status(401)
          .json({ success: false, msg: "Session not found" });
      }

      if (!session.active) {
  return res.status(401).json({
    success: false,
    msg: "Session revoked",
  });
}

      const hashed_token = crypto
  .createHmac("sha256", process.env.HASH_SECRET!)
  .update(incomingRefreshToken)
  .digest("hex");


      if (hashed_token !== session.hash_refresh_token) {
        await db
          .update(sessions)
          .set({
            active: false,
            revoked_at: new Date(),
          })
          .where(eq(sessions.sid, sid));

        res.clearCookie("access_token");
        res.clearCookie("refresh_token");
        res.clearCookie("sid");

        return res.status(401).json({
          success: false,
          msg: "Refresh token compromised",
        });
      }

      const newAccessToken =  await generateAccessToken(user?.id,  user?.role);
      const newRefreshToken = await generateRefreshToken();

      const hash_refresh_token = crypto.createHmac("sha256", 
        process.env.HASH_SECRET!
      ).update(newRefreshToken).digest('hex');

      await db.update(sessions).set({
        hash_refresh_token,
      }).where(
        and(
          eq(sessions.sid, sid),
          eq(sessions.user_id, user?.id)
        )
      )
     

    return res.status(200)
    .cookie('access_token',newAccessToken,{

    })
    .cookie("refresh_token", newRefreshToken,{

    })
    .json({
      success:true,
      msg : "Token rotated successfully",
      access_token : newAccessToken
    })
  } catch (error) {
    console.error("Token refresh error ", error);
    return res.status(500).json({
      succee: false,
      msg: "Server error",
    });
  }
};
