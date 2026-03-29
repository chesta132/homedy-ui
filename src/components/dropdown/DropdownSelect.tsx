import { cn } from "@/lib/utils";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "../ui/select";
import { capital } from "@/utils/manipulate/string";
import { Select as SelectPrimitive } from "radix-ui";

type StringOrNode = string | React.ReactNode;

type FormSelectProps = {
  placeholder?: StringOrNode;
  values: ({ label: StringOrNode } & SelectPrimitive.SelectItemProps & React.RefAttributes<HTMLDivElement>)[] | string[];
  onValueChange?: (value: string) => void;
  selectProps?: SelectPrimitive.SelectProps & React.RefAttributes<HTMLSelectElement>;
  triggerProps?: SelectPrimitive.SelectTriggerProps & React.RefAttributes<HTMLButtonElement>;
  valueProps?: SelectPrimitive.SelectValueProps & React.RefAttributes<HTMLSpanElement>;
  contentProps?: SelectPrimitive.SelectContentProps & React.RefAttributes<HTMLDivElement>;
  itemProps?: SelectPrimitive.SelectItemProps & React.RefAttributes<HTMLDivElement>;
  error?: string;
  errorProps?: React.HTMLAttributes<HTMLParagraphElement>;
} & Omit<React.ComponentProps<"div">, "children">;

export const DropdownSelect = ({
  className,
  placeholder,
  values,
  selectProps,
  triggerProps,
  valueProps,
  contentProps,
  itemProps,
  error,
  errorProps,
  ...props
}: FormSelectProps) => {
  return (
    <div className={cn("relative", className)} {...props}>
      <Select {...selectProps}>
        <SelectTrigger {...triggerProps} className={cn("cursor-pointer w-full", triggerProps?.className)}>
          <SelectValue placeholder={placeholder} {...valueProps} />
        </SelectTrigger>
        <SelectContent {...contentProps}>
          {values.map((val, idx) => {
            const { label, value, className, ...rest } = typeof val === "string" ? { label: capital(val.toLowerCase()), value: val } : val;
            return (
              <SelectItem
                value={value}
                key={value ? value : `select-item-${idx}`}
                {...itemProps}
                {...rest}
                className={cn("cursor-pointer", itemProps?.className, className)}
              >
                {label}
              </SelectItem>
            );
          })}
        </SelectContent>
      </Select>
      {error && (
        <p {...errorProps} className={cn("absolute text-red-500 text-[12px] text-start", errorProps?.className)}>
          {error}
        </p>
      )}
    </div>
  );
};
