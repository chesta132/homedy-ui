import { useEffect } from "react";
import { RichEditor, type RichEditorProps } from "../rich-editor/rich-editor";
import { FormFieldError } from "./FormError";
import { useFormLayout } from "./FormLayout";

export type FormRichEditorProps = RichEditorProps & { fieldId?: string; ignoreError?: boolean };
/** apply on update to editor */
export const FormRichEditor = ({ fieldId, ignoreError, ...props }: FormRichEditorProps) => {
  const {
    form: {
      form: [val],
    },
  } = useFormLayout();

  useEffect(() => {
    if (fieldId) {
      const { editor } = props;
      const current = editor?.getHTML();
      const next = String(val[fieldId]);

      if (current !== next) {
        editor?.commands.setContent(next, { emitUpdate: false });
      }
    }
  }, [fieldId, val[fieldId || ""]]);

  return (
    <div>
      <RichEditor {...props} />
      <FormFieldError fieldId={fieldId} ignoreError={ignoreError} />
    </div>
  );
};
