import { useState } from "react";
import Card from "@/components/atoms/Card";
import ApperIcon from "@/components/ApperIcon";
import { formatCurrency, formatPercentage } from "@/utils/currency";
import { getCurrentMonthDisplay } from "@/utils/date";
import { cn } from "@/utils/cn";

const BudgetHeader = ({ budget, totalSpent }) => {
  const [currentMonth] = useState(getCurrentMonthDisplay());
  const remaining = budget - totalSpent;
  const spentPercentage = budget > 0 ? (totalSpent / budget) * 100 : 0;
  
  const isOverBudget = totalSpent > budget;
  const isNearLimit = spentPercentage >= 85;

  return (
    <Card className="p-6 bg-gradient-to-br from-white to-blue-50/30">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center">
            <ApperIcon name="Calendar" size={20} className="text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">{currentMonth}</h1>
            <p className="text-sm text-gray-500">Budget Overview</p>
          </div>
        </div>
        
        <div className="text-right">
          <div className="flex items-center space-x-2 mb-1">
            <span className="text-2xl font-bold gradient-text">
              {formatCurrency(totalSpent)}
            </span>
            <span className="text-gray-400">/</span>
            <span className="text-lg font-semibold text-gray-600">
              {formatCurrency(budget)}
            </span>
          </div>
          <div className={cn(
            "flex items-center space-x-1 text-sm font-medium",
            isOverBudget ? "text-danger" : isNearLimit ? "text-warning" : "text-success"
          )}>
            <ApperIcon 
              name={isOverBudget ? "TrendingUp" : "TrendingDown"} 
              size={14} 
            />
            <span>{formatPercentage(spentPercentage)} spent</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white/50 rounded-lg p-4 backdrop-blur-sm">
          <div className="flex items-center space-x-2 mb-2">
            <ApperIcon name="Wallet" size={16} className="text-primary" />
            <span className="text-sm font-medium text-gray-600">Remaining</span>
          </div>
          <p className={cn(
            "text-xl font-bold",
            remaining >= 0 ? "text-success" : "text-danger"
          )}>
            {formatCurrency(Math.abs(remaining))}
          </p>
          <p className="text-xs text-gray-500">
            {remaining >= 0 ? "Available to spend" : "Over budget"}
          </p>
        </div>

        <div className="bg-white/50 rounded-lg p-4 backdrop-blur-sm">
          <div className="flex items-center space-x-2 mb-2">
            <ApperIcon name="Target" size={16} className="text-secondary" />
            <span className="text-sm font-medium text-gray-600">Daily Avg</span>
          </div>
          <p className="text-xl font-bold text-gray-900">
            {formatCurrency(totalSpent / new Date().getDate())}
          </p>
          <p className="text-xs text-gray-500">
            Spending per day
          </p>
        </div>
      </div>
    </Card>
  );
};

export default BudgetHeader;