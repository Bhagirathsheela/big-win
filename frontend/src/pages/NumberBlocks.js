import React, { useState } from "react";

const NumberBlocks = () => {
  const [clickedBlock, setClickedBlock] = useState(null);

  const handleClick = (number) => {
    setClickedBlock(number);
    setTimeout(() => setClickedBlock(null), 300); // Reset effect after 300ms
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-100">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">
        Interactive Number Blocks
      </h1>
      <div className="w-full px-4">
        {/* Adjust grid columns for responsiveness */}
        <div className="grid grid-cols-8 sm:grid-cols-8 md:grid-cols-10 lg:grid-cols-12 xl:grid-cols-14 gap-3">
          {Array.from({ length: 99 }, (_, i) => i + 1).map((number) => (
            <button
              key={number}
              onClick={() => handleClick(number)}
              className={`flex items-center justify-center 
                bg-blue-500 text-white rounded-lg shadow-lg 
                transition-transform transform hover:scale-110 ${
                  clickedBlock === number ? "bg-green-500 scale-125" : ""
                }
                w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 lg:w-14 lg:h-14`}
            >
              {number}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default NumberBlocks;
