import type { Profile } from "@/models/user";
import { createContext, useContext, useState, type ReactNode } from "react";
import { api } from "@/utils/server/apiClient";

type ProfileContextValue = {
  profiles: Profile[];
  setProfiles: React.Dispatch<React.SetStateAction<Profile[]>>;

  getProfile: (id: string) => Promise<Profile>;
};

const ProfileContext = createContext<ProfileContextValue | null>(null);

export const ProfileProvider = ({ children }: { children: ReactNode }) => {
  const [profiles, setProfiles] = useState<Profile[]>([]);

  const getProfile = async (id: string) => {
    const cached = profiles.find((u) => u.id === id);
    if (cached) return cached;
    const profile = await api.get("/users/{id}", { param: { id } });
    setProfiles((prev) => [...prev, profile.data]);
    return profile.data;
  };

  return <ProfileContext value={{ getProfile, setProfiles, profiles }}>{children}</ProfileContext>;
};

export const useProfile = () => {
  const ctx = useContext(ProfileContext);
  if (!ctx) throw new Error("useProfile must be used within ProfileProvider");
  return ctx;
};
