import React, { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import { categoriesService } from "@/services/api/categoriesService";
import { transactionsService } from "@/services/api/transactionsService";
import ApperIcon from "@/components/ApperIcon";
import TransactionItem from "@/components/molecules/TransactionItem";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import Input from "@/components/atoms/Input";
import Button from "@/components/atoms/Button";
import Select from "@/components/atoms/Select";
import Card from "@/components/atoms/Card";
import { formatCurrency } from "@/utils/currency";

const Transactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [sortBy, setSortBy] = useState("date");
  const [sortOrder, setSortOrder] = useState("desc");

  // Load initial data
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [transactionsData, categoriesData] = await Promise.all([
        transactionsService.getAll(),
        categoriesService.getAll()
      ]);
      
      setTransactions(transactionsData);
      setCategories(categoriesData);
    } catch (err) {
      console.error("Failed to load data:", err);
      setError("Failed to load transactions");
      toast.error("Failed to load transactions");
    } finally {
      setLoading(false);
    }
  };

  // Filter and sort transactions
  const filteredTransactions = useMemo(() => {
    let filtered = [...transactions];

    // Apply search filter
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(t => 
        t.merchant.toLowerCase().includes(term) ||
        (t.note && t.note.toLowerCase().includes(term))
      );
    }

    // Apply category filter
    if (selectedCategory) {
      filtered = filtered.filter(t => t.categoryId === parseInt(selectedCategory));
    }

    // Apply date range filter
    if (startDate && endDate) {
      filtered = filtered.filter(t => {
        const transactionDate = new Date(t.date);
        const start = new Date(startDate);
        const end = new Date(endDate);
        return transactionDate >= start && transactionDate <= end;
      });
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let aValue, bValue;
      
      switch (sortBy) {
        case "amount":
          aValue = Math.abs(a.amount);
          bValue = Math.abs(b.amount);
          break;
        case "merchant":
          aValue = a.merchant.toLowerCase();
          bValue = b.merchant.toLowerCase();
          break;
        case "category":
          const aCat = getCategoryForTransaction(a.categoryId);
          const bCat = getCategoryForTransaction(b.categoryId);
          aValue = aCat?.name || "";
          bValue = bCat?.name || "";
          break;
        default: // date
          aValue = new Date(a.date);
          bValue = new Date(b.date);
      }

      if (sortOrder === "asc") {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    return filtered;
  }, [transactions, searchTerm, selectedCategory, startDate, endDate, sortBy, sortOrder]);

  const getCategoryForTransaction = (categoryId) => {
    return categories.find(cat => cat.Id === categoryId);
  };

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedCategory("");
    setStartDate("");
    setEndDate("");
    setSortBy("date");
    setSortOrder("desc");
    toast.success("Filters cleared");
  };

  const totalAmount = filteredTransactions.reduce((sum, t) => sum + Math.abs(t.amount), 0);
  const hasActiveFilters = searchTerm || selectedCategory || startDate || endDate;

  if (loading) {
    return <Loading message="Loading transactions..." />;
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Transactions</h1>
            <p className="text-sm text-gray-500 mt-1">Manage your expenses</p>
          </div>
        </div>
        <Error message={error} onRetry={loadData} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Transactions</h1>
          <p className="text-sm text-gray-500 mt-1">
            {filteredTransactions.length} transaction{filteredTransactions.length !== 1 ? 's' : ''}
            {hasActiveFilters && ' (filtered)'}
          </p>
        </div>
        
        <div className="flex items-center space-x-3">
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              className="text-gray-500 hover:text-gray-700"
            >
              <ApperIcon name="X" size={16} className="mr-1" />
              Clear
            </Button>
          )}
        </div>
      </div>

      {/* Filters */}
      <Card className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Search */}
          <div className="lg:col-span-2">
            <Input
              placeholder="Search transactions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full"
            />
          </div>

          {/* Category Filter */}
          <Select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="">All Categories</option>
            {categories.map(category => (
              <option key={category.Id} value={category.Id}>
                {category.name}
              </option>
            ))}
          </Select>

          {/* Sort Options */}
          <Select
            value={`${sortBy}-${sortOrder}`}
            onChange={(e) => {
              const [field, order] = e.target.value.split('-');
              setSortBy(field);
              setSortOrder(order);
            }}
          >
            <option value="date-desc">Date (Newest First)</option>
            <option value="date-asc">Date (Oldest First)</option>
            <option value="amount-desc">Amount (Highest First)</option>
            <option value="amount-asc">Amount (Lowest First)</option>
            <option value="merchant-asc">Merchant (A-Z)</option>
            <option value="merchant-desc">Merchant (Z-A)</option>
            <option value="category-asc">Category (A-Z)</option>
          </Select>
        </div>

        {/* Date Range */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <Input
            type="date"
            label="Start Date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
          <Input
            type="date"
            label="End Date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>
      </Card>

      {/* Summary */}
      {filteredTransactions.length > 0 && (
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
                <ApperIcon name="Calculator" size={24} className="text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Total Amount</h3>
                <p className="text-sm text-gray-500">
                  {hasActiveFilters ? 'Filtered' : 'All'} transactions
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-danger">
                -{formatCurrency(totalAmount)}
              </p>
              <p className="text-sm text-gray-500">
                {filteredTransactions.length} transaction{filteredTransactions.length !== 1 ? 's' : ''}
              </p>
            </div>
          </div>
        </Card>
      )}

      {/* Transactions List */}
      <Card className="p-6">
        {filteredTransactions.length === 0 ? (
          <Empty
            title={hasActiveFilters ? "No matching transactions" : "No transactions yet"}
            description={hasActiveFilters ? "Try adjusting your filters to see more results" : "Start tracking your expenses by adding your first transaction"}
            icon="Receipt"
            actionLabel={hasActiveFilters ? "Clear Filters" : undefined}
            onAction={hasActiveFilters ? clearFilters : undefined}
          />
        ) : (
          <div className="space-y-1">
            {filteredTransactions.map((transaction) => (
              <TransactionItem
                key={transaction.Id}
                transaction={transaction}
                category={getCategoryForTransaction(transaction.categoryId)}
              />
            ))}
          </div>
        )}
      </Card>
    </div>
  );
};

export default Transactions;