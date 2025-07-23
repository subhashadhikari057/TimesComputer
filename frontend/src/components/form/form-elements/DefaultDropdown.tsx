import React, { useState, useRef, useEffect } from "react";
import { ChevronDown, X } from "lucide-react";

interface DropdownOption {
  value: string | number;
  label: string;
  hexCode?: string; 
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

interface MultiSelectDropdownProps {
  id?: string;
  name?: string;
  value: (string | number)[];
  onChange: (values: (string | number)[]) => void;
  options: DropdownOption[];
  placeholder?: string;
  label?: string;
  disabled?: boolean;
  required?: boolean;
  error?: string;
  className?: string;
  size?: "sm" | "md" | "lg";
  renderOption?: (option: DropdownOption, isSelected: boolean) => React.ReactNode;
  renderSelectedTag?: (option: DropdownOption) => React.ReactNode;
}

const sizeClasses = {
  sm: "px-3 py-1.5 text-sm pr-8",
  md: "px-3 py-2.5 text-sm pr-10",
  lg: "px-4 py-3 text-base pr-12",
};

const multiSelectSizeClasses = {
  sm: "px-3 py-1.5 text-sm pr-8 min-h-[32px]",
  md: "px-3 py-2.5 text-sm pr-10 min-h-[42px]",
  lg: "px-4 py-3 text-base pr-12 min-h-[48px]",
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

// ORIGINAL DROPDOWN COMPONENT - UNCHANGED
const Dropdown: React.FC<DropdownProps> = ({
  id,
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

// NEW MULTI-SELECT DROPDOWN COMPONENT
const MultiSelectDropdown: React.FC<MultiSelectDropdownProps> = ({
  id,
  value,
  onChange,
  options,
  placeholder = "Select options",
  label,
  disabled = false,
  required = false,
  error,
  className = "",
  size = "md",
  renderOption,
  renderSelectedTag,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedOptions = options.filter(option => value.includes(option.value));

  const handleOptionClick = (optionValue: string | number) => {
    if (value.includes(optionValue)) {
      onChange(value.filter(val => val !== optionValue));
    } else {
      onChange([...value, optionValue]);
    }
  };

  const handleRemoveTag = (valueToRemove: string | number, event: React.MouseEvent) => {
    event.stopPropagation();
    onChange(value.filter(val => val !== valueToRemove));
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
    ${multiSelectSizeClasses[size]}
  `;

  const dropdownClasses = `
    absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg
    max-h-60 overflow-auto
  `;

  // Default tag renderer
  const defaultRenderSelectedTag = (option: DropdownOption) => (
    <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-blue-100 text-blue-800 border border-blue-200">
      {option.label}
      <button
        type="button"
        onClick={(e) => handleRemoveTag(option.value, e)}
        className="ml-1 inline-flex items-center justify-center w-4 h-4 rounded-full hover:bg-blue-200 transition-colors"
      >
        <X size={10} />
      </button>
    </span>
  );

  // Default option renderer
  const defaultRenderOption = (option: DropdownOption, isSelected: boolean) => (
    <div className="flex items-center justify-between">
      <span>{option.label}</span>
      {isSelected && (
        <div className="w-4 h-4 bg-blue-600 rounded-sm flex items-center justify-center">
          <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
        </div>
      )}
    </div>
  );

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
        <div
          onClick={handleToggle}
          onKeyDown={handleKeyDown}
          className={buttonClasses}
          role="button"
          tabIndex={disabled ? -1 : 0}
          aria-haspopup="listbox"
          aria-expanded={isOpen}
        >
          <div className="flex flex-wrap gap-1 items-center">
            {selectedOptions.length > 0 ? (
              selectedOptions.map((option) => (
                <span key={option.value}>
                  {renderSelectedTag ? renderSelectedTag(option) : defaultRenderSelectedTag(option)}
                </span>
              ))
            ) : (
              <span className="text-gray-500">{placeholder}</span>
            )}
          </div>
        </div>
        
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
            {options.length === 0 ? (
              <div className="px-3 py-4 text-center text-gray-500 text-sm">
                No options available
              </div>
            ) : (
              options.map((option) => {
                const isSelected = value.includes(option.value);
                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => handleOptionClick(option.value)}
                    className={`
                      w-full text-left transition-colors duration-150
                      hover:bg-blue-50 hover:text-blue-700
                      focus:bg-blue-50 focus:text-blue-700 focus:outline-none
                      ${isSelected ? 'bg-blue-100 text-blue-700' : 'text-gray-900'}
                      ${optionSizeClasses[size]}
                      first:rounded-t-lg last:rounded-b-lg
                    `}
                    role="option"
                    aria-selected={isSelected}
                  >
                    {renderOption ? renderOption(option, isSelected) : defaultRenderOption(option, isSelected)}
                  </button>
                );
              })
            )}
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
export { MultiSelectDropdown };