import { useAuth } from "@/contexts/AuthContext";
import { useError } from "@/contexts/ErrorContext";
import { handleError } from "@/utils/server/handleError";
import { ServerError } from "@/utils/server/serverResponse";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { Navigate, Outlet, useLocation, useNavigate } from "react-router";

const isUnauthorizedErr = (err: unknown) => {
  if (err instanceof ServerError) {
    const code = err.getCode();
    if (code === "UNAUTHORIZED") {
      return true;
    }
  }
  return false;
};

export const AuthGuard = ({ unauthRedirect }: { unauthRedirect: string }) => {
  const { ensureMyUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const { setError } = useError();
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      try {
        await ensureMyUser();
      } catch (err) {
        if (isUnauthorizedErr(err)) {
          navigate(unauthRedirect, { state: { ensureUnauth: false } });
          return;
        }
        handleError(err, setError);
      } finally {
        setLoading(false);
      }
    })();
  });

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-base">
        <Loader2 className="h-5 w-5 animate-spin text-muted-strong" />
      </div>
    );
  }

  return <Outlet />;
};

export const UnauthGuard = ({ authRedirect }: { authRedirect: string }) => {
  const { user, ensureMyUser } = useAuth();
  const { setError } = useError();
  const { state } = useLocation();

  if (state?.ensureUnauth === false) {
    return <Outlet />;
  }

  if (user) {
    return <Navigate to={authRedirect} replace />;
  }

  useEffect(() => {
    (async () => {
      try {
        await ensureMyUser();
      } catch (err) {
        if (!isUnauthorizedErr(err)) handleError(err, setError);
      }
    })();
  });

  return <Outlet />;
};
