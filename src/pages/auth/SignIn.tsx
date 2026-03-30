import { useAuth } from "@/contexts/AuthContext";
import { useForm } from "@/hooks/useForm";
import { AuthValidator } from "@/models/validator/auth";
import { api } from "@/utils/server/apiClient";
import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { motion } from "motion/react";
import { HomedyLogo } from "@/components/ui/logo";
import { FormLayout } from "@/components/form-layout/FormLayout";
import { Loading } from "@/components/ui/loading";

export const SignInPage = () => {
  const { setUser } = useAuth();
  const formGroup = useForm({ identifier: "", password: "", rememberMe: true }, AuthValidator.BODY.signIn);
  const {
    form: [form],
    validateForm,
  } = formGroup;
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    setLoading(true);
    try {
      const res = await api.post("/auth/signin", { data: form });
      setUser(res.data);
      navigate("/");
      // catch in form layout
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-base p-4">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="w-full max-w-sm">
        {/* Logo */}
        <div className="mb-8 text-center">
          <HomedyLogo size="48" />
          <h1 className="text-2xl font-semibold text-fg">Welcome back</h1>
          <p className="mt-1.5 text-sm text-[#666666]">Sign in to your Homedy account</p>
        </div>

        <FormLayout form={formGroup} onFormSubmit={handleSubmit} className="space-y-3">
          <FormLayout.input fieldId="identifier" label="Email or Username" placeholder="youremail@email.com" autoComplete="username" />
          <FormLayout.input fieldId="password" label="Password" placeholder="Enter your password" type="password" autoComplete="current-password" />
          <FormLayout.checkbox fieldId="rememberMe" label="Remember me" id="remember-me" />
          <FormLayout.submit>
            {loading ? (
              <>
                <Loading className="mr-2 size-4" />
                Logging in...
              </>
            ) : (
              "Sign In"
            )}
          </FormLayout.submit>
        </FormLayout>

        <p className="mt-6 text-center text-sm text-dim">
          Don't have an account?{" "}
          <Link to="/signup" className="text-fg underline underline-offset-4 hover:text-white">
            Sign up
          </Link>
        </p>
      </motion.div>
    </div>
  );
};
