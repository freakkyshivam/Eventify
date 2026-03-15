import { Request, Response } from "express";

import users from "../../db/schema/user.model";
import { role_request_table } from "../../db/schema/role_request.schema";
import db from "../../db/db";
import { eq } from "drizzle-orm";

export const approveRoleRequest = async (req: Request, res: Response) => {
  try {
    const user = req.user;

    if (!user?.id || user?.role !== "admin") {
      return res.status(401).json({
        success: false,
        msg: "You can not approve this request",
      });
    }

    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        msg: "Orgaanizer request id is required",
      });
    }

    const [existingReq] = await db
      .select()
      .from(role_request_table)
      .where(eq(role_request_table.id, id));

    if (!existingReq) {
      return res.status(404).json({
        success: false,
        msg: "Organizer request not found or expired",
      });
    }

    if (!existingReq.user_id) {
      return res.status(400).json({
        success: false,
        msg: "Invalid organizer request: user not found",
      });
    }

    await db
      .update(role_request_table)
      .set({ status: "approved" })
      .where(eq(role_request_table.id, id));

    await db
      .update(users)
      .set({
        role: "organizer",
        organizer_request: false,
        updatedAt: new Date(),
      })
      .where(eq(users.id, existingReq.user_id));

    return res.status(200).json({
      success: true,
      msg: "Organizer request approved",
    });
  } catch (error) {
    console.error("Organizer approve error", error);
    return res.status(500).json({ success: false });
  }
};

export const rejectRoleRequest = async (req: Request, res: Response) => {
  try {
    const user = req.user;

    if (!user?.id || user?.role !== "admin") {
      return res.status(401).json({
        success: false,
        msg: "You can not approve this request",
      });
    }
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        sucess: false,
        msg: "Organizer request id is required",
      });
    }

    const [existingReq] = await db
      .select()
      .from(role_request_table)
      .where(eq(role_request_table.id, id));

    if (!existingReq) {
      return res.status(400).json({
        success: false,
        msg: "Organizer request is not found, may be request is expired",
      });
    }

    if (!existingReq.user_id) {
      return res.status(400).json({
        success: false,
        msg: "Invalid organizer request: user not found",
      });
    }

    await db
      .update(role_request_table)
      .set({
        status: "rejected",
      })
      .where(eq(role_request_table.id, id));

    await db
      .update(users)
      .set({
        organizer_request: false,
        updatedAt: new Date(),
      })
      .where(eq(users.id, existingReq.user_id));

    return res.status(200).json({
      success: true,
      msg: "Organizer request rejected sucessfully ",
    });
  } catch (error) {
    console.error("Organizer request reject error ", error);
    return res.status(500);
  }
};
