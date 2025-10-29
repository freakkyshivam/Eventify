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
 
    const hashedPassword = await bcrypt.hash(password, 10);
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
    const {identifiers, password} = req.body;
    console.log(identifiers);
    
    if(!identifiers || !password){
     res.status(400).json({success : false, message:"All field are required"});
     return;
    }

    const user = await User.findOne({
      $or: [{email:identifiers}, {username:identifiers}]
    })
    
    if(!user){
      res.status(401).json({success:false, messagee:"Invalid credentials"})
      return;
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if(!isMatch){
      res.status(401).json({success:false, messagee:"Password is wrong"})
      return;
    }
   const token = await generateToken(user._id.toString(),user.email,user.role);
  
   res.cookie("token", token,{
    httpOnly:true,
    secure:process.env.NODE_ENV==="production",
    sameSite:"strict",
    maxAge: 7 * 24 * 60 * 60
   })

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
export const googleAuth = async (req:Request, res : Response):Promise<void>=>{
  const code = req.query.code as string;
  try {
    
    const {data} = await axios.post("https://oauth2.googleapis.com/token", {
      code,
      client_id: process.env.GOOGLE_CLIENT_ID,
      client_secret: process.env.GOOGLE_CLIENT_SECRET,
      redirect_uri: process.env.GOOGLE_REDIRECT_URI,
      grant_type: "authorization_code",
    });

    const {access_token} = data;

    const userInfo = await axios.get("https://www.googleapis.com/oauth2/v2/userinfo",{
      headers: { Authorization: `Bearer ${access_token}` },
    })

    const { id, name, email, picture,given_name } = userInfo.data;
    const finalName = name || given_name || email.split("@")[0];
    console.log("✅ User Info:", id,finalName,email,picture);

    let user = await User.findOne({email});

    if(!user){
      const uniqueUserName = await generateUniqueUsername(finalName, email);

      const dummyPassword = await bcrypt.hash(id + process.env.JWT_SECRET, 10);

      user = new User({
        name:finalName ,
        username : uniqueUserName,
        email,
        password: dummyPassword,
        profileImage:picture,
        isAccountVerified : true
      })

      await user.save();

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

await sendMail(email, subject, text);


    }

    const token = await generateToken(user._id.toString(),email,user.role);

      
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
  } catch (error : any) {
    console.error("Google Login Error:", error.response?.data || error.message);
    res.status(500).json({ error: "Authentication failed" });
  }
}

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
    );
 
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
 
    const existingUser = await User.findOne({ username: updatedUserName });
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
    );
 
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

    const existingUser = await User.findById(user.id).select("+password"); 

    if (!existingUser) {
      res.status(404).json({ success: false, message: "User not found" });
      return;
    }

    const isMatch = await bcrypt.compare(previousPassword, existingUser.password);

    if (!isMatch) {
      res.status(400).json({ success: false, message: "Incorrect current password" });
      return;
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
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
    const hashedOtp = await bcrypt.hash(otp,10);
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

    const isMatchOtp = await bcrypt.compare(otp, user.resetOtp);
  if(otp === "" || !isMatchOtp){
    res.status(400).json({success:false, message:"Invalid OTP"})
  }

  const hashedPassword = await bcrypt.hash(newPassword,10);

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