import React from "react";
import { Link } from "react-router-dom";
import { FaHeart, FaArrowRight, FaShieldAlt } from "react-icons/fa";

const Footer = () => {
  const year = new Date().getFullYear();
  return (
    <footer className="mt-12">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 pb-28 sm:pb-8">
        <div className="relative rounded-[28px] bg-white border border-purple-100 shadow-soft overflow-hidden">
          {/* top accent stripe */}
          <div className="h-1.5 bg-brand-gradient" />

          {/* CTA banner */}
          <div className="px-6 sm:px-8 pt-6">
            <div className="rounded-2xl bg-playful-gradient border border-purple-100 p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <div className="font-display font-bold text-brand-purpleDeep text-lg leading-tight">
                  Feeling lucky today?
                </div>
                <div className="text-sm text-gray-600">
                  Pick a number and join the next draw.
                </div>
              </div>
              <Link
                to="/"
                className="inline-flex items-center gap-2 bg-brand-gradient text-white font-semibold px-5 py-2.5 rounded-full shadow-popPink active:scale-95 hover:-translate-y-0.5 transition"
              >
                Play now <FaArrowRight />
              </Link>
            </div>
          </div>

          {/* brand block (centered for clean look without sections) */}
          <div className="px-6 sm:px-8 py-7 text-center sm:text-left flex flex-col sm:flex-row items-start sm:items-center gap-5">
            <div className="flex items-center gap-3 mx-auto sm:mx-0">
              <div className="w-12 h-12 rounded-2xl bg-brand-gradient grid place-items-center shadow-popPink">
                <span className="font-display font-bold text-white text-xl">B</span>
              </div>
              <div className="text-left">
                <div className="font-display font-bold text-2xl text-gradient leading-none">
                  Big Win
                </div>
                <div className="text-[11px] text-gray-500 mt-1 tracking-wide">
                  feel the lucky vibe
                </div>
              </div>
            </div>

            <p className="text-sm text-gray-600 leading-relaxed sm:flex-1 max-w-xl">
              Pick your lucky numbers, win up to{" "}
              <span className="font-semibold text-brand-purpleDeep">9x your stake</span>.
              Daily draws, always fair, always fun.
            </p>

            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-700 text-xs font-semibold whitespace-nowrap mx-auto sm:mx-0">
              <FaShieldAlt /> Secure & responsible play
            </div>
          </div>

          {/* bottom strip */}
          <div className="px-6 sm:px-8 py-4 border-t border-purple-100 bg-purple-50/40 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-gray-500">
            <div>&copy; {year} Big Win. All rights reserved. 18+ only — please gamble responsibly.</div>
            <div className="inline-flex items-center gap-1.5">
              Made with <FaHeart className="text-brand-pink animate-pulse" /> in India
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
