import { Request, Response } from "express";

import users from '../../db/schema/user.model'
import { role_request_table } from "../../db/schema/role_request.schema";
import db from "../../db/db";

import {eq} from 'drizzle-orm'

export const change_role_request = async (req : Request, res:Response)=>{
    try {
        const user =  req.user;

        if(!user?.id){
            console.log("Unauthorized")
            return res.status(401).json({
                success : false,
                msg :'Unauthorized'
            })
        }

        if(user?.role === "organizer"){
            return res.status(400).json({
                success : false,
                msg : 'You are already a organizer you can not request'
            })
        }

        const [exsting] = await db.select()
        .from(role_request_table)
        .where(eq(role_request_table.user_id, user?.id))

        if(exsting){
            return res.status(400).json({
                success : false,
                msg : "You already sent a request for organizer"
            })
        }

        await db.insert(role_request_table).values({
            user_id : user?.id,
        })

        await db.update(users).set({
            organizer_request : true
        }).where(eq(users.id, user?.id))

        return res.status(200).json({
            success : true,
            msg : "Request sent to admin"
        })
    } catch (error) {
        console.error("Chnaging role request error ", error);
        return res.status(500).json({
            success : false,
            msg : "Server error"
        })
    }
}