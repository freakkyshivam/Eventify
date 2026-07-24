import { Request, Response } from "express";
import db from "../../db/db";
import events from "../../db/schema/event.model";
import { eventsValidation, updateEventValidation } from "../../validation/validation";
import { and, eq } from "drizzle-orm";
import { generateSlug } from "../../utils/slug";
import uploadOnCloudinary from "../../services/events/fileupload.service";

export const createEvent = async (req: Request, res: Response) => {
  try {
    const user = req.user;

    if (!user?.id) {
      return res.status(401).json({
        success: false,
        msg: "Unauthorized",
      });
    }

    if (user?.role === "attendee") {
      return res.status(403).json({
        success: false,
        msg: "Unauthorized",
      });
    }

    const validationResult = eventsValidation.safeParse(req.body);

    if (validationResult.error) {
      console.log("Create event validation error:", validationResult.error);
      return res.status(400).json({
        success: false,
        msg: validationResult.error,
      });
    }

    const {
      title,
      description,
      start_time,
      end_time,
      registration_deadline,
      location,
      event_mode,
      capacity,
      event_category,
      payment_type,
      price,
    } = validationResult.data;

    const files = req.files as Express.Multer.File[];
    let bannerUrls: string[] = [];

    if (files && files.length > 0) {
      const uploadPromises = files.map((file) => uploadOnCloudinary(file.path));
      bannerUrls = await Promise.all(uploadPromises);
    }

    const slug = generateSlug(title);
    await db.insert(events).values({
      title,
      description,
      slug,
      bannerUrls,
      start_time: new Date(start_time),
      end_time: new Date(end_time),
      registration_deadline: new Date(registration_deadline),
      location: location || "Online",
      event_mode,
      capacity: Number(capacity),
      event_category,
      payment_type,
      price: Number(price),
      authorId: req.user!.id,
    });

    return res.status(201).json({
      success: true,
      msg: "Event successfully created",
    });
  } catch (error: any) {
    console.error("Event creation error ", error);
    res.status(500).json({
      success: false,
      msg: "Internal server error",
    });
  }
};

export const updateEvent = async (req: Request, res: Response) => {
  try {
    const { slug } = req.params;

    if (!slug) {
      return res.status(400).json({
        success: false,
        msg: "Slug is required for update event",
      });
    }

    const user = req.user;

    if (!user?.id) {
      return res.status(401).json({
        success: false,
        msg: "Unauthorized",
      });
    }

    if (user?.role === "attendee") {
      return res.status(403).json({
        success: false,
        msg: "Unauthorized",
      });
    }

    console.log("Body : ", req.body);

    const validationResult = updateEventValidation.safeParse(req.body);

    console.log("Validation result : ", validationResult);

    if (validationResult.error) {
      return res.status(400).json({
        success: false,
        msg: validationResult?.error,
      });
    }

    const data = validationResult.data;

    const files = req.files as Express.Multer.File[];
    let newBannerUrls: string[] = [];
    if (files && files.length > 0) {
      const uploadPromises = files.map((file) => uploadOnCloudinary(file.path));
      newBannerUrls = await Promise.all(uploadPromises);
    }

    let existingBanners: string[] = [];
    if (req.body.existingBanners) {
      existingBanners = Array.isArray(req.body.existingBanners)
        ? req.body.existingBanners
        : [req.body.existingBanners];
    }

    const updatedData: any = {};
    if (data.title !== undefined) updatedData.title = data.title;
    if (data.description !== undefined) updatedData.description = data.description;
    if (data.location !== undefined) updatedData.location = data.location;
    if (data.event_mode !== undefined) updatedData.event_mode = data.event_mode;
    if (data.event_category !== undefined) updatedData.event_category = data.event_category;
    if (data.payment_type !== undefined) updatedData.payment_type = data.payment_type;
    if (data.capacity !== undefined) updatedData.capacity = Number(data.capacity);
    if (data.price !== undefined) updatedData.price = Number(data.price);
    if (data.start_time) updatedData.start_time = new Date(data.start_time);
    if (data.end_time) updatedData.end_time = new Date(data.end_time);
    if (data.registration_deadline) updatedData.registration_deadline = new Date(data.registration_deadline);

    if ((files && files.length > 0) || req.body.existingBanners) {
      updatedData.bannerUrls = [...existingBanners, ...newBannerUrls];
    }

    if (Object.keys(updatedData).length === 0) {
      return res.status(400).json({
        success: false,
        msg: "No fields provided to update",
      });
    }

    await db
      .update(events)
      .set(updatedData)
      .where(
        and(
          eq(events.slug, slug),
          user?.role === "admin" ? undefined : eq(events.authorId, user?.id)
        )
      );

    return res.status(200).json({
      success: true,
      msg: "Event details updated",
    });
  } catch (error: any) {
    console.error("Event update error ", error);
    res.status(500).json({
      success: false,
      msg: "Internal server error",
    });
  }
};