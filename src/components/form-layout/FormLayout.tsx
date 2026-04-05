import { useError } from "@/contexts/ErrorContext";
import type { FormGroup } from "@/hooks/useForm";
import { cn } from "@/lib/utils";
import { createContext, useContext } from "react";
import { FormInput, FormTagInput, FormUnixPermissionInput } from "./FormInput";
import { FormButton, FormSubmit, FormCancel } from "./FormButtons";
import { FormCheckbox } from "./FormCheckbox";
import { FormSelect } from "./FormSelect";
import { FormTextArea } from "./FormTextArea";
import { FormSeparator } from "./FormSeparator";
import { FormDirection } from "./FormDirection";
import { FormSingleDatePicker } from "./FormDatepicker";
import { handleFormError } from "@/utils/server/handleError";
import type { z, ZodObject } from "zod";
import { FormFieldError } from "./FormError";
import { FormToggle } from "./FormToggle";
import { FormRichEditor } from "./FormRichEditor";

type FormValues<F extends ZodObject = any> = { form: FormGroup<F> };

const FormContext = createContext<FormValues>({
  form: {
    resetForm() {},
    error: [{} as any, () => {}],
    form: [{}, () => {}],
    validateForm: () => false,
    validateField: () => false,
    updateField() {},
  },
});

type FormLayoutProps<F extends ZodObject, C extends boolean> = {
  asChild?: C;
  onFormSubmit?: C extends true ? never : (event: React.SubmitEvent<HTMLFormElement>, formValue: z.infer<F>) => any;
} & (C extends true ? React.ComponentProps<"div"> : React.ComponentProps<"form">) &
  FormValues<F>;

export const FormLayout = <F extends ZodObject, C extends boolean = false>({
  form,
  asChild = false as C,
  onFormSubmit,
  className,
  children,
  ...rest
}: FormLayoutProps<F, C>) => {
  const {
    form: [formVal],
    error: [_, setFormError],
    validateForm,
  } = form;

  const { setError } = useError();

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (!validateForm()) return;
    try {
      await onFormSubmit?.(e, formVal);
    } catch (err) {
      handleFormError(err, setFormError, setError);
    }
  };

  const Wrapper: React.ElementType = asChild ? "div" : "form";

  return (
    <FormContext value={{ form } as any}>
      <Wrapper className={cn("flex flex-col gap-2", className)} onSubmit={handleSubmit} {...(rest as any)}>
        {children}
      </Wrapper>
    </FormContext>
  );
};

FormLayout.input = FormInput;
FormLayout.button = FormButton;
FormLayout.checkbox = FormCheckbox;
FormLayout.select = FormSelect;
FormLayout.textarea = FormTextArea;
FormLayout.separator = FormSeparator;
FormLayout.submit = FormSubmit;
FormLayout.cancel = FormCancel;
FormLayout.direction = FormDirection;
FormLayout.singleDatePicker = FormSingleDatePicker;
FormLayout.fieldError = FormFieldError;
FormLayout.toggle = FormToggle;
FormLayout.tagInput = FormTagInput;
FormLayout.richEditor = FormRichEditor;
FormLayout.unixPermissionInput = FormUnixPermissionInput;

export const useFormLayout = () => {
  const context = useContext(FormContext);
  if (context === undefined) throw new Error(`useFormLayout must be used within a FormLayout`);
  return context;
};
