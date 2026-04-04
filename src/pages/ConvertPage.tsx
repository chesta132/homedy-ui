import { Layers, FileOutput, Loader2 } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { Button } from "@/components/ui/button";
import { FileRow, FileMobileCard } from "@/components/converter/FileRow";
import { UploadRow, UploadButton } from "@/components/converter/UploadRow";
import { ConvertValidator } from "@/models/validator/convert";
import { useConvert } from "@/contexts/ConvertContext";
import { PageTitle } from "@/components/ui/header";

export function ConvertPage() {
  const { addFiles, batchLoading, entries, handleBatch, handleSingle, removeEntry, setConvertTo } = useConvert();

  const anyLoading = batchLoading || entries.some((e) => e.loading);
  const hasEntries = entries.length > 0;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      {/* Header */}
      <PageTitle pageTitle="Converter" subtitle="Convert files between formats" />

      {/* Desktop layout */}
      <div className="hidden sm:block space-y-2">
        <AnimatePresence mode="popLayout">
          {entries.map((entry) => (
            <FileRow key={entry.id} entry={entry} onRemove={removeEntry} onConvertToChange={setConvertTo} />
          ))}
        </AnimatePresence>
        <UploadRow onFiles={addFiles} />
      </div>

      {/* Mobile layout */}
      <div className="flex sm:hidden flex-col gap-2">
        <AnimatePresence mode="popLayout">
          {entries.map((entry) => (
            <FileMobileCard key={entry.id} entry={entry} onRemove={removeEntry} onConvertToChange={setConvertTo} />
          ))}
        </AnimatePresence>
        <UploadButton onFiles={addFiles} />
      </div>

      {/* Action bar */}
      <div className="flex items-center justify-between gap-3">
        <Button variant="outline" className="gap-2" disabled={!hasEntries || anyLoading} onClick={handleBatch}>
          {batchLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Layers className="h-4 w-4" />}
          Batch
        </Button>

        <Button variant="default" className="gap-2" disabled={!hasEntries || anyLoading} onClick={handleSingle}>
          {entries.some((e) => e.loading) ? <Loader2 className="h-4 w-4 animate-spin" /> : <FileOutput className="h-4 w-4" />}
          Single
        </Button>
      </div>

      {/* Empty state */}
      {!hasEntries && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="rounded-lg border border-dashed border-border p-8 text-center">
          <p className="text-sm text-muted-strong">Supported: {ConvertValidator.ACCEPTED_EXTS.map((e) => `.${e}`).join(", ")}</p>
        </motion.div>
      )}
    </motion.div>
  );
}
