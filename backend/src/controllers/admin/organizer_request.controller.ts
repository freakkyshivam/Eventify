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

if(existingReq.used){
  return res.status(400).json({
    success : false,
    msg : "Request is expired"
  })
}

    if(existingReq.status === "approved"){
      return res.status(409).json({
        msg : "Organizer request already approved",
        success : false
      })
    }
      const userId = existingReq.user_id as string
    await db.transaction( async (tx)=>{
           await tx
                .update(role_request_table)
                .set({ status: "approved", used : true })
                .where(eq(role_request_table.id, id));

              await tx
                .update(users)
                .set({
                  role: "organizer",
                  organizer_request: false,
                  updatedAt: new Date(),
                })
                .where(eq(users.id, userId));
    })
    

    return res.status(200).json({
      success: true,
      msg: "Organizer request approved",
    });
  } catch (error) {
    console.error("Organizer request approve error", error);
    return res.status(500).json({ success: false, msg : "Organizer request approve error" });
  }
};

export const rejectRoleRequest = async (req: Request, res: Response) => {
  try {
    const user = req.user;

    if (!user?.id || user?.role !== "admin") {
      return res.status(401).json({
        success: false,
        msg: "You are not authorized to reject this request",
      });
    }

    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        msg: "Organizer request id is required",
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

    if(existingReq.used){
  return res.status(400).json({
    success : false,
    msg : "Request is expired"
  })
}

    if (existingReq.status === "rejected") {
      return res.status(409).json({
        success: false,
        msg: "Organizer request already rejected",
      });
    }
      const userId = existingReq.user_id as string

    await db.transaction(async (tx) => {
      await tx
        .update(role_request_table)
        .set({ status: "rejected", used : true })
        .where(eq(role_request_table.id, id));

      await tx
        .update(users)
        .set({ organizer_request: false, updatedAt: new Date() })
        .where(eq(users.id, userId));
    });

    return res.status(200).json({
      success: true,
      msg: "Organizer request rejected successfully",
    });
  } catch (error) {
    console.error("Organizer request reject error", error);
    return res.status(500).json({
      success: false,
      msg: "Organizer request reject error",
    });
  }
};
