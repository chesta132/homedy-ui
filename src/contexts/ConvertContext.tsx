import { toastError } from "@/components/ui/toaster";
import { ConvertValidator } from "@/models/validator/convert";
import { runBatch, runSingle, type FileEntry } from "@/utils/convert/convert";
import { createContext, useCallback, useContext, useState, type ReactNode } from "react";

type ConvertContextValue = {
  entries: FileEntry[];
  setEntries: React.Dispatch<React.SetStateAction<FileEntry[]>>;
  batchLoading: boolean;
  addFiles: (files: File[]) => void;
  removeEntry: (id: string) => void;
  setConvertTo: (id: string, val: string) => void;
  handleBatch: () => Promise<void>;
  handleSingle: () => Promise<void>;
};

const ConvertContext = createContext<ConvertContextValue | null>(null);

export const ConvertProvider = ({ children }: { children: ReactNode }) => {
  const [entries, setEntries] = useState<FileEntry[]>([]);
  const [batchLoading, setBatchLoading] = useState(false);

  const addFiles = useCallback((files: File[]) => {
    setEntries((prev) => [
      ...prev,
      ...files.map(
        (f): FileEntry => ({
          id: `${Date.now()}-${Math.random()}`,
          file: f,
          convertTo: ConvertValidator.getTargets(f.name)[0] ?? "",
          loading: false,
        }),
      ),
    ]);
  }, []);

  const removeEntry = useCallback((id: string) => {
    setEntries((prev) => prev.filter((e) => e.id !== id));
  }, []);

  const setConvertTo = useCallback((id: string, val: string) => {
    setEntries((prev) => prev.map((e) => (e.id === id ? { ...e, convertTo: val } : e)));
  }, []);

  const setEntryLoading = useCallback((id: string, loading: boolean) => {
    setEntries((prev) => prev.map((e) => (e.id === id ? { ...e, loading } : e)));
  }, []);

  const handleSingle = useCallback(async () => {
    // error handled inside
    await runSingle(entries, setEntryLoading);
  }, [entries, setEntryLoading]);

  const handleBatch = useCallback(async () => {
    setBatchLoading(true);
    try {
      await runBatch(entries);
    } catch (err) {
      toastError(err, { fallback: `Failed to convert ${entries.length} file(s)` });
    } finally {
      setBatchLoading(false);
    }
  }, [entries]);

  return (
    <ConvertContext value={{ entries, setEntries, addFiles, batchLoading, handleBatch, handleSingle, removeEntry, setConvertTo }}>
      {children}
    </ConvertContext>
  );
};

export const useConvert = () => {
  const ctx = useContext(ConvertContext);
  if (!ctx) throw new Error("useConvert must be used within ConvertProvider");
  return ctx;
};
