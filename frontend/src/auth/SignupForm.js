// src/components/SignupForm.jsx
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useHttpClient } from "../common/hooks/http-hook";


const SignupForm = ({ setShowLogin }) => {
  const {sendRequest } = useHttpClient();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  //const [isLoading, setIsLoading] = useState(false),
  //[error, setError] = useState()

  const onSubmit = async (data) => {
    //console.log("Form data:", data);
    try {
      await sendRequest("http://localhost:5000/api/users/signup","POST",
        JSON.stringify({
            name: data.username,
            email: data.email,
            password: data.password,
          }),
        {
            "Content-Type": "application/json"
        }
      );
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
            type="password"
            className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            {...register("password", {
              required: "Password is required",
              minLength: {
                value: 6,
                message: "Password must be at least 6 characters",
              },
            })}
            autoComplete="current-password"
          />
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
