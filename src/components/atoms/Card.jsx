import { forwardRef } from "react";
import { cn } from "@/utils/cn";

const Card = forwardRef(({ 
  className, 
  children, 
  hover = true,
  ...props 
}, ref) => {
  return (
    <div
      className={cn(
        "bg-white rounded-xl shadow-elevation-2 transition-all duration-200",
        hover && "hover:shadow-elevation-3",
        className
      )}
      ref={ref}
      {...props}
    >
      {children}
    </div>
  );
});

Card.displayName = "Card";

export default Card;