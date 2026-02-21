import React from "react";
import { BiLoader } from "react-icons/bi";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  className?: string;
  text?: string;
  isLoading?: boolean;
  isLoadingText?: string;
}

const Button: React.FC<ButtonProps> = ({
  className = "",
  ...props
}) => {
  const buttonStyles = props.disabled
    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
    : "bg-red-600 text-white hover:bg-red-700";
  return (
    <button
    className={`hover:cursor-pointer w-full ${buttonStyles} px-6 py-3 rounded-lg font-bold transition ${className}`}
    {...props}
    >
      {props.isLoading ? (
          <div className="text-bold flex items-center justify-center gap-2">
            <BiLoader size={20} className="animate-spin" />
            {props.isLoadingText || "Loading..."}
          </div>
        ) : (
          props.text || "Submit"
        )}
    </button>
  );
};

export default Button;
