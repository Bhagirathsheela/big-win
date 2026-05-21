import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useHttpClient } from "../common/hooks/http-hook";
import {
  FaTrophy, FaTrash, FaArrowRight, FaStar, FaMagic, FaDice,
} from "react-icons/fa";
import { fireConfetti, tileColor } from "../common/ui/confetti";
import { playSelectSound, playUnselectSound, playWinSound } from "../common/ui/sounds";

export default function NumberBlocksGrid() {
  const navigate = useNavigate();
  const { sendRequest } = useHttpClient();
  const [selectedNumbers, setSelectedNumbers] = useState(() => {
    const stored = localStorage.getItem("selectedNumbers");
    return stored ? JSON.parse(stored) : [];
  });
  const [winnerNumber, setWinnerNumber] = useState(null);
  const [justSelected, setJustSelected] = useState(null);

  useEffect(() => {
    localStorage.setItem("selectedNumbers", JSON.stringify(selectedNumbers));
  }, [selectedNumbers]);

  useEffect(() => {
    const fetchWinner = async () => {
      try {
        const responseData = await sendRequest(
          `${process.env.REACT_APP_BACKEND_URL}/users/getWinner`
        );
        if (responseData) setWinnerNumber(responseData.winnerNumber);
      } catch (err) {}
    };
    fetchWinner();
  }, [sendRequest]);

  const toggleNumber = (num) => {
    setSelectedNumbers((prev) => {
      const isAlreadySelected = prev.includes(num);
      if (isAlreadySelected) {
        playUnselectSound();
      } else {
        playSelectSound();
        setJustSelected(num);
        setTimeout(() => setJustSelected(null), 400);
        if ((prev.length + 1) % 5 === 0) fireConfetti(30, 1500);
      }
      return isAlreadySelected ? prev.filter((n) => n !== num) : [...prev, num];
    });
  };

  const resetSelection = () => {
    playUnselectSound();
    setSelectedNumbers([]);
  };

  const luckyDip = () => {
    const picks = new Set();
    while (picks.size < 5) picks.add(Math.floor(Math.random() * 100));
    setSelectedNumbers(Array.from(picks));
    playWinSound();
    fireConfetti(50, 1800);
  };

  const isSelected = (num) => selectedNumbers.includes(num);

  const proceedToBet = () => {
    if (selectedNumbers.length === 0) return;
    navigate("/bet");
  };

  const tiles = useMemo(() => [...Array(100)].map((_, i) => i), []);

  return (
    <div className="min-h-screen pb-32 sm:pb-10">
      <section className="relative px-4 pt-6 sm:pt-10">
        <div className="max-w-6xl mx-auto">
          <div className="relative overflow-hidden rounded-3xl bg-brand-gradient text-white p-6 sm:p-10 shadow-popPink">
            <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-white/15 blur-2xl" />
            <div className="absolute -bottom-12 -left-12 w-48 h-48 rounded-full bg-brand-yellow/30 blur-2xl" />
            <div className="absolute top-4 right-6 animate-floaty">
              <FaStar className="text-brand-yellow text-xl drop-shadow" />
            </div>
            <div className="absolute bottom-8 right-16 animate-floaty" style={{ animationDelay: "0.7s" }}>
              <FaStar className="text-white/80 text-sm" />
            </div>

            <div className="relative">
              <span className="chip bg-white/20 backdrop-blur text-white mb-3">
                <FaMagic className="mr-1.5 text-brand-yellow" /> Today's draw is live
              </span>
              <h1 className="font-display text-3xl sm:text-5xl font-bold leading-tight">
                Pick your <span className="text-brand-yellow">lucky</span> numbers
              </h1>
              <p className="mt-2 text-white/90 text-sm sm:text-base max-w-md">
                Tap any tile to add it to your bet. Win up to <strong>9x</strong> your stake!
              </p>

              {winnerNumber !== null && (
                <div className="mt-5 inline-flex items-center gap-3 bg-white text-brand-purpleDeep rounded-2xl pl-3 pr-4 py-2 shadow-soft animate-pulseRing">
                  <div className="w-10 h-10 rounded-xl bg-sunshine-gradient text-white grid place-items-center font-bold">
                    <FaTrophy />
                  </div>
                  <div>
                    <div className="text-[10px] uppercase tracking-wide text-gray-500">
                      Lucky number today
                    </div>
                    <div className="font-display font-bold text-xl leading-none">
                      {winnerNumber.toString().padStart(2, "0")}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 mt-6 sm:mt-8">
        <div className="flex flex-wrap items-center gap-3">
          <div className="chip bg-white border border-purple-100 text-brand-purpleDeep">
            <span className="w-2 h-2 rounded-full bg-brand-mint mr-2 animate-pulse" />
            {selectedNumbers.length} selected
          </div>
          <button onClick={luckyDip} className="chip bg-sunshine-gradient text-white shadow-popOrange active:scale-95 px-4 py-2">
            <FaDice className="mr-2" /> Lucky dip
          </button>
          {selectedNumbers.length > 0 && (
            <button onClick={resetSelection} className="chip bg-white border border-pink-200 text-brand-pink active:scale-95 px-4 py-2">
              <FaTrash className="mr-2" /> Clear all
            </button>
          )}
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 mt-5">
        <div className="grid grid-cols-5 sm:grid-cols-8 md:grid-cols-10 gap-2.5 sm:gap-3">
          {tiles.map((num) => {
            const palette = tileColor(num);
            const selected = isSelected(num);
            const isWinner = winnerNumber === num;
            const popping = justSelected === num;
            return (
              <button
                key={num}
                onClick={() => toggleNumber(num)}
                className={`relative aspect-square rounded-2xl font-display font-bold text-lg sm:text-xl border-2 transition-all duration-150 active:scale-90 ${
                  selected
                    ? "bg-brand-gradient text-white border-transparent shadow-popPink scale-105"
                    : `${palette.bg} ${palette.text} border-white/60 hover:scale-105 hover:shadow-soft`
                } ${popping ? "animate-pop" : ""} ${
                  isWinner && !selected ? "ring-4 ring-brand-yellow/80" : ""
                }`}
              >
                {num.toString().padStart(2, "0")}
                {isWinner && (
                  <span className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-brand-yellow text-white text-xs grid place-items-center shadow">
                    <FaStar />
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </section>

      {selectedNumbers.length > 0 && (
        <section className="max-w-6xl mx-auto px-4 mt-8">
          <div className="card-pop">
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-display font-bold text-lg text-brand-purpleDeep">Your picks</h2>
              <span className="chip bg-purple-100 text-brand-purpleDeep">
                {selectedNumbers.length} number{selectedNumbers.length > 1 ? "s" : ""}
              </span>
            </div>
            <div className="flex flex-wrap gap-2 stagger-in">
              {selectedNumbers.map((num) => (
                <span
                  key={num}
                  className="inline-flex items-center justify-center min-w-[44px] h-10 px-3 rounded-full bg-brand-gradient text-white font-bold shadow-popPink animate-bounceIn"
                >
                  {num.toString().padStart(2, "0")}
                </span>
              ))}
            </div>
          </div>
        </section>
      )}

      <div className="fixed bottom-0 inset-x-0 z-30 px-3 pb-3 safe-bottom pointer-events-none sm:px-6">
        <div className="pointer-events-auto max-w-2xl mx-auto bg-white/95 backdrop-blur-md rounded-2xl shadow-soft border border-purple-100 p-3 flex items-center gap-3">
          <div className="flex-1 min-w-0">
            <div className="text-[11px] uppercase tracking-wider text-gray-500">Selected</div>
            <div className="font-display font-bold text-brand-purpleDeep text-lg leading-tight truncate">
              {selectedNumbers.length === 0
                ? "Pick at least one number"
                : `${selectedNumbers.length} number${selectedNumbers.length > 1 ? "s" : ""} ready`}
            </div>
          </div>
          <button
            onClick={proceedToBet}
            disabled={selectedNumbers.length === 0}
            className={`inline-flex items-center gap-2 px-5 sm:px-6 py-3 rounded-full font-bold text-white transition active:scale-95 ${
              selectedNumbers.length === 0
                ? "bg-gray-300 cursor-not-allowed"
                : "bg-brand-gradient shadow-popPink hover:-translate-y-0.5"
            }`}
          >
            Proceed <FaArrowRight />
          </button>
        </div>
      </div>
    </div>
  );
}
