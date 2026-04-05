import { useState } from "react";
import { Loader2, Trash2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useNoteAction } from "@/contexts/NoteActionContext";
import type { Note } from "@/models/note";

interface DeleteNoteDialogProps {
  open: boolean;
  note: Note | null;
  onClose: () => void;
}

export function DeleteNoteDialog({ open, note, onClose }: DeleteNoteDialogProps) {
  const [loading, setLoading] = useState(false);
  const { deleteOne } = useNoteAction();

  const handleDelete = async () => {
    if (!note) return;
    setLoading(true);
    try {
      await deleteOne(note);
      onClose();
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Move to Trash</DialogTitle>
          <DialogDescription>This note will be moved to trash. You can restore it later.</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button onClick={handleDelete} disabled={loading} className="bg-red-950/80 text-red-400 hover:bg-red-900/80 border border-red-900/50">
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Deleting...
              </>
            ) : (
              <>
                <Trash2 className="mr-2 h-4 w-4" />
                Move to Trash
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
