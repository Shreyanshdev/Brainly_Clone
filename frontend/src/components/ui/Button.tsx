import type { ReactElement } from "react";


export interface ButtonProps {
  varaint: "primary" | "secondary";
  size: "sm" | "md" | "lg";
  text: string; 
  startIcon?: ReactElement;
  endIcon?: ReactElement;
  onClick: () => void;
}

const variantClasses = {
  primary: "bg-blue-600 text-white hover:bg-blue-700",
  secondary: "bg-gray-200 text-gray-800 hover:bg-gray-300 border border-gray-400",
};

const sizeClasses = {
  sm: "text-sm px-3 py-1.5",
  md: "text-base px-4 py-2",
  lg: "text-lg px-5 py-3",
};

export const Button = ({
  varaint,
  size,
  text,
  startIcon,
  endIcon,
  onClick,
}: ButtonProps) => {
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center justify-center gap-2 rounded-md transition-all duration-200 font-medium ${variantClasses[varaint]} ${sizeClasses[size]}`}
    >
      {startIcon && <span className="w-4 h-4">{startIcon}</span>}
      <span>{text}</span>
      {endIcon && <span className="w-4 h-4">{endIcon}</span>}
    </button>
  );
};
