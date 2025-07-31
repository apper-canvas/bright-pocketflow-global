import Badge from "@/components/atoms/Badge";
import ApperIcon from "@/components/ApperIcon";
import { formatCurrency } from "@/utils/currency";
import { formatTransactionDate } from "@/utils/date";
import { cn } from "@/utils/cn";

const TransactionItem = ({ transaction, category }) => {
  const { amount, merchant, note, date } = transaction;
  const isExpense = amount < 0;
  
  return (
    <div className="flex items-center justify-between py-4 border-b border-gray-100 last:border-b-0 group hover:bg-gray-50/50 -mx-4 px-4 rounded-lg transition-colors duration-200">
      <div className="flex items-center space-x-3">
        <div 
          className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
          style={{ backgroundColor: `${category?.color || "#6B7280"}15` }}
        >
          <ApperIcon 
            name={category?.icon || "ShoppingBag"} 
            size={18} 
            style={{ color: category?.color || "#6B7280" }}
          />
        </div>
        
        <div className="min-w-0 flex-1">
          <div className="flex items-center space-x-2 mb-1">
            <p className="font-medium text-gray-900 truncate">{merchant}</p>
            {category && (
              <Badge variant="secondary" size="sm">
                {category.name}
              </Badge>
            )}
          </div>
          
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <ApperIcon name="Clock" size={12} />
            <span>{formatTransactionDate(date)}</span>
            {note && (
              <>
                <span>•</span>
                <span className="truncate">{note}</span>
              </>
            )}
          </div>
        </div>
      </div>
      
      <div className="text-right flex-shrink-0">
        <p className={cn(
          "font-bold text-lg",
          isExpense ? "text-danger" : "text-success"
        )}>
          {isExpense ? "-" : "+"}{formatCurrency(Math.abs(amount))}
        </p>
        
        <div className="flex items-center justify-end space-x-1 text-xs text-gray-400 group-hover:text-gray-600 transition-colors duration-200">
          <ApperIcon name="MoreHorizontal" size={14} />
        </div>
      </div>
    </div>
  );
};

export default TransactionItem;