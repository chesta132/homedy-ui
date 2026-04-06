import "./assets/styles/main.css";
import { BrowserRouter, Navigate, Route, Routes } from "react-router";
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
import { ConvertPage } from "./pages/ConvertPage";
import { ConvertProvider } from "./contexts/ConvertContext";
import { SignUpApprovalPage } from "./pages/auth/ApprovalPage";
import { SignUpReviewApprovalPage } from "./pages/auth/ReviewApprovalPage";
import { NoteProvider } from "./contexts/NoteContext";
import { NoteListPage } from "./pages/note/NoteListPage";
import { NoteActionProvider } from "./contexts/NoteActionContext";
import { NoteDetailsPage } from "./pages/note/NoteDetailsPage";
import { ProfileProvider } from "./contexts/UserContext";

function App() {
  return (
    <BrowserRouter>
      <ErrorProvider>
        <AuthProvider>
          <ProfileProvider>
            <FileSharingProvider>
              <ConvertProvider>
                <NoteProvider>
                  <NoteActionProvider>
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
                          <Route path="/file-sharing" element={<FileSharingPage />} />
                          <Route path="/terminal" element={<TerminalPage />} />
                          <Route path="/convert" element={<ConvertPage />} />
                          <Route path="/notes" element={<NoteListPage />} />
                          <Route path="/notes/create" element={<NoteDetailsPage />} />
                          <Route path="/notes/:id" element={<NoteDetailsPage />} />

                          {/* TODO: add TrashLayout */}
                          <Route path="/trash/notes" element={<NoteListPage trashPage />} />
                        </Route>
                      </Route>

                      <Route path="/signup/approval-status" element={<SignUpApprovalPage />} />
                      <Route path="/signup/review-approval" element={<SignUpReviewApprovalPage />} />

                      {/* TODO: change to not found page */}
                      <Route path="*" element={<Navigate to={"/"} />} />
                    </Routes>
                  </NoteActionProvider>
                </NoteProvider>
              </ConvertProvider>
            </FileSharingProvider>
          </ProfileProvider>
        </AuthProvider>
      </ErrorProvider>
      <Toaster />
    </BrowserRouter>
  );
}

export default App;
