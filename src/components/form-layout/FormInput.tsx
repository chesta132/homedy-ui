import { Input, type InputProps } from "../form/Input";
import { useFormLayout } from "./FormLayout";

type FormInputProps = { fieldId?: string } & InputProps;
export const FormInput = ({ fieldId, ...props }: FormInputProps) => {
  const {
    form: {
      form: [val],
      error: [err],
      validateField,
    },
  } = useFormLayout();

  return (
    <Input
      value={fieldId && String(val[fieldId])}
      onValueChange={fieldId ? (val) => validateField({ [fieldId]: val }) : undefined}
      error={fieldId && err[fieldId]}
      {...props}
    />
  );
};
