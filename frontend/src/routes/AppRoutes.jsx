import React, { useContext } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { AuthContext } from "../common/context/auth-context";

// Your pages
import Home from "../pages/Home";
import About from "../pages/About";
import Contact from "../pages/Contact";
import Profile from "../pages/Profile";
import SignIn from "../auth/SignIn";
import BettingPage from "../pages/BettingPage";
import PaymentSummary from "../pages/PaymentSummary";
import TermsAndConditions from "../pages/TermsAndConditions";

// private routes
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
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/terms" element={<TermsAndConditions />} />
      <Route path="/signin" element={<SignIn />} />
      <Route path="/bet" element={<BettingPage />} />
      {/*  Protected Routes */}
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

      {/* Default Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;
