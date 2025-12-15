import { Document,Types } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  username: string;
  password :string;
  role:string;
   rollNumber : string;
   branch: string;
   year : number;
   phone : string;
  profileImageUrl:string;
   verifyOtp:string;
   verifyOtpExpiredAt:Date;
  resetOtp:string;
  resetOtpExpiredAt:Date;
  isAccountVerified:boolean;
  isProfileComplete : boolean;
    createdAt?: Date;
  updatedAt?: Date;
}