import { MoreHorizontal, Trash2, RotateCcw, Globe, Lock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { motion } from "motion/react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import type { Note } from "@/models/note";
import { Link } from "react-router";
import { memo, useRef, useState } from "react";
import { stripHtml } from "@/utils/manipulate/string";
import { useSelectionStore } from "@/contexts/SelectionContext";

interface NoteCardProps {
  note: Note;
  trashMode: boolean;
  onDelete: (note: Note) => void;
  onRestore: (note: Note) => void;
}

export const NoteCard = memo(({ note, trashMode, onDelete, onRestore }: NoteCardProps) => {
  const selected = useSelectionStore((s) => s.isSelected(note.id));
  const toggle = useSelectionStore((s) => s.toggle);
  const someSelected = useSelectionStore((s) => s.selected.size > 0);
  const isPrivate = note.visibility === "private";
  const holdRef = useRef(false);
  const inSelectMode = useRef(someSelected || selected);
  const inRightClick = useRef(false);
  const [dropdown, setDropdown] = useState(false);

  const handleTapStart = () => {
    inSelectMode.current = someSelected || selected;
    if (someSelected || selected) {
      toggle(note.id);
      return;
    }
    holdRef.current = true;
    setTimeout(() => {
      if (holdRef.current && !someSelected && !selected) {
        // setSelectMode(true);
        toggle(note.id);
      }
    }, 500);
  };
  const handleTapCancel = () => (holdRef.current = false);

  const handleRightClick = (e: React.MouseEvent<unknown, MouseEvent>) => {
    inRightClick.current = true;
    e.preventDefault();
    e.stopPropagation();
    if (!dropdown) setDropdown(true);
    inRightClick.current = false;
  };

  return (
    <motion.div
      whileTap={{ scale: 0.95 }}
      onTapStart={handleTapStart}
      onTap={handleTapCancel}
      onTapCancel={handleTapCancel}
      animate={{
        opacity: someSelected && !selected ? 0.5 : 1,
        scale: someSelected && !selected ? 0.97 : 1,
      }}
      className="h-full"
    >
      <Link
        to={`/notes/${note.id}`}
        className={cn(
          "group flex flex-col gap-2 rounded-lg border bg-[#0f0f0f] p-4 transition-colors cursor-pointer h-full",
          selected ? "border-border-hover bg-[#141414]" : "border-border hover:border-border-sub hover:bg-[#141414]",
        )}
        // hard code to prevent wait for re-render
        onClick={(e) => (inRightClick.current || inSelectMode.current || someSelected || selected || trashMode) && e.preventDefault()}
        aria-disabled={inRightClick.current || inSelectMode.current || someSelected || selected || trashMode}
        onContextMenu={handleRightClick}
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <div className="flex items-center gap-2 min-w-0 flex-1">
              <p className="text-sm font-medium text-fg truncate">{note.title}</p>
              <Badge variant="outline" className="shrink-0 gap-1 text-2xs">
                {isPrivate ? <Lock className="h-2.5 w-2.5" /> : <Globe className="h-2.5 w-2.5" />}
                {isPrivate ? "Private" : "Public"}
              </Badge>
            </div>
          </div>

          <DropdownMenu onOpenChange={setDropdown} open={dropdown}>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-6 w-6 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                <MoreHorizontal className="h-3.5 w-3.5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" onClick={(e) => e.stopPropagation()}>
              {trashMode ? (
                <DropdownMenuItem onClick={() => onRestore(note)} className="cursor-pointer gap-2">
                  <RotateCcw className="h-3.5 w-3.5" />
                  Restore
                </DropdownMenuItem>
              ) : (
                <DropdownMenuItem onClick={() => onDelete(note)} className="cursor-pointer gap-2 text-danger focus:text-danger">
                  <Trash2 className="h-3.5 w-3.5" />
                  Delete
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Content preview */}
        <p className="text-xs text-dim line-clamp-3 whitespace-pre-wrap">{stripHtml(note.content)}</p>

        {/* Footer */}
        <p className="text-2xs text-muted-strong mt-1">
          {new Date(note.updatedAt).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}
        </p>
      </Link>
    </motion.div>
  );
});
