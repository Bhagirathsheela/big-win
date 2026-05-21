import React from "react";
import { useLoader } from "../context/LoaderContext";

const Loader = () => {
  const { loading } = useLoader();
  if (!loading) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-purple-900/40 backdrop-blur-sm">
      <div className="relative w-20 h-20">
        <div
          className="absolute inset-0 rounded-full border-4 border-transparent animate-spin"
          style={{
            borderTopColor: "#EC4899",
            borderRightColor: "#9333EA",
            animationDuration: "1.2s",
          }}
        />
        <div
          className="absolute inset-2 rounded-full border-4 border-transparent animate-spin"
          style={{
            borderTopColor: "#FBBF24",
            borderLeftColor: "#10B981",
            animationDuration: "0.9s",
            animationDirection: "reverse",
          }}
        />
        <div className="absolute inset-0 grid place-items-center">
          <div className="w-3 h-3 rounded-full bg-white animate-pulse" />
        </div>
      </div>
    </div>
  );
};

export default Loader;
