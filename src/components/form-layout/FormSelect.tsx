import { DropdownSelect } from "../dropdown/DropdownSelect";
import { useFormLayout } from "./FormLayout";
import type { Select as SelectPrimitive } from "radix-ui";

type StringOrNode = string | React.ReactNode;

type FormSelectProps = {
  fieldId?: string;
  placeholder?: StringOrNode;
  values: ({ label: StringOrNode } & SelectPrimitive.SelectItemProps & React.RefAttributes<HTMLDivElement>)[] | string[];
  onValueChange?: (value: string) => void;
  selectProps?: SelectPrimitive.SelectProps & React.RefAttributes<HTMLSelectElement>;
  triggerProps?: SelectPrimitive.SelectTriggerProps & React.RefAttributes<HTMLButtonElement>;
  valueProps?: SelectPrimitive.SelectValueProps & React.RefAttributes<HTMLSpanElement>;
  separatorProps?: SelectPrimitive.SelectSeparatorProps & React.RefAttributes<HTMLDivElement>;
  contentProps?: SelectPrimitive.SelectContentProps & React.RefAttributes<HTMLDivElement>;
  itemProps?: SelectPrimitive.SelectItemProps & React.RefAttributes<HTMLDivElement>;
} & Omit<React.ComponentProps<"div">, "children">;

export const FormSelect = ({ fieldId, selectProps, ...props }: FormSelectProps) => {
  const {
    form: {
      form: [val],
      error: [err],
      validateField,
    },
  } = useFormLayout();

  const handleValueChange = fieldId ? ((val: string) => validateField({ [fieldId]: val })) : undefined;

  return (
    <DropdownSelect
      selectProps={{ value: fieldId && String(val[fieldId]), onValueChange: handleValueChange, ...selectProps }}
      error={fieldId ? err[fieldId] : undefined}
      {...props}
    />
  );
};
