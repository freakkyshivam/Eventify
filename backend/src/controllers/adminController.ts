import { Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import Event from "../models/Event.model";
import Users from "../models/User.model";
import EventRegistration from "../models/EventRegistration.model";
import axios from "axios";
import uploadOnCoudinary from "../config/cloudinary";
interface AuthRequest extends Request {
  user?: any;
}


// create event
export const createEvent = async (
  req: Request,
  res: Response
): Promise<void> => {
    const user = (req as AuthRequest).user; 
    if (!user ) {
      res.status(401).json({ success: false, message: "Invalide credntials" });
      return;
    }
  try {
    const {
      title,
      description,
      startDate,
      endDate,
      location,
      capacity,
      category,
      paymentType,
      price,
      status,
    } = req.body;

    const bannerFiles = req.files as Express.Multer.File[];

    if (!title) {
      res.status(400).json({ success: false, message: "Title is required" });
      return;
    }
    if (!description) {
      res
        .status(400)
        .json({ success: false, message: "Description is required" });
      return;
    }
      if (!bannerFiles || bannerFiles.length === 0) {
      res
        .status(400)
        .json({ success: false, message: "At least one banner is required" });
      return;
    }

    if (!startDate || !endDate) {
      res
        .status(400)
        .json({
          success: false,
          message: "Start date and end date are required",
        });
      return;
    }
    
    const uploadedImages = await Promise.all(
      bannerFiles.map((file) => uploadOnCoudinary(file.path))
    );
     

    const newEvent = new Event({
      title,
      description,
      banner : uploadedImages ,
      startDate,
      endDate,
      location,
      capacity,
      category,
      paymentType,
      price,
      status,
      author: user.id,
    });

    await newEvent.save();
     await Users.findByIdAndUpdate(user.id, {
      $push: { createdEvents: newEvent._id },
    });

    res.status(201).json({ success: true, newEvent });
  } catch (error: any) {
    console.error("New Event create error ", error.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const allUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = (req as AuthRequest).user;

    if (!user) {
      res.status(401).json({ success: false, message: "Invalid credentials" });
      return;
    }

    if (user.role === "user") {
      res.status(403).json({ success: false, message: "Access denied" });
      return;
    }
 
     const allUsers = await Users.find()
  .select("name email username role registeredEvents profileImage")
  .populate("registeredEvents", "title")
  .lean();     


    if (!allUsers || allUsers.length === 0) {
      res
        .status(404)
        .json({ success: false, message: "No users found in database" });
      return;
    }
    // console.log("All users:", allUsers);
    res.status(200).json({ success: true, users: allUsers });
  } catch (error: any) {
    console.error("All users error:", error.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
};