import React, { useContext, Suspense } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { AuthContext } from "../common/context/auth-context";

// Eagerly loaded component
import Home from "../pages/Home";

// Lazy loaded components
const About = React.lazy(() => import("../pages/About"));
const Contact = React.lazy(() => import("../pages/Contact"));
const Profile = React.lazy(() => import("../pages/Profile"));
const SignIn = React.lazy(() => import("../auth/SignIn"));
const BettingPage = React.lazy(() => import("../pages/BettingPage"));
const PaymentSummary = React.lazy(() => import("../pages/PaymentSummary"));
const TermsAndConditions = React.lazy(() =>
  import("../pages/TermsAndConditions")
);

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
        <Route path="/bet" element={isLoggedIn ?<BettingPage />:<SignIn />} />
        <Route
          path="/profile"
          element={isLoggedIn ? <Profile /> : <SignIn />}
        />
        <Route path="/summary" element={isLoggedIn ? <PaymentSummary /> : <SignIn />} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;
