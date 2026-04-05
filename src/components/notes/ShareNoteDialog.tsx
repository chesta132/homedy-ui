import { useState } from "react";
import { Download, Upload, Copy, Check } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useNoteAction } from "@/contexts/NoteActionContext";
import type { Note } from "@/models/note";
import { Loading } from "../ui/loading";
import { VITE_BASE_URL } from "@/config";

type ShareNoteDialogProps = {
  open: boolean;
  note: Note;
  onClose: () => void;
};

export const ShareNoteDialog = ({ note, onClose, open }: ShareNoteDialogProps) => {
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const { updateOne } = useNoteAction();

  const isPublic = note.visibility === "public";
  const toggleVisibility = (v: Note["visibility"]) => (v === "public" ? "private" : "public");
  const noteUrl = `${VITE_BASE_URL}/notes/${note.id}`;

  const toggleShare = async () => {
    try {
      setLoading(true);
      await updateOne(note.id, { content: note.content, title: note.title, visibility: toggleVisibility(note.visibility) }, { skipLoading: true });
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(noteUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Share Note</DialogTitle>
          <DialogDescription>
            {isPublic
              ? "This note will be made private. Others won't be able to access it anymore."
              : "This note will be shared publicly. Anyone with the link can view it."}
          </DialogDescription>
        </DialogHeader>

        {isPublic && (
          <div className="flex items-center gap-2 rounded-md border px-3 py-2 text-sm">
            <span className="flex-1 truncate text-muted-foreground">{noteUrl}</span>
            <Button size="icon" variant="ghost" className="size-7 shrink-0" onClick={handleCopy}>
              {copied ? <Check className="size-3.5 text-green-500" /> : <Copy className="size-3.5" />}
            </Button>
          </div>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button onClick={toggleShare} disabled={loading}>
            {loading ? (
              <>
                <Loading className="mr-2 size-4" />
                Making {toggleVisibility(note.visibility)}
              </>
            ) : (
              <>
                {isPublic ? <Download className="mr-2 h-4 w-4" /> : <Upload className="mr-2 h-4 w-4" />}
                Make {toggleVisibility(note.visibility)}
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
