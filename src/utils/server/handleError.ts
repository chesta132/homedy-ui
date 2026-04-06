import type { StateErrorServer } from "@/types/server";
import { ServerError } from "./serverResponse";
import { capital } from "../manipulate/string";
import { flattenError, ZodError } from "zod";

/**
 * Maps any caught error to the global error state.
 */
export const handleError = (err: unknown, setError: React.Dispatch<React.SetStateAction<StateErrorServer | null>>) => {
  if (err instanceof ServerError) {
    setError({ code: err.getCode(), message: err.getMessage() });
  } else if (err instanceof Error) {
    if (err.message.toLowerCase().includes("network")) {
      setError({ code: "BAD_GATEWAY", message: "Unable to connect to server. Check your connection." });
    } else {
      setError({ code: "SERVER_ERROR", message: err.message });
    }
  } else {
    setError({ code: "SERVER_ERROR", message: "An unexpected error occurred." });
  }
};

/**
 * Like handleError but also sets field-level errors for form inputs.
 */
export const handleFormError = <T extends Record<string, string>>(
  err: unknown,
  setFormError: React.Dispatch<React.SetStateAction<T>>,
  setError: React.Dispatch<React.SetStateAction<StateErrorServer | null>>,
) => {
  if (err instanceof ServerError) {
    const fields = err.getFields();
    if (fields) {
      const formattedFields = Object.entries(fields).reduce((acc, [field, value]) => ({ ...acc, [field]: capital(value) }), {});
      setFormError((prev) => ({ ...prev, ...formattedFields }));
      return;
    }
  }
  if (err instanceof ZodError) {
    setFormError((prev) => ({ ...prev, ...flattenError(err).fieldErrors }));
    return;
  }
  handleError(err, setError);
};
