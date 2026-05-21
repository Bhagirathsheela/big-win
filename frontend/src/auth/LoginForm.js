import React, { useContext, useState } from "react";
import { useForm } from "react-hook-form";
import { AuthContext } from "../common/context/auth-context";
import { useHttpClient } from "../common/hooks/http-hook";
import { FaEye, FaEyeSlash, FaEnvelope, FaLock } from "react-icons/fa";
import { useNavigate, useLocation } from "react-router-dom";
import { useLayout } from "../common/context/LayoutContext";
import ResetPwdPopupForm from "../components/ResetPwdPopupForm";

const LoginForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const { sendRequest } = useHttpClient();
  const auth = useContext(AuthContext);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { openPopup } = useLayout();

  const from = location.state?.from || "/";

  const onSubmit = async (data) => {
    try {
      const responseData = await sendRequest(
        `${process.env.REACT_APP_BACKEND_URL}/users/login`,
        "POST",
        JSON.stringify({ email: data.email, password: data.password }),
        { "Content-Type": "application/json" }
      );
      if (responseData) {
        auth.login(responseData, responseData.token);
        navigate(from, { replace: true });
      }
    } catch (err) {}
  };

  const handleResetClick = () => {
    openPopup("pwdResetPopup", {
      title: "Reset password",
      body: <ResetPwdPopupForm />,
    });
  };

  return (
    <div className="card-pop">
      <h2 className="font-display text-xl font-bold text-brand-purpleDeep text-center mb-5">
        Login to your account
      </h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-gray-500 mb-1 ml-1">
            Email
          </label>
          <div className="relative">
            <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-purple/60" />
            <input
              type="email"
              placeholder="you@example.com"
              className="input-fancy pl-11"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$/,
                  message: "Please enter a valid email",
                },
              })}
            />
          </div>
          {errors.email && (
            <p className="text-pink-600 text-xs mt-1 ml-1">{errors.email.message}</p>
          )}
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-500 mb-1 ml-1">
            Password
          </label>
          <div className="relative">
            <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-purple/60" />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="At least 6 characters"
              className="input-fancy pl-11 pr-12"
              autoComplete="current-password"
              {...register("password", {
                required: "Password is required",
                minLength: { value: 6, message: "At least 6 characters" },
              })}
            />
            <button
              type="button"
              onClick={() => setShowPassword((p) => !p)}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-xl grid place-items-center text-gray-500 hover:text-brand-purpleDeep hover:bg-purple-50 transition"
              aria-label="Toggle password"
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
          {errors.password && (
            <p className="text-pink-600 text-xs mt-1 ml-1">{errors.password.message}</p>
          )}
        </div>

        <button type="submit" className="btn-primary w-full">Login</button>
      </form>

      <div className="text-center mt-4 text-sm text-gray-500">
        Forgot password?{" "}
        <button
          type="button"
          onClick={handleResetClick}
          className="text-brand-pink font-semibold hover:underline"
        >
          Reset it
        </button>
      </div>
    </div>
  );
};

export default LoginForm;
