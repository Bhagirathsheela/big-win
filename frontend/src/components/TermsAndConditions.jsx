import React from "react";
import {
  FaGavel, FaTrophy, FaClock, FaCalendarCheck,
  FaShieldAlt, FaUserCheck, FaExclamationTriangle, FaDice,
} from "react-icons/fa";

const sections = [
  { icon: <FaDice />, tone: "bg-purple-100 text-brand-purpleDeep", title: "1. Game rules", points: [
    "You can place a bet on any number available on the platform each day.",
    "Each day, one number will be randomly selected as the lucky number.",
    "The winner is the user who bet on the selected lucky number.",
  ]},
  { icon: <FaTrophy />, tone: "bg-amber-100 text-amber-700", title: "2. Winning & payout", points: [
    "Winners receive a payout of 9x their bet amount.",
    "For example, Rs.200 on a winning number pays Rs.1800.",
    "Payouts are credited per our standard withdrawal process.",
  ]},
  { icon: <FaClock />, tone: "bg-pink-100 text-pink-700", title: "3. Bet timing", points: [
    "Bets must be placed before the daily cut-off time.",
    "Once placed, bets cannot be cancelled or modified.",
  ]},
  { icon: <FaCalendarCheck />, tone: "bg-emerald-100 text-emerald-700", title: "4. Result declaration", points: [
    "The lucky number is declared daily at 6:00 AM server time.",
    "Winners can view results on the platform after the declaration.",
  ]},
  { icon: <FaShieldAlt />, tone: "bg-sky-100 text-sky-700", title: "5. Fairness & randomness", points: [
    "The winning number is selected using a secure random algorithm.",
    "We ensure fair play and transparency in every draw.",
  ]},
  { icon: <FaUserCheck />, tone: "bg-orange-100 text-orange-700", title: "6. Eligibility", points: [
    "Participants must be 18 years or older.",
    "You confirm that betting is legal in your jurisdiction.",
  ]},
  { icon: <FaExclamationTriangle />, tone: "bg-red-100 text-red-700", title: "7. Disclaimer", points: [
    "We are not responsible for losses due to user error or external failures.",
    "We may modify rules and payout structures with prior notice.",
  ]},
];

const TermsAndConditions = () => (
  <div className="min-h-screen px-4 py-8 sm:py-12">
    <div className="max-w-3xl mx-auto">
      <div className="relative overflow-hidden rounded-3xl bg-brand-gradient text-white p-6 sm:p-8 shadow-popPink">
        <div className="absolute -top-12 -right-12 w-44 h-44 rounded-full bg-white/15 blur-2xl" />
        <div className="relative flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-white/15 grid place-items-center backdrop-blur">
            <FaGavel className="text-brand-yellow text-xl" />
          </div>
          <div>
            <h1 className="font-display text-2xl sm:text-3xl font-bold">Terms & conditions</h1>
            <p className="text-white/90 mt-1 text-sm">
              By participating in our daily number game, you agree to the following terms.
            </p>
          </div>
        </div>
      </div>

      <div className="mt-6 space-y-3 stagger-in">
        {sections.map((s) => (
          <div key={s.title} className="card-pop">
            <div className="flex items-center gap-3 mb-3">
              <div className={`w-10 h-10 rounded-xl grid place-items-center ${s.tone}`}>{s.icon}</div>
              <h2 className="font-display font-bold text-brand-purpleDeep text-lg">{s.title}</h2>
            </div>
            <ul className="space-y-2">
              {s.points.map((p, i) => (
                <li key={i} className="flex gap-2 text-sm sm:text-base text-gray-700">
                  <span className="text-brand-pink mt-1">*</span>
                  <span>{p}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <p className="text-center text-xs text-gray-500 mt-6 pb-2">
        By continuing to use our platform, you accept these terms. Please gamble responsibly.
      </p>
    </div>
  </div>
);

export default TermsAndConditions;
