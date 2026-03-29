import { record } from "@/utils/manipulate/object";
import { useState } from "react";
import { type ZodObject, type infer as ZodInfer, type ZodError, z, ZodType } from "zod";

export type FormGroup<T extends ZodObject> = {
  readonly form: [ZodInfer<T>, React.Dispatch<React.SetStateAction<ZodInfer<T>>>];
  readonly error: [Record<keyof ZodInfer<T>, string>, React.Dispatch<React.SetStateAction<Record<keyof ZodInfer<T>, string>>>];
  readonly validateForm: () => boolean;
  /** @deprecated use `updateField` instead */
  readonly validateField: (field: Partial<ZodInfer<T>>) => boolean;
  readonly resetForm: () => void;
  readonly updateField: <T extends keyof ZodInfer<T>>(field: T, value: ZodInfer<T>[T]) => void;
};

export const useForm = <T extends ZodObject>(defaultVal: ZodInfer<T>, validator: T) => {
  type Inferred = ZodInfer<T>;
  const [form, setForm] = useState(defaultVal);
  const [error, setError] = useState(record(defaultVal, ""));

  const formatErrors = (zodError: ZodError) => {
    return Object.fromEntries(Object.entries<string[]>(z.flattenError(zodError).fieldErrors).map(([key, val]) => [key, val?.[0] ?? ""]));
  };

  const validateForm = () => {
    const parsed = validator.safeParse(form);
    if (!parsed.success) {
      setError((prev) => ({ ...prev, ...formatErrors(parsed.error) }));
    } else {
      setError(record(error, ""));
    }
    return parsed.success;
  };

  const validateField = (field: Partial<ZodInfer<T>>) => {
    const parsed = validator.safeParse(field);
    setForm((prev) => ({ ...prev, ...field }));

    if (!parsed.success) {
      setError((prev) => ({ ...prev, ...formatErrors(parsed.error) }));
    } else if (Object.keys(field).some((key) => error[key] !== "")) {
      setError((prev) => ({ ...prev, ...record(field, "") }));
    }
    return parsed.success;
  };

  const updateField = <T extends keyof Inferred>(field: T, value: Inferred[T]) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    const fieldValidator = (validator.shape as any)[field];
    if (fieldValidator instanceof ZodType) {
      const validator = z.object({ [field]: fieldValidator });
      const parsed = validator.safeParse({ [field]: value });
      if (!parsed.success) {
        setError((prev) => ({ ...prev, ...formatErrors(parsed.error) }));
      } else if (error[field] !== "") {
        setError((prev) => ({ ...prev, [field]: "" }));
      }
    }
  };

  const resetForm = () => {
    setForm(defaultVal);
    setError(record(defaultVal, ""));
  };

  return {
    form: [form, setForm],
    error: [error, setError],
    validateForm,
    validateField,
    resetForm,
    updateField,
  } as FormGroup<T>;
};
