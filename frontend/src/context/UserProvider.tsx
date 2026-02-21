 

import { useState, useEffect, type ReactNode } from "react";
import { AuthContext } from "./AuthContext";
import { type AuthSession } from "../types/User";

type Props = {
  children: ReactNode;
};

export const AuthProvider = ({ children }: Props) => {

  const [session, setSessionState] = useState<AuthSession | null>(null);

  const setSession = (session: AuthSession | null) => {

    setSessionState(session);

    if (session) {
      localStorage.setItem("session", JSON.stringify(session));
    } else {
      localStorage.removeItem("session");
    }
  };

  const logout = () => {
    setSession(null);
  };

  
  useEffect(() => {

    const stored = localStorage.getItem("session");

    if (stored) {
      setSessionState(JSON.parse(stored));
    }

  }, []);

  return (
    <AuthContext.Provider value={{ session, setSession, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
