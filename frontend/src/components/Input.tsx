import React from "react";

interface InputProps {
  type: string;
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
  maxLength?: number
}

const Input = ({ type, placeholder, value, onChange, className, maxLength }: InputProps) => {
  return (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className={`w-full px-4 py-3 border border-gray-300 rounded-lg text-[#444444] focus:outline-none focus:ring-2 focus:ring-[#465EFF] ${className}`}
      maxLength={maxLength}
    />
  );
};

export default Input;