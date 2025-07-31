import { useLocation, useNavigate } from "react-router-dom";
import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";

const BottomNavigation = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const navItems = [
    { path: "/", icon: "Home", label: "Dashboard" },
    { path: "/transactions", icon: "Receipt", label: "Transactions" },
    { path: "/reports", icon: "BarChart3", label: "Reports" },
    { path: "/settings", icon: "Settings", label: "Settings" }
  ];

  return (
    <div className="bottom-nav">
      {navItems.map((item) => (
        <button
          key={item.path}
          onClick={() => navigate(item.path)}
          className={cn(
            "bottom-nav-item",
            location.pathname === item.path && "active"
          )}
        >
          <ApperIcon 
            name={item.icon} 
            size={20} 
            className="mb-1"
          />
          <span className="text-xs font-medium">{item.label}</span>
        </button>
      ))}
    </div>
  );
};

export default BottomNavigation;