// import { Request , Response } from "express";
// import { CustomJwtPayload } from "../utils/customJwtPayloads";
//  import User from "../models/User.model";
// import { sendMail } from "../utils/nodeMailer";
// import  argon2  from "argon2";
// import uploadOnCoudinary from "../config/cloudinary";


// import db from '../db/db'
// import Users from '../db/schema/user.model'
 
// import { updateNameValidation,updateusernameValidation } from "../validation/validation";
// import { eq, and, ne } from "drizzle-orm";
 

// interface AuthRequest extends Request {
//   user?: CustomJwtPayload;
// }



// // update name
// export const updateName = async (req: Request, res: Response) => {
//   try {

//     const validationResult = await updateNameValidation.safeParseAsync(req.body)

//      if(validationResult.error){
//        res.status(400).json({success:false, msg:validationResult.error.format()})
//              return;
//     }

//     const { updatedName } = validationResult.data;

//     const user = (req as AuthRequest).user;
 
//     if (!user?.id) {
//       res.status(401).json({ success: false, message: "Unauthorized" });
//       return;
//     }
 
//     const [updatedUser] = await db.update(Users).set({
//       name : updatedName
//     })
//     .where((table)=> eq(table.id, user.id))
//     .returning()
 
//     res.status(200).json({
//       success: true,
//       message: "Name updated successfully",
//       user: {
//         name : updatedUser.name,
//         email : updatedUser.email
//       },
//     });
//   } catch (error: any) {
//     console.error("Update name error:", error.message);
//     res.status(500).json({ success: false, message: "Server error" });
//   }
// };

// // update user name 
// export const updateUserName = async (req: Request, res: Response) => {
//   try {

//     const validationResult = await updateusernameValidation.safeParseAsync(req.body)

//      if(validationResult.error){
//        res.status(400).json({success:false, msg:validationResult.error.format()})
//              return;
//     }

//     const { updatedUsername } = validationResult.data;
//     const user = (req as AuthRequest).user;
   
//     if (!user?.id) {
//       res.status(401).json({ success: false, message: "Unauthorized" });
//       return;
//     }

  

//   const [existingUser] = await db
//   .select()
//   .from(Users)
//   .where(
//     and(
//       eq(Users.username, updatedUsername),
//       ne(Users.id, user.id) 
//     )
//   );

// if (existingUser) {
//    res.status(400).json({
//     success: false,
//     message: "Username already taken",
//   });
//   return;
// }

//     const [updatedUser] = await db.update(Users).set({
//       username : updatedUsername,
//        updatedAt: new Date(),
//     })
//     // .where(eq(Users.id, user.id))
//     .returning();
 
     
//     res.status(200).json({
//       success: true,
//       message: "Username updated successfully",
//       user: {
//         name : updatedUser.name,
//         username : updatedUser.username,
//         email : updatedUser.email
//       },
//     });
//   } catch (error: any) {
//     console.error("Update username error:", error.message);
//     res.status(500).json({ success: false, message: "Server error" });
//   }
// };

// // update password 
// export const updatePassword = async (req: Request, res: Response) => {
//   try {
//     const { previousPassword, newPassword } = req.body;
//     const user = (req as AuthRequest).user;  
//     if (!user?.id) {
//       res.status(401).json({ success: false, message: "Unauthorized" });
//       return;
//     }

//     if (!previousPassword || !newPassword) {
//       res.status(400).json({ success: false, message: "All fields are required" });
//       return;
//     }

//     const existingUser = await User.findById(user.id).select("+password").lean(); 

//     if (!existingUser) {
//       res.status(404).json({ success: false, message: "User not found" });
//       return;
//     }

//    const isMatch = await argon2.verify(existingUser.password, previousPassword);



//     if (!isMatch) {
//       res.status(400).json({ success: false, message: "Incorrect current password" });
//       return;
//     }

//     const hashedPassword = await argon2.hash(newPassword, {
//   type: argon2.argon2id,
//   memoryCost: 15360,  
//   timeCost: 2,        
//   parallelism: 1
// });

   
//     await User.findByIdAndUpdate(user.id, {password:hashedPassword},{
//       new:true,
//       runValidators:true
//     })

//     await sendMail(
//   user.email,
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

    
//     res.status(200).json({ success: true, message: "Password updated successfully" });
//   } catch (error: any) {
//     console.error("Update password error:", error.message);
//     res.status(500).json({ success: false, message: "Server error" });
//   }
// };

// export const profileImage = async(req : Request, res:Response) : Promise<void> =>{
//   try {
//      const avtar = req.file;
//      const user = (req as AuthRequest).user;  
//     if (!user?.id) {
//       res.status(401).json({ success: false, message: "Unauthorized" });
//       return;
//     }

//     if (!avtar) {
//       res.status(400).json({ success: false, message: "Profile image are required" });
//       return;
//     }

     

//       const existingUser =await User.findById(user.id).lean();

//       if(!existingUser){
//          res.status(404).json({ success: false, message: "User not found" });
//       return;
//       }
//      const response = await uploadOnCoudinary(avtar?.path)
//      console.log(response);
     
//       await User.findByIdAndUpdate(user.id,{profileImage:response},{
//         new:true,
//         runValidators:true
//       })

//        res.status(200).json({ success: true, message: "Profile image updated successfully" });
//   } catch (error) {
    
//   }
// }