import { RichEditor, type RichEditorProps } from "../rich-editor/rich-editor";
import { FormFieldError } from "./FormError";

export type FormRichEditorProps = RichEditorProps & { fieldId?: string };
/** apply form to editor */
export const FormRichEditor = ({ fieldId, ...props }: FormRichEditorProps) => {
  return (
    <div>
      <RichEditor {...props} />
      <FormFieldError fieldId={fieldId} />
    </div>
  );
};
