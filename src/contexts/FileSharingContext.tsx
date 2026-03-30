import type { Shares } from "@/models/samba";
import { api } from "@/utils/server/apiClient";
import { createContext, useCallback, useContext, useState, type ReactNode } from "react";
import { toast } from "sonner";

type FileSharingContextValue = {
  shares: Shares;
  setShares: React.Dispatch<React.SetStateAction<Shares>>;
  refreshShares: () => Promise<void>;
  ensureShares: () => Promise<void>;
  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
};

const FileSharingContext = createContext<FileSharingContextValue | null>(null);

export const FileSharingProvider = ({ children }: { children: ReactNode }) => {
  const [shares, setShares] = useState<Shares>({});
  const [loading, setLoading] = useState(false);

  const refreshShares = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get("/samba");
      setShares(res.data);
    } catch {
      toast.error("Failed to load shares");
    } finally {
      setLoading(false);
    }
  }, []);

  const ensureShares = useCallback(async () => {
    if (Object.keys(shares).length === 0) {
      await refreshShares();
    }
  }, []);

  return <FileSharingContext value={{ shares, setShares, refreshShares, loading, setLoading, ensureShares }}>{children}</FileSharingContext>;
};

export const useFileSharing = () => {
  const ctx = useContext(FileSharingContext);
  if (!ctx) throw new Error("useFileSharing must be used within FileSharingProvider");
  return ctx;
};
