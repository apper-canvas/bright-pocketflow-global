import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import TransactionItem from "@/components/molecules/TransactionItem";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import ApperIcon from "@/components/ApperIcon";
import { useNavigate } from "react-router-dom";

const RecentTransactions = ({ transactions, categories, loading, error, onRetry }) => {
  const navigate = useNavigate();

  const getCategoryForTransaction = (categoryId) => {
    return categories?.find(cat => cat.Id === categoryId);
  };

  if (loading) {
    return (
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="h-6 bg-gray-200 rounded w-40 animate-pulse"></div>
          <div className="h-8 bg-gray-200 rounded w-20 animate-pulse"></div>
        </div>
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-center justify-between py-3 animate-pulse">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gray-200 rounded-lg"></div>
                <div>
                  <div className="h-4 bg-gray-200 rounded w-24 mb-1"></div>
                  <div className="h-3 bg-gray-200 rounded w-16"></div>
                </div>
              </div>
              <div className="text-right">
                <div className="h-4 bg-gray-200 rounded w-16 mb-1"></div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="p-6">
        <Error 
          message="Failed to load recent transactions" 
          onRetry={onRetry}
          variant="inline"
        />
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-secondary to-purple-600 rounded-lg flex items-center justify-center">
            <ApperIcon name="Receipt" size={20} className="text-white" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-900">Recent Transactions</h2>
            <p className="text-sm text-gray-500">Latest spending activity</p>
          </div>
        </div>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate("/transactions")}
          className="text-primary hover:text-primary/80"
        >
          <span className="hidden sm:inline">View All</span>
          <ApperIcon name="ArrowRight" size={16} className="ml-1" />
        </Button>
      </div>

      {!transactions || transactions.length === 0 ? (
        <Empty
          title="No transactions yet"
          description="Start tracking your expenses by adding your first transaction"
          icon="Receipt"
          actionLabel="Add Transaction"
          onAction={() => {}}
        />
      ) : (
        <div className="space-y-1">
          {transactions.slice(0, 7).map((transaction) => (
            <TransactionItem
              key={transaction.Id}
              transaction={transaction}
              category={getCategoryForTransaction(transaction.categoryId)}
            />
          ))}
        </div>
      )}
    </Card>
  );
};

export default RecentTransactions;