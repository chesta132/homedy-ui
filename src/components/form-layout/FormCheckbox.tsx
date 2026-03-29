import { Checkbox, type CheckboxProps } from "../form/checkbox";
import { useFormLayout } from "./FormLayout";

type FormCheckboxProps = { fieldId?: string } & CheckboxProps;

export const FormCheckbox = ({ fieldId, ...props }: FormCheckboxProps) => {
  const {
    form: {
      form: [val],
      validateField,
    },
  } = useFormLayout();

  return <Checkbox checked={!!fieldId && !!val[fieldId]} onCheckedChange={fieldId ? ((val) => validateField({ [fieldId]: val })) : undefined} {...props} />;
};
