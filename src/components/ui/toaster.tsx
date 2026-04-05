import { ServerError } from "@/utils/server/serverResponse";
import { Toaster as SonnerToaster, toast, type ExternalToast } from "sonner";

/** @deprecated use showToast */
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

export const showToast = {
  ...toast,
  error: (e: unknown, d?: ExternalToast) =>
    toast.error(e instanceof ServerError ? e.getMessage() : e instanceof Error ? e.message : "An error occured", d),
};
