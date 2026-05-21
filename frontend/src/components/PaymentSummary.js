import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  FaCheckCircle,
  FaHome,
  FaReceipt,
  FaUserAlt,
  FaCopy,
} from "react-icons/fa";
import { fireConfetti, tileColor } from "../common/ui/confetti";

export default function PaymentSummary() {
  const location = useLocation();
  const navigate = useNavigate();
  const { bets, totalAmount, paymentId } = location.state || {};

  useEffect(() => {
    if (bets && paymentId) fireConfetti(120, 2800);
  }, [bets, paymentId]);

  if (!bets || !paymentId)
    return (
      <div className="min-h-[60vh] grid place-items-center px-4">
        <div className="card-pop max-w-md text-center">
          <div className="text-5xl mb-2">?</div>
          <h2 className="font-display font-bold text-xl text-brand-purpleDeep">
            No transaction found
          </h2>
          <p className="text-gray-500 mt-1">
            It looks like you got here without placing a bet.
          </p>
          <button
            onClick={() => navigate("/")}
            className="btn-primary mt-4 inline-flex items-center gap-2"
          >
            <FaHome /> Back to home
          </button>
        </div>
      </div>
    );

  const copyId = () => {
    if (navigator.clipboard) navigator.clipboard.writeText(paymentId);
  };

  return (
    <div className="min-h-screen pb-16 pt-6 px-4">
      <div className="max-w-xl mx-auto">
        <div className="relative overflow-hidden rounded-3xl bg-mint-gradient text-white p-6 sm:p-8 shadow-popMint text-center">
          <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-white/15 blur-2xl" />
          <div className="absolute -bottom-12 -left-12 w-44 h-44 rounded-full bg-brand-yellow/30 blur-2xl" />
          <div className="relative">
            <div className="mx-auto w-20 h-20 rounded-full bg-white/15 grid place-items-center backdrop-blur animate-bounceIn">
              <FaCheckCircle className="text-white text-5xl" />
            </div>
            <h1 className="font-display text-3xl sm:text-4xl font-bold mt-4">
              Payment successful!
            </h1>
            <p className="text-white/90 mt-1">
              Your bets are locked in. Best of luck!
            </p>
          </div>
        </div>

        <div className="card-pop mt-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display font-bold text-lg text-brand-purpleDeep flex items-center gap-2">
              <FaReceipt className="text-brand-pink" /> Receipt
            </h2>
            <span className="chip bg-emerald-50 text-emerald-700">Paid</span>
          </div>

          <div className="space-y-3 text-sm">
            <div className="flex items-center justify-between gap-2">
              <span className="text-gray-500">Payment ID</span>
              <button
                onClick={copyId}
                className="font-mono text-brand-purpleDeep inline-flex items-center gap-2 hover:text-brand-pink transition"
                title="Copy"
              >
                {paymentId} <FaCopy className="text-xs" />
              </button>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-500">Total amount</span>
              <span className="font-display font-bold text-brand-purpleDeep text-lg">
                Rs.{totalAmount.toLocaleString("en-IN")}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-500">Possible payout</span>
              <span className="font-display font-bold text-gradient text-lg">
                Rs.{(totalAmount * 9).toLocaleString("en-IN")}
              </span>
            </div>
          </div>

          <div className="my-5 border-t border-dashed border-purple-200" />

          <h3 className="font-display font-bold text-sm text-gray-500 uppercase tracking-wide mb-3">
            Your bets
          </h3>
          <ul className="space-y-2 stagger-in">
            {bets.map((bet) => {
              const palette = tileColor(bet.selectedNumber);
              return (
                <li
                  key={bet.selectedNumber}
                  className="flex items-center gap-3 p-3 rounded-2xl bg-purple-50 border border-purple-100"
                >
                  <div
                    className={`w-11 h-11 rounded-xl grid place-items-center font-display font-bold ${palette.bg} ${palette.text}`}
                  >
                    {bet.selectedNumber.toString().padStart(2, "0")}
                  </div>
                  <div className="flex-1">
                    <div className="text-xs text-gray-500">Stake</div>
                    <div className="font-semibold text-brand-purpleDeep">
                      Rs.{bet.amount.toLocaleString("en-IN")}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-gray-500">If you win</div>
                    <div className="font-semibold text-emerald-700">
                      Rs.{(bet.amount * 9).toLocaleString("en-IN")}
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>

        <div className="grid grid-cols-2 gap-3 mt-5">
          <button
            onClick={() => navigate("/profile")}
            className="btn-secondary inline-flex items-center justify-center gap-2"
          >
            <FaUserAlt /> My bets
          </button>
          <button
            onClick={() => navigate("/")}
            className="btn-primary inline-flex items-center justify-center gap-2"
          >
            <FaHome /> Home
          </button>
        </div>
      </div>
    </div>
  );
}
