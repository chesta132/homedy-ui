import { useState, useEffect } from "react";
import { Plus, Loader2, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AppSecretModal } from "@/components/ui/app-secret-modal";
import { toast } from "@/components/ui/toaster";
import type { ShareMap } from "@/models/samba";
import { motion, AnimatePresence } from "motion/react";
import { useAppSecret } from "@/hooks/useAppSecret";
import { api } from "@/utils/server/apiClient";
import { ServerError } from "@/utils/server/serverResponse";
import { capital } from "@/utils/manipulate/string";

type ConfigRow = { key: string; value: string };

// not using context because config should be uncontrolled state
export function SambaConfigEditor() {
  const [rows, setRows] = useState<ConfigRow[]>([]);
  const [original, setOriginal] = useState<ConfigRow[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const { prompt, getSecret, submitPrompt, cancelPrompt } = useAppSecret();

  const toConfigRows = (data: Record<string, string>) => Object.entries(data).map(([key, value]) => ({ key, value }));

  const fetchConfig = async () => {
    setLoading(true);
    try {
      const secret = await getSecret();
      if (!secret) return;

      const res = await api.get("/samba/config", {
        header: { "X-APP-SECRET": secret },
      });
      const parsed = toConfigRows(res.data);
      setRows(parsed);
      setOriginal(parsed);
      setLoaded(true);
    } catch (err) {
      toast.error(err instanceof ServerError ? capital(err.getMessage()) : "Failed to load global config");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConfig();
  }, []);

  const addRow = () => setRows((p) => [...p, { key: "", value: "" }]);
  const removeRow = (i: number) => setRows((p) => p.filter((_, idx) => idx !== i));
  const updateRow = (i: number, field: "key" | "value", val: string) => setRows((p) => p.map((r, idx) => (idx === i ? { ...r, [field]: val } : r)));
  const keyHasDuplicates = (rows: ConfigRow[]) => {
    const uniqueKeys = new Set(rows.map((item) => item.key));
    return uniqueKeys.size !== rows.length;
  };

  const handleCancel = () => setRows(original);

  const handleSave = async () => {
    if (rows.some((r) => r.key.trim() === "")) {
      toast.error("All keys must be non-empty. Remove blank rows first.");
      return;
    }
    if (keyHasDuplicates(rows)) {
      toast.error("All keys must be unique.");
      return;
    }
    const data: ShareMap = {};
    for (const { key, value } of rows) data[key.trim()] = value.trim();

    setSaving(true);
    try {
      const secret = await getSecret();
      if (!secret) return;

      const config = await api.put("/samba/config", { data, header: { "X-APP-SECRET": secret } });
      setRows(toConfigRows(config.data));
      setOriginal(toConfigRows(config.data));
      toast.success("Global config saved");
    } catch (err) {
      toast.error(err instanceof ServerError ? capital(err.getMessage()) : "Failed to save config");
    } finally {
      setSaving(false);
    }
  };

  const isDirty = JSON.stringify(rows) !== JSON.stringify(original);

  const inputCls =
    "h-8 rounded-md border border-border-sub bg-surface px-2.5 font-mono text-xs text-fg placeholder:text-muted-strong focus:outline-none focus:border-border-drag transition-colors w-full";

  return (
    <>
      <Card>
        <CardHeader className="flex-row items-center justify-between pb-3">
          <div>
            <CardTitle>Global Configuration</CardTitle>
            <CardDescription className="mt-0.5">Edit [global] section key-value pairs</CardDescription>
          </div>
        </CardHeader>

        <CardContent className="space-y-2 pb-4">
          {loading ? (
            <div className="flex items-center justify-center py-10">
              <Loader2 className="h-5 w-5 animate-spin text-muted" />
            </div>
          ) : !loaded ? (
            <div className="flex flex-col items-center gap-3 py-8">
              <p className="text-sm text-muted">Config requires app secret to load.</p>
              <Button size="sm" variant="outline" className="text-subtle" onClick={fetchConfig}>
                Load Config
              </Button>
            </div>
          ) : (
            <>
              {/* ── Rows ───────────────────────────────────────────────────── */}
              <AnimatePresence initial={false}>
                {rows.length === 0 && <p className="py-4 text-center text-sm text-muted">No options configured. Add one below.</p>}

                {rows.map((row, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.13 }}
                  >
                    {/* ── Desktop: single inline row ── */}
                    <div className="hidden sm:flex items-center gap-2">
                      <input value={row.key} onChange={(e) => updateRow(i, "key", e.target.value)} placeholder="option" className={inputCls} />
                      <span className="text-muted-strong font-mono text-xs select-none shrink-0">=</span>
                      <input value={row.value} onChange={(e) => updateRow(i, "value", e.target.value)} placeholder="value" className={inputCls} />
                      <button
                        type="button"
                        onClick={() => removeRow(i)}
                        className="h-8 w-8 shrink-0 flex items-center justify-center rounded-md text-muted hover:text-red-400 hover:bg-red-950/30 transition-colors"
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    </div>

                    {/* ── Mobile: stacked card ── */}
                    <div className="sm:hidden rounded-lg border border-border bg-surface p-3 space-y-2">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-2xs uppercase tracking-wider text-muted">Key</span>
                        <button
                          type="button"
                          onClick={() => removeRow(i)}
                          className="h-6 w-6 flex items-center justify-center rounded text-muted hover:text-red-400 hover:bg-red-950/30 transition-colors"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                      <input value={row.key} onChange={(e) => updateRow(i, "key", e.target.value)} placeholder="option name" className={inputCls} />
                      <span className="block text-2xs uppercase tracking-wider text-muted">Value</span>
                      <input value={row.value} onChange={(e) => updateRow(i, "value", e.target.value)} placeholder="value" className={inputCls} />
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              {/* ── Add row ─────────────────────────────────────────────── */}
              <div className="pt-1">
                <Button type="button" variant="outline" size="sm" onClick={addRow} className="w-full border-dashed text-muted hover:text-subtle">
                  <Plus className="mr-1.5 h-3.5 w-3.5" />
                  Add
                </Button>
              </div>

              {/* ── Cancel / Save ────────────────────────────────────────── */}
              <div className="flex items-center justify-between gap-2 pt-3 border-t border-border mt-2">
                <Button type="button" variant="outline" size="sm" onClick={handleCancel} disabled={!isDirty || saving} className="gap-1.5">
                  <X className="h-3.5 w-3.5" />
                  Cancel
                </Button>
                <Button type="button" size="sm" onClick={handleSave} disabled={!isDirty || saving} className="gap-1.5">
                  {saving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Check className="h-3.5 w-3.5" />}
                  Save
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      <AppSecretModal open={prompt} onSubmit={submitPrompt} onCancel={cancelPrompt} />
    </>
  );
}
