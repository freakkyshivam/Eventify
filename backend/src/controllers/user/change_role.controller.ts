import { Request, Response } from "express";

import { role_request_table } from "../../db/schema/role_request.schema";
import { success } from "zod";


export const change_role_request = async (req : Request, res:Response)=>{
    try {
        const user =  req.user;

        if(!user?.id){
            return res.status(401).json({
                success : false,
                msg :'Unauthorized'
            })
        }
        
    } catch (error) {
        console.error("Chnaging role request error ", error);
        return res.status(500).json({
            success : false,
            msg : "Server error"
        })
    }
}