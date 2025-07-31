import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import { cn } from "@/utils/cn";

const Error = ({ 
  message = "Something went wrong", 
  onRetry, 
  className,
  variant = "default"
}) => {
  if (variant === "inline") {
    return (
      <div className={cn("flex items-center space-x-2 text-danger", className)}>
        <ApperIcon name="AlertCircle" size={16} />
        <span className="text-sm">{message}</span>
        {onRetry && (
          <button
            onClick={onRetry}
            className="text-primary hover:text-primary/80 text-sm font-medium ml-2"
          >
            Retry
          </button>
        )}
      </div>
    );
  }

  return (
    <div className={cn("flex flex-col items-center justify-center py-12 px-6", className)}>
      <div className="text-center max-w-md">
        <div className="w-16 h-16 bg-gradient-danger rounded-full flex items-center justify-center mx-auto mb-4">
          <ApperIcon name="AlertTriangle" size={24} className="text-white" />
        </div>
        
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Oops! Something went wrong
        </h3>
        
        <p className="text-gray-600 mb-6">
          {message}
        </p>
        
        {onRetry && (
          <Button onClick={onRetry} className="inline-flex items-center space-x-2">
            <ApperIcon name="RefreshCw" size={16} />
            <span>Try Again</span>
          </Button>
        )}
      </div>
    </div>
  );
};

export default Error;