import { NavLink, useLocation } from "react-router-dom";
import { useAuth } from "@/layouts/Root";
import React from "react";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import { cn } from "@/utils/cn";
function Sidebar({ className }) {
  const location = useLocation();
  const { logout } = useAuth();
  
  const navigation = [
    { name: "Dashboard", href: "/", icon: "LayoutDashboard" },
    { name: "Transactions", href: "/transactions", icon: "Receipt" },
    { name: "Budgets", href: "/budgets", icon: "Target" },
    { name: "Goals", href: "/goals", icon: "TrendingUp" },
    { name: "Charts", href: "/charts", icon: "BarChart3" }
  ];

  return (
    <div className={cn(
      "fixed top-0 left-0 h-full w-64 bg-white shadow-lg border-r border-gray-200 z-40 flex flex-col",
      className
    )}>
      <div className="p-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-r from-primary to-secondary rounded-lg flex items-center justify-center">
            <ApperIcon name="Wallet" className="h-6 w-6 text-white" />
          </div>
          <h1 className="text-xl font-bold text-gray-900">BalanceBook</h1>
        </div>
      </div>

      <nav className="mt-8 space-y-2 flex-1 px-4">
        {navigation.map((item) => {
          const isActive = item.href === "/" 
            ? location.pathname === "/" 
            : location.pathname.startsWith(item.href);
            
          return (
            <NavLink
              key={item.name}
              to={item.href}
              className={cn(
                "flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200",
                isActive
                  ? "bg-gradient-to-r from-primary to-secondary text-white shadow-lg"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              )}
            >
              <ApperIcon name={item.icon} className="h-5 w-5" />
              <span>{item.name}</span>
            </NavLink>
          );
        })}
      </nav>
      
      {/* Logout Button */}
      <div className="p-6 mt-auto">
        <Button
          onClick={logout}
          variant="outline"
          className="w-full flex items-center space-x-2 text-gray-600 hover:text-gray-900"
        >
          <ApperIcon name="LogOut" className="h-4 w-4" />
          <span>Logout</span>
        </Button>
      </div>
    </div>
  );
}

export default Sidebar;