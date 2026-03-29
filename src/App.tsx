import "./assets/styles/main.css";
import { BrowserRouter, Route, Routes } from "react-router";
import { ErrorProvider } from "./contexts/ErrorContext";
import { AuthProvider } from "./contexts/AuthContext";
import { SignUpPage } from "./pages/auth/SignUp";
import { SignInPage } from "./pages/auth/SignIn";
import { DashboardPage } from "./pages/Dashboard";
import { DashboardLayout } from "./components/layout/DashboardLayout";

function App() {
  return (
    <BrowserRouter>
      <ErrorProvider>
        <AuthProvider>
          <Routes>
            {/* auth */}
            <Route path="/signup" element={<SignUpPage />} />
            <Route path="/signin" element={<SignInPage />} />

            {/* dashboard */}
            <Route path="/" element={<DashboardLayout />}>
              <Route path="/" index element={<DashboardPage />} />
            </Route>

            {/* debug */}
            <Route path="*" element={<SignUpPage />} />
          </Routes>
        </AuthProvider>
      </ErrorProvider>
    </BrowserRouter>
  );
}

export default App;
