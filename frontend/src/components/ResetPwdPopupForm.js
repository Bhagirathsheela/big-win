import React, { useState } from "react";
import { useHttpClient } from "../common/hooks/http-hook";
import { useLayout } from "../common/context/LayoutContext";
import { useNotification } from "../common/context/NotificationContext";
import { FaEnvelope, FaPaperPlane } from "react-icons/fa";

const ResetPwdPopupForm = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const { sendRequest } = useHttpClient();
  const { closePopup } = useLayout();
  const { showError, showSuccess } = useNotification();

  const validateEmail = (e) =>
    /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$/.test(e);

  const handleReset = async () => {
    if (!email.trim()) { setError("Email is required"); return; }
    if (!validateEmail(email)) { setError("Please enter a valid email"); return; }
    try {
      const responseData = await sendRequest(
        `${process.env.REACT_APP_BACKEND_URL}/users/reset-password`,
        "POST",
        JSON.stringify({ email }),
        { "Content-Type": "application/json" }
      );
      closePopup();
      if (responseData) showSuccess("Reset link sent! Please check your inbox.");
    } catch (err) {
      showError("Failed to send reset link.");
    }
  };

  return (
    <>
      <div className="space-y-4">
        <p className="text-sm text-gray-600">
          Enter your email and we'll send you a reset link.
        </p>
        <div>
          <div className="relative">
            <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-purple/60" />
            <input
              type="email"
              value={email}
              onChange={(e) => { setEmail(e.target.value); setError(""); }}
              placeholder="you@example.com"
              className="input-fancy pl-11"
            />
          </div>
          {error && <p className="text-pink-600 text-xs mt-1 ml-1">{error}</p>}
        </div>
      </div>

      <div className="flex justify-end gap-2 px-1 py-3 border-t mt-6 border-purple-100">
        <button
          onClick={closePopup}
          className="px-5 py-2.5 rounded-full font-semibold text-gray-600 bg-white border border-gray-200 hover:bg-gray-50 active:scale-95 transition"
        >
          Cancel
        </button>
        <button onClick={handleReset} className="btn-primary inline-flex items-center gap-2">
          <FaPaperPlane /> Send link
        </button>
      </div>
    </>
  );
};

export default ResetPwdPopupForm;
