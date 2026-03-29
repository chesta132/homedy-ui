import { useForm } from "@/hooks/useForm";
import { AuthValidator } from "@/models/validator/auth";
import { api } from "@/utils/server/apiClient";
import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Loader2, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router";
import { HomedyLogo } from "@/components/ui/logo";
import { FormLayout } from "@/components/form-layout/FormLayout";

export const SignUpPage = () => {
  const formGroup = useForm({ email: "", password: "", username: "" }, AuthValidator.BODY.signUp);
  const {
    form: [form],
    validateForm,
  } = formGroup;
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState({ isSubmitted: false, email: "" });

  const handleSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    setLoading(true);
    try {
      const res = await api.post("/auth/signup", { data: form });
      setSubmitted({ isSubmitted: true, email: res.data.email });
      // catch in FormLayout
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-base p-4">
      <AnimatePresence mode="wait">
        {submitted.isSubmitted ? (
          <motion.div
            key="pending"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.3 }}
            className="w-full max-w-sm text-center"
          >
            <div className="mb-6 flex justify-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full border border-border-sub bg-card">
                <Mail className="h-7 w-7 text-subtle" />
              </div>
            </div>
            <h1 className="text-2xl font-semibold text-fg">Check your inbox</h1>
            <p className="mt-2 text-sm text-[#666666]">Your request has been submitted. The owner will receive an approval email shortly.</p>
            <div className="mt-4 rounded-lg border border-[#1e1e1e] bg-card px-4 py-3">
              <p className="text-xs text-dim">Registered as</p>
              <p className="mt-0.5 text-sm font-medium text-fg">{submitted.email}</p>
            </div>
            <p className="mt-6 text-xs text-[#444444]">You'll receive an email at this address once the owner reviews your request.</p>
            <div className="mt-6 space-y-3">
              <Link to="/signup/approval">
                <Button className="w-full h-10">Check request status</Button>
              </Link>
              <p className="text-center text-sm text-dim">
                Already approved?{" "}
                <Link to="/signin" className="text-fg underline underline-offset-4 hover:text-white">
                  Sign in
                </Link>
              </p>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="form"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.3 }}
            className="w-full max-w-sm"
          >
            {/* Logo */}
            <div className="mb-8 text-center">
              <HomedyLogo size="48" />
              <h1 className="text-2xl font-semibold text-fg">Create an account</h1>
              <p className="mt-1.5 text-sm text-[#666666]">Get started with Homedy</p>
            </div>

            <FormLayout form={formGroup} onFormSubmit={handleSubmit} className="space-y-3">
              <FormLayout.input fieldId="username" label="Username" placeholder="Your username" autoComplete="username" />
              <FormLayout.input fieldId="email" label="Email" placeholder="youremail@email.com" type="email" />
              <div>
                <FormLayout.input
                  fieldId="password"
                  label="Password"
                  placeholder="Create a secure password"
                  type="password"
                  autoComplete="new-password"
                />
                <p className="text-xs mt-1 text-dim">8–32 chars, must include uppercase, lowercase, and a digit</p>
              </div>
              <FormLayout.submit>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating account...
                  </>
                ) : (
                  "Sign Up"
                )}
              </FormLayout.submit>
            </FormLayout>

            <p className="mt-6 text-center text-sm text-dim">
              Already have an account?{" "}
              <Link to="/signin" className="text-fg underline underline-offset-4 hover:text-white">
                Sign in
              </Link>
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
