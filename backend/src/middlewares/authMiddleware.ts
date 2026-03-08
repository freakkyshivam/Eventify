import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { JwtUserPayload } from "../types/User.type";
 

interface AuthRequest extends Request {
  user?: JwtUserPayload;
}
export const authMiddleware = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  let access_token: string | undefined;

   
  if (req.cookies?.access_token) {
    access_token = req.cookies.access_token;   
  }

 
  if (!access_token && req.headers.authorization) {
    access_token = req.headers.authorization.split(" ")[1];
  }

 
  

  if (!access_token) {
    return res
      .status(401)
      .json({ success: false, message: "Not authorized" });
  }
 

  try {
    const decoded = jwt.verify(
      access_token,
      process.env.JWT_SECRET as string
    ) as JwtUserPayload;

    req.user = decoded;
    next();
  } catch (error) {
    return res
      .status(401)
      .json({ success: false, message: "Invalid token" });
  }
};
