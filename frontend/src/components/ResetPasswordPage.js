import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useHttpClient } from "../common/hooks/http-hook";
import { FaEye, FaEyeSlash, FaLock, FaKey } from "react-icons/fa";
import { useNotification } from "../common/context/NotificationContext";

const ResetPasswordPage = () => {
  const { token } = useParams();
  const { sendRequest } = useHttpClient();
  const navigate = useNavigate();
  const { showError, showSuccess } = useNotification();

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
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md">
        <div className="relative overflow-hidden rounded-3xl bg-candy-gradient text-white px-6 py-7 shadow-popPink mb-5">
          <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-white/15 blur-2xl" />
          <div className="relative">
            <div className="w-12 h-12 rounded-2xl bg-white/15 grid place-items-center backdrop-blur mb-3">
              <FaKey className="text-brand-yellow text-xl" />
            </div>
            <h1 className="font-display text-2xl font-bold">Reset your password</h1>
            <p className="text-white/90 text-sm mt-1">
              Choose a new password to secure your account.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="card-pop space-y-4">
          {error && (
            <div className="rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm px-3 py-2">
              {error}
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1 ml-1">
              New password
            </label>
            <div className="relative">
              <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-purple/60" />
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => { setPassword(e.target.value); setError(""); }}
                placeholder="At least 6 characters"
                className="input-fancy pl-11 pr-12"
              />
              <button
                type="button"
                onClick={() => setShowPassword((p) => !p)}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-xl grid place-items-center text-gray-500 hover:text-brand-purpleDeep hover:bg-purple-50 transition"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1 ml-1">
              Confirm new password
            </label>
            <div className="relative">
              <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-purple/60" />
              <input
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => { setConfirmPassword(e.target.value); setError(""); }}
                placeholder="Re-enter password"
                className="input-fancy pl-11 pr-12"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword((p) => !p)}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-xl grid place-items-center text-gray-500 hover:text-brand-purpleDeep hover:bg-purple-50 transition"
              >
                {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          <button type="submit" className="btn-primary w-full">Reset password</button>
        </form>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
