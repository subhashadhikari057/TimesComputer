import React from "react";

interface DefaultNumberInputProps {
  label: string;
  name: string;
  value: number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  required?: boolean;
  className?: string;
  helpText?: string;
  min?: number;
  max?: number;
  step?: number;
}

const DefaultNumberInput: React.FC<DefaultNumberInputProps> = ({
  label,
  name,
  value,
  onChange,
  placeholder,
  required = false,
  className = "",
  helpText,
  min,
  max,
  step,
}) => {
  return (
    <div className={className}>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <input
        type="number"
        name={name}
        value={value}
        onChange={onChange}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        placeholder={placeholder}
        required={required}
        min={min}
        max={max}
        step={step}
      />
      {helpText && <p className="mt-1 text-sm text-gray-500">{helpText}</p>}
    </div>
  );
};

export default DefaultNumberInput;
