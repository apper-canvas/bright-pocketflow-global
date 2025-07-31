import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import { cn } from "@/utils/cn";

const Empty = ({ 
  title = "No data found",
  description = "Get started by adding your first item",
  actionLabel,
  onAction,
  icon = "Inbox",
  className 
}) => {
  return (
    <div className={cn("flex flex-col items-center justify-center py-12 px-6", className)}>
      <div className="text-center max-w-md">
        <div className="w-16 h-16 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
          <ApperIcon name={icon} size={24} className="text-gray-400" />
        </div>
        
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          {title}
        </h3>
        
        <p className="text-gray-600 mb-6">
          {description}
        </p>
        
        {actionLabel && onAction && (
          <Button onClick={onAction} className="inline-flex items-center space-x-2">
            <ApperIcon name="Plus" size={16} />
            <span>{actionLabel}</span>
          </Button>
        )}
      </div>
    </div>
  );
};

export default Empty;