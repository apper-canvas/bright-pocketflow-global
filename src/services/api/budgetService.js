import budgets from "@/services/mockData/budgets.json";
import { getCurrentMonth } from "@/utils/date";

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const budgetService = {
  async getAll() {
    await delay(300);
    return [...budgets];
  },

  async getById(id) {
    await delay(200);
    const budget = budgets.find(b => b.Id === parseInt(id));
    if (!budget) {
      throw new Error("Budget not found");
    }
    return { ...budget };
  },

  async getCurrentMonthBudget() {
    await delay(250);
    const currentMonth = getCurrentMonth();
    const budget = budgets.find(b => b.month === currentMonth);
    
    if (!budget) {
      // Return default budget for current month if none exists
      return {
        Id: 1,
        month: currentMonth,
        year: new Date().getFullYear(),
        totalBudget: 3500,
        totalSpent: 0
      };
    }
    
    return { ...budget };
  },

  async create(budgetData) {
    await delay(400);
    const newBudget = {
      Id: Math.max(...budgets.map(b => b.Id)) + 1,
      ...budgetData
    };
    budgets.push(newBudget);
    return { ...newBudget };
  },

  async update(id, budgetData) {
    await delay(350);
    const index = budgets.findIndex(b => b.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Budget not found");
    }
    
    budgets[index] = { ...budgets[index], ...budgetData };
    return { ...budgets[index] };
  },

  async delete(id) {
    await delay(300);
    const index = budgets.findIndex(b => b.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Budget not found");
    }
    
    budgets.splice(index, 1);
    return true;
  }
};