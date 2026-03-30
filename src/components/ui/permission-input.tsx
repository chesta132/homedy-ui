import { useState } from "react";
import { Info } from "lucide-react";
import { cn } from "@/lib/utils";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface PermissionInputProps {
  value: number[];
  onChange: (perms: number[]) => void;
  error?: string;
}

const PERMISSION_LABELS = ["Owner", "Group", "Others"] as const;

const PERMISSION_BITS = [
  { value: 7, label: "7 — Read, Write, Execute", short: "rwx" },
  { value: 6, label: "6 — Read, Write", short: "rw-" },
  { value: 5, label: "5 — Read, Execute", short: "r-x" },
  { value: 4, label: "4 — Read only", short: "r--" },
  { value: 3, label: "3 — Write, Execute", short: "-wx" },
  { value: 2, label: "2 — Write only", short: "-w-" },
  { value: 1, label: "1 — Execute only", short: "--x" },
  { value: 0, label: "0 — No permissions", short: "---" },
];

/**
 * Three-digit permission input for Linux-style file permissions (Owner / Group / Others).
 * Each field accepts 0–7. Includes an info modal explaining what each digit means.
 */
export function PermissionInput({ value, onChange, error }: PermissionInputProps) {
  const [infoOpen, setInfoOpen] = useState(false);

  // Ensure we always have 3 values
  const perms = [value[0] ?? 7, value[1] ?? 7, value[2] ?? 5];

  const handleChange = (index: number, raw: string) => {
    const num = parseInt(raw, 10);
    if (raw === "") {
      const next = [...perms];
      next[index] = 0;
      onChange(next);
      return;
    }
    if (isNaN(num) || num < 0 || num > 7) return;
    const next = [...perms];
    next[index] = num;
    onChange(next);
  };

  return (
    <div className="w-full">
      <div className="flex items-center gap-1 mb-2">
        <span className="text-xs text-[#666666]">Octal notation (0–7 per field)</span>
        <button type="button" onClick={() => setInfoOpen(true)} className="text-dim hover:text-subtle transition-colors">
          <Info className="h-3.5 w-3.5" />
        </button>
      </div>

      <div className="flex items-center gap-3">
        {PERMISSION_LABELS.map((label, i) => (
          <div key={label} className="flex flex-col items-center gap-1.5 flex-1">
            <label className="text-xs text-[#666666]">{label}</label>
            <input
              type="number"
              min={0}
              max={7}
              value={perms[i]}
              onChange={(e) => handleChange(i, e.target.value)}
              className={cn(
                "w-full h-10 text-center rounded-md border border-border-sub bg-elevated",
                "text-sm font-mono text-fg focus:outline-none focus:border-border-drag transition-colors",
                error && "border-red-500/60",
              )}
            />
            <span className="text-2xs font-mono text-muted">{PERMISSION_BITS.find((b) => b.value === perms[i])?.short ?? "???"}</span>
          </div>
        ))}

        {/* Visual combined display */}
        <div className="flex flex-col items-center gap-1.5">
          <label className="text-xs text-muted">Combined</label>
          <div className="h-10 flex items-center px-3 rounded-md border border-border bg-surface">
            <span className="text-sm font-mono text-dim">{perms.join("")}</span>
          </div>
          <span className="text-2xs font-mono text-muted-strong">octal</span>
        </div>
      </div>

      {error && <p className="mt-1.5 text-xs text-red-400">{error}</p>}

      {/* Permission reference modal */}
      <Dialog open={infoOpen} onOpenChange={setInfoOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Linux File Permission Reference</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 text-sm">
            <p className="text-[#666666] text-xs leading-relaxed">
              Permissions are set separately for <span className="text-[#aaa]">Owner</span>, <span className="text-[#aaa]">Group</span>, and{" "}
              <span className="text-[#aaa]">Others</span>. Each digit is the sum of the bits that are enabled.
            </p>

            <div className="rounded-md border border-border-sub overflow-hidden">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-border-sub bg-surface">
                    <th className="px-3 py-2 text-left text-dim font-medium">Value</th>
                    <th className="px-3 py-2 text-left text-dim font-medium">Notation</th>
                    <th className="px-3 py-2 text-left text-dim font-medium">Permissions</th>
                  </tr>
                </thead>
                <tbody>
                  {PERMISSION_BITS.map((bit, i) => (
                    <tr key={bit.value} className={cn("border-b border-elevated", i === PERMISSION_BITS.length - 1 && "border-0")}>
                      <td className="px-3 py-2 font-mono text-fg font-semibold">{bit.value}</td>
                      <td className="px-3 py-2 font-mono text-subtle">{bit.short}</td>
                      <td className="px-3 py-2 text-[#666666]">{bit.label.replace(`${bit.value} — `, "")}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="rounded-md border border-border bg-surface p-3 space-y-1.5">
              <p className="text-dim text-xs font-medium">Common examples</p>
              {[
                { octal: "755", desc: "Owner: rwx  /  Group & Others: r-x" },
                { octal: "644", desc: "Owner: rw-  /  Group & Others: r--" },
                { octal: "700", desc: "Owner: rwx  /  Group & Others: none" },
                { octal: "777", desc: "Everyone: rwx (not recommended)" },
              ].map((ex) => (
                <div key={ex.octal} className="flex items-center gap-2">
                  <span className="font-mono text-fg w-8">{ex.octal}</span>
                  <span className="text-dim">—</span>
                  <span className="text-[#666666] text-xs">{ex.desc}</span>
                </div>
              ))}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
