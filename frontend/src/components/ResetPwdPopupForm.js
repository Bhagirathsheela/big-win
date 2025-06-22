import React, { useState } from "react";
import { useHttpClient } from "../common/hooks/http-hook";
import { useLayout } from "../common/context/LayoutContext";
import { useNotification } from "../common/context/NotificationContext";
const ResetPwdPopupForm = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const { sendRequest } = useHttpClient();
  const { closePopup } = useLayout();
  const { showError, showSuccess } = useNotification();
  const validateEmail = (email) =>
    /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$/.test(email);

  const handleReset = async () => {
    if (!email.trim()) {
      setError("Email is required");
      return;
    } else if (!validateEmail(email)) {
      setError("Invalid email address");
      return;
    }

    try {
      const responseData = await sendRequest(
        `${process.env.REACT_APP_BACKEND_URL}/users/reset-password`,
        "POST",
        JSON.stringify({
          email: email,
        }),
        { "Content-Type": "application/json" }
      );

      closePopup();
      if (responseData) {
        showSuccess("A password reset link is sent, please check your email");
      }
    } catch (err) {
      showError("Failed to send reset link.");
    }
  };

  return (
    <>
      <div className="space-y-4">
        <p className="text-sm text-gray-600">
          Enter your email and we’ll send you a reset link.
        </p>
        <input
          type="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            setError("");
          }}
          placeholder="Email address"
          className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-400"
        />
        {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
      </div>

      {/* Footer */}
      <div className="flex justify-end gap-2 px-4 py-3 border-t mt-10">
        <button
          onClick={closePopup}
          className="px-4 py-2 border rounded-md text-gray-700 hover:bg-gray-100"
        >
          Close
        </button>

        <button
          onClick={handleReset}
          className="px-4 py-2 border rounded-md bg-blue-500 text-white  hover:bg-blue-600"
        >
          Confirm
        </button>
      </div>
    </>
  );
};

export default ResetPwdPopupForm;
