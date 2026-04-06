import { useState } from "react";
import { useSearchParams } from "react-router";
import { XCircle, Loader2, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AppSecretModal } from "@/components/ui/app-secret-modal";
import { useAppSecret } from "@/hooks/useAppSecret";
import { api } from "@/utils/server/apiClient";
import { toast } from "sonner";
import type { User } from "@/models/user";
import type { AuthValidator } from "@/models/validator/auth";
import type z from "zod";
import { ServerError } from "@/utils/server/serverResponse";
import { Loading } from "@/components/ui/loading";
import { ReviewLayout } from "@/components/layout/auth/ReviewApprovalLayout";
import { guardReviewApproval, ReviewApprovalGuard } from "@/components/auth/ReviewApprovalComp";

export type ApprovalReviewState = "pending" | "loading" | "approved" | "denied" | "error";

export function SignUpReviewApprovalPage() {
  const [params] = useSearchParams();
  const identifier = params.get("identifier") ?? "";
  const action = params.get("action");

  const { prompt, getSecret, submitPrompt, cancelPrompt } = useAppSecret();

  const [state, setState] = useState<ApprovalReviewState>("pending");
  const [user, setUser] = useState<User | null>(null);
  const [errorMessage, setErrorMessage] = useState("");

  const isValidParams = Boolean(identifier && (action === "approve" || action === "deny"));
  const isApproveAction = action === "approve";

  const handleSubmit = async () => {
    if (!isValidParams) {
      toast.error("Missing information to process approval");
      return;
    }
    const secret = await getSecret();
    if (!secret) return;

    setState("loading");

    try {
      const res = await api.patch("/auth/signup/approval", {
        data: { identifier, action } as z.infer<typeof AuthValidator.BODY.signUpApproval>,
        header: { "X-APP-SECRET": secret },
      });
      setUser(res.data);
      setState(isApproveAction ? "approved" : "denied");
    } catch (err) {
      const message = err instanceof ServerError ? err.getMessage() : `Failed to ${isApproveAction ? "approve" : "deny"} requested approval`;
      setErrorMessage(message);
      setState("error");
      toast.error(message);
    }
  };

  const guardedCondition = guardReviewApproval({ isValidParams, state, user });
  if (guardedCondition)
    return (
      <ReviewApprovalGuard
        condition={guardedCondition}
        err={errorMessage}
        isValidParams={isValidParams}
        setReviewState={setState}
        state={state}
        user={user}
      />
    );

  return (
    <ReviewLayout>
      <AppSecretModal open={prompt} onSubmit={submitPrompt} onCancel={cancelPrompt} />

      <div className="mb-5 flex justify-center">
        <div
          className={`flex h-16 w-16 items-center justify-center rounded-full border ${
            isApproveAction ? "border-emerald-900/40 bg-emerald-950/30" : "border-red-900/40 bg-red-950/30"
          }`}
        >
          {state === "loading" ? (
            <Loading className="size-7" />
          ) : isApproveAction ? (
            <ShieldCheck className="h-7 w-7 text-emerald-400" />
          ) : (
            <XCircle className="h-7 w-7 text-red-400" />
          )}
        </div>
      </div>

      <h1 className="text-2xl font-semibold text-fg">{isApproveAction ? "Approve account request?" : "Deny account request?"}</h1>
      <p className="mt-2 text-sm text-[#666666]">
        {isApproveAction ? "The user will be able to sign in after this is confirmed." : "The user's account request will be permanently rejected."}
      </p>

      <Button className="mt-6 w-full" variant={isApproveAction ? "default" : "destructive"} disabled={state === "loading"} onClick={handleSubmit}>
        {state === "loading" ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Processing...
          </>
        ) : isApproveAction ? (
          "Approve"
        ) : (
          "Deny"
        )}
      </Button>
    </ReviewLayout>
  );
}
