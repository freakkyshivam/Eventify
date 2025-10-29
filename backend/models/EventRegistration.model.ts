import mongoose,{Document,Types} from "mongoose";
import { IEventRegistration } from "../types/EventRegistration.types";

const EventRegistrationSchema = new mongoose.Schema({
  event: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Event",
    required: true,
  },
   user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
   registrationDate: {
      type: Date,
      default: Date.now,
    },
   registrationStatus: {
  type: String,
  enum: ["registered", "cancelled", "attended"],
  default: "registered",
},   
  numberOfPeople: {
    type: Number,
    default: 1,
    min: 1,
  },
  paymentId: String,
  razorpayOrderId:String,
  paymentStatus: {
    type: String,
   enum: ["pending", "completed", "failed", "refunded"],
default: "pending",

  },
 
  checkInStatus: {
    type: Boolean,
    default: false,
  },
  checkInTime: {
    type: Date,
  },
  ticketCode: {
    type: String,
    unique: true,
  },
  answers: [
    {
      question: String,
      answer: String,
    },
  ],
}, { timestamps: true,versionKey:false });

EventRegistrationSchema.pre("save", function (next) {
  if (!this.ticketCode) {
    this.ticketCode = `TCKT-${Math.random().toString(36).substring(2, 10).toUpperCase()}`;
  }
  next();
});


EventRegistrationSchema.index({ event: 1, user: 1 }, { unique: true });


export default mongoose.model<IEventRegistration>("EventRegistration", EventRegistrationSchema);

