import { CheckCircle, Clock, XCircle } from "lucide-react";
import { motion } from "motion/react";
import { HomedyLogo } from "../ui/logo";
import type { AuthResponse } from "@/models/auth";
import { Link } from "react-router";
import { Button } from "../ui/button";

const ApprovalApproved = () => {
  return (
    <>
      <div className="mb-5 flex justify-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full border border-emerald-900/40 bg-emerald-950/30">
          <CheckCircle className="h-7 w-7 text-emerald-400" />
        </div>
      </div>
      <h1 className="text-2xl font-semibold text-fg">Account approved</h1>
      <p className="mt-2 text-sm text-[#666666]">Your account is ready. You can sign in now.</p>
    </>
  );
};

const ApprovalPending = () => {
  return (
    <>
      <div className="mb-5 flex justify-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full border border-border-sub bg-card">
          <Clock className="h-7 w-7 text-subtle" />
        </div>
      </div>
      <h1 className="text-2xl font-semibold text-fg">Still pending</h1>
      <p className="mt-2 text-sm text-[#666666]">Your request hasn't been reviewed yet. Check back later.</p>
    </>
  );
};

const ApprovalDenied = () => {
  return (
    <>
      <div className="mb-5 flex justify-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full border border-red-900/40 bg-red-950/30">
          <XCircle className="h-7 w-7 text-red-400" />
        </div>
      </div>
      <h1 className="text-2xl font-semibold text-fg">Request denied</h1>
      <p className="mt-2 text-sm text-[#666666]">Your account request was denied. If you think this was a mistake, contact the owner.</p>
    </>
  );
};

const approvalResultMap = {
  approved: ApprovalApproved,
  pending: ApprovalPending,
  denied: ApprovalDenied,
};

export const ApprovalResult = ({ result, onReset }: { result: AuthResponse.ApprovalStatus; onReset: () => void }) => {
  const Result = approvalResultMap[result.status];

  return (
    <motion.div
      key="result"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      transition={{ duration: 0.3 }}
      className="w-full max-w-sm text-center"
    >
      <div className="mb-6 flex justify-center">
        <HomedyLogo size="48" />
      </div>
      <Result />
      <div className="mt-4 rounded-lg border border-border bg-card px-4 py-3 text-left space-y-2">
        {result.username && (
          <div>
            <p className="text-xs text-dim">Username</p>
            <p className="text-sm font-medium text-fg">{result.username}</p>
          </div>
        )}
        <div>
          <p className="text-xs text-dim">Email</p>
          <p className="text-sm font-medium text-fg">{result.email}</p>
        </div>
      </div>

      <div className="mt-6 space-y-2">
        {result.status === "approved" && (
          <Link to="/signin">
            <Button className="w-full h-10">Sign In</Button>
          </Link>
        )}
        <Button variant="outline" className="w-full h-10" onClick={onReset}>
          Check another email
        </Button>
      </div>
    </motion.div>
  );
};
