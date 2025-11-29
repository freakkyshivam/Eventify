import {Types,Document} from 'mongoose'

export interface IEventRegistration extends Document {
  event: Types.ObjectId; 
  user: Types.ObjectId; 
  name: string;
  registrationDate: Date;
  status: "Registered" | "Cancelled" | "Attended";
  numberOfPeople: number;
  paymentId?: string;
  paymentStatus: "Pending" | "Completed" | "Failed" | "Refunded";
  checkInStatus: boolean;
  checkInTime?: Date;
  ticketCode: string;
  answers: {
    question: string;
    answer: string;
  }[];
  createdAt?: Date;
  updatedAt?: Date;
}