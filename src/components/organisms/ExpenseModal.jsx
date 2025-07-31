import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import Select from "@/components/atoms/Select";
import ApperIcon from "@/components/ApperIcon";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/utils/cn";
import { categoriesService } from "@/services/api/categoriesService";
import { transactionsService } from "@/services/api/transactionsService";

const ExpenseModal = ({ isOpen, onClose, onExpenseAdded }) => {
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    amount: "",
    categoryId: "",
    merchant: "",
    note: ""
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isOpen) {
      loadCategories();
      // Reset form when modal opens
      setFormData({
        amount: "",
        categoryId: "",
        merchant: "",
        note: ""
      });
      setErrors({});
    }
  }, [isOpen]);

  const loadCategories = async () => {
    try {
      const data = await categoriesService.getAll();
      setCategories(data);
    } catch (error) {
      console.error("Failed to load categories:", error);
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      newErrors.amount = "Please enter a valid amount";
    }

    if (!formData.categoryId) {
      newErrors.categoryId = "Please select a category";
    }

    if (!formData.merchant.trim()) {
      newErrors.merchant = "Please enter a merchant name";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      const expense = {
        amount: -Math.abs(parseFloat(formData.amount)), // Negative for expenses
        categoryId: parseInt(formData.categoryId),
        merchant: formData.merchant.trim(),
        note: formData.note.trim(),
        date: new Date().toISOString()
      };

      const newTransaction = await transactionsService.create(expense);
      onExpenseAdded(newTransaction);
      toast.success("Expense added successfully!");
      onClose();
    } catch (error) {
      console.error("Failed to add expense:", error);
      toast.error("Failed to add expense. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          onClick={onClose}
        />
        
        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className="relative w-full max-w-md bg-white rounded-2xl shadow-elevation-3 overflow-hidden"
        >
          {/* Header */}
          <div className="bg-gradient-primary px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                  <ApperIcon name="Plus" size={20} className="text-white" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white">Add Expense</h2>
                  <p className="text-sm text-blue-100">Track your spending</p>
                </div>
              </div>
              
              <button
                onClick={onClose}
                className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center text-white hover:bg-white/30 transition-colors duration-200"
              >
                <ApperIcon name="X" size={16} />
              </button>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <Input
              label="Amount"
              type="number"
              step="0.01"
              min="0"
              value={formData.amount}
              onChange={(e) => handleInputChange("amount", e.target.value)}
              error={errors.amount}
              placeholder="0.00"
              className="text-lg font-semibold"
            />

            <Select
              label="Category"
              value={formData.categoryId}
              onChange={(e) => handleInputChange("categoryId", e.target.value)}
              error={errors.categoryId}
            >
              <option value="">Select a category</option>
              {categories.map((category) => (
                <option key={category.Id} value={category.Id}>
                  {category.name}
                </option>
              ))}
            </Select>

            <Input
              label="Merchant"
              value={formData.merchant}
              onChange={(e) => handleInputChange("merchant", e.target.value)}
              error={errors.merchant}
              placeholder="Where did you spend?"
            />

            <Input
              label="Note (Optional)"
              value={formData.note}
              onChange={(e) => handleInputChange("note", e.target.value)}
              placeholder="Add a note..."
            />

            {/* Actions */}
            <div className="flex space-x-3 pt-4">
              <Button
                type="button"
                variant="secondary"
                onClick={onClose}
                className="flex-1"
                disabled={loading}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="flex-1"
                disabled={loading}
              >
                {loading ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Adding...</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <ApperIcon name="Plus" size={16} />
                    <span>Add Expense</span>
                  </div>
                )}
              </Button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default ExpenseModal;