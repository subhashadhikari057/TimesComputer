import React, { useState, useEffect, useRef } from 'react';

// Format number to NPR currency format
const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('en-IN').format(value);
};

// Parse currency string to number
const parseCurrency = (value: string): number => {
  return parseInt(value.replace(/[^0-9]/g, ''));
};

interface PriceFilterSliderProps {
  min: number;
  max: number;
  currency: string;
  initialMin: number;
  initialMax: number;
  onPriceChange: (min: number, max: number) => void;
  onApply: () => void;
}

const PriceFilterSlider: React.FC<PriceFilterSliderProps> = ({
  min: minLimit,
  max: maxLimit,
  currency,
  initialMin,
  initialMax,
  onPriceChange,
  onApply
}) => {
  const [mounted, setMounted] = useState(false);
  const [minValue, setMinValue] = useState(initialMin);
  const [maxValue, setMaxValue] = useState(initialMax);
  const [minInput, setMinInput] = useState(formatCurrency(initialMin));
  const [maxInput, setMaxInput] = useState(formatCurrency(initialMax));
  
  const sliderRef = useRef<HTMLDivElement>(null);
  const isInitialMount = useRef(true);
  
  // Handle component mount
  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);
  
  // Calculate minimum gap based on thumb size
  const getMinimumGap = (): number => {
    if (!sliderRef.current) return 1000; // fallback
    
    const sliderWidth = sliderRef.current.offsetWidth;
    const thumbSize = 20; // 20px diameter
    const valueRange = maxLimit - minLimit;
    
    // Calculate value difference that corresponds to thumb size in pixels
    const minGap = Math.ceil((thumbSize / sliderWidth) * valueRange);
    return Math.max(minGap, 100); // minimum 100 NPR gap
  };
  
  // Update input values when slider values change
  useEffect(() => {
    setMinInput(formatCurrency(minValue));
    setMaxInput(formatCurrency(maxValue));
  }, [minValue, maxValue]);

  // Notify parent of price changes, but skip the initial mount
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    const timeoutId = setTimeout(() => {
      onPriceChange(minValue, maxValue);
    }, 300);
    return () => clearTimeout(timeoutId);
  }, [minValue, maxValue, onPriceChange]);
  
  // Handle slider changes
  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'min' | 'max'): void => {
    const value = parseInt(e.target.value);
    const minGap = getMinimumGap();
    
    if (type === 'min') {
      const newMin = Math.min(value, maxValue - minGap);
      setMinValue(newMin);
    } else {
      const newMax = Math.max(value, minValue + minGap);
      setMaxValue(newMax);
    }
  };
  
  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'min' | 'max'): void => {
    const value = e.target.value;
    
    if (type === 'min') {
      setMinInput(value);
    } else {
      setMaxInput(value);
    }
  };
  
  // Handle input blur
  const handleInputBlur = (type: 'min' | 'max'): void => {
    const minGap = getMinimumGap();
    
    if (type === 'min') {
      const parsed = parseCurrency(minInput);
      const newMin = Math.max(minLimit, Math.min(parsed, maxValue - minGap));
      setMinValue(newMin);
      setMinInput(formatCurrency(newMin));
    } else {
      const parsed = parseCurrency(maxInput);
      const newMax = Math.min(maxLimit, Math.max(parsed, minValue + minGap));
      setMaxValue(newMax);
      setMaxInput(formatCurrency(newMax));
    }
  };
  
  // Calculate slider track fill for the ACTIVE (selected) portion
  const getSliderTrackStyle = () => {
    if (!mounted || !sliderRef.current) {
      return {
        left: '0%',
        width: '0%',
        opacity: 0,
      };
    }
    
    const minPercent = ((minValue - minLimit) / (maxLimit - minLimit)) * 100;
    const maxPercent = ((maxValue - minLimit) / (maxLimit - minLimit)) * 100;
    
    // Ensure percentages are properly bounded between 0 and 100
    const boundedMinPercent = Math.max(0, Math.min(minPercent, 100));
    const boundedMaxPercent = Math.max(0, Math.min(maxPercent, 100));
    const width = boundedMaxPercent - boundedMinPercent;
    
    return {
      left: `${boundedMinPercent}%`,
      width: `${width}%`,
      opacity: 1
    };
  };
  
  const handleApply = () => {
    console.log('Applied price range:', { min: minValue, max: maxValue });
  };
  
  return (
    <div className="w-full max-w-full sm:max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="mb-6"> 
        {/* Input Fields */}
        <div className="flex items-center gap-3 mb-6">
          <div className="flex-1">
            <div className="relative">
              <span className="absolute left-1 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">
                NPR
              </span>
              <input
                type="text"
                value={minInput}
                onChange={(e) => handleInputChange(e, 'min')}
                onBlur={() => handleInputBlur('min')}
                className="w-full pl-10 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-xs"
                placeholder="Min price"
              />
            </div>
          </div>
          
          <span className="text-gray-500 font-medium">to</span>
          
          <div className="flex-1">
            <div className="relative">
              <span className="absolute left-1 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">
                NPR
              </span>
              <input
                type="text"
                value={maxInput}
                onChange={(e) => handleInputChange(e, 'max')}
                onBlur={() => handleInputBlur('max')}
                className="w-full pl-10 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-xs"
                placeholder="Max price"
              />
            </div>
          </div>
        </div>
        
        {/* Dual Range Slider */}
        <div className="relative mb-6">
          <div className="relative h-1" ref={sliderRef}>
            {/* Slider Track */}
            <div className="absolute inset-0 bg-gray-200 rounded-full"></div>
            
            {/* Active Track */}
            <div 
              className="absolute inset-y-0 left-0 right-0 bg-[radial-gradient(circle,_rgba(59,130,246,1)_0%,_rgba(59,130,246,0)_100%)] rounded-full transition-all duration-300 ease-out"
              style={getSliderTrackStyle()}
            />
            
            {/* Min Range Input */}
            <input
              type="range"
              min={minLimit}
              max={maxLimit}
              value={minValue}
              onChange={(e) => handleSliderChange(e, 'min')}
              className={`absolute w-full h-1 bg-transparent appearance-none cursor-pointer slider-thumb slider-thumb-min ${!mounted ? 'opacity-0' : ''}`}
              style={{ zIndex: 1 }}
              disabled={!mounted}
            />
            
            {/* Max Range Input */}
            <input
              type="range"
              min={minLimit}
              max={maxLimit}
              value={maxValue}
              onChange={(e) => handleSliderChange(e, 'max')}
              className={`absolute w-full h-1 bg-transparent appearance-none cursor-pointer slider-thumb slider-thumb-max ${!mounted ? 'opacity-0' : ''}`}
              style={{ zIndex: 2 }}
              disabled={!mounted}
            />
          </div>
          
          {/* Value Labels */}
          <div className="flex justify-between text-xs text-gray-500 mt-2">
          </div>
        </div>
        
        {/* Apply Button */}
        <button
          onClick={handleApply}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Apply
        </button>
      </div>
      
      {/* Custom Slider Styles */}
      <style jsx>{`
        .slider-thumb {
          pointer-events: none;
        }
        
        .slider-thumb::-webkit-slider-thumb {
          appearance: none;
          width: 20px;
          height: 20px;
          background: #2563eb;
          border-radius: 50%;
          cursor: pointer;
          border: 2px solid white;
          box-shadow: 0 2px 4px rgba(0,0,0,0.2);
          pointer-events: auto;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }
        
        .slider-thumb::-moz-range-thumb {
          width: 20px;
          height: 20px;
          background: #2563eb;
          border-radius: 50%;
          cursor: pointer;
          border: 2px solid white;
          box-shadow: 0 2px 4px rgba(0,0,0,0.2);
          pointer-events: auto;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }
        
        .slider-thumb::-webkit-slider-thumb:hover {
          transform: scale(1.1);
          box-shadow: 0 4px 8px rgba(0,0,0,0.3);
        }
        
        .slider-thumb::-moz-range-thumb:hover {
          transform: scale(1.1);
          box-shadow: 0 4px 8px rgba(0,0,0,0.3);
        }
        
        .slider-thumb:focus::-webkit-slider-thumb {
          outline: none;
          box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.3);
        }
        
        .slider-thumb:focus::-moz-range-thumb {
          outline: none;
          box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.3);
        }
        
        .slider-thumb::-webkit-slider-track {
          background: transparent;
        }
        
        .slider-thumb::-moz-range-track {
          background: transparent;
        }
        
        .slider-thumb-min::-webkit-slider-thumb {
          background: #1d4ed8;
        }
        
        .slider-thumb-min::-moz-range-thumb {
          background: #1d4ed8;
        }
        
        .slider-thumb-max::-webkit-slider-thumb {
          background: #2563eb;
        }
        
        .slider-thumb-max::-moz-range-thumb {
          background: #2563eb;
        }
      `}</style>
    </div>
  );
};

export default PriceFilterSlider;