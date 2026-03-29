import { useFormLayout } from "./FormLayout";
import { TextArea, type TextAreaProps } from "../form/text-area";

type FormTextAreaProps = { fieldId?: string } & TextAreaProps;

export const FormTextArea = ({ fieldId, ...props }: FormTextAreaProps) => {
  const {
    form: {
      form: [val],
      error: [err],
      validateField,
    },
  } = useFormLayout();

  return (
    <TextArea
      value={fieldId && String(val[fieldId])}
      onValueChange={fieldId ? (val) => validateField({ [fieldId]: val }) : undefined}
      error={fieldId && err[fieldId]}
      {...props}
    />
  );
};
