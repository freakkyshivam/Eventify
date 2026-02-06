import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { IUser } from "../types/User.type";

interface AuthRequest extends Request {
  user?: IUser | JwtPayload;
}

export const authMiddleware = (req: AuthRequest, res: Response, next: NextFunction) => {
  const {access_token} =
    req.cookies || req.header("Authorization")?.replace("Bearer ", "");
  console.log(access_token);
  
  if (!access_token) {
    return res.status(401).json({ success: false, message: "Not authorized" });
  }

  try {
    const decoded = jwt.verify(access_token, process.env.JWT_SECRET as string) as JwtPayload;
    // console.log(decoded);
    
    req.user = decoded;  
    next();
  } catch {
    return res.status(401).json({ success: false, message: "Invalid token" });
  }
};
