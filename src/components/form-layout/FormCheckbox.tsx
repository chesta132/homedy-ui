import { Checkbox, type CheckboxProps } from "../ui/checkbox";
import { useFormLayout } from "./FormLayout";

type FormCheckboxProps = { fieldId?: string } & CheckboxProps;

export const FormCheckbox = ({ fieldId, ...props }: FormCheckboxProps) => {
  const {
    form: {
      form: [val],
      updateField,
    },
  } = useFormLayout();

  return <Checkbox checked={!!fieldId && !!val[fieldId]} onCheckedChange={fieldId ? (val) => updateField(fieldId as any, val) : undefined} {...props} />;
};
