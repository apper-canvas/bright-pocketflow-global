import { forwardRef } from "react";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";

const Select = forwardRef(({ 
  className, 
  label,
  error,
  children,
  ...props 
}, ref) => {
  return (
    <div className="space-y-1">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
        </label>
      )}
      <div className="relative">
        <select
          className={cn(
            "w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm transition-colors duration-200 appearance-none bg-white",
            "focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary",
            "disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed",
            error && "border-danger focus:ring-danger focus:border-danger",
            className
          )}
          ref={ref}
          {...props}
        >
          {children}
        </select>
        <ApperIcon 
          name="ChevronDown" 
          size={16} 
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" 
        />
      </div>
      {error && (
        <p className="text-sm text-danger mt-1">{error}</p>
      )}
    </div>
  );
});

Select.displayName = "Select";

export default Select;