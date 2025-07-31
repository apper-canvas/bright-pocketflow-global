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
  }
};