import type { User } from "@/models/user";
import { createContext, useContext, useState, type ReactNode } from "react";
import { api } from "@/utils/server/apiClient";

type AuthContextValue = {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  /** error is not handled */
  refreshMyUser: () => Promise<void>;
  /** error is not handled */
  ensureMyUser: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  const refreshMyUser = async () => {
    const me = await api.get("/auth/me");
    setUser(me.data);
  };

  const ensureMyUser = async () => {
    if (!user) await refreshMyUser();
  };

  return <AuthContext value={{ user, setUser, ensureMyUser, refreshMyUser }}>{children}</AuthContext>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
