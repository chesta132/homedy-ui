import { useState, useRef, useCallback } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "motion/react";

interface ConvertSelectProps {
  options: string[];
  value: string;
  onChange: (v: string) => void;
  disabled?: boolean;
}

export function ConvertSelect({ options, value, onChange, disabled }: ConvertSelectProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const handleBlur = useCallback((e: React.FocusEvent) => {
    if (!ref.current?.contains(e.relatedTarget as Node)) setOpen(false);
  }, []);

  if (disabled || options.length === 0) {
    return (
      <div className="flex h-8 min-w-27.5 items-center gap-1.5 rounded-md border border-border bg-card px-2.5 opacity-40 cursor-not-allowed select-none">
        <span className="text-xs text-dim">convert to</span>
      </div>
    );
  }

  return (
    <div ref={ref} className="relative" onBlur={handleBlur} tabIndex={-1}>
      <button
        type="button"
        onClick={() => setOpen((p) => !p)}
        className={cn(
          "flex h-8 min-w-27.5 items-center justify-between gap-1.5 rounded-md border px-2.5 text-xs transition-colors focus:outline-none",
          "border-border-sub bg-elevated text-fg hover:border-border hover:bg-border",
        )}
      >
        <span className="font-mono">.{value}</span>
        <ChevronDown className={cn("h-3 w-3 text-dim transition-transform", open && "rotate-180")} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.1 }}
            className="absolute right-0 top-9 z-50 min-w-27.5 overflow-hidden rounded-md border border-border-sub bg-hover shadow-xl"
          >
            {options.map((opt) => (
              <button
                key={opt}
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => {
                  onChange(opt);
                  setOpen(false);
                }}
                className={cn(
                  "flex w-full items-center px-2.5 py-1.5 text-left text-xs transition-colors hover:bg-border",
                  opt === value ? "text-fg" : "text-subtle",
                )}
              >
                <span className="font-mono">.{opt}</span>
                {opt === value && <span className="ml-auto h-1.5 w-1.5 rounded-full bg-white" />}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
