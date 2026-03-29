import { useFormLayout } from "./FormLayout";
import { TextArea, type TextAreaProps } from "../ui/text-area";

type FormTextAreaProps = { fieldId?: string } & TextAreaProps;

export const FormTextArea = ({ fieldId, ...props }: FormTextAreaProps) => {
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
      error={fieldId && err[fieldId]}
      {...props}
    />
  );
};
