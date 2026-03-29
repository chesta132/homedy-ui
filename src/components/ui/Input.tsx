import { Eye, EyeOff } from "lucide-react";
import { useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { kebab } from "@/utils/manipulate/string";

export type InputProps = {
  error?: string | null;
  label?: string;
  optional?: boolean;
  classLabel?: string;
  classInput?: string;
  start?: React.ReactNode;
  end?: React.ReactNode;
  onValueChange?: (value: string) => void;
  inputRef?: React.RefObject<HTMLInputElement | null>;
} & Omit<React.ComponentProps<"input">, "size">;

export const Input = ({
  type = "text",
  placeholder,
  error,
  label,
  value,
  className,
  optional,
  classLabel,
  classInput,
  start,
  end,
  onValueChange,
  inputRef: inputRefProps,
  ...inputProps
}: InputProps) => {
  const [internalValue, setInternalValue] = useState(value || "");
  const [inputType, setInputType] = useState(type);

  const inputRef = useRef<HTMLInputElement>(null);
  const ref = inputRefProps ?? inputRef;

  const hypenId = kebab(inputProps.id?.toLowerCase() || label?.toLowerCase() || placeholder?.toLowerCase() || "unknown");

  const handleChange = (val: string) => {
    setInternalValue(val);
    onValueChange?.(val);
  };

  return (
    <div className={cn("flex flex-col gap-1", className)}>
      {label && (
        <label
          htmlFor={hypenId}
          className={cn("text-sm text-subtle leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70", classLabel)}
        >
          {label}
          {optional && <span className="ml-1 text-xs text-muted-foreground">(optional)</span>}
        </label>
      )}

      <div className="relative flex items-center">
        {start && <div className="absolute left-3">{start}</div>}

        <input
          ref={ref}
          id={hypenId}
          type={inputType}
          value={internalValue}
          placeholder={placeholder}
          autoComplete="off"
          onInput={(e) => handleChange((e.target as HTMLInputElement).value)}
          className={cn(
            "flex h-9 w-full rounded-md border border-border-sub bg-elevated px-3 py-1 text-sm text-fg placeholder:text-dim transition-colors",
            "focus:outline-none focus:border-border-drag",
            "disabled:cursor-not-allowed disabled:opacity-50",
            start && "pl-9",
            (end || type === "password") && "pr-9",
            error && "border-red-500",
            classInput,
          )}
          {...inputProps}
        />

        {type === "password" && !end && (
          <button
            type="button"
            onMouseDown={(e) => {
              e.preventDefault();
              setInputType((prev) => (prev === "password" ? "text" : "password"));
            }}
            className="absolute right-3 text-dim hover:text-subtle transition-colors"
            aria-label={inputType === "password" ? "Show password" : "Hide password"}
          >
            {inputType === "password" ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        )}

        {end && <div className="absolute right-3">{end}</div>}
      </div>

      {error && <p className="text-xs text-red-400">{error}</p>}
    </div>
  );
};
