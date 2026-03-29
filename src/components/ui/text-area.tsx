import { useAutosizeTextArea } from "@/hooks/useAutosizeTextArea";
import { useState } from "react";
import { kebab } from "@/utils/manipulate/string";
import { cn } from "@/lib/utils";

export type TextAreaProps = {
  error?: string | null;
  label?: string;
  optional?: boolean;
  classLabel?: string;
  value?: string;
  onValueChange?: (value: string) => void;
  start?: React.ReactNode;
  end?: React.ReactNode;
} & Omit<React.ComponentProps<"textarea">, "value">;

export const TextArea = ({
  placeholder,
  error,
  label,
  value = "",
  className,
  optional,
  classLabel,
  start,
  end,
  onValueChange,
  ...textAreaProps
}: TextAreaProps) => {
  const [internalValue, setInternalValue] = useState(value);
  const { textAreaRef } = useAutosizeTextArea(internalValue);

  const handleChange = (val: string) => {
    setInternalValue(val);
    onValueChange?.(val);
  };

  const hypenId = kebab(textAreaProps.id?.toLowerCase() || label?.toLowerCase() || placeholder?.toLowerCase() || "unknown");

  return (
    <div className={cn("flex flex-col gap-1", className)}>
      {label && (
        <label
          htmlFor={hypenId}
          className={cn("text-sm text-subtle leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70", classLabel)}
        >
          {label}
          {optional && <span className="ml-1 text-xs text-dim">(optional)</span>}
        </label>
      )}

      <div className="relative flex items-start">
        {start && <div className="absolute left-3 top-3">{start}</div>}

        <textarea
          ref={textAreaRef}
          id={hypenId}
          value={internalValue}
          placeholder={placeholder}
          autoComplete="off"
          onInput={(e) => handleChange((e.target as HTMLTextAreaElement).value)}
          className={cn(
            "w-full px-4 py-3 border border-border-sub bg-elevated text-fg",
            "focus:outline-none focus:border-border-drag transition-colors rounded-md overflow-y-auto scroll-bar",
            "disabled:cursor-not-allowed disabled:opacity-50",
            start && "pl-9",
            end && "pr-9",
            error && "border-red-500",
          )}
          {...textAreaProps}
        />

        {end && <div className="absolute right-3 top-3">{end}</div>}
      </div>

      {error && <p className="text-red-500 text-xs">{error}</p>}
    </div>
  );
};
