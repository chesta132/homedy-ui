import { Switch, type SwitchProps } from "../ui/switch";
import { FormFieldError } from "./FormError";
import { useFormLayout } from "./FormLayout";

export type FormToggleProps = SwitchProps & { fieldId?: string; boolTransform?: { true: any; false: any } };

export const FormToggle = ({ fieldId, boolTransform, ...props }: FormToggleProps) => {
  const {
    form: {
      form: [val],
      updateField,
    },
  } = useFormLayout();

  const bool = boolTransform || { true: true, false: false };

  return (
    <div>
      <Switch
        checked={!!fieldId && val[fieldId] === bool.true}
        onCheckedChange={fieldId ? (val) => updateField(fieldId as any, val ? bool.true : bool.false) : undefined}
        {...props}
      />
      <FormFieldError fieldId={fieldId} />
    </div>
  );
};
