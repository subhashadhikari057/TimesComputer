'use client';

import React, { useState } from 'react';

const PriceFilter: React.FC = () => {
  const minLimit = 0;
  const maxLimit = 900000;

  const [minPrice, setMinPrice] = useState(80000);
  const [maxPrice, setMaxPrice] = useState(90000);

  const handleMinInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^\d]/g, '');
    const numValue = Number(value);
    if (!isNaN(numValue) && numValue >= minLimit && numValue <= maxPrice) {
      setMinPrice(numValue);
    }
  };

  const handleMaxInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^\d]/g, '');
    const numValue = Number(value);
    if (!isNaN(numValue) && numValue <= maxLimit && numValue >= minPrice) {
      setMaxPrice(numValue);
    }
  };

  const minPercent = ((minPrice - minLimit) / (maxLimit - minLimit)) * 100;
  const maxPercent = ((maxPrice - minLimit) / (maxLimit - minLimit)) * 100;

  return (
    <div className="mb-2 w-full max-w-full">
      <h3 className="text-xl font-semibold mb-4">Price</h3>

      {/* Input fields with NPR label */}
      <div className="flex items-center space-x-2">
        {/* Min input */}
        <div className="relative w-full">
          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">NPR</span>
          <input
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            value={minPrice}
            onChange={handleMinInputChange}
            className="w-full pl-[48px] border px-3 py-2 rounded-lg appearance-none"
            placeholder="Min Price"
          />
        </div>

        <span className="text-base text-black">to</span>

        {/* Max input */}
        <div className="relative w-full">
          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">NPR</span>
          <input
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            value={maxPrice}
            onChange={handleMaxInputChange}
            className="w-full pl-[48px] border px-3 py-2 rounded-lg appearance-none"
            placeholder="Max Price"
          />
        </div>
      </div>

      {/* Dual Range Slider */}
      <div className="relative my-4">
        <div className="relative h-3">
          {/* Background track */}
          <div className="absolute w-full h-3 bg-gray-300 rounded-full"></div>

          {/* Active range highlight */}
          <div
            className="absolute h-2.5 bg-primary rounded-full"
            style={{
              left: `${minPercent}%`,
              width: `${maxPercent - minPercent}%`,
            }}
          ></div>
        </div>

        {/* Min slider thumb */}
        <div
          className="absolute w-6 h-6 bg-white border-4 border-primary rounded-full shadow-lg cursor-pointer transform -translate-y-2.5 -translate-x-4 z-30 hover:scale-110 transition-transform"
          style={{ left: `${minPercent}%` }}
          onMouseDown={(e) => {
            e.preventDefault();
            const startX = e.clientX;
            const startValue = minPrice;
            const sliderRect = e.currentTarget.parentElement!.getBoundingClientRect();
            const sliderWidth = sliderRect.width;

            const handleMouseMove = (e: MouseEvent) => {
              const deltaX = e.clientX - startX;
              const deltaPercent = (deltaX / sliderWidth) * 100;
              const deltaValue = (deltaPercent / 100) * (maxLimit - minLimit);
              const newValue = Math.max(minLimit, Math.min(maxPrice, startValue + deltaValue));
              setMinPrice(Math.round(newValue));
            };

            const handleMouseUp = () => {
              document.removeEventListener('mousemove', handleMouseMove);
              document.removeEventListener('mouseup', handleMouseUp);
            };

            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', handleMouseUp);
          }}
        ></div>

        {/* Max slider thumb */}
        <div
          className="absolute w-6 h-6 bg-white border-4 border-primary rounded-full shadow-lg cursor-pointer transform -translate-y-2.5 -translate-x-4 z-30 hover:scale-110 transition-transform"
          style={{ left: `${maxPercent}%` }}
          onMouseDown={(e) => {
            e.preventDefault();
            const startX = e.clientX;
            const startValue = maxPrice;
            const sliderRect = e.currentTarget.parentElement!.getBoundingClientRect();
            const sliderWidth = sliderRect.width;

            const handleMouseMove = (e: MouseEvent) => {
              const deltaX = e.clientX - startX;
              const deltaPercent = (deltaX / sliderWidth) * 100;
              const deltaValue = (deltaPercent / 100) * (maxLimit - minLimit);
              const newValue = Math.max(minPrice, Math.min(maxLimit, startValue + deltaValue));
              setMaxPrice(Math.round(newValue));
            };

            const handleMouseUp = () => {
              document.removeEventListener('mousemove', handleMouseMove);
              document.removeEventListener('mouseup', handleMouseUp);
            };

            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', handleMouseUp);
          }}
        ></div>
      </div>

      {/* Apply button */}
      <div className="flex justify-end -mt-2">
        <button className="bg-primary w-[90px] h-[47px] mb-6 text-white px-4 py-2 rounded-lg">
          Apply
        </button>
      </div>
    </div>
  );
};

export default PriceFilter;
