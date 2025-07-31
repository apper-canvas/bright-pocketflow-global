import { useState } from "react";
import ApperIcon from "@/components/ApperIcon";
import ExpenseModal from "@/components/organisms/ExpenseModal";
import { cn } from "@/utils/cn";

const FloatingActionButton = ({ onExpenseAdded }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleExpenseAdded = (expense) => {
    onExpenseAdded(expense);
    setIsModalOpen(false);
  };

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        className={cn(
          "fab group",
          "hover:shadow-2xl active:scale-95"
        )}
        aria-label="Add expense"
      >
        <ApperIcon 
          name="Plus" 
          size={24} 
          className="transition-transform duration-200 group-hover:rotate-90" 
        />
      </button>

      <ExpenseModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onExpenseAdded={handleExpenseAdded}
      />
    </>
  );
};

export default FloatingActionButton;