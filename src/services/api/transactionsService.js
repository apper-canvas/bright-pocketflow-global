import transactions from "@/services/mockData/transactions.json";

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const transactionsService = {
  async getAll() {
    await delay(300);
    return [...transactions].sort((a, b) => new Date(b.date) - new Date(a.date));
  },

  async getById(id) {
    await delay(200);
    const transaction = transactions.find(t => t.Id === parseInt(id));
    if (!transaction) {
      throw new Error("Transaction not found");
    }
    return { ...transaction };
  },

  async getRecent(limit = 10) {
    await delay(250);
    return [...transactions]
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, limit);
  },

  async getByCategory(categoryId) {
    await delay(300);
    return transactions
      .filter(t => t.categoryId === parseInt(categoryId))
      .sort((a, b) => new Date(b.date) - new Date(a.date));
  },

  async create(transactionData) {
    await delay(400);
    const newTransaction = {
      Id: Math.max(...transactions.map(t => t.Id), 0) + 1,
      ...transactionData
    };
    transactions.unshift(newTransaction); // Add to beginning for recent order
    return { ...newTransaction };
  },

  async update(id, transactionData) {
    await delay(350);
    const index = transactions.findIndex(t => t.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Transaction not found");
    }
    
    transactions[index] = { ...transactions[index], ...transactionData };
    return { ...transactions[index] };
  },

  async delete(id) {
    await delay(300);
    const index = transactions.findIndex(t => t.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Transaction not found");
}
    
    transactions.splice(index, 1);
    return true;
  },

  async getByDateRange(startDate, endDate) {
    await delay(300);
    return transactions
      .filter(t => {
        const transactionDate = new Date(t.date);
        const start = new Date(startDate);
        const end = new Date(endDate);
        return transactionDate >= start && transactionDate <= end;
      })
      .sort((a, b) => new Date(b.date) - new Date(a.date));
  },

  async searchTransactions(searchTerm) {
    await delay(250);
    const term = searchTerm.toLowerCase();
    return transactions
      .filter(t => 
        t.merchant.toLowerCase().includes(term) ||
        (t.note && t.note.toLowerCase().includes(term))
      )
      .sort((a, b) => new Date(b.date) - new Date(a.date));
  },

  async getByFilter({ searchTerm, categoryId, startDate, endDate }) {
    await delay(300);
    let filtered = [...transactions];

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(t => 
        t.merchant.toLowerCase().includes(term) ||
        (t.note && t.note.toLowerCase().includes(term))
      );
    }

    if (categoryId) {
      filtered = filtered.filter(t => t.categoryId === parseInt(categoryId));
    }

    if (startDate && endDate) {
      filtered = filtered.filter(t => {
        const transactionDate = new Date(t.date);
        const start = new Date(startDate);
        const end = new Date(endDate);
        return transactionDate >= start && transactionDate <= end;
      });
    }

return filtered.sort((a, b) => new Date(b.date) - new Date(a.date));
  },

  // Analytics methods for Reports
  async getCategorySpending() {
    await delay(300);
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    
    // Filter transactions for current month
    const currentMonthTransactions = transactions.filter(t => {
      const transactionDate = new Date(t.date);
      return transactionDate.getMonth() === currentMonth && 
             transactionDate.getFullYear() === currentYear;
    });
    
    // Group by category and calculate totals
    const categorySpending = {};
    currentMonthTransactions.forEach(transaction => {
      const categoryId = transaction.categoryId;
      if (!categorySpending[categoryId]) {
        categorySpending[categoryId] = {
          categoryId: categoryId,
          amount: 0,
          transactionCount: 0
        };
      }
      categorySpending[categoryId].amount += transaction.amount;
      categorySpending[categoryId].transactionCount += 1;
    });
    
    // Convert to array and sort by amount
    return Object.values(categorySpending)
      .sort((a, b) => b.amount - a.amount);
  },

  async getMonthlyTrends(monthsCount = 6) {
    await delay(350);
    const now = new Date();
    const trends = [];
    
    for (let i = monthsCount - 1; i >= 0; i--) {
      const targetDate = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const month = targetDate.getMonth();
      const year = targetDate.getFullYear();
      
      // Get month name
      const monthName = targetDate.toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
      
      // Calculate total spending for this month
      const monthTransactions = transactions.filter(t => {
        const transactionDate = new Date(t.date);
        return transactionDate.getMonth() === month && 
               transactionDate.getFullYear() === year;
      });
      
      const totalAmount = monthTransactions.reduce((sum, t) => sum + t.amount, 0);
      
      trends.push({
        month: monthName,
        amount: totalAmount,
        transactionCount: monthTransactions.length,
        year: year,
        monthIndex: month
      });
    }
    
    return trends;
  },

  async getCurrentMonthSpending() {
    await delay(200);
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    
    const currentMonthTransactions = transactions.filter(t => {
      const transactionDate = new Date(t.date);
      return transactionDate.getMonth() === currentMonth && 
             transactionDate.getFullYear() === currentYear;
    });
    
return currentMonthTransactions.reduce((sum, t) => sum + t.amount, 0);
  },

  // Alias method for backward compatibility
  async getTransactions() {
    return this.getAll();
  }
};