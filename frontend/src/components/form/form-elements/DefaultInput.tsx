import React from "react";

interface DefaultInputProps {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string;
  placeholder?: string;
  required?: boolean;
  className?: string;
  helpText?: string;
  error?: string;
  disabled?: boolean;
}

const DefaultInput: React.FC<DefaultInputProps> = ({
  label,
  name,
  value,
  onChange,
  type = "text",
  placeholder,
  required = false,
  className = "",
  helpText,
  error,
  disabled = false,
}) => {
  return (
    <div className={className}>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        disabled={disabled}
        className={`w-full px-3 py-2.5 border rounded-lg bg-white text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-1 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${
          error 
            ? "border-red-300 focus:border-red-500 focus:ring-red-500" 
            : "border-gray-200 focus:border-blue-500 focus:ring-blue-500 hover:border-gray-300"
        }`}
        placeholder={placeholder}
        required={required}
      />
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
      {helpText && !error && (
        <p className="mt-1 text-sm text-gray-500">{helpText}</p>
      )}
    </div>
  );
};

export default DefaultInput;