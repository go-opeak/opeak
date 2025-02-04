import { Navigate, Route, Routes } from "react-router-dom";
import { Main } from "@pages/Main";
import { ROUTES } from "@constants/routes";
import { Login } from "@pages/Login";
import Survey from "@pages/Survey";
import { SignUp } from "@pages/SignUp";
import { AuthProvider, useAuth } from "@contexts/AuthContext";
import { useEffect } from "react";
import { Exam } from "@pages/Exam";
import { MyPage } from "@pages/MyPage";
import { SurveyManage } from "@pages/MyPage/SurveyManage";
import { FeedbackDetail } from "@pages/FeedbackDetail";
import { AlertProvider } from "@components/Alter/AlertProvider";

function AuthenticatedRoutes() {
  return (
    <Routes>
      <Route path={ROUTES.MAIN} element={<Main />} />
      <Route path={ROUTES.SURVEY} element={<Survey />} />
      <Route path={ROUTES.EXAM} element={<Exam />} />
      <Route path={ROUTES.MY_PAGE} element={<MyPage />} />
      <Route path={ROUTES.SURVEY_MANAGE} element={<SurveyManage />} />
      <Route
        path={`${ROUTES.FEEDBACK}/:feedbackId`}
        element={<FeedbackDetail />}
      />
    </Routes>
  );
}

function UnauthenticatedRoutes() {
  return (
    <Routes>
      <Route path={ROUTES.MAIN} element={<Main />} />
      <Route path={ROUTES.SIGN_UP} element={<SignUp />} />
      <Route path={ROUTES.LOGIN} element={<Login />} />
      <Route
        path={ROUTES.SURVEY}
        element={<Navigate replace to={ROUTES.LOGIN} />}
      />
    </Routes>
  );
}

function AppContent() {
  const auth = useAuth();

  useEffect(() => {}, [auth?.isAuthenticated]);

  return auth?.isAuthenticated ? (
    <AuthenticatedRoutes />
  ) : (
    <UnauthenticatedRoutes />
  );
}

function App() {
  return (
    <AuthProvider>
      <AlertProvider>
        <AppContent />
      </AlertProvider>
    </AuthProvider>
  );
}

export default App;
