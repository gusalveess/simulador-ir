import React from "react";

interface ButtonProps {
  type: "submit" | "button" | "reset";
  children: React.ReactNode;
  className?: string;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
}

const Button = ({ type, children, className, onClick }: ButtonProps) => {
  return (
    <button
      type={type}
      className={`py-3 px-6 rounded-lg text-lg font-semibold ${className}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export default Button;