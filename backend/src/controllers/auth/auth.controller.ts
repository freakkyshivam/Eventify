// import { Request, Response } from "express";
// import { CustomJwtPayload } from "../../utils/customJwtPayloads";
// import { generateUniqueUsername } from "../../utils/generateUsername";
// import { generateToken } from "../../utils/generateToken";
// import { sendMail } from "../../utils/nodeMailer";
// import axios from 'axios';
// import { generateOtp } from "../../utils/generateOtp";
// import  argon2  from "argon2";
// import {loginValidation,signupValidation,resetPasswordValidation} from '../../validation/validation'
// import db from '../../db/db';
// import Users from '../../db/schema/user.model'
// import { findUserByEmail } from "../../services/user.service";
// import {hashedPassword} from '../../utils/hashedPassword'
// import type { InferModel } from "drizzle-orm"
 

// type UserInsert = InferModel<typeof Users, "insert">;

// interface AuthRequest extends Request {
//   user?: CustomJwtPayload;
// }
 

// const GOOGLE_AUTH_URL = "https://accounts.google.com/o/oauth2/v2/auth";

// // Register
// export const register = async (req: Request, res: Response): Promise<void> => {
//   try {

//     const validationResult = await signupValidation.safeParseAsync(req.body)

//     if(validationResult.error){
//        res.status(400).json({success:false, msg:validationResult.error.format()})
//              return;
//     }
//     const { email, name, password,branch,year,rollNumber,phone } = validationResult.data;
 
 
//     const existingUser = await findUserByEmail(email)
   
    
//     if (existingUser) {
//       res.status(409).json({ success: false, message: "User already registered" });
//       return;
//     }
 
//     const hash:string = await hashedPassword(password)

//     let uniqueUserName:string = await generateUniqueUsername(name, email);

//     const payload: UserInsert = {
//       name,
//       email,
//       username: uniqueUserName,
//       password: hash,
//       branch,
//       year,
//       rollNumber,
//       phone,
//       isProfileComplete : true
//     };
//     const [newUser] = await db.insert(Users).values(payload).returning({
//       id:Users.id,
//       name : Users.name,
//       role : Users.role
//     })

//       const subject = `🎉 Welcome to ${process.env.APP_NAME || 'Eventify'}!`;
//     const text = `
//   <div style="font-family:Arial, sans-serif; line-height:1.6;">
//     <h2 style="color:#333;">Welcome Aboard!</h2>
//     <p>Hello ${newUser.name || "User"},</p>
//     <p>Thank you for registering with <strong>${process.env.APP_NAME || "Eventify"}</strong>.</p>
//     <p>Your account has been created successfully, and you can now log in to explore all features.</p>
//     <p>If you didn’t create this account, please ignore this email.</p>
//     <br/>
//     <p>Best regards,<br/><strong>${process.env.APP_NAME || "Eventify"} Team</strong></p>
//   </div>
//   `;

// await sendMail(email, subject, text);

//     const token = await generateToken(newUser.id.toString(),email,newUser.role)
//     res.cookie("token", token, {
//       httpOnly: true,        
//       secure: process.env.NODE_ENV === "production",  
//       sameSite: "strict",    
//       maxAge: 7 * 24 * 60 * 60 * 1000, 
//     });

//      res.status(201).json({
//       success: true,
//       message: "Registration successful",
//       user: newUser,
//     });

     
//   } catch (error: any) {
//     console.error("Registration error:", error?.message ??error);
//     res.status(500).json({ success: false, message: "Server error" });
//   }
// };

// // login
// export const login = async (req : Request, res:Response):Promise<void>=>{
//   try {

//     const validationResult = await loginValidation.safeParseAsync(req.body)
//      if(validationResult.error){
//              res.status(400).json({success:false, msg:validationResult.error.format()})
//              return;
//         }
    
//     const {email, password} = validationResult.data;
    
    
//     const user = await  findUserByEmail(email)
//     if(!user){
//       res.status(401).json({success:false, messagee:`User with this email or username ${email} not found`})
//       return;
//     }
 
//   const isMatch = await argon2.verify(user.password, password);
 
//     if(!isMatch){
//       res.status(401).json({success:false, messagee:"Password is wrong"})
//       return;
//     }
 
//    const token = await generateToken(user.id.toString(),user.email,user.role);
  
   
//    res.cookie("token", token,{
//     httpOnly:true,
//     secure:process.env.NODE_ENV==="production",
//     sameSite:"strict",
//     maxAge: 7 * 24 * 60 * 60 * 1000
//    })
   
//     res.status(200).json({
//       success : true,
//       message: "Login successfull",
//       user : {
//         id: user.id,
//         email: user.email,
//         name : user.name
//       }
//     })
 
//   } catch (error:any) {
//     console.error("Login error", error.message)
//      res.status(500).json({ success: false, message: "Server error" });
//   }
// }

// // google redirect url

// export const googleRedirect = (req:Request, res:Response)=>{
//   try {
//     const redirectUrl = `${GOOGLE_AUTH_URL}?client_id=${process.env.GOOGLE_CLIENT_ID}&redirect_uri=${process.env.GOOGLE_REDIRECT_URI}&response_type=code&scope=openid%20email%20profile%20&access_type=offline&prompt=consent`;

//     res.redirect(redirectUrl);
//   } catch (error : any) {
//     console.error("Error to redirect ", error.message)
//   }
// }

// // google auth
// export const googleAuth = async (req: Request, res: Response): Promise<void> => {
//   try {
//     const code = req.query.code as string;

//     const { data } = await axios.post(
//       "https://oauth2.googleapis.com/token",
//       {
//         code,
//         client_id: process.env.GOOGLE_CLIENT_ID,
//         client_secret: process.env.GOOGLE_CLIENT_SECRET,
//         redirect_uri: process.env.GOOGLE_REDIRECT_URI,
//         grant_type: "authorization_code",
//       }
//     );

//     const { id_token } = data;

//     // Decode id_token
//     const payload = JSON.parse(
//       Buffer.from(id_token.split(".")[1], "base64").toString()
//     );
    
//     const { email, name, picture, sub } = payload;
//     const finalName = name || email.split("@")[0];

//     let user = await findUserByEmail(email)

//     if (!user) {
//       const uniqueUserName = await generateUniqueUsername(finalName, email);

//      const dummyPassword = await argon2.hash("google_user_" + process.env.JWT_SECRET, {
//   type: argon2.argon2id,
// });

//       const payload: UserInsert = {
//       name : finalName,
//       email,
//       username: uniqueUserName,
//       password: dummyPassword,
//       profileImageUrl:picture ?? null,
//       isAccountVerified: true,
//       isProfileComplete: false,
//         //

//       rollNumber: "",   
//       branch: "",       
//       year: 0,          
//       phone: "",
//     };

//       const [inserted] = await db.insert(Users).values(payload).returning();
//     user = inserted;
//       const subject = `🎉 Welcome to ${process.env.APP_NAME || 'Eventify'}!`;
//     const text = `
//   <div style="font-family:Arial, sans-serif; line-height:1.6;">
//     <h2 style="color:#333;">Welcome Aboard!</h2>
//     <p>Hello ${inserted.name || "User"},</p>
//     <p>Thank you for registering with <strong>${process.env.APP_NAME || "Eventify"}</strong>.</p>
//     <p>Your account has been created successfully, and you can now log in to explore all features.</p>
//     <p>If you didn’t create this account, please ignore this email.</p>
//     <br/>
//     <p>Best regards,<br/><strong>${process.env.APP_NAME || "Eventify"} Team</strong></p>
//   </div>
//   `;

//   try {
//   await sendMail(email, subject, text);
// } catch (err) {
//   console.error("Welcome mail failed:", err);
// }


//     }

//     if (!user) {
//    res.status(500).json({ success: false });
//    return;
// }

//     const token = generateToken(user.id.toString(), email, user.role);

//     res.cookie("token", token, {
//       httpOnly: true,
//       secure: process.env.NODE_ENV === "production",
//       sameSite: "strict",
//       maxAge: 7 * 24 * 60 * 60 * 1000,
//     });

//     res.status(200).json({
//       success: true,
//       message: "Login successful",
//       user: {
//         id: user.id,
//         name: user.name,
//         username: user.username,
//         email: user.email,
         
//       },
//     });
//   } catch (error: any) {
//     console.error("Google Login Error:", error.response?.data || error.message);
//     res.status(500).json({ error: "Authentication failed" });
//   }
// };


// // logout
// export const logout = async (req :Request,res:Response):Promise<void>=>{
//   try {
//    res.clearCookie("token", {
//   httpOnly: true,
//   secure: process.env.NODE_ENV === "production",
//   sameSite: "strict",
// });

//      res.status(200).json({
//       success : true,
//       message: "Logout successfull",
//     })
//   } catch (error : any) {
//     console.error("Logout error ", error.message);
//      res.status(500).json({ success: false, message: "Server error" });
//   }
// }

// // forgot password
// export const passwordResetOtp = async (req: Request, res: Response): Promise<void> => {
//   try {
//     const {email} = req.body;
//     if(!email){
//       res.status(400).json({success:true, message:"Email is required"});
//     }

//      const user = await findUserByEmail(email);
//     if (!user) {
//       res.status(404).json({ success: false, message: "User not found" });
//       return;
//     }
//     const otp = generateOtp();
//    const hashedOtp =  await argon2.hash(otp, {
//   type: argon2.argon2id
// });
     
//     await db.update(Users).set({
//       resetOtp:hashedOtp,
//       resetOtpExpiredAt : new Date(Date.now() + 10 * 60 * 1000)
//     })
  
 
//     await sendMail(
//   email,
//   "🔐 Password Reset Verification Code",
//   `
//   <div style="font-family:Arial, sans-serif; line-height:1.6;">
//     <h2 style="color:#333;">Password Reset Request</h2>
//     <p>Hello ${user.name || "User"},</p>
//     <p>We received a request to reset your password. Please use the following OTP to proceed:</p>
//     <h1 style="color:#2b7de9;">${otp}</h1>
//     <p>This code will expire in <strong>10 minutes</strong>.</p>
//     <p>If you didn’t request this, you can safely ignore this email.</p>
//     <br/>
//     <p>Best regards,<br/><strong>${process.env.APP_NAME || "Eventify"} Team</strong></p>
//   </div>
//   `
// );
//   res.status(200).json({
//       success: true,
//       message: "OTP sent successfully to your email",
//     });
//   }  catch (error: any) {
//     console.error("Password reset otp error:", error.message);
//     res.status(500).json({ success: false, message: "Server error" });
//   }
// }

// // verify otp and update password
// export const verifyResetOtpAndUpdatePassword = async (req: Request, res: Response): Promise<void> => {
//   try {

//     const validationResult = await resetPasswordValidation.safeParseAsync(req.body);

//     if(validationResult.error){
//        res.status(400).json({success:false, msg:validationResult.error.format()})
//              return;
//     }

//     const {email,rawOtp,newPassword} = validationResult.data;

     
//   const user = await findUserByEmail(email);
//   if(!user){
//     res.status(400).json({success:false, message:"User not found"});
//     return;
//   }

//   if (!user.resetOtp) {
//    res.status(400).json({ success: false, message: "OTP not generated" });
//    return;
//   }

//     if (!user.resetOtpExpiredAt || new Date() > user.resetOtpExpiredAt) {
//     res
//     .status(400)
//     .json({ success: false, message: "OTP is expired, generate a new OTP" });
//     return;
// }


    
//    const isMatchOtp = await argon2.verify(user.resetOtp, rawOtp);

//   if(rawOtp === "" || !isMatchOtp){
//     res.status(400).json({success:false, message:"Invalid OTP"})
//   }

//  const hashedPassword = await argon2.hash(newPassword, {
//   type: argon2.argon2id,
//   memoryCost: 15360,
//   timeCost: 2,        
//   parallelism: 1
// });



//   await db.update(Users).set({
//     resetOtp : "",
//     resetOtpExpiredAt : null,
//     password : hashedPassword
//   })
//   await sendMail(
//   email,
//   "Your Password Has Been Changed Successfully",
//   `
//   <div style="font-family:Arial, sans-serif; line-height:1.6;">
//     <h2 style="color:#333;">Password Changed</h2>
//     <p>Hello ${user.name || "User"},</p>
//     <p>This is a confirmation that your account password was successfully changed.</p>
//     <p>If you did not make this change, please contact our support team immediately.</p>
//     <br/>
//     <p>Best regards,<br/><strong>${process.env.APP_NAME || "Eventify"} Team</strong></p>
//   </div>
//   `
// );

//   res.status(200).json({
//     success:true,
//     message:"Password changed successfully"
//   })
    
//   }  catch (error: any) {
//     console.error("Password reset otp error:", error.message);
//     res.status(500).json({ success: false, message: "Server error" });
//   }
// }

// // about user
// export const userInfo = async (req:Request, res:Response):Promise<void> => {
//   try {
//     const user = (req as AuthRequest).user;
//     res.json(user)
//   } catch (error) {
//     console.error(error);
    
//   }
// }