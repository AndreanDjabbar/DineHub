import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  className?: string;
}

const Button: React.FC<ButtonProps> = ({
  children,
  className = "",
  ...props
}) => {
  return (
    <button
      className={`hover:cursor-pointer  w-full bg-red-600 text-white py-3 rounded-lg font-bold hover:bg-red-700 transition ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
