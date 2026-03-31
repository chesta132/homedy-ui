import { FileIcon, X, Loader2 } from "lucide-react";
import { motion } from "motion/react";
import { ConvertSelect } from "./ConvertSelect";
import type { FileEntry } from "@/utils/convert/convert";
import { ConvertValidator } from "@/models/validator/convert";

interface FileRowProps {
  entry: FileEntry;
  onRemove: (id: string) => void;
  onConvertToChange: (id: string, val: string) => void;
}

/** Desktop row: [icon | filename] ←justify-between→ [loader | select | x] */
export function FileRow({ entry, onRemove, onConvertToChange }: FileRowProps) {
  const targets = ConvertValidator.getTargets(entry.file.name);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -12 }}
      transition={{ duration: 0.15 }}
      className="flex items-center justify-between gap-3 rounded-lg border border-border bg-card px-4 py-3"
    >
      <div className="flex min-w-0 items-center gap-3">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-border-sub bg-elevated">
          <FileIcon className="h-3.5 w-3.5 text-dim" />
        </div>
        <span className="truncate text-sm text-fg">{entry.file.name}</span>
      </div>

      <div className="flex shrink-0 items-center gap-2">
        {entry.loading && <Loader2 className="h-3.5 w-3.5 animate-spin text-dim" />}
        <ConvertSelect options={targets} value={entry.convertTo} onChange={(v) => onConvertToChange(entry.id, v)} disabled={entry.loading} />
        <button
          onClick={() => onRemove(entry.id)}
          disabled={entry.loading}
          className="flex h-6 w-6 items-center justify-center rounded text-muted transition-colors hover:bg-border hover:text-subtle disabled:opacity-40"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      </div>
    </motion.div>
  );
}

/** Mobile card: filename+x on top row, convert-to on second row */
export function FileMobileCard({ entry, onRemove, onConvertToChange }: FileRowProps) {
  const targets = ConvertValidator.getTargets(entry.file.name);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -12 }}
      transition={{ duration: 0.15 }}
      className="rounded-lg border border-border bg-card px-3 py-3"
    >
      <div className="flex items-center gap-2">
        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md border border-border-sub bg-elevated">
          <FileIcon className="h-3 w-3 text-dim" />
        </div>
        <span className="flex-1 truncate text-sm text-fg">{entry.file.name}</span>
        {entry.loading && <Loader2 className="h-3.5 w-3.5 animate-spin text-dim" />}
        <button
          onClick={() => onRemove(entry.id)}
          disabled={entry.loading}
          className="flex h-6 w-6 items-center justify-center rounded text-muted transition-colors hover:bg-border hover:text-subtle disabled:opacity-40"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      </div>
      <div className="mt-2 flex items-center gap-2 pl-9">
        <span className="text-xs text-dim">convert to</span>
        <ConvertSelect options={targets} value={entry.convertTo} onChange={(v) => onConvertToChange(entry.id, v)} disabled={entry.loading} />
      </div>
    </motion.div>
  );
}
