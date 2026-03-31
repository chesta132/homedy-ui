import { Input, type InputProps } from "../ui/Input";
import { PermissionInput, type PermissionInputProps } from "../ui/permission-input";
import { TagInput, type TagInputProps } from "../ui/tag-input";
import { useFormLayout } from "./FormLayout";

type FormInputProps = { fieldId?: string } & InputProps;
export const FormInput = ({ fieldId, ...props }: FormInputProps) => {
  const {
    form: {
      form: [val],
      error: [err],
      updateField,
    },
  } = useFormLayout();

  return (
    <Input
      value={fieldId && String(val[fieldId])}
      onValueChange={fieldId ? (val) => updateField(fieldId as any, val) : undefined}
      error={fieldId && err[fieldId]}
      {...props}
    />
  );
};

export type FormTagInputProps = { fieldId?: string } & Partial<TagInputProps>;
export const FormTagInput = ({ fieldId, ...props }: FormTagInputProps) => {
  const {
    form: {
      form: [val],
      error: [err],
      updateField,
    },
  } = useFormLayout();

  return (
    <TagInput
      value={fieldId ? (Array.isArray(val[fieldId]) ? val[fieldId] : []) : []}
      onChange={fieldId ? (val) => updateField(fieldId as any, val) : () => {}}
      error={fieldId && err[fieldId]}
      {...props}
    />
  );
};

export type FormUnixPermissionInput = { fieldId?: string } & Partial<PermissionInputProps>;
export const FormUnixPermissionInput = ({ fieldId, ...props }: FormUnixPermissionInput) => {
  const {
    form: {
      form: [val],
      error: [err],
      updateField,
    },
  } = useFormLayout();

  return (
    <PermissionInput
      value={fieldId ? (Array.isArray(val[fieldId]) ? val[fieldId] : []) : []}
      onChange={fieldId ? (val) => updateField(fieldId as any, val) : () => {}}
      error={fieldId && err[fieldId]}
      {...props}
    />
  );
};
