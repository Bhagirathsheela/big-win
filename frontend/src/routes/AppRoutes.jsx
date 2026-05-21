import React, { useContext, Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { AuthContext } from "../common/context/auth-context";

import Home from "../components/Home";

const About = React.lazy(() => import("../components/About"));
const Contact = React.lazy(() => import("../components/Contact"));
const Profile = React.lazy(() => import("../components/Profile"));
const SignIn = React.lazy(() => import("../auth/SignIn"));
const BettingPage = React.lazy(() => import("../components/BettingPage"));
const PaymentSummary = React.lazy(() => import("../components/PaymentSummary"));
const TermsAndConditions = React.lazy(() => import("../components/TermsAndConditions"));
const ResetPasswordPage = React.lazy(() => import("../components/ResetPasswordPage"));

const AppRoutes = () => {
  const { isLoggedIn } = useContext(AuthContext);
  return (
    <Suspense
      fallback={
        <div className="min-h-[60vh] grid place-items-center px-4">
          <div className="card-pop flex items-center gap-3">
            <div className="w-3 h-3 rounded-full bg-brand-pink animate-pulse" />
            <span className="text-gray-600 font-medium">Loading...</span>
          </div>
        </div>
      }
    >
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/terms" element={<TermsAndConditions />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
        <Route path="/bet" element={isLoggedIn ? <BettingPage /> : <SignIn />} />
        <Route path="/profile" element={isLoggedIn ? <Profile /> : <SignIn />} />
        <Route path="/summary" element={isLoggedIn ? <PaymentSummary /> : <SignIn />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;
