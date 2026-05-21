import React, { useState, useContext } from "react";
import { useForm } from "react-hook-form";
import { useHttpClient } from "../common/hooks/http-hook";
import { AuthContext } from "../common/context/auth-context";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash, FaEnvelope, FaLock, FaUserAlt } from "react-icons/fa";

const SignupForm = ({ setShowLogin }) => {
  const { sendRequest } = useHttpClient();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const auth = useContext(AuthContext);
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const onSubmit = async (data) => {
    try {
      const responseData = await sendRequest(
        `${process.env.REACT_APP_BACKEND_URL}/users/signup`,
        "POST",
        JSON.stringify({
          name: data.username,
          email: data.email,
          password: data.password,
        }),
        { "Content-Type": "application/json" }
      );
      if (responseData) {
        auth.login(responseData, responseData.token);
        navigate("/");
      }
    } catch (err) {}
  };

  return (
    <div className="card-pop">
      <h2 className="font-display text-xl font-bold text-brand-purpleDeep text-center mb-5">
        Create your account
      </h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-gray-500 mb-1 ml-1">Name</label>
          <div className="relative">
            <FaUserAlt className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-purple/60" />
            <input
              type="text"
              placeholder="Your name"
              className="input-fancy pl-11"
              {...register("username", { required: "Name is required" })}
            />
          </div>
          {errors.username && (
            <p className="text-pink-600 text-xs mt-1 ml-1">{errors.username.message}</p>
          )}
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-500 mb-1 ml-1">Email</label>
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
          <label className="block text-xs font-semibold text-gray-500 mb-1 ml-1">Password</label>
          <div className="relative">
            <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-purple/60" />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="At least 6 characters"
              className="input-fancy pl-11 pr-12"
              autoComplete="new-password"
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

        <button type="submit" className="btn-primary w-full">Create account</button>
      </form>
    </div>
  );
};

export default SignupForm;
