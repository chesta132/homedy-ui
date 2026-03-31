import { useState, useRef, type KeyboardEvent } from "react";
import { X, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

export interface TagInputProps {
  value: string[];
  onChange: (tags: string[]) => void;
  placeholder?: string;
  className?: string;
  error?: string;
}

/**
 * Tag input component for multi-value fields like valid_users and admin_users.
 * Renders existing tags as dismissible chips, and an inline input to add new ones.
 * Press Enter or comma to confirm a tag.
 */
export function TagInput({ value, onChange, placeholder = "Add user...", className, error }: TagInputProps) {
  const [inputVal, setInputVal] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const addTag = (raw: string) => {
    const tag = raw.trim();
    if (!tag || value.includes(tag)) {
      setInputVal("");
      return;
    }
    onChange([...value, tag]);
    setInputVal("");
  };

  const removeTag = (tag: string) => {
    onChange(value.filter((t) => t !== tag));
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addTag(inputVal);
    } else if (e.key === "Backspace" && inputVal === "" && value.length > 0) {
      // Remove last tag on backspace when input is empty
      onChange(value.slice(0, -1));
    }
  };

  return (
    <div className={cn("w-full", className)}>
      <div
        className={cn(
          "flex min-h-9 w-full flex-wrap items-center gap-1.5 rounded-md border border-border-sub bg-elevated px-2 py-1.5 cursor-text",
          "focus-within:border-border-drag transition-colors",
          error && "border-red-500/60 focus-within:border-red-500/60",
        )}
        onClick={() => inputRef.current?.focus()}
      >
        {/* Existing tags */}
        {value.map((tag) => (
          <span key={tag} className="inline-flex items-center gap-1 rounded bg-[#252525] border border-muted-strong px-2 py-0.5 text-xs text-[#cccccc]">
            {tag}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                removeTag(tag);
              }}
              className="text-[#666666] hover:text-fg transition-colors ml-0.5"
            >
              <X className="h-3 w-3" />
            </button>
          </span>
        ))}

        {/* New tag input */}
        <div className="flex items-center gap-1 flex-1 min-w-20">
          <input
            ref={inputRef}
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            onKeyDown={handleKeyDown}
            onBlur={() => {
              if (inputVal.trim()) addTag(inputVal);
            }}
            placeholder={value.length === 0 ? placeholder : ""}
            className="flex-1 bg-transparent text-sm text-fg placeholder:text-dim outline-none min-w-15"
          />
          {inputVal.trim() && (
            <button type="button" onClick={() => addTag(inputVal)} className="text-dim hover:text-fg transition-colors shrink-0">
              <Plus className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      </div>
      {error && <p className="mt-1 text-xs text-red-400">{error}</p>}
      <p className="mt-1 text-xs text-muted">Press Enter or comma to add</p>
    </div>
  );
}
