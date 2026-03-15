import db from "../../db/db";
import { users } from "../../db/schema/user.model";
import { Request, Response } from "express";

export const getAllUsersAD = async (req:Request,res:Response)=>{
    try {
        
        const user = req.user;

        if(!user?.id){
            return res.status(401).json({
                msg: "Unauthorized",
                success : false
            })
        }

        if(user.role !== "admin"){
            return res.status(403).json({
                success : false,
                msg : "Forbidden"
            })
        }

        const results = await db.select().from(users);

        if((results).length === 0){
            return res.status(400).json({
                success : false,
                msg : "No user found"
            })
        }

        return res.status(200).json({
            success : true,
            results
        })

    } catch (error) {
        console.error("All users fetching error (Admin)", error);
        return 
    }
}