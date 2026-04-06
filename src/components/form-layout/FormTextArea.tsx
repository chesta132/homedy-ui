import { useFormLayout } from "./FormLayout";
import { TextArea, type TextAreaProps } from "../ui/text-area";

type FormTextAreaProps = { fieldId?: string; ignoreError?: boolean } & TextAreaProps;

export const FormTextArea = ({ fieldId, ignoreError, ...props }: FormTextAreaProps) => {
  const {
    form: {
      form: [val],
      error: [err],
      updateField,
    },
  } = useFormLayout();

  return (
    <TextArea
      value={fieldId && String(val[fieldId])}
      onValueChange={fieldId ? (val) => updateField(fieldId as any, val) : undefined}
      error={!ignoreError && fieldId ? err[fieldId] : undefined}
      {...props}
    />
  );
};
