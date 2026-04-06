import { DropdownSelect, type SelectProps } from "../ui/dropdown-select";
import { useFormLayout } from "./FormLayout";

type FormSelectProps = SelectProps & { fieldId?: string; ignoreError?: boolean };

export const FormSelect = ({ fieldId, selectProps, ignoreError, ...props }: FormSelectProps) => {
  const {
    form: {
      form: [val],
      error: [err],
      updateField,
    },
  } = useFormLayout();

  const handleValueChange = fieldId ? (val: string) => updateField(fieldId as any, val) : undefined;

  return (
    <DropdownSelect
      selectProps={{ value: fieldId && String(val[fieldId]), onValueChange: handleValueChange, ...selectProps }}
      error={!ignoreError && fieldId ? err[fieldId] : undefined}
      {...props}
    />
  );
};
