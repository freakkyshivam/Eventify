import { Request, Response } from "express";

import users from "../../db/schema/user.model";
import { role_request_table } from "../../db/schema/role_request.schema";
import db from "../../db/db";
import { eq } from "drizzle-orm";
 



export const updateRole = async(req:Request, res:Response)=>{
    try {

        const user =  req.user;

        if(!user?.id){
            return res.status(401).json({
                success : false,
                msg : "Unaothorized"
            })
        }

        if(user?.role !== 'admin'){
            return res.status(403).json({
                success : false,
                msg : "You can not proceed this request"
            })
        }

        const {userId} =  req.params;

        if(!userId){
            return res.status(400).json({
                success:false,
                msg : "User id is required for chnaging the user role"
            })
        }

       const [exitingUser] = await db.select().from(users).where(eq(users.id,userId));

       if(!exitingUser){
        return res.status(400).json({
            success : false,
            msg : "User not found"
        })
       }

       if(exitingUser.role === 'admin'){
        return res.status(400).json({
            success : false,
            msg : "Admin role can not be chnageable"
        })
       }

       const Role = (exitingUser.role === 'attendee' ? 'organizer' : 'attendee');

          await db.update(users).set({
            role : Role
          }).where(eq(users.id, userId))

          return res.status(200).json({
            success : true,
            msg : "User role updated"
          })
        
    } catch (error) {
        console.error("Updateing role error ", error);
        return res.status(500).json({
            success : false,
            msg : "Internal serevr error"
        })
    }
}

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
        msg: "Role request id is required",
      });
    }

    const [existingReq] = await db
      .select()
      .from(role_request_table)
      .where(eq(role_request_table.id, id));

    if (!existingReq) {
      return res.status(404).json({
        success: false,
        msg: "Role request not found or expired",
      });
    }

    if (!existingReq.user_id) {
  return res.status(400).json({
    success: false,
    msg: "Invalid role request: user not found",
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
        updatedAt: new Date(),
      })
      .where(eq(users.id, existingReq.user_id));

    return res.status(200).json({
      success: true,
      msg: "Role request approved",
    });
  } catch (error) {
    console.error("Role approve error", error);
    return res.status(500).json({ success: false });
  }
};

export const rejectRoleRequest = async(req : Request, res : Response)=>{
    try {

        const user = req.user;

        if(!user?.id || user?.role !== 'admin'){
            return res.status(401).json({
                success : false,
                msg : "You can not approve this request"
            })
        }
        const {id} = req.params;

        if(!id){
            return res.status(400).json({
                sucess : false,
                msg : "Role request id is required"
            })
        }

        const [extingReq] = await db.select().from(role_request_table).where(eq(role_request_table.id, id));
        
        if(!extingReq){
            return res.status(400).json({
                success : false,
                msg : "Role request is not found, may be request is expired"
            })
        }

        await db.update(role_request_table)
        .set({
            status : "rejected"
        }).where(eq(role_request_table.id, id))

 
        return res.status(200).json({
            success : true,
            msg  : "Role request rejected sucessfully "
        })

    } catch (error) {
        console.error("Role raject error ", error);
        return res.status(500)
    }
}
