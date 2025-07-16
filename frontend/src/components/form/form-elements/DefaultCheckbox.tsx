import React from "react";

interface DefaultCheckboxProps {
  label: string;
  name: string;
  checked: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
  helpText?: string;
  error?: string;
  disabled?: boolean;
  required?: boolean;
}

const DefaultCheckbox: React.FC<DefaultCheckboxProps> = ({
  label,
  name,
  checked,
  onChange,
  className = "",
  helpText,
  error,
  disabled = false,
  required = false,
}) => {
  return (
    <div className={className}>
      <label className={`flex items-start space-x-3 cursor-pointer ${disabled ? 'cursor-not-allowed opacity-50' : ''}`}>
        <input
          type="checkbox"
          name={name}
          checked={checked}
          onChange={onChange}
          disabled={disabled}
          required={required}
          className={`mt-0.5 w-4 h-4 rounded border focus:ring-2 focus:ring-offset-0 transition-all duration-200 disabled:cursor-not-allowed ${
            error
              ? "border-red-300 text-red-600 focus:ring-red-500"
              : "border-gray-300 text-blue-600 focus:ring-blue-500 hover:border-gray-400"
          }`}
        />
        <div className="flex-1">
          <span className="block text-sm font-medium text-gray-700">
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </span>
          {helpText && !error && (
            <p className="mt-1 text-sm text-gray-500">{helpText}</p>
          )}
          {error && (
            <p className="mt-1 text-sm text-red-600">{error}</p>
          )}
        </div>
      </label>
    </div>
  );
};

export default DefaultCheckbox;