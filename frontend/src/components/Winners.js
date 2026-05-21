import React, { useState, useEffect, useRef } from "react";
import { FaTrophy, FaStar } from "react-icons/fa";

const WinnerSlider = ({ winners = [] }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const trackRef = useRef(null);

  useEffect(() => {
    if (winners.length === 0) return;
    const id = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % winners.length);
    }, 2500);
    return () => clearInterval(id);
  }, [winners]);

  useEffect(() => {
    if (trackRef.current) {
      trackRef.current.style.transition = "transform 0.6s cubic-bezier(0.22, 1, 0.36, 1)";
      trackRef.current.style.transform = `translateY(-${currentIndex * 100}%)`;
    }
  }, [currentIndex]);

  if (!winners || winners.length === 0) {
    return (
      <div className="rounded-2xl bg-white border border-purple-100 px-4 py-3 text-sm text-gray-500 inline-flex items-center gap-2">
        <FaTrophy className="text-brand-yellow" />
        No winners yet - be the first!
      </div>
    );
  }

  return (
    <div className="inline-flex items-center gap-3 bg-white rounded-full pl-3 pr-5 py-2 shadow-soft border border-purple-100">
      <div className="w-9 h-9 rounded-full bg-sunshine-gradient text-white grid place-items-center shadow-popOrange">
        <FaTrophy />
      </div>
      <div className="overflow-hidden h-6 w-56">
        <div className="flex flex-col" ref={trackRef}>
          {winners.map((w, idx) => (
            <div key={idx} className="flex items-center h-6 gap-2 text-sm text-brand-purpleDeep">
              <FaStar className="text-brand-yellow text-xs" />
              <span className="font-semibold truncate">{w.name}</span>
              {w.number !== undefined && (
                <span className="chip bg-purple-100 text-brand-purpleDeep text-[10px] py-0">
                  #{w.number.toString().padStart(2, "0")}
                </span>
              )}
              {w.amount !== undefined && (
                <span className="ml-auto text-emerald-600 font-semibold">
                  Rs.{Number(w.amount).toLocaleString("en-IN")}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WinnerSlider;
