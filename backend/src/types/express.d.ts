 import { IUser } from "./User.type";

declare global {
  namespace Express {
    interface Request {
      user?: IUser;
    }
  }
}

export {};
