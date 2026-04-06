import { ServerError } from "@/utils/server/serverResponse";
import { Toaster as SonnerToaster, toast } from "sonner";
import { ZodError } from "zod";

export { toast };

export function Toaster() {
  return (
    <SonnerToaster
      position="bottom-right"
      toastOptions={{
        style: {
          background: "#1a1a1a",
          border: "1px solid #2a2a2a",
          color: "#ededed",
        },
      }}
    />
  );
}

export const toastError = (err: unknown, { fallback = "An error occured", unmatchSilent = false } = {}) => {
  const unMatch = (err: unknown) => {
    if (unmatchSilent) return err;
    else throw err;
  };
  if (err instanceof ServerError) {
    fallback = err.getMessage();
    // should be handled with useForm
    if (fallback.toLowerCase() === "invalid payload") return unMatch(err);
  }
  // should be handled with useForm
  if (err instanceof ZodError) return unMatch(err);
  if (err instanceof Error) {
    fallback = err.message;
  }

  toast.error(fallback);
};
