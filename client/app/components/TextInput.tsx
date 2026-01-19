import React, { useState } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";
import type { IconType } from "react-icons";

interface TextInputProps {
  label?: string;
  type?: "text" | "email" | "password";
  name?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  required?: boolean;
  icon?: IconType;
  className?: string;
}

const TextInput: React.FC<TextInputProps> = ({
  label,
  type = "text",
  name,
  value,
  onChange,
  placeholder,
  required = false,
  icon: Icon,
  className = "",
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const inputType = type === "password" && showPassword ? "text" : type;

  return (
    <div className={`space-y-2 ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
            <Icon className="w-5 h-5" />
          </div>
        )}
        <input
          type={inputType}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          className={`w-full ${Icon ? "pl-12" : "px-4"} ${type === "password" ? "pr-12" : "pr-4"} py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 bg-white`}
        />
        {type === "password" && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:cursor-pointer hover:text-gray-600 p-1"
          >
            {showPassword ? (
              <FiEyeOff className="w-5 h-5" />
            ) : (
              <FiEye className="w-5 h-5" />
            )}
          </button>
        )}
      </div>
    </div>
  );
};

export default TextInput;
