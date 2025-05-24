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

// Private route guard
const PrivateRoute = ({ children }) => {
  const { token } = useContext(AuthContext);
  const location = useLocation();

  if (!token) {
    return <Navigate to="/signin" state={{ from: location }} replace />;
  }

  return children;
};

const AppRoutes = () => {
  return (
    <Suspense fallback={<div className="text-center py-10">Loading...</div>}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/terms" element={<TermsAndConditions />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/bet" element={<BettingPage />} />
        <Route
          path="/profile"
          element={
            <PrivateRoute>
              <Profile />
            </PrivateRoute>
          }
        />
        <Route
          path="/summary"
          element={
            <PrivateRoute>
              <PaymentSummary />
            </PrivateRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;
