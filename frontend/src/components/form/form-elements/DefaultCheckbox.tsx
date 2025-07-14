import React from "react";

interface DefaultCheckboxProps {
  label: string;
  name: string;
  checked: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
  helpText?: string;
}

const DefaultCheckbox: React.FC<DefaultCheckboxProps> = ({
  label,
  name,
  checked,
  onChange,
  className = "",
  helpText,
}) => {
  return (
    <div className={className}>
      <label className="flex items-center space-x-2">
        <input
          type="checkbox"
          name={name}
          checked={checked}
          onChange={onChange}
          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
        />
        <span className="text-sm font-medium text-gray-700">{label}</span>
      </label>
      {helpText && <p className="mt-1 text-sm text-gray-500">{helpText}</p>}
    </div>
  );
};

export default DefaultCheckbox;
