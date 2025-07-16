import React from "react";
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
  sm: "px-2 py-1.5 text-sm",
  md: "px-3 py-2.5 text-sm",
  lg: "px-4 py-3 text-base",
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
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedValue = e.target.value;
    
    if (selectedValue === "") {
      onChange(null);
      return;
    }
    
    // Find the original option to get the correct type
    const selectedOption = options.find(option => String(option.value) === selectedValue);
    
    if (selectedOption) {
      onChange(selectedOption.value); // This preserves the original type (string or number)
    } else {
      onChange(null);
    }
  };

  const baseClasses = `
    w-full pr-10 border rounded-lg bg-white text-gray-900 
    focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 
    hover:border-gray-300 transition-all duration-200 
    disabled:opacity-50 disabled:cursor-not-allowed 
    appearance-none
    ${error ? "border-red-300 focus:border-red-500 focus:ring-red-500" : "border-gray-200"}
    ${sizeClasses[size]}
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
      
      <div className="relative">
        <select
          id={id}
          name={name}
          value={value || ""}
          onChange={handleChange}
          disabled={disabled}
          required={required}
          className={baseClasses}
        >
          <option value="">{placeholder}</option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        
        {/* Custom arrow icon */}
        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
          <ChevronDown 
            size={size === "lg" ? 20 : size === "sm" ? 14 : 16} 
            className={`text-gray-400 transition-colors duration-200 ${
              disabled ? 'opacity-50' : ''
            }`} 
          />
        </div>
      </div>
      
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
};

export default Dropdown;