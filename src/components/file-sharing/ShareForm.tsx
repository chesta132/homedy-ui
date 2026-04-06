import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import type { Share } from "@/models/samba";
import { toast, toastError } from "@/components/ui/toaster";
import { api } from "@/utils/server/apiClient";
import { useForm } from "@/hooks/useForm";
import { SambaValidator } from "@/models/validator/samba";
import { FormLayout } from "../form-layout/FormLayout";
import { useFileSharing } from "@/contexts/FileSharingContext";

type Mode = { type: "create" } | { type: "edit"; name: string; share: Share };

interface ShareFormProps {
  open: boolean;
  mode: Mode;
  onClose: () => void;
}

/**
 * Modal form for creating or editing a Samba share.
 * Fields exactly match the backend Share model.
 */
export function ShareForm({ open, mode, onClose }: ShareFormProps) {
  const isEdit = mode.type === "edit";
  const { setShares } = useFileSharing();
  const [loading, setLoading] = useState(false);

  const editFormGroup = useForm(
    { adminUsers: [], browsable: "yes", name: "", path: "/", permissions: [7, 7, 5], readOnly: "no", validUsers: [] },
    SambaValidator.BODY.updateShare,
  );
  const {
    form: [editForm, setEditForm],
    validateForm: validateCreateForm,
  } = editFormGroup;

  const createFormGroup = useForm(
    { adminUsers: [], browsable: "yes", name: "", path: "", permissions: [7, 7, 5], readOnly: "no", validUsers: [] },
    SambaValidator.BODY.createShare,
  );
  const {
    form: [createForm],
    validateForm: validateEditFOrm,
  } = editFormGroup;

  // Populate form when editing
  useEffect(() => {
    if (mode.type === "edit") {
      const { name, share } = mode;
      setEditForm({
        name,
        path: share.path,
        readOnly: share.readOnly,
        browsable: share.browsable,
        validUsers: share.validUsers,
        adminUsers: share.adminUsers,
        permissions: share.permissions,
      });
    }
  }, [open, mode]);

  const handleSubmit = async () => {
    if (isEdit ? !validateEditFOrm() : !validateCreateForm()) return;
    setLoading(true);
    try {
      if (isEdit) {
        const shares = await api.put("/samba/{name}", { data: editForm, param: { name: mode.name } });
        setShares(shares.data);
        toast.success("Share updated successfully");
      } else {
        const shares = await api.post("/samba", { data: createForm });
        setShares(shares.data);
        toast.success("Share created successfully");
      }
      onClose();
    } catch (err) {
      toastError(err, { fallback: isEdit ? "Update failed" : "Failed to create share", unmatchSilent: true });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{isEdit ? `Edit Share: ${mode.name}` : "Create New Share"}</DialogTitle>
          <DialogDescription>{isEdit ? "Update share configuration" : "Configure a new SMB/CIFS network share"}</DialogDescription>
        </DialogHeader>

        <FormLayout form={isEdit ? editFormGroup : createFormGroup} className="space-y-5 py-2">
          {/* Share name — readonly when editing */}
          <div className="space-y-1.5">
            {/* <Label>Share Name</Label> */}
            <FormLayout.input fieldId="name" placeholder="my-share" label="Share Name" />
          </div>

          {/* Path */}
          <FormLayout.input fieldId="path" placeholder="/srv/my-share" label="Path" />

          {/* <Separator /> */}
          <FormLayout.separator />

          {/* Toggles */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <Label>Read Only</Label>
                <p className="text-xs text-muted mt-0.5">Prevent writes to this share</p>
              </div>
              <FormLayout.toggle fieldId="readOnly" boolTransform={{ true: "yes", false: "no" }} />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label>Browsable</Label>
                <p className="text-xs text-muted mt-0.5">Show in network browse list</p>
              </div>
              <FormLayout.toggle fieldId="browsable" boolTransform={{ true: "yes", false: "no" }} />
            </div>
          </div>

          <Separator />

          {/* Valid Users */}
          <div className="space-y-1.5">
            <Label>Valid Users</Label>
            <FormLayout.tagInput fieldId="validUsers" placeholder="Add user..." />
          </div>

          {/* Admin Users */}
          <div className="space-y-1.5">
            <Label>Admin Users</Label>
            <FormLayout.tagInput fieldId="adminUsers" placeholder="Add admin user..." />
          </div>

          <Separator />

          {/* Permissions */}
          <div className="space-y-1.5">
            <Label>Permissions</Label>
            <FormLayout.unixPermissionInput fieldId="permissions" />
          </div>
        </FormLayout>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {isEdit ? "Saving..." : "Creating..."}
              </>
            ) : isEdit ? (
              "Save Changes"
            ) : (
              "Create Share"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
