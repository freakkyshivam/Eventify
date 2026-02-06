import { Document,Types } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  role:string;
  profileImageUrl:string;
  isAccountVerified:boolean;
  profile_completed : boolean;
  createdAt?: Date;
  updatedAt?: Date;
}