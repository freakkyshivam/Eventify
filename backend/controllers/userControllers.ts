import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt, { JwtPayload } from "jsonwebtoken";
import { CustomJwtPayload } from "../utils/customJwtPayloads";
import User from "../models/User.model";  
import { generateUniqueUsername } from "../utils/generateUsername";
import { generateToken } from "../utils/generateToken";
import { sendMail } from "../utils/nodeMailer";
import axios from 'axios';
import { generateOtp } from "../utils/generateOtp";
import  argon2  from "argon2";
 

interface AuthRequest extends Request {
  user?: CustomJwtPayload;
}
 

const GOOGLE_AUTH_URL = "https://accounts.google.com/o/oauth2/v2/auth";

// Register
export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, name, password } = req.body;
 
    if (!email) {
      res.status(400).json({ success: false, message: "Email is required" });
      return;
    }
    if (!name) {
      res.status(400).json({ success: false, message: "Name is required" });
      return;
    }
    if (!password) {
      res.status(400).json({ success: false, message: "Password is required" });
      return;
    }
 
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(409).json({ success: false, message: "User already registered" });
      return;
    }
 
    const hashedPassword = await argon2.hash(password, {
  type: argon2.argon2id,
  memoryCost: 15360,  
  timeCost: 2,        
  parallelism: 1
});

    let uniqueUserName = await generateUniqueUsername(name, email);
    const newUser = new User({
      name,
      username:uniqueUserName,
      email,
      password: hashedPassword,
    });

    await newUser.save();

    const subject = `🎉 Welcome to ${process.env.APP_NAME || 'Eventify'}!`;
    const text = `
  <div style="font-family:Arial, sans-serif; line-height:1.6;">
    <h2 style="color:#333;">Welcome Aboard!</h2>
    <p>Hello ${newUser.name || "User"},</p>
    <p>Thank you for registering with <strong>${process.env.APP_NAME || "Eventify"}</strong>.</p>
    <p>Your account has been created successfully, and you can now log in to explore all features.</p>
    <p>If you didn’t create this account, please ignore this email.</p>
    <br/>
    <p>Best regards,<br/><strong>${process.env.APP_NAME || "Eventify"} Team</strong></p>
  </div>
  `;

await sendMail(email, subject, text);

    const token = await generateToken(newUser._id.toString(),email,newUser.role)
    res.cookie("token", token, {
      httpOnly: true,        
      secure: process.env.NODE_ENV === "production",  
      sameSite: "strict",    
      maxAge: 7 * 24 * 60 * 60 * 1000, 
    });


    res.status(201)
    .json({ success: true,
     message: "Registration successful",
     user: {
        id: newUser._id,
        name: newUser.name,
        username : newUser.username,
        email: newUser.email,
      },
    });
  } catch (error: any) {
    console.error("Registration error:", error.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// login
export const login = async (req : Request, res:Response):Promise<void>=>{
  try {
    console.time("TOTAL");
    const {identifiers, password} = req.body;
    console.log(identifiers);
    
    if(!identifiers || !password){
     res.status(400).json({success : false, message:"All field are required"});
     return;
    }

    console.time("DB");
    const user = await User.findOne({
      $or: [{email:identifiers}, {username:identifiers}]
    }).lean(); // << speeds up response (returns JS object, not mongoose doc)
    
    if(!user){
      res.status(401).json({success:false, messagee:"Invalid credentials"})
      return;
    }

   console.time("verify");
const isMatch = await argon2.verify(user.password, password);
console.timeEnd("verify");


    if(!isMatch){
      res.status(401).json({success:false, messagee:"Password is wrong"})
      return;
    }

    console.time("Token")
   const token =  generateToken(user._id.toString(),user.email,user.role);
  console.timeEnd("Token")
  
   console.time("COOKIE");
   res.cookie("token", token,{
    httpOnly:true,
    secure:process.env.NODE_ENV==="production",
    sameSite:"strict",
    maxAge: 7 * 24 * 60 * 60 * 1000
   })
   console.timeEnd("COOKIE");

   console.time("RESPONSE");
    res.status(200).json({
      success : true,
      message: "Login successfull",
      user : {
        id: user._id,
        username : user.username,
        name : user.name,
        email: user.email
      }
    })
    console.timeEnd("RESPONSE");
    console.timeEnd("TOTAL");
  } catch (error:any) {
    console.error("Login error", error.message)
     res.status(500).json({ success: false, message: "Server error" });
  }
}

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
export const googleAuth = async (req: Request, res: Response): Promise<void> => {
  try {
    const code = req.query.code as string;

    const { data } = await axios.post(
      "https://oauth2.googleapis.com/token",
      {
        code,
        client_id: process.env.GOOGLE_CLIENT_ID,
        client_secret: process.env.GOOGLE_CLIENT_SECRET,
        redirect_uri: process.env.GOOGLE_REDIRECT_URI,
        grant_type: "authorization_code",
      }
    );

    const { id_token } = data;

    // Decode id_token
    const payload = JSON.parse(
      Buffer.from(id_token.split(".")[1], "base64").toString()
    );

    const { email, name, picture, sub } = payload;
    const finalName = name || email.split("@")[0];

    let user = await User.findOne({ email }).lean();

    if (!user) {
      const uniqueUserName = await generateUniqueUsername(finalName, email);

     const dummyPassword = await argon2.hash("google_user_" + process.env.JWT_SECRET, {
  type: argon2.argon2id,
});

      user = await User.create({
        name: finalName,
        username: uniqueUserName,
        email,
        password: dummyPassword,
        profileImage: picture,
        isAccountVerified: true
      });

      const subject = `🎉 Welcome to ${process.env.APP_NAME || 'Eventify'}!`;
    const text = `
  <div style="font-family:Arial, sans-serif; line-height:1.6;">
    <h2 style="color:#333;">Welcome Aboard!</h2>
    <p>Hello ${user.name || "User"},</p>
    <p>Thank you for registering with <strong>${process.env.APP_NAME || "Eventify"}</strong>.</p>
    <p>Your account has been created successfully, and you can now log in to explore all features.</p>
    <p>If you didn’t create this account, please ignore this email.</p>
    <br/>
    <p>Best regards,<br/><strong>${process.env.APP_NAME || "Eventify"} Team</strong></p>
  </div>
  `;

   sendMail(email, subject, text);
    }

    const token = generateToken(user._id.toString(), email, user.role);

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      success: true,
      message: "Login successful",
      user: {
        id: user._id,
        name: user.name,
        username: user.username,
        email: user.email,
        profileImage: user.profileImage,
      },
    });
  } catch (error: any) {
    console.error("Google Login Error:", error.response?.data || error.message);
    res.status(500).json({ error: "Authentication failed" });
  }
};


// logout
export const logout = async (req :Request,res:Response):Promise<void>=>{
  try {
   res.clearCookie("token", {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict",
});

     res.status(200).json({
      success : true,
      message: "Logout successfull",
    })
  } catch (error : any) {
    console.error("Logout error ", error.message);
     res.status(500).json({ success: false, message: "Server error" });
  }
}


export const userInfo = async (req:Request, res:Response):Promise<void> => {
  try {
    const user = (req as AuthRequest).user;
    res.json(user)
  } catch (error) {
    console.error(error);
    
  }
}

// update name
export const updateName = async (req: Request, res: Response): Promise<void> => {
  try {
    const { updatedName } = req.body;
    const user = (req as AuthRequest).user;

    if (!updatedName) {
      res.status(400).json({ success: false, message: "New name is required" });
      return;
    }

    if (!user?.id) {
      res.status(401).json({ success: false, message: "Unauthorized" });
      return;
    }
 
    const updatedUser = await User.findByIdAndUpdate(
      user.id,
      { name: updatedName },
      {
        new: true,
        runValidators: true,
      }
    ).lean();
 
    if (!updatedUser) {
      res.status(404).json({ success: false, message: "User not found" });
      return;
    }
 
    res.status(200).json({
      success: true,
      message: "Name updated successfully",
      user: updatedUser,
    });
  } catch (error: any) {
    console.error("Update name error:", error.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// update user name 
export const updateUserName = async (req: Request, res: Response): Promise<void> => {
  try {
    const { updatedUserName } = req.body;
    const user = (req as AuthRequest).user;
    if (!updatedUserName) {
      res.status(400).json({ success: false, message: "New username is required" });
      return;
    }

    if (!user?.id) {
      res.status(401).json({ success: false, message: "Unauthorized" });
      return;
    }
 
    const existingUser = await User.findOne({ username: updatedUserName }).lean();
    if (existingUser) {
      res.status(400).json({ success: false, message: "Username already exists" });
      return;
    }
 
    const updatedUser = await User.findByIdAndUpdate(
      user.id,
      { username: updatedUserName },
      {
        new: true,
        runValidators: true,
      }
    ).lean();
 
    if (!updatedUser) {
      res.status(404).json({ success: false, message: "User not found" });
      return;
    }
 
    res.status(200).json({
      success: true,
      message: "Username updated successfully",
      user: updatedUser,
    });
  } catch (error: any) {
    console.error("Update username error:", error.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// update password 
export const updatePassword = async (req: Request, res: Response): Promise<void> => {
  try {
    const { previousPassword, newPassword } = req.body;
    const user = (req as AuthRequest).user;  
    if (!user?.id) {
      res.status(401).json({ success: false, message: "Unauthorized" });
      return;
    }

    if (!previousPassword || !newPassword) {
      res.status(400).json({ success: false, message: "All fields are required" });
      return;
    }

    const existingUser = await User.findById(user.id).select("+password").lean(); 

    if (!existingUser) {
      res.status(404).json({ success: false, message: "User not found" });
      return;
    }

   const isMatch = await argon2.verify(existingUser.password, previousPassword);



    if (!isMatch) {
      res.status(400).json({ success: false, message: "Incorrect current password" });
      return;
    }

    const hashedPassword = await argon2.hash(newPassword, {
  type: argon2.argon2id,
  memoryCost: 15360,  
  timeCost: 2,        
  parallelism: 1
});

   
    await User.findByIdAndUpdate(user.id, {password:hashedPassword},{
      new:true,
      runValidators:true
    })

    await sendMail(
  user.email,
  "Your Password Has Been Changed Successfully",
  `
  <div style="font-family:Arial, sans-serif; line-height:1.6;">
    <h2 style="color:#333;">Password Changed</h2>
    <p>Hello ${user.name || "User"},</p>
    <p>This is a confirmation that your account password was successfully changed.</p>
    <p>If you did not make this change, please contact our support team immediately.</p>
    <br/>
    <p>Best regards,<br/><strong>${process.env.APP_NAME || "Eventify"} Team</strong></p>
  </div>
  `
);

    
    res.status(200).json({ success: true, message: "Password updated successfully" });
  } catch (error: any) {
    console.error("Update password error:", error.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// forgot password
export const passwordResetOtp = async (req: Request, res: Response): Promise<void> => {
  try {
    const {email} = req.body;
    if(!email){
      res.status(400).json({success:true, message:"Email is required"});
    }

     const user = await User.findOne({ email });
    if (!user) {
      res.status(404).json({ success: false, message: "User not found" });
      return;
    }
    const otp = generateOtp();
   const hashedOtp =  await argon2.hash(otp, {
  type: argon2.argon2id
});
     user.resetOtp = hashedOtp;
    user.resetOtpExpiredAt = new Date(Date.now() + 10 * 60 * 1000);
  
    
    await user.save();
 
    await sendMail(
  email,
  "🔐 Password Reset Verification Code",
  `
  <div style="font-family:Arial, sans-serif; line-height:1.6;">
    <h2 style="color:#333;">Password Reset Request</h2>
    <p>Hello ${user.name || "User"},</p>
    <p>We received a request to reset your password. Please use the following OTP to proceed:</p>
    <h1 style="color:#2b7de9;">${otp}</h1>
    <p>This code will expire in <strong>10 minutes</strong>.</p>
    <p>If you didn’t request this, you can safely ignore this email.</p>
    <br/>
    <p>Best regards,<br/><strong>${process.env.APP_NAME || "Eventify"} Team</strong></p>
  </div>
  `
);
  res.status(200).json({
      success: true,
      message: "OTP sent successfully to your email",
    });
  }  catch (error: any) {
    console.error("Password reset otp error:", error.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
}

// verify otp and update password
export const verifyResetOtpAndUpdatePassword = async (req: Request, res: Response): Promise<void> => {
  try {
    const {email,otp,newPassword} = req.body;

     if (!email || !otp || !newPassword) {
     res.status(400).json({
      success: false,
      message: "Email, OTP, and new password are required",
    });
    return;
  }

  const user = await User.findOne({email});
  if(!user){
    res.status(400).json({success:false, message:"User not found"});
    return;
  }

    if(user.resetOtpExpiredAt < new Date()){
      res.status(400).json({success:false, message:"OTP is expired, generate new OTP"})
    }

   const isMatchOtp = await argon2.verify(user.resetOtp, otp);

  if(otp === "" || !isMatchOtp){
    res.status(400).json({success:false, message:"Invalid OTP"})
  }

 const hashedPassword = await argon2.hash(newPassword, {
  type: argon2.argon2id,
  memoryCost: 15360,
  timeCost: 2,        
  parallelism: 1
});


  user.password = hashedPassword;
  user.resetOtp = "",
  user.resetOtpExpiredAt = new Date();
  await user.save();

  await sendMail(
  email,
  "Your Password Has Been Changed Successfully",
  `
  <div style="font-family:Arial, sans-serif; line-height:1.6;">
    <h2 style="color:#333;">Password Changed</h2>
    <p>Hello ${user.name || "User"},</p>
    <p>This is a confirmation that your account password was successfully changed.</p>
    <p>If you did not make this change, please contact our support team immediately.</p>
    <br/>
    <p>Best regards,<br/><strong>${process.env.APP_NAME || "Eventify"} Team</strong></p>
  </div>
  `
);

  res.status(200).json({
    success:true,
    message:"Password changed successfully"
  })
    
  }  catch (error: any) {
    console.error("Password reset otp error:", error.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
}