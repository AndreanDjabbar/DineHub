import React from "react";
import type { IconType } from "react-icons";

interface OptionItem {
    id: any;
    value: any;
    name: string;
}

interface SelectInputProps {
    label?: string;
    name?: string;
    optionLabel: string;
    options?: OptionItem[];
    value: string | number;
    onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
    required?: boolean;
    icon?: IconType;
    className?: string;
    error?: string;
    disabled?: boolean;
}

const SelectInput: React.FC<SelectInputProps> = ({
    label,
    optionLabel,
    name,
    value,
    options = [],
    onChange,
    required = false,
    icon: Icon,
    className = "",
    error,
    disabled = false,
}) => {
    return (
        <div className={`space-y-2 ${className}`}>
        {label && (
            <label className="block text-sm font-medium text-gray-700 mb-1">
            {label} {required && <span className="text-red-500">*</span>}
            </label>
        )}
        <div className="relative">
            {Icon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                <Icon size={20} />
            </div>
            )}
            <select
            name={name}
            className={`w-full ${Icon ? "pl-10" : "pl-4"} pr-4 py-2 border ${
                error ? "border-red-500" : "border-gray-200"
            } rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 bg-white hover:cursor-pointer disabled:bg-gray-100 disabled:cursor-not-allowed`}
            value={value}
            onChange={onChange}
            required={required}
            disabled={disabled}
            >
            <option value="">{optionLabel}</option>
            {options.map((option) => (
                <option key={option.id} value={option.value}>
                {option.name}
                </option>
            ))}
            </select>
        </div>
        {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
        </div>
    );
};

export default SelectInput;