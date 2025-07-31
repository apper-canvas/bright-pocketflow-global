import { forwardRef } from "react";
import { cn } from "@/utils/cn";

const ProgressBar = forwardRef(({ 
  className, 
  value = 0,
  max = 100,
  variant = "primary",
  size = "md",
  animated = false,
  ...props 
}, ref) => {
  const percentage = Math.min((value / max) * 100, 100);
  
  const variants = {
    primary: "bg-gradient-primary",
    success: "bg-gradient-success",
    warning: "bg-gradient-warning", 
    danger: "bg-gradient-danger",
    secondary: "bg-gradient-to-r from-secondary to-purple-400"
  };
  
  const sizes = {
    sm: "h-1",
    md: "h-2",
    lg: "h-3"
  };

  return (
    <div
      className={cn("w-full bg-gray-200 rounded-full overflow-hidden", className)}
      ref={ref}
      {...props}
    >
      <div
        className={cn(
          "transition-all duration-500 ease-out rounded-full",
          sizes[size],
          variants[variant],
          animated && "progress-bar-animated"
        )}
        style={{ 
          width: `${percentage}%`,
          "--progress-width": `${percentage}%`
        }}
      />
    </div>
  );
});

ProgressBar.displayName = "ProgressBar";

export default ProgressBar;