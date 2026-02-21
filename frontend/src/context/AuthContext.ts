 

import { createContext } from "react";
import { type AuthSession } from "../types/User";

export type AuthContextType = {
  session: AuthSession | null;
  setSession: (session: AuthSession | null) => void;
  logout: () => void;
};

export const AuthContext = createContext<AuthContextType | null>(null);