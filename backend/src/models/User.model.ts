import mongoose, { Schema, model } from "mongoose";
import { IUser } from "../types/User.type";

const UserSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    username: {
      type: String,
      required: true,
      lowercase: true,
      unique: true,
      trim: true,
      index : true
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      unique: true,
      trim: true,
      index : true
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    role: {
   type: String,
   enum: ["student", "coordinator", "club_admin", "super_admin"],
   default: "student",
  },

    //  For normal users — which events they registered for
    registeredEvents: [
      {
        type: Schema.Types.ObjectId,
        ref: "Event",
      },
    ],

    //  For admins — which events they created
    createdEvents: [
      {
        type: Schema.Types.ObjectId,
        ref: "Event",
      },
    ],

    profileImage: {
      type: String,
      default: "",
    },
    verifyOtp: {
      type: String,
      default: "",
    },
    verifyOtpExpiredAt: {
      type: Date,
      default: null,
    },
    resetOtp: {
      type: String,
      default: "",
    },
    resetOtpExpiredAt: {
      type: Date,
      default: null,
    },
    isAccountVerified: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

UserSchema.index({ email: 1, username: 1 });

export default model("User", UserSchema);
