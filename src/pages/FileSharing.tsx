import { useFileSharing } from "@/contexts/FileSharingContext";
import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import { Loading } from "@/components/ui/loading";
import { Download, FolderOpen, Plus, RefreshCcw, Settings2, Upload } from "lucide-react";
import type { Share } from "@/models/samba";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { SharesCardList, SharesTable } from "@/components/file-sharing/SharesTable";
import { SambaConfigEditor } from "@/components/file-sharing/SambaConfigEditor";
import { ShareForm } from "@/components/file-sharing/ShareForm";
import { DeleteShareDialog } from "@/components/file-sharing/DeleteShareDialog";
import { AppSecretModal } from "@/components/ui/app-secret-modal";
import { PageTitle } from "@/components/ui/header";

type FormMode = { type: "create"; isOpen: boolean } | { type: "edit"; name: string; share: Share; isOpen: boolean };

export const FileSharingPage = () => {
  const {
    backup,
    restore,
    backingUp,
    restoring,
    loading,
    shares,
    ensureShares,
    refreshShares,
    appSecret: { prompt, cancelPrompt, submitPrompt },
  } = useFileSharing();

  // Dialog state
  const [formMode, setFormMode] = useState<FormMode>({ type: "create", isOpen: false });
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);

  useEffect(() => {
    ensureShares();
  }, []);

  const openCreate = () => {
    setFormMode({ type: "create", isOpen: true });
  };

  const openEdit = (name: string, share: Share) => {
    setFormMode({ type: "edit", name, share, isOpen: true });
  };

  const shareCount = Object.keys(shares).length;
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      {/* Page header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <PageTitle pageTitle="File Sharing" subtitle="Manage SMB/CIFS network shares" />
        <div className="flex items-center gap-2 text-subtle">
          <Button variant="outline" size="sm" onClick={backup} disabled={backingUp} className="flex-1 sm:flex-none bg-transparent">
            {backingUp ? <Loading className="mr-2 size-3.5" /> : <Download className="mr-2 size-3.5" />}
            Backup
          </Button>
          <Button variant="outline" size="sm" onClick={restore} disabled={restoring} className="flex-1 sm:flex-none bg-transparent">
            {restoring ? <Loading className="mr-2 size-3.5" /> : <Upload className="mr-2 size-3.5" />}
            Restore
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="shares">
        <TabsList className="w-full md:w-auto">
          <TabsTrigger value="shares" className="gap-2 cursor-pointer w-1/2">
            <FolderOpen className="size-3.5" />
            Shares
          </TabsTrigger>
          <TabsTrigger value="config" className="gap-2 cursor-pointer w-1/2">
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
              <div className="flex gap-2">
                <Button size="sm" variant={"outline"} onClick={refreshShares}>
                  <RefreshCcw className="mr-1.5 size-3.5" />
                  Refresh
                </Button>
                <Button size="sm" onClick={openCreate}>
                  <Plus className="mr-1.5 size-3.5" />
                  Create Share
                </Button>
              </div>
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
      <ShareForm open={formMode.isOpen} mode={formMode} onClose={() => setFormMode((prev) => ({ ...prev, isOpen: false }))} />

      <DeleteShareDialog open={deleteTarget !== null} shareName={deleteTarget ?? ""} onClose={() => setDeleteTarget(null)} />

      <AppSecretModal open={prompt} onSubmit={submitPrompt} onCancel={cancelPrompt} />
    </motion.div>
  );
};
