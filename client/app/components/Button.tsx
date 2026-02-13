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
  return (
    <button
    className={`hover:cursor-pointer w-full bg-red-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-red-700 transition ${className}`}
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
