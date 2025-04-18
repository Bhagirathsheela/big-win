// NumberBlocksGrid.js
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function NumberBlocksGrid() {
  const [selectedNumbers, setSelectedNumbers] = useState(() => {
    const stored = localStorage.getItem("selectedNumbers");
    return stored ? JSON.parse(stored) : [];
  });

  const navigate = useNavigate();

  useEffect(() => {
    localStorage.setItem("selectedNumbers", JSON.stringify(selectedNumbers));
  }, [selectedNumbers]);

  const playClickSound = () => {
    const audio = new Audio("https://www.myinstants.com/media/sounds/mouse-click.mp3");
    audio.play();
  };

  const toggleNumber = (num) => {
    playClickSound();
    setSelectedNumbers((prev) =>
      prev.includes(num) ? prev.filter((n) => n !== num) : [...prev, num]
    );
  };

  const resetSelection = () => {
    playClickSound();
    setSelectedNumbers([]);
  };

  const isSelected = (num) => {
    return selectedNumbers.includes(num);
  };

  const proceedToBet = () => {
    navigate("/bet");
  };

  return (
    <div className="min-h-screen p-4 bg-gradient-to-br from-gray-50 to-gray-200 flex flex-col items-center">
      <h1 className="text-3xl font-bold mb-6 text-indigo-800">Select Numbers</h1>

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
          {[...Array(99)].map((_, i) => {
            const num = i + 1;
            const selected = isSelected(num);
            return (
              <div
                key={num}
                onClick={() => toggleNumber(num)}
                className={`w-12 h-12 flex items-center justify-center rounded-xl shadow-md cursor-pointer border font-semibold text-lg transition-all duration-150 transform active:scale-90 ${
                  selected
                    ? "bg-indigo-600 text-white scale-105 shadow-lg"
                    : "bg-white text-gray-700 hover:bg-indigo-200"
                }`}
              >
                {num}
              </div>
            );
          })}
        </div>

        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-3 text-indigo-700">Selected Numbers:</h2>
          <div className="flex flex-wrap gap-2">
            {selectedNumbers.map((num) => (
              <span
                key={num}
                className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-sm shadow-sm"
              >
                {num}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}


