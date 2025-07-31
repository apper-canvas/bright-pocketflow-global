import { useState, useEffect } from "react";
import BudgetHeader from "@/components/molecules/BudgetHeader";
import BudgetCategories from "@/components/organisms/BudgetCategories";
import RecentTransactions from "@/components/organisms/RecentTransactions";
import FloatingActionButton from "@/components/molecules/FloatingActionButton";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import { budgetService } from "@/services/api/budgetService";
import { categoriesService } from "@/services/api/categoriesService";
import { transactionsService } from "@/services/api/transactionsService";
import { getCurrentMonth } from "@/utils/date";

const Dashboard = () => {
  const [budget, setBudget] = useState(null);
  const [categories, setCategories] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    setError("");
    
    try {
      const [budgetData, categoriesData, transactionsData] = await Promise.all([
        budgetService.getCurrentMonthBudget(),
        categoriesService.getAll(),
        transactionsService.getRecent(7)
      ]);

      setBudget(budgetData);
      setCategories(categoriesData);
      setTransactions(transactionsData);
    } catch (err) {
      console.error("Failed to load dashboard data:", err);
      setError("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  const handleExpenseAdded = async (newExpense) => {
    try {
      // Reload all data to get updated totals
      await loadDashboardData();
    } catch (error) {
      console.error("Failed to refresh data after adding expense:", error);
    }
  };

  if (loading) {
    return <Loading variant="skeleton" />;
  }

  if (error) {
    return (
      <Error 
        message="Failed to load your budget dashboard" 
        onRetry={loadDashboardData}
      />
    );
  }

  const totalSpent = Math.abs(
    transactions
      .filter(t => t.amount < 0)
      .reduce((sum, t) => sum + t.amount, 0)
  );

  return (
    <div className="space-y-6">
      <BudgetHeader 
        budget={budget?.totalBudget || 0}
        totalSpent={totalSpent}
      />

      <div>
        <div className="flex items-center space-x-3 mb-4">
          <h2 className="text-xl font-bold text-gray-900">Budget Categories</h2>
          <div className="flex-1 h-px bg-gradient-to-r from-gray-200 to-transparent"></div>
        </div>
        
        <BudgetCategories
          categories={categories}
          loading={false}
          error=""
          onRetry={loadDashboardData}
        />
      </div>

      <RecentTransactions
        transactions={transactions}
        categories={categories}
        loading={false}
        error=""
        onRetry={loadDashboardData}
      />

      <FloatingActionButton onExpenseAdded={handleExpenseAdded} />
    </div>
  );
};

export default Dashboard;