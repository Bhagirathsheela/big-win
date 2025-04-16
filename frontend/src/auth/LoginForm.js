import React, { useContext } from "react";
import { useForm } from "react-hook-form";
import { AuthContext } from "../common/context/auth-context";
import { useHttpClient } from "../common/hooks/http-hook";

const LoginForm = () => {
   const {
     register,
     handleSubmit,
     formState: { errors },
   } = useForm();
    const {sendRequest } = useHttpClient();
    const auth = useContext(AuthContext);
    const onSubmit = async (data) => {
      console.log("Form data:", data);
      try {
        const responseData = await sendRequest(
          "http://localhost:5000/api/users/login",
          "POST",
          JSON.stringify({
            email: data.email,
            password: data.password,
          }),
          { "Content-Type": "application/json" }
        );
        if(responseData){
          auth.login(responseData.user);
          console.log("user Logged in", responseData);
        }
      } catch (err) {}
    };
  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold text-center text-gray-700">
        Login
      </h2>
      <form className="mt-4" onSubmit={handleSubmit(onSubmit)}>
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
          Login
        </button>
      </form>
    </div>
  );
};

export default LoginForm;
