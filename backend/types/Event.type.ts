import { Types,Document } from "mongoose";

export interface IEvent extends Document {
  title: string;
  description: string;
  banner: string;
  startDate: Date;
  endDate: Date;
  location: string;
  capacity: number;
  category: "Conference" | "Webinar" | "Workshop" | "Competition" | "Technology" | "Other";
  paymentType: "Free" | "Paid";
  price: number;
  status: "Upcoming" | "Ongoing" | "Completed" | "Cancelled";
  author: Types.ObjectId; 
  registeredUsers: Types.ObjectId[];
  createdAt?: Date;
  updatedAt?: Date;
}