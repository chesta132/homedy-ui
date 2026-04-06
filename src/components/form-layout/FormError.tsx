import { cn } from "@/lib/utils";
import { useFormLayout } from "./FormLayout";

export type FormFieldErrorProps = React.ComponentProps<"p"> & { fieldId?: string; ignoreError?: boolean };

export const FormFieldError = ({ fieldId, className, ignoreError, ...props }: FormFieldErrorProps) => {
  const {
    form: {
      error: [err],
    },
  } = useFormLayout();
  const fieldErr = err[fieldId as keyof typeof err];

  if (!fieldErr || ignoreError) return null;

  return (
    <p className={cn("text-xs text-red-400", className)} {...props}>
      {fieldErr}
    </p>
  );
};
