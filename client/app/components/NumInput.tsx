import React from "react";
import type { IconType } from "react-icons";
import { BiChevronDown, BiChevronUp } from "react-icons/bi";

interface NumInputProps {
  label?: string;
  name?: string;
  value: number | string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  placeholder?: string;
  required?: boolean;
  min?: string | number;
  icon?: IconType;
  className?: string;
}

const NumInput: React.FC<NumInputProps> = ({
  label,
  name,
  value,
  onChange,
  onKeyDown,
  placeholder,
  required = false,
  min = "0",
  icon: Icon,
  className = "",
}) => {
  const handleIncrement = () => {
    const currentValue = parseFloat(value as string) || 0;
    const newValue = currentValue + 1;
    const event = {
      target: { name, value: newValue.toString() },
    } as React.ChangeEvent<HTMLInputElement>;
    onChange(event);
  };

  const handleDecrement = () => {
    const currentValue = parseFloat(value as string) || 0;
    const minValue = parseFloat(min as string) || 0;
    const newValue = Math.max(minValue, currentValue - 1);
    const event = {
      target: { name, value: newValue.toString() },
    } as React.ChangeEvent<HTMLInputElement>;
    onChange(event);
  };

  return (
    <div className={`space-y-2 ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 z-10">
            <Icon className="w-5 h-5" />
          </div>
        )}
        <input
          type="number"
          name={name}
          value={value}
          onChange={onChange}
          onKeyDown={onKeyDown}
          placeholder={placeholder}
          required={required}
          min={min}
          className={`
            w-full ${Icon ? "pl-12" : "px-4"} pr-12 py-2 
            border border-gray-200 rounded-lg 
            focus:outline-none focus:ring-2 focus:ring-red-500 
            bg-white
            [&::-webkit-outer-spin-button]:appearance-none 
            [&::-webkit-inner-spin-button]:appearance-none
            ${className}
          `}
          style={{
            MozAppearance: "textfield",
          }}
        />
        {/* Custom spinner buttons */}
        <div className="absolute right-0 top-0 bottom-0 flex flex-col border-l border-gray-200">
          <button
            type="button"
            onClick={handleIncrement}
            className="flex-1 px-3 hover:bg-gray-100 active:bg-gray-200 transition-colors flex items-center justify-center border-b border-gray-200 rounded-tr-lg hover:cursor-pointer"
            tabIndex={-1}
          >
            <BiChevronUp className="w-5 h-5 text-gray-600" />
          </button>
          <button
            type="button"
            onClick={handleDecrement}
            className="flex-1 px-3 hover:bg-gray-100 active:bg-gray-200 transition-colors flex items-center justify-center rounded-br-lg hover:cursor-pointer"
            tabIndex={-1}
          >
            <BiChevronDown className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default NumInput;
