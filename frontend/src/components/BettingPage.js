import { useState, useEffect, useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "../common/context/auth-context";
import { useHttpClient } from "../common/hooks/http-hook";
import {
  FaPlus,
  FaMinus,
  FaTimes,
  FaArrowLeft,
  FaArrowRight,
  FaCoins,
  FaExclamationCircle,
} from "react-icons/fa";
import { tileColor } from "../common/ui/confetti";

const QUICK_AMOUNTS = [50, 100, 200, 500];

export default function BettingPage() {
  const [bets, setBets] = useState([]);
  const [error, setError] = useState(null);
  const auth = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const { sendRequest } = useHttpClient();

  useEffect(() => {
    const stored = localStorage.getItem("selectedNumbers");
    const selected = stored ? JSON.parse(stored) : [];
    setBets(selected.map((num) => ({ selectedNumber: num, amount: 50 })));
  }, []);

  const handleAmountChange = (index, newAmount) => {
    const updated = [...bets];
    updated[index].amount = Math.max(0, parseInt(newAmount, 10) || 0);
    setBets(updated);
  };

  const handleIncrease = (index) => {
    const updated = [...bets];
    updated[index].amount += 50;
    setBets(updated);
  };

  const handleDecrease = (index) => {
    const updated = [...bets];
    updated[index].amount = Math.max(0, updated[index].amount - 50);
    setBets(updated);
  };

  const setQuickAmount = (index, value) => {
    const updated = [...bets];
    updated[index].amount = value;
    setBets(updated);
  };

  const handleRemove = (numberToRemove) => {
    const updated = bets.filter((bet) => bet.selectedNumber !== numberToRemove);
    setBets(updated);
    localStorage.setItem(
      "selectedNumbers",
      JSON.stringify(updated.map((bet) => bet.selectedNumber))
    );
    if (updated.length === 0) navigate("/");
  };

  const totalAmount = bets.reduce((sum, bet) => sum + bet.amount, 0);
  const potentialWin = totalAmount * 9;

  const handleFinalProceed = async () => {
    setError(null);
    if (bets.length === 0) {
      setError("No bets selected. Please choose at least one number.");
      return;
    }
    if (!auth.token) {
      navigate("/signin", { state: { from: location }, replace: true });
      return;
    }
    if (bets.some((bet) => bet.amount <= 0)) {
      setError("Amount should be more than 0 for all bets.");
      return;
    }

    try {
      const responseData = await sendRequest(
        `${process.env.REACT_APP_BACKEND_URL}/bets`,
        "POST",
        JSON.stringify({
          selectedBet: bets,
          creator: auth.userInfo.userId,
        }),
        {
          "Content-Type": "application/json",
          Authorization: "Bearer " + auth.token,
        }
      );
      if (responseData) {
        navigate("/summary", {
          state: { bets, totalAmount, paymentId: "74ASDF-BHGAI-234W" },
        });
        localStorage.removeItem("selectedNumbers");
      }
    } catch (err) {
      setError("Something went wrong while placing your bet.");
    }
  };

  return (
    <div className="min-h-screen pb-36 sm:pb-12">
      <section className="px-4 pt-6">
        <div className="max-w-3xl mx-auto">
          <div className="relative overflow-hidden rounded-3xl bg-candy-gradient text-white p-5 sm:p-7 shadow-popPink">
            <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-white/15 blur-2xl" />
            <div className="flex items-start justify-between gap-3">
              <div>
                <button
                  onClick={() => navigate("/")}
                  className="inline-flex items-center gap-2 text-white/90 text-sm mb-3 hover:text-white"
                >
                  <FaArrowLeft /> Back to numbers
                </button>
                <h1 className="font-display text-2xl sm:text-3xl font-bold">
                  Place your bets
                </h1>
                <p className="text-white/90 text-sm mt-1">
                  Adjust the stake for each number. Each winner pays{" "}
                  <strong>9x</strong> your bet.
                </p>
              </div>
              <div className="hidden sm:block animate-floaty">
                <FaCoins className="text-brand-yellow text-4xl drop-shadow" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {error && (
        <div className="max-w-3xl mx-auto px-4 mt-4">
          <div className="flex items-center gap-2 bg-red-50 border-2 border-red-200 text-red-700 rounded-2xl px-4 py-3 font-medium animate-bounceIn">
            <FaExclamationCircle /> {error}
          </div>
        </div>
      )}

      <section className="max-w-3xl mx-auto px-4 mt-6 space-y-3 stagger-in">
        {bets.length === 0 && (
          <div className="card-pop text-center">
            <p className="text-gray-500">No bets to show. Go pick some numbers!</p>
          </div>
        )}

        {bets.map((bet, index) => {
          const palette = tileColor(bet.selectedNumber);
          return (
            <div key={bet.selectedNumber} className="card-pop relative overflow-hidden">
              <div className="flex items-center gap-3 sm:gap-4">
                <div
                  className={`flex-shrink-0 w-14 h-14 sm:w-16 sm:h-16 rounded-2xl grid place-items-center font-display font-bold text-2xl shadow-soft ${palette.bg} ${palette.text}`}
                >
                  {bet.selectedNumber.toString().padStart(2, "0")}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="text-[11px] uppercase tracking-wide text-gray-500">
                    Stake
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <button
                      onClick={() => handleDecrease(index)}
                      className="w-10 h-10 rounded-xl bg-pink-50 text-brand-pink grid place-items-center font-bold active:scale-90 hover:bg-pink-100 transition"
                      aria-label="Decrease"
                    >
                      <FaMinus />
                    </button>
                    <div className="relative flex-1">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-purpleDeep font-bold">
                        Rs.
                      </span>
                      <input
                        type="text"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        className="w-full pl-10 pr-3 py-2.5 rounded-xl border-2 border-purple-100 bg-purple-50 text-center font-display font-bold text-lg text-brand-purpleDeep focus:outline-none focus:border-brand-purple focus:bg-white transition"
                        value={bet.amount}
                        onChange={(e) => {
                          let raw = e.target.value.replace(/\D/g, "");
                          let cleaned = raw.replace(/^0+(?=\d)/, "");
                          handleAmountChange(index, cleaned);
                        }}
                        onBlur={(e) => {
                          if (e.target.value === "") handleAmountChange(index, "0");
                        }}
                      />
                    </div>
                    <button
                      onClick={() => handleIncrease(index)}
                      className="w-10 h-10 rounded-xl bg-emerald-50 text-brand-mint grid place-items-center font-bold active:scale-90 hover:bg-emerald-100 transition"
                      aria-label="Increase"
                    >
                      <FaPlus />
                    </button>
                  </div>
                </div>

                <button
                  onClick={() => handleRemove(bet.selectedNumber)}
                  className="w-9 h-9 rounded-full bg-red-50 text-red-500 grid place-items-center hover:bg-red-100 active:scale-90 transition"
                  title="Remove"
                  aria-label="Remove bet"
                >
                  <FaTimes />
                </button>
              </div>

              <div className="mt-3 flex flex-wrap gap-2">
                {QUICK_AMOUNTS.map((amt) => (
                  <button
                    key={amt}
                    onClick={() => setQuickAmount(index, amt)}
                    className={`chip border transition active:scale-95 ${
                      bet.amount === amt
                        ? "bg-brand-gradient text-white border-transparent shadow-popPink"
                        : "bg-white border-purple-200 text-brand-purpleDeep hover:border-brand-purple"
                    }`}
                  >
                    Rs.{amt}
                  </button>
                ))}
                <span className="ml-auto text-xs text-gray-500 self-center">
                  Wins Rs.{bet.amount * 9}
                </span>
              </div>
            </div>
          );
        })}
      </section>

      {bets.length > 0 && (
        <section className="max-w-3xl mx-auto px-4 mt-5">
          <div className="card-pop bg-purple-50 border-purple-200">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-[11px] uppercase tracking-wide text-gray-500">
                  Total stake
                </div>
                <div className="font-display font-bold text-2xl text-brand-purpleDeep">
                  Rs.{totalAmount.toLocaleString("en-IN")}
                </div>
              </div>
              <div className="text-right">
                <div className="text-[11px] uppercase tracking-wide text-gray-500">
                  Possible win
                </div>
                <div className="font-display font-bold text-2xl text-gradient">
                  Rs.{potentialWin.toLocaleString("en-IN")}
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      <div className="fixed bottom-0 inset-x-0 z-30 px-3 pb-3 safe-bottom pointer-events-none sm:px-6">
        <div className="pointer-events-auto max-w-2xl mx-auto bg-white/95 backdrop-blur-md rounded-2xl shadow-soft border border-purple-100 p-3 flex items-center gap-3">
          <button
            onClick={() => navigate("/")}
            className="hidden sm:inline-flex items-center gap-2 px-4 py-3 rounded-full bg-white border-2 border-purple-200 text-brand-purpleDeep font-semibold active:scale-95"
          >
            <FaArrowLeft /> Back
          </button>
          <div className="flex-1 min-w-0">
            <div className="text-[11px] uppercase tracking-wider text-gray-500">
              Total
            </div>
            <div className="font-display font-bold text-brand-purpleDeep text-lg leading-tight">
              Rs.{totalAmount.toLocaleString("en-IN")}
            </div>
          </div>
          <button
            onClick={handleFinalProceed}
            disabled={bets.length === 0}
            className={`inline-flex items-center gap-2 px-5 sm:px-7 py-3 rounded-full font-bold text-white transition active:scale-95 ${
              bets.length === 0
                ? "bg-gray-300 cursor-not-allowed"
                : "bg-mint-gradient shadow-popMint hover:-translate-y-0.5"
            }`}
          >
            Confirm <FaArrowRight />
          </button>
        </div>
      </div>
    </div>
  );
}
