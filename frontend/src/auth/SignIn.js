import React, { useState } from "react";
import LoginForm from "./LoginForm";
import SignupForm from "./SignupForm";
import { FaStar, FaTrophy } from "react-icons/fa";

const SignIn = () => {
  const [showLogin, setShowLogin] = useState(true);

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md">
        <div className="relative overflow-hidden rounded-3xl bg-brand-gradient text-white px-6 py-7 shadow-popPink mb-5">
          <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-white/15 blur-2xl" />
          <div className="absolute top-3 right-5 animate-floaty">
            <FaStar className="text-brand-yellow" />
          </div>
          <div className="relative">
            <div className="w-12 h-12 rounded-2xl bg-white/15 grid place-items-center backdrop-blur mb-3">
              <FaTrophy className="text-brand-yellow text-xl" />
            </div>
            <h1 className="font-display text-2xl font-bold">
              {showLogin ? "Welcome back!" : "Join the fun"}
            </h1>
            <p className="text-white/90 text-sm mt-1">
              {showLogin
                ? "Sign in to claim your lucky picks."
                : "Create an account and start winning today."}
            </p>
          </div>
        </div>

        <div className="relative bg-white rounded-full p-1 border border-purple-100 shadow-soft mb-4 flex">
          <div
            className={`absolute top-1 bottom-1 w-[calc(50%-4px)] rounded-full bg-brand-gradient shadow-popPink transition-all duration-300 ${
              showLogin ? "left-1" : "left-[calc(50%+3px)]"
            }`}
          />
          <button
            onClick={() => setShowLogin(true)}
            className={`relative z-10 flex-1 py-2.5 rounded-full text-sm font-semibold transition-colors ${
              showLogin ? "text-white" : "text-brand-purpleDeep"
            }`}
          >
            Login
          </button>
          <button
            onClick={() => setShowLogin(false)}
            className={`relative z-10 flex-1 py-2.5 rounded-full text-sm font-semibold transition-colors ${
              !showLogin ? "text-white" : "text-brand-purpleDeep"
            }`}
          >
            Sign up
          </button>
        </div>

        <div className="animate-bounceIn">
          {showLogin ? <LoginForm /> : <SignupForm setShowLogin={setShowLogin} />}
        </div>
      </div>
    </div>
  );
};

export default SignIn;
