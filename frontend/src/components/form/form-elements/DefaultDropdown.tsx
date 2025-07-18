import React, { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";

interface DropdownOption {
  value: string | number;
  label: string;
}

interface DropdownProps {
  id?: string;
  name?: string;
  value: string | number | null;
  onChange: (value: string | number | null) => void;
  options: DropdownOption[];
  placeholder?: string;
  label?: string;
  disabled?: boolean;
  required?: boolean;
  error?: string;
  className?: string;
  size?: "sm" | "md" | "lg";
}

const sizeClasses = {
  sm: "px-3 py-1.5 text-sm pr-8",
  md: "px-3 py-2.5 text-sm pr-10",
  lg: "px-4 py-3 text-base pr-12",
};

const optionSizeClasses = {
  sm: "px-3 py-1.5 text-sm",
  md: "px-3 py-2.5 text-sm",
  lg: "px-4 py-3 text-base",
};

const iconSizes = {
  sm: 14,
  md: 16,
  lg: 18,
};

const iconPositions = {
  sm: "right-2",
  md: "right-3",
  lg: "right-3",
};

const Dropdown: React.FC<DropdownProps> = ({
  id,
  name,
  value,
  onChange,
  options,
  placeholder = "Select an option",
  label,
  disabled = false,
  required = false,
  error,
  className = "",
  size = "md",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find(option => option.value === value);

  const handleOptionClick = (optionValue: string | number) => {
    onChange(optionValue);
    setIsOpen(false);
  };

  const handleToggle = () => {
    if (!disabled) {
      setIsOpen(!isOpen);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const buttonClasses = `
    w-full border rounded-lg bg-white text-gray-900 
    focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:ring-opacity-20
    hover:border-gray-300 transition-all duration-200 
    disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-50
    cursor-pointer text-left
    ${error ? "border-red-300 focus:border-red-500 focus:ring-red-500 focus:ring-opacity-20" : "border-gray-200"}
    ${sizeClasses[size]}
  `;

  const dropdownClasses = `
    absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg
    max-h-60 overflow-auto
  `;

  return (
    <div className={className}>
      {label && (
        <label
          htmlFor={id}
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      <div className="relative" ref={dropdownRef}>
        <button
          type="button"
          id={id}
          onClick={handleToggle}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          className={buttonClasses}
          aria-haspopup="listbox"
          aria-expanded={isOpen}
        >
          <span className={selectedOption ? "text-gray-900" : "text-gray-500"}>
            {selectedOption ? selectedOption.label : placeholder}
          </span>
        </button>
        
        {/* Custom arrow icon with animation */}
        <div className={`absolute inset-y-0 ${iconPositions[size]} flex items-center pointer-events-none`}>
          <ChevronDown 
            size={iconSizes[size]} 
            className={`text-gray-400 transition-all duration-200 ${
              disabled ? 'opacity-50' : ''
            } ${isOpen ? 'rotate-180' : ''}`} 
          />
        </div>

        {/* Custom dropdown menu */}
        {isOpen && (
          <div className={dropdownClasses}>
            {options.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => handleOptionClick(option.value)}
                className={`
                  w-full text-left transition-colors duration-150
                  hover:bg-blue-50 hover:text-blue-700
                  focus:bg-blue-50 focus:text-blue-700 focus:outline-none
                  ${value === option.value ? 'bg-blue-100 text-blue-700' : 'text-gray-900'}
                  ${optionSizeClasses[size]}
                  first:rounded-t-lg last:rounded-b-lg
                `}
                role="option"
                aria-selected={value === option.value}
              >
                {option.label}
              </button>
            ))}
          </div>
        )}
      </div>
      
      {error && (
        <p className="mt-1 text-sm text-red-600" role="alert">
          {error}
        </p>
      )}
    </div>
  );
};

export default Dropdown;