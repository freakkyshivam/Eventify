import { Request, Response } from "express";


export const logout = async (req:Request, res:Response)=>{
    try {

        return res.
        clearCookie('access_token')
        .clearCookie("refresh_token")
        .clearCookie('sid')
        .json({
            success:true,
            msg : "Logout successfull"
        })
        
    } catch (error : any) {
        console.error("Logout errror  ", error?.response?.message);
        return res.status(500).json({
            success : false,
            msg : "Server error"
        })
    }
}