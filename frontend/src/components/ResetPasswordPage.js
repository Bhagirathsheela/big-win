// src/pages/ResetPasswordPage.js
import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useHttpClient } from "../common/hooks/http-hook";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useNotification } from "../common/context/NotificationContext";

const ResetPasswordPage = () => {
  const { token } = useParams();
  const { sendRequest } = useHttpClient();
  const navigate = useNavigate();
   const { showError,showSuccess } = useNotification();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSubmit = async (e) => {
    setError("");
    e.preventDefault();

    if (!password || !confirmPassword) {
      setError("Both fields are required.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      await sendRequest(
        `${process.env.REACT_APP_BACKEND_URL}/users/new-password`,
        "POST",
        JSON.stringify({ token, newPassword: password }),
        { "Content-Type": "application/json" }
      );
      showSuccess("Password reset successful! Redirecting to login...");
      setTimeout(() => navigate("/signin"), 3000);
    } catch (err) {
      showError("Invalid or expired token.");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold text-center mb-4 text-gray-700">
        Reset Password
      </h2>

      {error && <p className="text-red-500 text-sm mb-3">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="mb-4 relative">
          <label className="block text-sm font-medium text-gray-600 custom_input_label">
            New Password
          </label>
          <input
            type={showPassword ? "text" : "password"}
            className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 pr-10"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setError("");
            }}
          />
          <span
            className="absolute right-3 top-[22px] text-gray-500 cursor-pointer"
            onClick={() => setShowPassword((prev) => !prev)}
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </span>
        </div>

        <div className="mb-4 relative">
          <label className="block text-sm font-medium text-gray-600 custom_input_label">
            Confirm New Password
          </label>
          <input
            type={showConfirmPassword ? "text" : "password"}
            className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 pr-10"
            value={confirmPassword}
            onChange={(e) => {
              setConfirmPassword(e.target.value);
              setError("");
            }}
          />
          <span
            className="absolute right-3 top-[22px] text-gray-500 cursor-pointer"
            onClick={() => setShowConfirmPassword((prev) => !prev)}
          >
            {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
          </span>
        </div>

        <button
          type="submit"
          className="w-full px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600"
        >
          Reset Password
        </button>
      </form>
    </div>
  );
};

export default ResetPasswordPage;
