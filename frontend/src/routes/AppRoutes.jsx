import React, { useContext, Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { AuthContext } from "../common/context/auth-context";

// Eagerly loaded component
import Home from "../components/Home";

// Lazy loaded components
const About = React.lazy(() => import("../components/About"));
const Contact = React.lazy(() => import("../components/Contact"));
const Profile = React.lazy(() => import("../components/Profile"));
const SignIn = React.lazy(() => import("../auth/SignIn"));
const BettingPage = React.lazy(() => import("../components/BettingPage"));
const PaymentSummary = React.lazy(() => import("../components/PaymentSummary"));
const TermsAndConditions = React.lazy(() =>import("../components/TermsAndConditions"));
const ResetPasswordPage = React.lazy(() =>import("../components/ResetPasswordPage"));


const AppRoutes = () => {
  const {isLoggedIn } = useContext(AuthContext);
  return (
    <Suspense fallback={<div className="text-center py-10">Loading...</div>}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/terms" element={<TermsAndConditions />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
        <Route
          path="/bet"
          element={isLoggedIn ? <BettingPage /> : <SignIn />}
        />
        <Route
          path="/profile"
          element={isLoggedIn ? <Profile /> : <SignIn />}
        />
        <Route
          path="/summary"
          element={isLoggedIn ? <PaymentSummary /> : <SignIn />}
        />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;
