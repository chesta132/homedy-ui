import "./assets/styles/main.css";
import { BrowserRouter, Route, Routes } from "react-router";
import { ErrorProvider } from "./contexts/ErrorContext";
import { AuthProvider } from "./contexts/AuthContext";
import { SignUpPage } from "./pages/auth/SignUp";
import { SignInPage } from "./pages/auth/SignIn";

function App() {
  return (
    <BrowserRouter>
      <ErrorProvider>
        <AuthProvider>
          <Routes>
            <Route path="/signup" element={<SignUpPage />} />
            <Route path="/signin" element={<SignInPage />} />
            {/* debug */}
            <Route path="*" element={<SignUpPage />} />
          </Routes>
        </AuthProvider>
      </ErrorProvider>
    </BrowserRouter>
  );
}

export default App;
