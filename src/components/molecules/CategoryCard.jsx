import Card from "@/components/atoms/Card";
import ProgressBar from "@/components/atoms/ProgressBar";
import ApperIcon from "@/components/ApperIcon";
import { formatCurrency, getBudgetStatus, getBudgetStatusColor } from "@/utils/currency";
import { cn } from "@/utils/cn";

const CategoryCard = ({ category }) => {
  const { name, icon, budgetAmount, spentAmount, color } = category;
  const remaining = budgetAmount - spentAmount;
  const percentage = (spentAmount / budgetAmount) * 100;
  const status = getBudgetStatus(spentAmount, budgetAmount);
  
  const getProgressVariant = () => {
    switch (status) {
      case "good": return "success";
      case "warning": return "warning";
      case "over": return "danger";
      default: return "primary";
    }
  };

  return (
    <Card className={cn(
      "p-4 border-l-4 transition-all duration-200 hover:scale-105",
      getBudgetStatusColor(status).replace("text-", "border-")
    )}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-3">
          <div 
            className="w-10 h-10 rounded-lg flex items-center justify-center"
            style={{ backgroundColor: `${color}15` }}
          >
            <ApperIcon 
              name={icon} 
              size={20} 
              style={{ color: color }}
            />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">{name}</h3>
            <p className="text-xs text-gray-500">
              {formatCurrency(remaining)} left
            </p>
          </div>
        </div>
        
        <div className="text-right">
          <p className={cn(
            "font-bold text-lg",
            getBudgetStatusColor(status).split(" ")[0]
          )}>
            {formatCurrency(spentAmount)}
          </p>
          <p className="text-xs text-gray-500">
            of {formatCurrency(budgetAmount)}
          </p>
        </div>
      </div>

      <div className="space-y-2">
        <ProgressBar
          value={spentAmount}
          max={budgetAmount}
          variant={getProgressVariant()}
          animated={true}
        />
        
        <div className="flex justify-between items-center text-xs">
          <span className={cn(
            "font-medium",
            getBudgetStatusColor(status).split(" ")[0]
          )}>
            {Math.round(percentage)}% used
          </span>
          
          <div className="flex items-center space-x-1">
            <ApperIcon 
              name={status === "over" ? "AlertTriangle" : status === "warning" ? "AlertCircle" : "CheckCircle"} 
              size={12}
              className={getBudgetStatusColor(status).split(" ")[0]}
            />
            <span className={cn(
              "font-medium text-xs",
              getBudgetStatusColor(status).split(" ")[0]
            )}>
              {status === "over" ? "Over budget" : status === "warning" ? "Near limit" : "On track"}
            </span>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default CategoryCard;