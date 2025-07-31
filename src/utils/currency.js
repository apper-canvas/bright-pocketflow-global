export const formatCurrency = (amount) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
};

export const formatPercentage = (value) => {
  return `${Math.round(value)}%`;
};

export const getBudgetStatus = (spent, budget) => {
  const percentage = (spent / budget) * 100;
  
  if (percentage >= 100) return "over";
  if (percentage >= 85) return "warning";
  if (percentage >= 75) return "alert";
  return "good";
};

export const getBudgetStatusColor = (status) => {
  switch (status) {
    case "good":
      return "text-success border-success";
    case "warning":
      return "text-warning border-warning";
    case "over":
      return "text-danger border-danger";
    default:
      return "text-gray-500 border-gray-200";
  }
};

export const getBudgetProgressColor = (status) => {
  switch (status) {
    case "good":
      return "bg-gradient-success";
    case "warning":
      return "bg-gradient-warning";
    case "over":
      return "bg-gradient-danger";
    default:
      return "bg-gray-200";
  }
};