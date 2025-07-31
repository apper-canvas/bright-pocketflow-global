import categories from "@/services/mockData/categories.json";
import { transactionsService } from "@/services/api/transactionsService";

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const categoriesService = {
  async getAll() {
    await delay(300);
    return [...categories];
  },

  async getById(id) {
    await delay(200);
    return categories.find(category => category.id === id);
  },

  async create(categoryData) {
    await delay(400);
    const newCategory = {
      id: Date.now().toString(),
      ...categoryData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    categories.push(newCategory);
    return newCategory;
  },

  async update(id, updates) {
    await delay(400);
    const index = categories.findIndex(category => category.id === id);
    if (index === -1) {
      throw new Error("Category not found");
    }
    
    categories[index] = {
      ...categories[index],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    
    return categories[index];
  },

  async delete(id) {
    await delay(300);
    const index = categories.findIndex(category => category.id === id);
    if (index === -1) {
      throw new Error("Category not found");
    }
    
    categories.splice(index, 1);
    return true;
  },

  async getCategoriesWithSpending(month) {
    await delay(400);
    try {
      // Get all categories
      const allCategories = await this.getAll();
      
      // Get transactions for the specified month
      const transactions = await transactionsService.getTransactions({ month });
      
      // Calculate spending for each category
      const categoriesWithSpending = allCategories.map(category => {
        const categoryTransactions = transactions.filter(
          transaction => transaction.categoryId === category.id && transaction.type === 'expense'
        );
        
        const spent = categoryTransactions.reduce((total, transaction) => {
          return total + Math.abs(transaction.amount);
        }, 0);
        
        return {
          ...category,
          spent,
          remaining: Math.max(0, (category.budget || 0) - spent),
          percentage: (category.budget || 0) > 0 ? Math.min(100, (spent / category.budget) * 100) : 0,
          transactionCount: categoryTransactions.length
        };
      });
      
      return categoriesWithSpending;
    } catch (error) {
      console.error('Error getting categories with spending:', error);
      throw new Error('Failed to load categories with spending data');
    }
  },

  async getPresetTemplates() {
    await delay(300);
    return [
      {
        name: "Essential Living",
        description: "Basic categories for everyday expenses",
        categories: [
          { name: "Groceries", budget: 400, color: "#10B981", icon: "🛒" },
          { name: "Transportation", budget: 200, color: "#3B82F6", icon: "🚗" },
          { name: "Housing", budget: 800, color: "#8B5CF6", icon: "🏠" },
          { name: "Utilities", budget: 150, color: "#F59E0B", icon: "⚡" }
        ]
      },
      {
        name: "Family Budget",
        description: "Comprehensive categories for family expenses",
        categories: [
          { name: "Groceries", budget: 600, color: "#10B981", icon: "🛒" },
          { name: "Childcare", budget: 400, color: "#EC4899", icon: "👶" },
          { name: "Education", budget: 200, color: "#6366F1", icon: "📚" },
          { name: "Healthcare", budget: 250, color: "#EF4444", icon: "🏥" },
          { name: "Entertainment", budget: 150, color: "#F59E0B", icon: "🎬" }
        ]
      }
    ];
  },

  async getSpendingAnalytics(timeframe = 'month') {
    await delay(500);
    const allCategories = await this.getAll();
    const transactions = await transactionsService.getTransactions({});
    
    return allCategories.map(category => {
      const categoryExpenses = transactions.filter(
        t => t.categoryId === category.id && t.type === 'expense'
      );
      
      const totalSpent = categoryExpenses.reduce((sum, t) => sum + Math.abs(t.amount), 0);
      
      return {
        ...category,
        totalSpent,
        transactionCount: categoryExpenses.length,
        averageTransaction: categoryExpenses.length > 0 ? totalSpent / categoryExpenses.length : 0
      };
    });
  },
  async getAll() {
    await delay(300);
    return [...categories];
  },

  async getById(id) {
    await delay(200);
    const category = categories.find(c => c.Id === parseInt(id));
    if (!category) {
      throw new Error("Category not found");
    }
    return { ...category };
  },

async create(categoryData) {
    await delay(400);
    const newCategory = {
      Id: Math.max(...categories.map(c => c.Id), 0) + 1,
      spentAmount: 0,
      ...categoryData
    };
    categories.push(newCategory);
    return { ...newCategory };
  },

  async update(id, categoryData) {
    await delay(350);
    const index = categories.findIndex(c => c.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Category not found");
    }
    
    categories[index] = { ...categories[index], ...categoryData };
    return { ...categories[index] };
  },

  async delete(id) {
    await delay(300);
    const index = categories.findIndex(c => c.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Category not found");
    }
    
    categories.splice(index, 1);
    return true;
  },

  async updateSpentAmount(id, newSpentAmount) {
    await delay(200);
    const index = categories.findIndex(c => c.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Category not found");
    }
    
    categories[index].spentAmount = newSpentAmount;
    return { ...categories[index] };
},

  async getPresetTemplates() {
    await delay(100);
    return [
      {
        name: "Essentials",
        icon: "Home",
        categories: [
          { name: "Rent/Mortgage", budgetAmount: 1200, icon: "Home", color: "#10B981" },
          { name: "Groceries", budgetAmount: 600, icon: "ShoppingCart", color: "#F59E0B" },
          { name: "Utilities", budgetAmount: 250, icon: "Zap", color: "#EF4444" },
          { name: "Transportation", budgetAmount: 400, icon: "Car", color: "#3B82F6" },
          { name: "Healthcare", budgetAmount: 200, icon: "Heart", color: "#06B6D4" }
        ]
      },
      {
        name: "Lifestyle",
        icon: "Coffee",
        categories: [
          { name: "Dining Out", budgetAmount: 350, icon: "Utensils", color: "#8B5CF6" },
          { name: "Entertainment", budgetAmount: 300, icon: "Film", color: "#EC4899" },
          { name: "Shopping", budgetAmount: 500, icon: "ShoppingBag", color: "#84CC16" },
          { name: "Hobbies", budgetAmount: 200, icon: "GameController2", color: "#F97316" },
          { name: "Travel", budgetAmount: 300, icon: "Plane", color: "#06B6D4" }
        ]
      },
      {
        name: "Savings",
        icon: "PiggyBank",
        categories: [
          { name: "Emergency Fund", budgetAmount: 500, icon: "Shield", color: "#10B981" },
          { name: "Retirement", budgetAmount: 800, icon: "TrendingUp", color: "#3B82F6" },
          { name: "Investments", budgetAmount: 600, icon: "BarChart3", color: "#8B5CF6" },
          { name: "Education", budgetAmount: 200, icon: "BookOpen", color: "#F59E0B" },
          { name: "Vacation Fund", budgetAmount: 300, icon: "MapPin", color: "#EC4899" }
        ]
      }
    ];
  },

  async applyPresetTemplate(templateName) {
    await delay(400);
    const templates = await this.getPresetTemplates();
    const template = templates.find(t => t.name === templateName);
    
    if (!template) {
      throw new Error("Template not found");
    }

    // Clear existing categories and add template categories
    const newCategories = [];
    for (const categoryData of template.categories) {
      const created = await this.create(categoryData);
      newCategories.push(created);
    }

    return newCategories;
  }
};