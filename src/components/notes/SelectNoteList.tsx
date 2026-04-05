import { useNote } from "@/contexts/NoteContext";
import { AnimatePresence, motion } from "motion/react";
import { Button } from "@/components/ui/button";
import { ArchiveRestore, Trash2, X } from "lucide-react";
import { Loading } from "@/components/ui/loading";
import { Checkbox } from "@/components/ui/checkbox";
import { useNoteAction } from "@/contexts/NoteActionContext";
import { Label } from "@/components/ui/label";
import { useSelectionStore } from "@/contexts/SelectionContext";
import { useMemo } from "react";

export const SelectNoteList = ({ trashMode }: { trashMode: boolean }) => {
  const { exist, loading, trash } = useNote();
  const { deleteMany, restoreMany } = useNoteAction();
  const { notes } = trashMode ? trash : exist;
  const noteIds = useMemo(() => notes.map((n) => n.id), [notes]);

  const { clear, toggleSelectAll, selected } = useSelectionStore();
  const someSelected = useSelectionStore((s) => s.selected.size > 0);
  const allSelected = useSelectionStore((s) => s.allSelected(noteIds));

  const handleAction = () => {
    if (trashMode) {
      restoreMany({ ids: [...selected] });
    } else {
      deleteMany(notes.filter((n) => selected.has(n.id)));
    }
    clear();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -6 }}
      className="flex items-center gap-3 rounded-lg border border-border bg-[#0f0f0f] px-3 py-2 min-h-12"
    >
      {/* Select all checkbox */}
      <Checkbox
        id="select-checkbox"
        checked={allSelected ? true : someSelected ? "indeterminate" : false}
        onCheckedChange={() => toggleSelectAll(noteIds)}
      />
      <Label htmlFor="select-checkbox" className="text-xs flex-1 cursor-pointer">
        {selected.size > 0 ? `${selected.size} of ${notes.length} selected` : `Select all (${notes.length})`}
      </Label>

      <AnimatePresence>
        {selected.size > 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center gap-2">
            <Button
              size="sm"
              variant={trashMode ? "outline" : "destructive"}
              onClick={handleAction}
              disabled={loading}
              className="h-7 bg-transparent text-xs"
            >
              {loading ? (
                <Loading className="mr-1.5 size-3" />
              ) : trashMode ? (
                <ArchiveRestore className="mr-1.5 size-3" />
              ) : (
                <Trash2 className="mr-1.5 size-3" />
              )}
              {trashMode ? "Restore" : "Delete"} {selected.size}
            </Button>

            <Button size="icon" variant="ghost" onClick={() => clear()} className="h-7 w-7">
              <X className="size-3.5" />
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
