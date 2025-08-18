import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useHttpClient } from "../common/hooks/http-hook";

export default function NumberBlocksGrid() {
  const navigate = useNavigate();
  const { sendRequest } = useHttpClient();
  const [selectedNumbers, setSelectedNumbers] = useState(() => {
    const stored = localStorage.getItem("selectedNumbers");
    return stored ? JSON.parse(stored) : [];
  });
  const [winnerNumber, setWinnerNumber] = useState(null);

  useEffect(() => {
    localStorage.setItem("selectedNumbers", JSON.stringify(selectedNumbers));
  }, [selectedNumbers]);

  useEffect(() => {
    const fetchWinner = async () => {
      try {
        const responseData = await sendRequest(
          `${process.env.REACT_APP_BACKEND_URL}/users/getWinner`
        );
        if (responseData) {
          setWinnerNumber(responseData.winnerNumber);
        }
      } catch (err) {}
    };

    fetchWinner();
  }, [sendRequest]);

  const playClickSound = (type) => {
    const soundPath =
      type === "select"
        ? "/sounds/select-sound.mp3"
        : "/sounds/unselect-sound.mp3";
    const audio = new Audio(`${soundPath}?v=${Date.now()}`);
    try {
      audio.play();
    } catch (err) {
      console.error("Sound playback failed:", err);
    }
  };

  const toggleNumber = (num) => {
    setSelectedNumbers((prev) => {
      const isAlreadySelected = prev.includes(num);
      playClickSound(isAlreadySelected ? "unselect" : "select");
      return isAlreadySelected ? prev.filter((n) => n !== num) : [...prev, num];
    });
  };

  const resetSelection = () => {
    playClickSound("unselect");
    setSelectedNumbers([]);
  };

  const isSelected = (num) => selectedNumbers.includes(num);

  const proceedToBet = () => {
    navigate("/bet");
  };

  return (
    <div className="min-h-screen p-4 bg-gradient-to-br from-gray-50 to-gray-200 flex flex-col items-center">
      <h1 className="text-3xl font-bold mb-4 text-indigo-800">
        Select your Lucky Numbers
      </h1>

      {winnerNumber !== null && (
        <div className="mb-6 text-center px-4 py-3 bg-blue-100 border border-blue-300 text-blue-800 rounded-lg shadow-sm">
          🎉 <strong>Today’s Lucky Number:</strong>{" "}
          <span className="font-bold text-xl">
            {winnerNumber.toString().padStart(2, "0")}
          </span>
        </div>
      )}

      <div className="flex gap-4 mb-4">
        <button
          onClick={resetSelection}
          className="px-5 py-2 bg-red-500 text-white font-medium rounded-full shadow hover:bg-red-600 transition duration-200"
        >
          Clear Selection
        </button>
        <button
          onClick={proceedToBet}
          className="px-5 py-2 bg-green-600 text-white font-medium rounded-full shadow hover:bg-green-700 transition duration-200"
        >
          Proceed
        </button>
      </div>

      <div className="w-full max-w-6xl px-2 sm:px-4 md:px-6">
        <div className="grid grid-cols-5 sm:grid-cols-8 md:grid-cols-10 gap-4 justify-center">
          {[...Array(100)].map((_, i) => {
            const num = i; // now starts at 0, goes up to 99
            const selected = isSelected(num);

            return (
              <div
                key={num}
                onClick={() => toggleNumber(num)}
                className={`w-12 h-12 flex items-center justify-center rounded-xl shadow-md cursor-pointer border font-semibold text-lg transition-all duration-150 transform active:scale-90
                  ${
                    selected
                      ? "bg-indigo-600 text-white scale-105 shadow-lg"
                      : "bg-blue-100 text-gray-800 hover:bg-indigo-200"
                  }`}
              >
                {num.toString().padStart(2, "0")}
              </div>
            );
          })}
        </div>

        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-3 text-indigo-700">
            Selected Numbers:
          </h2>
          <div className="flex flex-wrap gap-2">
            {selectedNumbers.map((num) => (
              <span
                key={num}
                className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-sm shadow-sm"
              >
                {num.toString().padStart(2, "0")}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
