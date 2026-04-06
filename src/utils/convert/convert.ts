import { toast, toastError } from "@/components/ui/toaster";
import { api } from "../server/apiClient";
import { objToFormData } from "../manipulate/object";
import type { ConvertPayload } from "@/models/convert";

export interface FileEntry {
  id: string;
  file: File;
  convertTo: string;
  loading: boolean;
}

function triggerDownload(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

/**
 * POST /api/convert/single — called once per file.
 * Returns the filename that was downloaded, or throws on error.
 */
export async function convertSingle(entry: FileEntry) {
  const res = await api.post("/convert/single", {
    data: { convertTo: entry.convertTo, file: entry.file },
    responseType: "blob",
    transformRequest: (data) => objToFormData(data),
  });
  const filename = res.getFilename() ?? "download";
  triggerDownload(res.data, filename);
  return filename;
}

/**
 * POST /api/convert/multiple — sends all files in one request, downloads a zip.
 * Returns the zip filename.
 */
export async function convertMultiple(entries: FileEntry[]) {
  const data = entries.reduce((acc, entry) => ({ files: [...acc.files, entry.file], convertTo: [...acc.convertTo, entry.convertTo] }), {
    files: [],
    convertTo: [],
  } as ConvertPayload.ConvertMultipleBody);

  const res = await api.post("/convert/multiple", {
    data,
    responseType: "blob",
    transformRequest: (data) => objToFormData(data),
  });
  const filename = res.getFilename() ?? "download";
  triggerDownload(res.data, filename);
  return filename;
}

/**
 * Run Single conversion — loops over entries, shows per-file toasts.
 * Calls setLoading(id, bool) callbacks for UI feedback.
 */
export async function runSingle(entries: FileEntry[], setLoading: (id: string, v: boolean) => void): Promise<void> {
  const valid = entries.filter((e) => e.convertTo);
  if (!valid.length) {
    toast.error("No valid conversions selected");
    return;
  }

  for (const entry of valid) {
    setLoading(entry.id, true);
    try {
      const filename = await convertSingle(entry);
      toast.success(`Converted: ${filename}`);
    } catch (err) {
      toastError(err, { fallback: `Failed to convert ${entry.file.name}` });
    } finally {
      setLoading(entry.id, false);
    }
  }
}

/**
 * Run Batch conversion — single zip download.
 */
export async function runBatch(entries: FileEntry[]): Promise<void> {
  const valid = entries.filter((e) => e.convertTo);
  if (!valid.length) {
    toast.error("No valid conversions selected");
    return;
  }

  const filename = await convertMultiple(valid);
  toast.success(`Downloaded: ${filename}`);
}
