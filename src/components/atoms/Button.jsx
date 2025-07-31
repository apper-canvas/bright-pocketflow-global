import { forwardRef } from "react";
import { cn } from "@/utils/cn";

const Button = forwardRef(({ 
  className, 
  variant = "primary", 
  size = "md", 
  children, 
  disabled,
  ...props 
}, ref) => {
  const baseClasses = "inline-flex items-center justify-center font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    primary: "bg-gradient-primary text-white hover:scale-105 hover:shadow-elevation-2 focus:ring-primary",
    secondary: "bg-white border border-gray-200 text-gray-700 hover:scale-105 hover:shadow-elevation-1 focus:ring-gray-300",
    outline: "border-2 border-primary text-primary bg-transparent hover:bg-primary hover:text-white focus:ring-primary",
    ghost: "text-gray-700 hover:bg-gray-100 focus:ring-gray-300",
    danger: "bg-gradient-danger text-white hover:scale-105 hover:shadow-elevation-2 focus:ring-danger"
  };
  
  const sizes = {
    sm: "px-3 py-1.5 text-sm rounded-md",
    md: "px-4 py-2 text-sm rounded-lg",
    lg: "px-6 py-3 text-base rounded-lg",
    xl: "px-8 py-4 text-lg rounded-xl"
  };

  return (
    <button
      className={cn(
        baseClasses,
        variants[variant],
        sizes[size],
        disabled && "hover:scale-100 hover:shadow-none",
        className
      )}
      ref={ref}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
});

Button.displayName = "Button";

export default Button;