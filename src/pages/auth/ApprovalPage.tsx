import { useState } from "react";
import { Link } from "react-router";
import { Mail } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { api } from "@/utils/server/apiClient";
import { useForm } from "@/hooks/useForm";
import { AuthValidator } from "@/models/validator/auth";
import { FormLayout } from "@/components/form-layout/FormLayout";
import { Loading } from "@/components/ui/loading";
import type { AuthResponse } from "@/models/auth";
import { ApprovalResult } from "@/components/auth/SignUpApprovalComp";

export function SignUpApprovalPage() {
  const formGroup = useForm({ email: "" }, AuthValidator.QUERY.signUpApprovalStatus);
  const {
    form: [form],
    validateForm,
    resetForm,
  } = formGroup;
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AuthResponse.ApprovalStatus | null>(null);

  const handleCheck = async (e: React.SubmitEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    setLoading(true);
    try {
      const res = await api.get("/auth/signup/approval-status", {
        query: { email: form.email },
      });
      setResult(res.data);
      // catch in form layout
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setResult(null);
    resetForm();
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-base p-4">
      <AnimatePresence mode="wait">
        {result ? (
          <ApprovalResult onReset={handleReset} result={result} />
        ) : (
          <motion.div
            key="form"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.3 }}
            className="w-full max-w-sm"
          >
            <div className="mb-8 text-center">
              <div className="mb-4 flex justify-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-full border border-border-sub bg-card">
                  <Mail className="h-6 w-6 text-subtle" />
                </div>
              </div>
              <h1 className="text-2xl font-semibold text-fg">Check request status</h1>
              <p className="mt-1.5 text-sm text-[#666666]">Enter the email you used to sign up</p>
            </div>

            <FormLayout form={formGroup} onFormSubmit={handleCheck} className="gap-4">
              <FormLayout.input fieldId="email" label="Email" type="email" autoComplete="email" placeholder="youremail@email.com" />
              <FormLayout.submit>
                {loading ? (
                  <>
                    <Loading />
                    Checking...
                  </>
                ) : (
                  "Check Status"
                )}
              </FormLayout.submit>
            </FormLayout>

            <p className="mt-6 text-center text-sm text-dim">
              Already approved?{" "}
              <Link to="/signin" className="text-fg underline underline-offset-4 hover:text-white">
                Sign in
              </Link>
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
