import { record } from "@/utils/manipulate/object";
import { useState } from "react";
import { type ZodObject, type infer as ZodInfer, type ZodError, z } from "zod";

export const useForm = <T extends ZodObject>(schema: T, defaultVal?: Partial<ZodInfer<T>>) => {
  const [form, setForm] = useState({ ...schema.shape, ...defaultVal });
  const [error, setError] = useState(record(schema.shape, ""));

  const formatErrors = (zodError: ZodError) => {
    return Object.fromEntries(Object.entries<string[]>(z.flattenError(zodError).fieldErrors).map(([key, val]) => [key, val?.[0] ?? ""]));
  };

  const validateForm = () => {
    const parsed = schema.safeParse(form);
    if (!parsed.success) {
      setError((prev) => ({ ...prev, ...formatErrors(parsed.error) }));
    } else {
      setError(record(error, ""));
    }
    return parsed.success;
  };

  const validateField = (field: Partial<T>) => {
    const parsed = schema.safeParse(field);
    setForm((prev) => ({ ...prev, ...field }));

    if (!parsed.success) {
      setError((prev) => ({ ...prev, ...formatErrors(parsed.error) }));
    } else if (Object.keys(field).some((key) => error[key] !== "")) {
      setError((prev) => ({ ...prev, ...record(field, "") }));
    }
    return parsed.success;
  };

  const resetForm = () => {
    setForm({ ...schema.shape, ...defaultVal });
    setError(record(schema.shape, ""));
  };

  return {
    form: [form, setForm],
    error: [error, setError],
    validateForm,
    validateField,
    resetForm,
  };
};
