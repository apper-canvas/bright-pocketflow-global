import { forwardRef } from "react";
import { cn } from "@/utils/cn";

const Input = forwardRef(({ 
  className, 
  type = "text",
  label,
  error,
  ...props 
}, ref) => {
  return (
    <div className="space-y-1">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
        </label>
      )}
      <input
        type={type}
        className={cn(
          "w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm transition-colors duration-200",
          "focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary",
          "disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed",
          "placeholder:text-gray-400",
          error && "border-danger focus:ring-danger focus:border-danger",
          className
        )}
        ref={ref}
        {...props}
      />
      {error && (
        <p className="text-sm text-danger mt-1">{error}</p>
      )}
    </div>
  );
});

Input.displayName = "Input";

export default Input;