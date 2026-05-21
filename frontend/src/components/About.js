import React from "react";
import { Link } from "react-router-dom";
import { FaBolt, FaShieldAlt, FaHeart, FaUsers, FaArrowRight } from "react-icons/fa";

const features = [
  { icon: <FaBolt />, title: "Lightning fast", desc: "Pick numbers, place bets, and see results in seconds.", tone: "bg-orange-100 text-orange-700" },
  { icon: <FaShieldAlt />, title: "Fair & secure", desc: "Provably random draws and encrypted transactions every time.", tone: "bg-emerald-100 text-emerald-700" },
  { icon: <FaHeart />, title: "Made with love", desc: "Designed to be fun, friendly, and easy on the eyes.", tone: "bg-pink-100 text-pink-700" },
  { icon: <FaUsers />, title: "Growing community", desc: "Join thousands of players chasing their lucky number.", tone: "bg-purple-100 text-brand-purpleDeep" },
];

const About = () => (
  <div className="min-h-screen px-4 py-8 sm:py-12">
    <div className="max-w-4xl mx-auto">
      <div className="relative overflow-hidden rounded-3xl bg-brand-gradient text-white p-7 sm:p-12 shadow-popPink text-center">
        <div className="absolute -top-12 -right-12 w-44 h-44 rounded-full bg-white/15 blur-2xl" />
        <div className="absolute -bottom-12 -left-12 w-44 h-44 rounded-full bg-brand-yellow/30 blur-2xl" />
        <div className="relative">
          <span className="chip bg-white/20 text-white backdrop-blur mb-3">About Big Win</span>
          <h1 className="font-display text-3xl sm:text-5xl font-bold leading-tight">
            A playful way to <span className="text-brand-yellow">win big</span>
          </h1>
          <p className="text-white/90 mt-3 max-w-xl mx-auto">
            Big Win is a daily number-game where you pick your lucky digits and cheer for the draw.
            Simple, fair, and built for fun.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-6 stagger-in">
        {features.map((f) => (
          <div key={f.title} className="card-pop">
            <div className={`w-11 h-11 rounded-2xl grid place-items-center ${f.tone}`}>{f.icon}</div>
            <h3 className="font-display font-bold text-brand-purpleDeep mt-3">{f.title}</h3>
            <p className="text-sm text-gray-600 mt-1">{f.desc}</p>
          </div>
        ))}
      </div>

      <div className="mt-6 card-pop bg-sunshine-gradient text-white border-0">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="font-display font-bold text-xl">Ready to feel lucky?</h3>
            <p className="text-white/90 text-sm">Pick your numbers and join today's draw.</p>
          </div>
          <Link
            to="/"
            className="inline-flex items-center gap-2 bg-white text-orange-600 font-bold px-5 py-3 rounded-full shadow-soft active:scale-95"
          >
            Pick numbers <FaArrowRight />
          </Link>
        </div>
      </div>
    </div>
  </div>
);

export default About;
