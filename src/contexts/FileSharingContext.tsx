import { useAppSecret } from "@/hooks/useAppSecret";
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
  appSecret: ReturnType<typeof useAppSecret>;
  backingUp: boolean;
  restoring: boolean;
  restore: () => Promise<void>;
  backup: () => Promise<void>;
};

const FileSharingContext = createContext<FileSharingContextValue | null>(null);

export const FileSharingProvider = ({ children }: { children: ReactNode }) => {
  const [shares, setShares] = useState<Shares>({});
  const [loading, setLoading] = useState(false);
  const [backingUp, setBackingUp] = useState(false);
  const [restoring, setRestoring] = useState(false);

  const appSecret = useAppSecret();
  const { getSecret } = appSecret;

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

  const backup = useCallback(async () => {
    setBackingUp(true);
    try {
      const secret = await getSecret();
      if (!secret) return;
      await api.post("/samba/backup", { header: { "X-APP-SECRET": secret } });
      toast.success("Backup completed successfully");
    } catch (err: any) {
      if (err?.status === 403) {
        toast.error("Invalid app secret");
      } else toast.error("Backup failed");
    } finally {
      setBackingUp(false);
    }
  }, []);

  const restore = useCallback(async () => {
    setRestoring(true);
    try {
      const secret = await getSecret();
      if (!secret) return;
      const res = await api.post("/samba/restore", { header: { "X-APP-SECRET": secret } });
      setShares(res.data ?? {});
      toast.success("Restore completed successfully");
    } catch (err: any) {
      if (err?.status === 403) {
        toast.error("Invalid app secret");
      } else toast.error("Restore failed");
    } finally {
      setRestoring(false);
    }
  }, []);

  return (
    <FileSharingContext
      value={{ shares, setShares, refreshShares, loading, setLoading, ensureShares, appSecret, backingUp, restoring, backup, restore }}
    >
      {children}
    </FileSharingContext>
  );
};

export const useFileSharing = () => {
  const ctx = useContext(FileSharingContext);
  if (!ctx) throw new Error("useFileSharing must be used within FileSharingProvider");
  return ctx;
};
