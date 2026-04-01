import type { User } from "@/models/user";
import { Button } from "../ui/button";
import { CheckCircle, XCircle } from "lucide-react";
import type { ApprovalReviewState } from "@/pages/auth/ReviewApprovalPage";
import { ReviewLayout } from "../layout/auth/ReviewApprovalLayout";

type ReviewApprovalGuardProps = {
  isValidParams: boolean;
  state: ApprovalReviewState;
  user: User | null;
  err: string;
  setReviewState: React.Dispatch<React.SetStateAction<ApprovalReviewState>>;
  condition: GuardedCondition;
};
type GuardedCondition = "approved" | "denied" | "error" | "invalidParams";

export const ReviewApprovalGuard = (props: ReviewApprovalGuardProps) => {
  const { err, setReviewState, user, condition } = props;
  const viewMap = {
    invalidParams: InvalidView,
    approved: ApprovedView,
    denied: DeniedView,
    error: ErrorView,
  } satisfies Record<GuardedCondition, unknown>;
  
  const View = viewMap[condition];
  return (
    <ReviewLayout>
      <View error={err} user={user!} onRetry={() => setReviewState("pending")} />
    </ReviewLayout>
  );
};

export const guardReviewApproval = ({
  isValidParams,
  state,
  user,
}: Omit<ReviewApprovalGuardProps, "err" | "setReviewState" | "condition">): GuardedCondition | null => {
  if (!isValidParams) {
    return "invalidParams";
  }
  if (state === "approved" && user) {
    return "approved";
  }
  if (state === "denied" && user) {
    return "denied";
  }
  if (state === "error") {
    return "error";
  }

  return null;
};

function InvalidView() {
  return (
    <>
      <div className="mb-5 flex justify-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full border border-border-sub bg-card">
          <XCircle className="h-7 w-7 text-red-400" />
        </div>
      </div>
      <h1 className="text-2xl font-semibold text-fg">Invalid approval link</h1>
      <p className="mt-2 text-sm text-[#666666]">This approval link is invalid or has already been used.</p>
    </>
  );
}

function ApprovedView({ user }: { user: User }) {
  return (
    <>
      <div className="mb-5 flex justify-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full border border-emerald-900/40 bg-emerald-950/30">
          <CheckCircle className="h-7 w-7 text-emerald-400" />
        </div>
      </div>
      <h1 className="text-2xl font-semibold text-fg">Account approved</h1>
      <p className="mt-2 text-sm text-[#666666]">
        <span className="font-medium text-fg">{user.username}</span>'s account has been approved. They can now sign in to Homedy.
      </p>
      <UserCard user={user} />
    </>
  );
}

function DeniedView({ user }: { user: User }) {
  return (
    <>
      <div className="mb-5 flex justify-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full border border-red-900/40 bg-red-950/30">
          <XCircle className="h-7 w-7 text-red-400" />
        </div>
      </div>
      <h1 className="text-2xl font-semibold text-fg">Request denied</h1>
      <p className="mt-2 text-sm text-[#666666]">
        <span className="font-medium text-fg">{user.username}</span>'s account request has been denied.
      </p>
      <UserCard user={user} />
    </>
  );
}

function ErrorView({ error, onRetry }: { error: string; onRetry: () => void }) {
  return (
    <>
      <div className="mb-5 flex justify-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full border border-red-900/40 bg-red-950/30">
          <XCircle className="h-7 w-7 text-red-400" />
        </div>
      </div>
      <h1 className="text-2xl font-semibold text-fg">Action failed</h1>
      <p className="mt-2 text-sm text-[#666666]">{error}</p>
      <Button variant="outline" className="mt-5 w-full" onClick={onRetry}>
        Try again
      </Button>
    </>
  );
}

function UserCard({ user }: { user: User }) {
  return (
    <div className="mt-4 rounded-lg border border-border bg-card px-4 py-3 text-left space-y-2">
      <div>
        <p className="text-xs text-dim">Username</p>
        <p className="text-sm font-medium text-fg">{user.username}</p>
      </div>
      <div>
        <p className="text-xs text-dim">Email</p>
        <p className="text-sm font-medium text-fg">{user.email}</p>
      </div>
    </div>
  );
}
