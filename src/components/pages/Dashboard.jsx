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
import { notificationService } from "@/services/notificationService";

const Dashboard = () => {
  const [budget, setBudget] = useState(null);
  const [categories, setCategories] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [previousCategories, setPreviousCategories] = useState([]);

  useEffect(() => {
    loadDashboardData();
  }, []);

  useEffect(() => {
    if (categories.length > 0 && !loading) {
      notificationService.checkBudgetAlerts(categories, previousCategories);
      setPreviousCategories(categories);
    }
  }, [categories, loading]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError("");
      
const currentMonth = getCurrentMonth();
      
      // Load budget data
      const budgetData = await budgetService.getCurrentMonthBudget();
      if (budgetData) {
        setBudget(budgetData);
      }
      
      // Load categories with their spending
      const categoriesData = await categoriesService.getCategoriesWithSpending(currentMonth);
      setCategories(categoriesData);
      
      // Load recent transactions
      const transactionsData = await transactionsService.getTransactions({
        month: currentMonth,
        limit: 10
      });
      setTransactions(transactionsData);
      
    } catch (err) {
      console.error('Error loading dashboard data:', err);
      setError('Failed to load dashboard data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

const handleExpenseAdded = async (newExpense) => {
    try {
      // Refresh dashboard data to reflect the new expense
      await loadDashboardData();
      
      // Show success notification
      notificationService.showSuccess('Expense added successfully!');
    } catch (err) {
      console.error('Error adding expense:', err);
      notificationService.showError('Failed to add expense. Please try again.');
    }
  };

  // Calculate total spent from categories
  const totalSpent = categories.reduce((sum, category) => sum + (category.spent || 0), 0);

  if (loading) {
    return <Loading message="Loading your dashboard..." />;
  }

  if (error) {
    return (
      <Error 
        message={error}
        onRetry={loadDashboardData}
      />
    );
  }

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