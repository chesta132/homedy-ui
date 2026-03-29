import "./assets/styles/main.css";
import { BrowserRouter, Route, Routes } from "react-router";
import { ErrorProvider } from "./contexts/ErrorContext";
import { AuthProvider } from "./contexts/AuthContext";
import { SignUpPage } from "./pages/auth/SignUp";

function App() {
  return (
    <BrowserRouter>
      <ErrorProvider>
        <AuthProvider>
          <Routes>
            <Route path="/signup" element={<SignUpPage />} />
            {/* debug */}
            <Route path="*" element={<SignUpPage />} />
          </Routes>
        </AuthProvider>
      </ErrorProvider>
    </BrowserRouter>
  );
}

export default App;
