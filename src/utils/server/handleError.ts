import type { StateErrorServer } from "@/types/server";
import { ServerError } from "./serverResponse";


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
    const field = err.getField();
    if (field) {
      setFormError((prev) => ({ ...prev, ...field }));
      return;
    }
  }
  handleError(err, setError);
};
