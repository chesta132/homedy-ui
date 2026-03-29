import { Input, type InputProps } from "../ui/Input";
import { useFormLayout } from "./FormLayout";

type FormInputProps = { fieldId?: string } & InputProps;
export const FormInput = ({ fieldId, ...props }: FormInputProps) => {
  const {
    form: {
      form: [val],
      error: [err],
      updateField,
    },
  } = useFormLayout();

  return (
    <Input
      value={fieldId && String(val[fieldId])}
      onValueChange={fieldId ? (val) => updateField(fieldId as any, val) : undefined}
      error={fieldId && err[fieldId]}
      {...props}
    />
  );
};
