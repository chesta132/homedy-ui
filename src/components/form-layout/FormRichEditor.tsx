import { useEffect } from "react";
import { RichEditor, type RichEditorProps } from "../rich-editor/rich-editor";
import { FormFieldError } from "./FormError";
import { useFormLayout } from "./FormLayout";

export type FormRichEditorProps = RichEditorProps & { fieldId?: string };
/** apply on update to editor */
export const FormRichEditor = ({ fieldId, ...props }: FormRichEditorProps) => {
  const {
    form: {
      form: [val],
    },
  } = useFormLayout();

  useEffect(() => {
    if (fieldId) {
      const { editor } = props;
      editor?.commands.setContent(String(val[fieldId]));
    }
  }, [fieldId, val[fieldId || ""]]);

  return (
    <div>
      <RichEditor {...props} />
      <FormFieldError fieldId={fieldId} />
    </div>
  );
};
