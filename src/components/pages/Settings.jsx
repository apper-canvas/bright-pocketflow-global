import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { categoriesService } from "@/services/api/categoriesService";
import { budgetService } from "@/services/api/budgetService";
import ApperIcon from "@/components/ApperIcon";
import Input from "@/components/atoms/Input";
import Button from "@/components/atoms/Button";
import Select from "@/components/atoms/Select";
import Card from "@/components/atoms/Card";
import { formatCurrency } from "@/utils/currency";
const Settings = () => {
  const [currentBudget, setCurrentBudget] = useState(null);
  const [categories, setCategories] = useState([]);
  const [totalBudget, setTotalBudget] = useState("");
  const [loading, setLoading] = useState(true);
  const [editingCategory, setEditingCategory] = useState(null);
  const [newCategory, setNewCategory] = useState({
    name: "",
    budgetAmount: "",
    icon: "Wallet",
    color: "#3B82F6"
  });
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [errors, setErrors] = useState({});

  const presetTemplates = [
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

  const iconOptions = [
    "Wallet", "ShoppingCart", "Film", "Zap", "Car", "Utensils", "ShoppingBag", 
    "Heart", "BookOpen", "Home", "Coffee", "GameController2", "Plane", "Shield", 
    "TrendingUp", "BarChart3", "MapPin", "PiggyBank"
  ];

  const colorOptions = [
    "#10B981", "#3B82F6", "#8B5CF6", "#F59E0B", "#EF4444", "#EC4899", 
    "#06B6D4", "#84CC16", "#F97316", "#64748B"
  ];

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [budgetData, categoriesData] = await Promise.all([
        budgetService.getCurrentMonthBudget(),
        categoriesService.getAll()
      ]);
      
      setCurrentBudget(budgetData);
      setTotalBudget(budgetData.totalBudget.toString());
      setCategories(categoriesData);
    } catch (error) {
      toast.error("Failed to load budget data");
      console.error("Load data error:", error);
    } finally {
      setLoading(false);
    }
  };

  const validateTotalBudget = (value) => {
    const budget = parseFloat(value);
    if (!value || isNaN(budget) || budget <= 0) {
      return "Please enter a valid budget amount";
    }
    return null;
  };

  const validateCategory = (category) => {
    const errors = {};
    
    if (!category.name.trim()) {
      errors.name = "Category name is required";
    }
    
    const amount = parseFloat(category.budgetAmount);
    if (!category.budgetAmount || isNaN(amount) || amount <= 0) {
      errors.budgetAmount = "Please enter a valid budget amount";
    }
    
    return Object.keys(errors).length > 0 ? errors : null;
  };

  const calculateTotalAllocated = () => {
    return categories.reduce((total, cat) => total + (cat.budgetAmount || 0), 0);
  };

  const handleUpdateTotalBudget = async () => {
    const error = validateTotalBudget(totalBudget);
    if (error) {
      setErrors({ totalBudget: error });
      return;
    }

    try {
      const budgetAmount = parseFloat(totalBudget);
      await budgetService.updateTotalBudget(currentBudget.Id, budgetAmount);
      setCurrentBudget({ ...currentBudget, totalBudget: budgetAmount });
      setErrors({});
      toast.success("Total budget updated successfully");
    } catch (error) {
      toast.error("Failed to update total budget");
      console.error("Update budget error:", error);
    }
  };

  const handleAddCategory = async () => {
    const validationErrors = validateCategory(newCategory);
    if (validationErrors) {
      setErrors(validationErrors);
      return;
    }

    try {
      const categoryData = {
        ...newCategory,
        budgetAmount: parseFloat(newCategory.budgetAmount)
      };
      
      const created = await categoriesService.create(categoryData);
      setCategories([...categories, created]);
      setNewCategory({ name: "", budgetAmount: "", icon: "Wallet", color: "#3B82F6" });
      setShowAddCategory(false);
      setErrors({});
      toast.success("Category added successfully");
    } catch (error) {
      toast.error("Failed to add category");
      console.error("Add category error:", error);
    }
  };

  const handleUpdateCategory = async (categoryId, updatedData) => {
    const validationErrors = validateCategory(updatedData);
    if (validationErrors) {
      setErrors(validationErrors);
      return;
    }

    try {
      const categoryData = {
        ...updatedData,
        budgetAmount: parseFloat(updatedData.budgetAmount)
      };
      
      await categoriesService.update(categoryId, categoryData);
      setCategories(categories.map(cat => 
        cat.Id === categoryId ? { ...cat, ...categoryData } : cat
      ));
      setEditingCategory(null);
      setErrors({});
      toast.success("Category updated successfully");
    } catch (error) {
      toast.error("Failed to update category");
      console.error("Update category error:", error);
    }
  };

  const handleDeleteCategory = async (categoryId) => {
    if (!window.confirm("Are you sure you want to delete this category? This action cannot be undone.")) {
      return;
    }

    try {
      await categoriesService.delete(categoryId);
      setCategories(categories.filter(cat => cat.Id !== categoryId));
      toast.success("Category deleted successfully");
    } catch (error) {
      toast.error("Failed to delete category");
      console.error("Delete category error:", error);
    }
  };

  const handleApplyPreset = async (preset) => {
    if (!window.confirm(`This will replace your current categories with ${preset.name} template. Continue?`)) {
      return;
    }

    try {
      // Clear existing categories
      for (const category of categories) {
        await categoriesService.delete(category.Id);
      }

      // Add preset categories
      const newCategories = [];
      for (const categoryData of preset.categories) {
        const created = await categoriesService.create(categoryData);
        newCategories.push(created);
      }

      setCategories(newCategories);
      
      // Update total budget to match preset total
      const presetTotal = preset.categories.reduce((sum, cat) => sum + cat.budgetAmount, 0);
      setTotalBudget(presetTotal.toString());
      await budgetService.updateTotalBudget(currentBudget.Id, presetTotal);
      setCurrentBudget({ ...currentBudget, totalBudget: presetTotal });
      
      toast.success(`${preset.name} template applied successfully`);
    } catch (error) {
      toast.error("Failed to apply preset template");
      console.error("Apply preset error:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  const totalAllocated = calculateTotalAllocated();
  const currentTotalBudget = parseFloat(totalBudget) || 0;
  const remaining = currentTotalBudget - totalAllocated;
  const isOverAllocated = remaining < 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3">
        <div className="w-12 h-12 bg-gradient-to-br from-gray-600 to-gray-800 rounded-xl flex items-center justify-center">
          <ApperIcon name="Settings" size={24} className="text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Budget Management</h1>
          <p className="text-gray-600">Set up and manage your monthly budget</p>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
        {[
          { id: "overview", label: "Overview", icon: "BarChart3" },
          { id: "categories", label: "Categories", icon: "Grid3x3" },
          { id: "presets", label: "Templates", icon: "Sparkles" }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 flex items-center justify-center space-x-2 py-2 px-4 rounded-md transition-all duration-200 ${
              activeTab === tab.id
                ? "bg-white text-primary shadow-sm"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            <ApperIcon name={tab.icon} size={16} />
            <span className="font-medium">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Overview Tab */}
      {activeTab === "overview" && (
        <div className="space-y-6">
          {/* Total Budget Setup */}
          <Card className="p-6">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center">
                <ApperIcon name="Wallet" size={20} className="text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Monthly Budget</h3>
                <p className="text-gray-600">Set your total monthly budget amount</p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <Input
                  type="number"
                  placeholder="Enter total budget"
                  value={totalBudget}
                  onChange={(e) => setTotalBudget(e.target.value)}
                  error={errors.totalBudget}
                />
              </div>
              <Button onClick={handleUpdateTotalBudget} className="sm:w-auto">
                Update Budget
              </Button>
            </div>
          </Card>

          {/* Budget Breakdown */}
          <Card className="p-6">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <ApperIcon name="PieChart" size={20} className="text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Budget Breakdown</h3>
                <p className="text-gray-600">Overview of your budget allocation</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">
                  {formatCurrency(currentTotalBudget)}
                </div>
                <div className="text-gray-600">Total Budget</div>
              </div>
              
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">
                  {formatCurrency(totalAllocated)}
                </div>
                <div className="text-gray-600">Allocated</div>
              </div>
              
              <div className="text-center">
                <div className={`text-2xl font-bold ${isOverAllocated ? 'text-danger' : 'text-success'}`}>
                  {formatCurrency(Math.abs(remaining))}
                </div>
                <div className="text-gray-600">
                  {isOverAllocated ? 'Over Budget' : 'Remaining'}
                </div>
              </div>
            </div>

            {isOverAllocated && (
              <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-center space-x-2">
                  <ApperIcon name="AlertTriangle" size={16} className="text-red-500" />
                  <span className="text-red-700 font-medium">Budget Exceeded</span>
                </div>
                <p className="text-red-600 text-sm mt-1">
                  Your category allocations exceed your total budget by {formatCurrency(Math.abs(remaining))}
                </p>
              </div>
            )}
          </Card>
        </div>
      )}

      {/* Categories Tab */}
      {activeTab === "categories" && (
        <div className="space-y-6">
          {/* Add New Category */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-blue-600 rounded-lg flex items-center justify-center">
                  <ApperIcon name="Plus" size={20} className="text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Add Category</h3>
                  <p className="text-gray-600">Create a new budget category</p>
                </div>
              </div>
              
              <Button
                onClick={() => setShowAddCategory(!showAddCategory)}
                variant={showAddCategory ? "secondary" : "primary"}
              >
                {showAddCategory ? "Cancel" : "Add Category"}
              </Button>
            </div>

            {showAddCategory && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-gray-200">
                <Input
                  label="Category Name"
                  placeholder="Enter category name"
                  value={newCategory.name}
                  onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                  error={errors.name}
                />
                
                <Input
                  label="Budget Amount"
                  type="number"
                  placeholder="Enter budget amount"
                  value={newCategory.budgetAmount}
                  onChange={(e) => setNewCategory({ ...newCategory, budgetAmount: e.target.value })}
                  error={errors.budgetAmount}
                />
                
                <Select
                  label="Icon"
                  value={newCategory.icon}
                  onChange={(e) => setNewCategory({ ...newCategory, icon: e.target.value })}
                >
                  {iconOptions.map(icon => (
                    <option key={icon} value={icon}>{icon}</option>
                  ))}
                </Select>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Color</label>
                  <div className="flex flex-wrap gap-2">
                    {colorOptions.map(color => (
                      <button
                        key={color}
                        onClick={() => setNewCategory({ ...newCategory, color })}
                        className={`w-8 h-8 rounded-full border-2 transition-all duration-200 ${
                          newCategory.color === color ? 'border-gray-900 scale-110' : 'border-gray-300'
                        }`}
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                </div>
                
                <div className="md:col-span-2 flex justify-end">
                  <Button onClick={handleAddCategory}>
                    Add Category
                  </Button>
                </div>
              </div>
            )}
          </Card>

          {/* Categories List */}
          <Card className="p-6">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg flex items-center justify-center">
                <ApperIcon name="Grid3x3" size={20} className="text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Categories</h3>
                <p className="text-gray-600">Manage your budget categories</p>
              </div>
            </div>

            {categories.length === 0 ? (
              <div className="text-center py-8">
                <ApperIcon name="Grid3x3" size={48} className="text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">No categories added yet</p>
                <p className="text-gray-400 text-sm">Add your first category to get started</p>
              </div>
            ) : (
              <div className="space-y-4">
                {categories.map((category) => (
                  <div
                    key={category.Id}
                    className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors"
                  >
                    {editingCategory === category.Id ? (
                      <CategoryEditForm
                        category={category}
                        onSave={(data) => handleUpdateCategory(category.Id, data)}
                        onCancel={() => setEditingCategory(null)}
                        iconOptions={iconOptions}
                        colorOptions={colorOptions}
                        errors={errors}
                      />
                    ) : (
                      <>
                        <div className="flex items-center space-x-4">
                          <div
                            className="w-10 h-10 rounded-lg flex items-center justify-center"
                            style={{ backgroundColor: category.color }}
                          >
                            <ApperIcon name={category.icon} size={20} className="text-white" />
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-900">{category.name}</h4>
                            <p className="text-gray-600">{formatCurrency(category.budgetAmount)}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => setEditingCategory(category.Id)}
                          >
                            <ApperIcon name="Edit" size={16} />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleDeleteCategory(category.Id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <ApperIcon name="Trash2" size={16} />
                          </Button>
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>
      )}

      {/* Presets Tab */}
      {activeTab === "presets" && (
        <div className="space-y-6">
          <Card className="p-6">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-lg flex items-center justify-center">
                <ApperIcon name="Sparkles" size={20} className="text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Budget Templates</h3>
                <p className="text-gray-600">Quick start with pre-configured categories</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {presetTemplates.map((preset) => (
                <div key={preset.name} className="border border-gray-200 rounded-lg p-6 hover:border-gray-300 transition-colors">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center">
                      <ApperIcon name={preset.icon} size={24} className="text-white" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">{preset.name}</h4>
                      <p className="text-gray-600 text-sm">
                        {formatCurrency(preset.categories.reduce((sum, cat) => sum + cat.budgetAmount, 0))}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2 mb-4">
                    {preset.categories.slice(0, 3).map((category, index) => (
                      <div key={index} className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">{category.name}</span>
                        <span className="font-medium">{formatCurrency(category.budgetAmount)}</span>
                      </div>
                    ))}
                    {preset.categories.length > 3 && (
                      <div className="text-xs text-gray-500">
                        +{preset.categories.length - 3} more categories
                      </div>
                    )}
                  </div>

                  <Button
                    onClick={() => handleApplyPreset(preset)}
                    variant="outline"
                    className="w-full"
                  >
                    Apply Template
                  </Button>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}

function CategoryEditForm({ category, onSave, onCancel, iconOptions, colorOptions, errors }) {
  const [formData, setFormData] = useState({
    name: category.name,
    budgetAmount: category.budgetAmount.toString(),
    icon: category.icon,
    color: category.color
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="flex-1 grid grid-cols-1 md:grid-cols-4 gap-4">
      <Input
        placeholder="Category name"
        value={formData.name}
        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        error={errors.name}
      />
      
      <Input
        type="number"
        placeholder="Budget amount"
        value={formData.budgetAmount}
        onChange={(e) => setFormData({ ...formData, budgetAmount: e.target.value })}
        error={errors.budgetAmount}
      />
      
      <Select
        value={formData.icon}
        onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
      >
        {iconOptions.map(icon => (
          <option key={icon} value={icon}>{icon}</option>
        ))}
      </Select>
      
      <div className="flex items-center space-x-2">
        <div className="flex space-x-1">
          {colorOptions.slice(0, 5).map(color => (
            <button
              key={color}
              type="button"
              onClick={() => setFormData({ ...formData, color })}
              className={`w-6 h-6 rounded-full border transition-all duration-200 ${
                formData.color === color ? 'border-gray-900 scale-110' : 'border-gray-300'
              }`}
              style={{ backgroundColor: color }}
            />
          ))}
        </div>
        
        <div className="flex space-x-2">
          <Button type="submit" size="sm">Save</Button>
          <Button type="button" size="sm" variant="ghost" onClick={onCancel}>Cancel</Button>
        </div>
      </div>
    </form>
  );
}

export default Settings;