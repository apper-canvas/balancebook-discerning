import React, { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { useAuth } from "@/layouts/Root";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import { cn } from "@/utils/cn";

function MobileNav() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { logout } = useAuth();
  const navigation = [
    { name: "Dashboard", href: "/", icon: "LayoutDashboard" },
    { name: "Transactions", href: "/transactions", icon: "Receipt" },
    { name: "Budgets", href: "/budgets", icon: "Target" },
    { name: "Goals", href: "/goals", icon: "Trophy" },
    { name: "Charts", href: "/charts", icon: "PieChart" }
  ];

  return (
    <>
      {/* Mobile Header */}
      <div className="lg:hidden bg-white border-b border-gray-200 px-4 py-4 fixed top-0 left-0 right-0 z-40">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
              <ApperIcon name="Wallet" className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-lg font-bold text-gray-900">BalanceBook</h1>
          </div>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsOpen(!isOpen)}
            className="p-2"
          >
            <ApperIcon name={isOpen ? "X" : "Menu"} className="w-6 h-6" />
          </Button>
        </div>
      </div>

      {/* Mobile Overlay */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-30 lg:hidden"
              onClick={() => setIsOpen(false)}
            />
            
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed left-0 top-0 bottom-0 w-64 bg-white border-r border-gray-200 z-40 lg:hidden"
className="fixed left-0 top-0 bottom-0 w-64 bg-white border-r border-gray-200 z-40 lg:hidden"
            >
              <div className="flex flex-col h-full">
                <div className="flex items-center px-6 py-8 border-b border-gray-200">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
                      <ApperIcon name="Wallet" className="w-5 h-5 text-white" />
                    </div>
                    <h1 className="text-lg font-bold text-gray-900">BalanceBook</h1>
                  </div>
                </div>
                
                <nav className="flex-1 px-4 py-6 space-y-2">
                  {navigation.map((item) => (
                    <NavLink
                      key={item.name}
                      to={item.href}
                      onClick={() => setIsOpen(false)}
                      className={({ isActive }) =>
                        cn(
                          "flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200",
                          isActive
                            ? "bg-gradient-to-r from-primary/10 to-secondary/10 text-primary border-l-4 border-primary ml-0 pl-3"
                            : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                        )
                      }
                    >
                      {({ isActive }) => (
                        <>
                          <ApperIcon 
                            name={item.icon} 
                            className={cn(
                              "w-5 h-5 mr-3",
                              isActive ? "text-primary" : "text-gray-400"
                            )} 
                          />
                          {item.name}
                        </>
                      )}
                    </NavLink>
                  ))}
                </nav>
                
                {/* Logout Button */}
                <div className="px-4 pb-4 mt-auto">
                  <Button
                    onClick={() => {
                      logout();
                      setIsOpen(false);
                    }}
                    variant="outline"
                    className="w-full flex items-center space-x-2 text-gray-600 hover:text-gray-900"
                  >
                    <ApperIcon name="LogOut" className="h-4 w-4" />
                    <span>Logout</span>
                  </Button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
                  {navigation.map((item) => (
                    <NavLink
                      key={item.name}
                      to={item.href}
                      onClick={() => setIsOpen(false)}
                      className={({ isActive }) =>
                        cn(
                          "flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200",
                          isActive
                            ? "bg-gradient-to-r from-primary/10 to-secondary/10 text-primary border-l-4 border-primary ml-0 pl-3"
                            : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                        )
                      }
                    >
                      {({ isActive }) => (
                        <>
                          <ApperIcon 
                            name={item.icon} 
                            className={cn(
                              "w-5 h-5 mr-3",
                              isActive ? "text-primary" : "text-gray-400"
                            )} 
                          />
                          {item.name}
                        </>
                      )}
                    </NavLink>
                  ))}
export default MobileNav;