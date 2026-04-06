import { Input, type InputProps } from "../ui/Input";
import { PermissionInput, type PermissionInputProps } from "../ui/permission-input";
import { TagInput, type TagInputProps } from "../ui/tag-input";
import { useFormLayout } from "./FormLayout";

type FormInputProps = { fieldId?: string; ignoreError?: boolean } & InputProps;
export const FormInput = ({ fieldId, ignoreError, ...props }: FormInputProps) => {
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
      error={!ignoreError && fieldId ? err[fieldId] : undefined}
      {...props}
    />
  );
};

export type FormTagInputProps = { fieldId?: string; ignoreError?: boolean } & Partial<TagInputProps>;
export const FormTagInput = ({ fieldId, ignoreError, ...props }: FormTagInputProps) => {
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
      error={!ignoreError && fieldId ? err[fieldId] : undefined}
      {...props}
    />
  );
};

export type FormUnixPermissionInput = { fieldId?: string; ignoreError?: boolean } & Partial<PermissionInputProps>;
export const FormUnixPermissionInput = ({ fieldId, ignoreError, ...props }: FormUnixPermissionInput) => {
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
      error={!ignoreError && fieldId ? err[fieldId] : undefined}
      {...props}
    />
  );
};
