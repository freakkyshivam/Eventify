import { Document,Types } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  username: string;
  password :string;
  role:string;
  registeredEvents: Types.ObjectId[];
  createdEvents: Types.ObjectId[];
  profileImage:string;
   verifyOtp:string;
   verifyOtpExpiredAt:Date;
  resetOtp:string;
  resetOtpExpiredAt:Date;
  isAccountVerified:boolean;
    createdAt?: Date;
  updatedAt?: Date;
}