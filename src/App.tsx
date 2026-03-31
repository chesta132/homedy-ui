import "./assets/styles/main.css";
import { BrowserRouter, Route, Routes } from "react-router";
import { ErrorProvider } from "./contexts/ErrorContext";
import { AuthProvider } from "./contexts/AuthContext";
import { SignUpPage } from "./pages/auth/SignUp";
import { SignInPage } from "./pages/auth/SignIn";
import { DashboardPage } from "./pages/Dashboard";
import { DashboardLayout } from "./components/layout/DashboardLayout";
import { FileSharingProvider } from "./contexts/FileSharingContext";
import { AuthGuard, UnauthGuard } from "./components/layout/auth/Guard";
import { FileSharingPage } from "./pages/FileSharing";
import { Toaster } from "./components/ui/toaster";
import { TerminalPage } from "./pages/TerminalPage";

function App() {
  return (
    <BrowserRouter>
      <ErrorProvider>
        <AuthProvider>
          <FileSharingProvider>
            <Routes>
              {/* guest only */}
              <Route element={<UnauthGuard authRedirect="/" />}>
                {/* auth */}
                <Route path="/signup" element={<SignUpPage />} />
                <Route path="/signin" element={<SignInPage />} />
              </Route>

              {/* protected */}
              <Route element={<AuthGuard unauthRedirect="/signin" />}>
                {/* dashboard */}
                <Route element={<DashboardLayout />}>
                  <Route path="/" index element={<DashboardPage />} />
                  <Route path="/file-sharing" index element={<FileSharingPage />} />
                  <Route path="/terminal" index element={<TerminalPage />} />
                </Route>
              </Route>

              {/* debug */}
              <Route path="*" element={<SignUpPage />} />
            </Routes>
          </FileSharingProvider>
        </AuthProvider>
      </ErrorProvider>
      <Toaster />
    </BrowserRouter>
  );
}

export default App;
