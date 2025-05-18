import React, { useState, useContext } from "react";
import { useForm } from "react-hook-form";
import { useHttpClient } from "../common/hooks/http-hook";
import { useNotification } from "../common/context/NotificationContext";
import { AuthContext } from "../common/context/auth-context";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const SignupForm = ({ setShowLogin }) => {
  const { sendRequest } = useHttpClient();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const { showSuccess } = useNotification();
  const auth = useContext(AuthContext);

  const [showPassword, setShowPassword] = useState(false);

  const onSubmit = async (data) => {
    try {
      const responseData = await sendRequest(
        "http://localhost:5000/api/users/signup",
        "POST",
        JSON.stringify({
          name: data.username,
          email: data.email,
          password: data.password,
        }),
        {
          "Content-Type": "application/json",
        }
      );
      if (responseData) {
        showSuccess("Signed up successfully, please login using credentials");
        setShowLogin(true);
      }
    } catch (err) {}
  };

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold text-center text-gray-700">
        Sign Up
      </h2>
      <form className="mt-4" onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-4 relative">
          <label className="block text-sm font-medium text-gray-600 custom_input_label">
            Name
          </label>
          <input
            type="text"
            className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            {...register("username", {
              required: "Username is required",
            })}
          />
          {errors.username && (
            <p className="text-red-500 text-xs mt-1">
              {errors.username.message}
            </p>
          )}
        </div>
        <div className="mb-4 relative">
          <label className="block text-sm font-medium text-gray-600 custom_input_label">
            Email
          </label>
          <input
            type="email"
            className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$/,
                message: "Invalid email address",
              },
            })}
          />
          {errors.email && (
            <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
          )}
        </div>
        <div className="mb-4 relative">
          <label className="block text-sm font-medium text-gray-600 custom_input_label">
            Password
          </label>
          <input
            type={showPassword ? "text" : "password"}
            className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 pr-10"
            {...register("password", {
              required: "Password is required",
              minLength: {
                value: 6,
                message: "Password must be at least 6 characters",
              },
            })}
            autoComplete="current-password"
          />
          <span
            className="absolute right-3 top-[22px] text-gray-500 cursor-pointer"
            onClick={() => setShowPassword((prev) => !prev)}
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </span>
          {errors.password && (
            <p className="text-red-500 text-xs mt-1">
              {errors.password.message}
            </p>
          )}
        </div>
        <button
          type="submit"
          className="w-full px-4 py-2 font-medium text-white bg-blue-500 rounded-md hover:bg-blue-600"
        >
          Sign Up
        </button>
      </form>
    </div>
  );
};

export default SignupForm;
