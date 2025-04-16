import React, { useState, useEffect, useRef } from 'react';

const WinnerSlider = ({ winners }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const sliderRef = useRef(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % winners.length);
    }, 2000);

    return () => clearInterval(interval);
  }, [winners]);

  useEffect(() => {
    if (sliderRef.current) {
      sliderRef.current.style.transition = 'transform 0.5s ease-in-out';
      sliderRef.current.style.transform = `translateY(-${currentIndex * 100}%)`;
    }
  }, [currentIndex]);

  if (!winners || winners.length === 0) {
    return <div className="text-center">No winners to display.</div>;
  }

  return (
    <div className="overflow-hidden h-16 w-52 relative"> {/* Increase height to h-16 */}
  <div className="flex flex-col absolute top-0 left-0 w-full transition-transform duration-500 ease-in-out" ref={sliderRef}>
    {winners.map((winner, index) => (
      <div key={index} className="flex items-center justify-center h-16"> {/* Increase height to h-16 */}
        {winner.name}
      </div>
    ))}
  </div>
</div>
  );
};

export default WinnerSlider;