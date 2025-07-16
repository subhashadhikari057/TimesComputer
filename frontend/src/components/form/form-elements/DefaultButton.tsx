import React from "react";
import { LucideIcon } from "lucide-react";

interface DefaultButtonProps {
  children: React.ReactNode;
  type?: "button" | "submit" | "reset";
  variant?: "primary" | "secondary" | "danger" | "success";
  size?: "sm" | "md" | "lg";
  disabled?: boolean;
  loading?: boolean;
  icon?: LucideIcon;
  iconPosition?: "left" | "right";
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  className?: string;
  fullWidth?: boolean;
}

const DefaultButton: React.FC<DefaultButtonProps> = ({
  children,
  type = "button",
  variant = "primary",
  size = "md",
  disabled = false,
  loading = false,
  icon: Icon,
  iconPosition = "left",
  onClick,
  className = "",
  fullWidth = false,
}) => {
  const baseClasses =
    "inline-flex items-center justify-center font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed";

  // Always responsive size classes
  const sizeClasses = {
    sm: "px-3 py-1.5 text-xs sm:px-4 sm:py-2 sm:text-sm",
    md: "px-4 py-2 text-sm sm:px-5 sm:py-2.5 md:px-6 md:py-3 md:text-base",
    lg: "px-5 py-2.5 text-sm sm:px-6 sm:py-3 sm:text-base md:px-8 md:py-4 md:text-lg",
  };

  const variantClasses = {
    primary:
      "text-white bg-blue-600 border border-transparent hover:bg-blue-700 focus:ring-blue-500 active:bg-blue-800",
    secondary:
      "text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 hover:text-gray-900 focus:ring-blue-500 active:bg-gray-100",
    danger:
      "text-white bg-red-600 border border-transparent hover:bg-red-700 focus:ring-red-500 active:bg-red-800",
    success:
      "text-white bg-green-600 border border-transparent hover:bg-green-700 focus:ring-green-500 active:bg-green-800",
  };

  // Always responsive width classes
  const widthClasses = fullWidth ? "w-full" : "";

  const combinedClasses =
    `${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${widthClasses} ${className}`.trim();

  // Always responsive icon sizes
  const getIconSize = () => {
    return size === "sm" ? 14 : size === "md" ? 16 : 18;
  };

  const iconSize = getIconSize();

  const renderIcon = (position: "left" | "right") => {
    if (!Icon || iconPosition !== position) return null;

    const iconClasses = position === "left" ? "mr-1.5 sm:mr-2" : "ml-1.5 sm:ml-2";
    return <Icon size={iconSize} className={iconClasses} />;
  };

  const renderContent = () => {
    if (loading) {
      return (
        <>
          <svg
            className="animate-spin -ml-1 mr-1.5 sm:mr-2 h-4 w-4 text-current"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          {children}
        </>
      );
    }

    return (
      <>
        {renderIcon("left")}
        {children}
        {renderIcon("right")}
      </>
    );
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={combinedClasses}
    >
      {renderContent()}
    </button>
  );
};

export default DefaultButton;