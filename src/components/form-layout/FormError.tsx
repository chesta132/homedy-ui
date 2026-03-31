import { cn } from "@/lib/utils";
import { useFormLayout } from "./FormLayout";

export type FormFieldErrorProps = React.ComponentProps<"p"> & { fieldId?: string };

export const FormFieldError = ({ fieldId, className, ...props }: FormFieldErrorProps) => {
  const {
    form: {
      error: [err],
    },
  } = useFormLayout();
  const fieldErr = err[fieldId as keyof typeof err];

  if (!fieldErr) return null;

  return (
    <p className={cn("text-xs text-red-400", className)} {...props}>
      {fieldErr}
    </p>
  );
};
