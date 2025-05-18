import React, { useContext } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
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

const AppRoutes = () => {
  const { token } = useContext(AuthContext);

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/bet" element={<BettingPage />} />
      <Route path="/summary" element={<PaymentSummary />} />
      <Route path="/terms" element={<TermsAndConditions />} />

      {token ? (
        <>
          <Route path="/profile" element={<Profile />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </>
      ) : (
        <>
          <Route path="/signin" element={<SignIn />} />
          <Route path="*" element={<Navigate to="/signin" replace />} />
        </>
      )}
    </Routes>
  );
};

export default AppRoutes;
