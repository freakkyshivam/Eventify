import { Request, Response } from "express";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../../utils/generateToken";
 
import axios from "axios";
 
import db from "../../db/db";
import Users, { users } from "../../db/schema/user.model";
import { findUserByEmail } from "../../services/user.service";
import {   sendWelcomeMail } from "../../services/mail/sendMail.service";
 
import crypto from "node:crypto";
import sessions from '../../db/schema/session.schema';
import {UAParser} from 'ua-parser-js';
 

const GOOGLE_AUTH_URL = "https://accounts.google.com/o/oauth2/v2/auth";

// google redirect url

export const googleRedirect = (req:Request, res:Response)=>{
      try {
    const redirectUrl = `${GOOGLE_AUTH_URL}?client_id=${process.env.GOOGLE_CLIENT_ID}&redirect_uri=${process.env.GOOGLE_REDIRECT_URI}&response_type=code&scope=openid%20email%20profile%20&access_type=offline&prompt=consent`;
    res.redirect(redirectUrl);
  } catch (error : any) {
    console.error("Error to redirect ", error.message)
  }
}

// google auth

export const googleAuth = async (req :Request,  res:Response)=>{
    try {
        const code = req.query.code as string;

        const {data} = await axios.post(
             "https://oauth2.googleapis.com/token",
             {
        code,
        client_id: process.env.GOOGLE_CLIENT_ID,
        client_secret: process.env.GOOGLE_CLIENT_SECRET,
        redirect_uri: process.env.GOOGLE_REDIRECT_URI,
        grant_type: "authorization_code",
      });

      const {id_token} = data;
      
      // Decode id_token
      const payload = JSON.parse(
        Buffer.from(id_token.split(".")[1], 'base64').toString()
      )

      const {email, name, picture, sub} = payload;

      const finalName = name || email.split("@")[0];

      let user =  await  findUserByEmail(email)

      if(!user){

                        await db.insert(Users).values({
                            name: finalName,
                            email,
                            isAccountVerified : true,
                            profileImageUrl : picture
                        });

                        await sendWelcomeMail(email, finalName);

                        return res.status(200).json({
                            success : true,
                            msg : 'Registarion successfull'
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

        return;

    } catch (error: any) {
        console.error("Google authentication error ", error);
        res.status(500).json({success : false,
            msg :"Google authentication failed"
        })
    }
}