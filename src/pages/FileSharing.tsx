import { useFileSharing } from "@/contexts/FileSharingContext";
import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import { Loading } from "@/components/ui/loading";
import { Download, FolderOpen, Plus, Settings2, Upload } from "lucide-react";
import { api } from "@/utils/server/apiClient";
import { toast } from "@/components/ui/toaster";
import { useAppSecret } from "@/hooks/useAppSecret";
import type { Share } from "@/models/samba";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { SharesCardList, SharesTable } from "@/components/file-sharing/SharesTable";
import { SambaConfigEditor } from "@/components/file-sharing/SambaConfigEditor";
import { ShareForm } from "@/components/file-sharing/ShareForm";
import { DeleteShareDialog } from "@/components/file-sharing/DeleteShareDialog";
import { AppSecretModal } from "@/components/ui/app-secret-modal";

type FormMode = { type: "create"; isOpen: boolean } | { type: "edit"; name: string; share: Share; isOpen: boolean };

export const FileSharingPage = () => {
  const { refreshShares, setShares, loading, shares, ensureShares } = useFileSharing();
  const [backingUp, setBackingUp] = useState(false);
  const [restoring, setRestoring] = useState(false);

  // Dialog state
  const [formMode, setFormMode] = useState<FormMode>({ type: "create", isOpen: false });
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);

  const { prompt, getSecret, submitPrompt, cancelPrompt } = useAppSecret();

  useEffect(() => {
    ensureShares();
  }, []);

  const openCreate = () => {
    setFormMode({ type: "create", isOpen: true });
  };

  const openEdit = (name: string, share: Share) => {
    setFormMode({ type: "edit", name, share, isOpen: true });
  };

  const handleBackup = async () => {
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
  };

  const handleRestore = async () => {
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
  };

  const shareCount = Object.keys(shares).length;
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-5">
      {/* Page header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-semibold text-fg">File Sharing</h1>
          <p className="mt-0.5 text-sm text-dim">Manage SMB/CIFS network shares</p>
        </div>
        <div className="flex items-center gap-2 text-subtle">
          <Button variant="outline" size="sm" onClick={handleBackup} disabled={backingUp} className="flex-1 sm:flex-none bg-transparent">
            {backingUp ? <Loading className="mr-2 size-3.5" /> : <Download className="mr-2 size-3.5" />}
            Backup
          </Button>
          <Button variant="outline" size="sm" onClick={handleRestore} disabled={restoring} className="flex-1 sm:flex-none bg-transparent">
            {restoring ? <Loading className="mr-2 size-3.5" /> : <Upload className="mr-2 size-3.5" />}
            Restore
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="shares">
        <TabsList>
          <TabsTrigger value="shares" className="gap-2">
            <FolderOpen className="size-3.5" />
            Shares
          </TabsTrigger>
          <TabsTrigger value="config" className="gap-2">
            <Settings2 className="size-3.5" />
            Global Config
          </TabsTrigger>
        </TabsList>

        {/* ── Shares tab ── */}
        <TabsContent value="shares" className="mt-4">
          <Card>
            <CardHeader className="flex-row items-center justify-between pb-3">
              <div>
                <CardTitle>Network Shares</CardTitle>
                <CardDescription className="mt-0.5">
                  {shareCount} {shareCount === 1 ? "share" : "shares"} configured
                </CardDescription>
              </div>
              <Button size="sm" onClick={openCreate}>
                <Plus className="mr-1.5 size-3.5" />
                Create Share
              </Button>
            </CardHeader>

            <CardContent className="p-0">
              {loading ? (
                <Loading className="py-12" />
              ) : (
                <>
                  {/* Desktop table */}
                  <div className="hidden md:block">
                    <SharesTable shares={shares} onEdit={openEdit} onDelete={(name) => setDeleteTarget(name)} />
                  </div>
                  {/* Mobile cards */}
                  <div className="md:hidden p-4">
                    <SharesCardList shares={shares} onEdit={openEdit} onDelete={(name) => setDeleteTarget(name)} />
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* ── Config tab ── */}
        <TabsContent value="config" className="mt-4">
          <SambaConfigEditor />
        </TabsContent>
      </Tabs>

      {/* Dialogs */}
      <ShareForm
        open={formMode.isOpen}
        mode={formMode}
        onClose={() => setFormMode((prev) => ({ ...prev, isOpen: false }))}
        onSuccess={refreshShares}
      />

      <DeleteShareDialog
        open={deleteTarget !== null}
        shareName={deleteTarget ?? ""}
        onClose={() => setDeleteTarget(null)}
        onSuccess={refreshShares}
      />

      <AppSecretModal open={prompt} onSubmit={submitPrompt} onCancel={cancelPrompt} />
    </motion.div>
  );
};
