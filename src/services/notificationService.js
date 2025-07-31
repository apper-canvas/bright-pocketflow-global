import { toast } from 'react-toastify';
import { formatCurrency } from '@/utils/currency';

class NotificationService {
  constructor() {
    this.previousAlerts = new Map();
  }

  checkBudgetAlerts(categories, previousCategories = []) {
    const previousMap = new Map(
      previousCategories.map(cat => [cat.Id, cat])
    );

    categories.forEach(category => {
      const { Id, name, budgetAmount, spentAmount } = category;
      const percentage = (spentAmount / budgetAmount) * 100;
      const previousCategory = previousMap.get(Id);
      const previousPercentage = previousCategory 
        ? (previousCategory.spentAmount / previousCategory.budgetAmount) * 100 
        : 0;

      // Check for 100% threshold crossing
      if (percentage >= 100 && previousPercentage < 100) {
        this.showBudgetAlert(
          'over',
          name,
          spentAmount,
          budgetAmount,
          percentage
        );
      }
      // Check for 75% threshold crossing (but not if already over 100%)
      else if (percentage >= 75 && percentage < 100 && previousPercentage < 75) {
        this.showBudgetAlert(
          'warning',
          name,
          spentAmount,
          budgetAmount,
          percentage
        );
      }
    });
  }

  showBudgetAlert(type, categoryName, spent, budget, percentage) {
    const alertKey = `${categoryName}-${type}`;
    
    // Prevent duplicate alerts for the same category and type
    if (this.previousAlerts.has(alertKey)) {
      return;
    }

    this.previousAlerts.set(alertKey, Date.now());

    const options = {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    };

    if (type === 'over') {
      toast.error(
        `🚨 Budget Exceeded! ${categoryName} is ${Math.round(percentage)}% over budget (${formatCurrency(spent)} of ${formatCurrency(budget)})`,
        options
      );
    } else if (type === 'warning') {
      toast.warn(
        `⚠️ Budget Alert! ${categoryName} has reached ${Math.round(percentage)}% of budget (${formatCurrency(spent)} of ${formatCurrency(budget)})`,
        options
      );
    }
  }

  clearAlerts() {
    this.previousAlerts.clear();
  }

  // Clean up old alerts (optional, for memory management)
  cleanupOldAlerts(maxAge = 24 * 60 * 60 * 1000) { // 24 hours
    const now = Date.now();
    for (const [key, timestamp] of this.previousAlerts.entries()) {
      if (now - timestamp > maxAge) {
        this.previousAlerts.delete(key);
      }
    }
  }
}

export const notificationService = new NotificationService();