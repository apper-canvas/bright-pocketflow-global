import CategoryCard from "@/components/molecules/CategoryCard";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";

const BudgetCategories = ({ categories, loading, error, onRetry }) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="bg-white rounded-xl p-4 shadow-elevation-2 animate-pulse">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gray-200 rounded-lg"></div>
                <div className="h-5 bg-gray-200 rounded w-20"></div>
              </div>
              <div className="h-6 bg-gray-200 rounded w-16"></div>
            </div>
            <div className="w-full h-2 bg-gray-200 rounded-full mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-24"></div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <Error 
        message="Failed to load budget categories" 
        onRetry={onRetry}
      />
    );
  }

  if (!categories || categories.length === 0) {
    return (
      <Empty
        title="No budget categories"
        description="Create your first budget category to start tracking expenses"
        icon="PieChart"
        actionLabel="Add Category"
        onAction={() => {}}
      />
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {categories.map((category) => (
        <CategoryCard
          key={category.Id}
          category={category}
        />
      ))}
    </div>
  );
};

export default BudgetCategories;