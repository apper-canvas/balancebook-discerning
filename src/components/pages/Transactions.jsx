import React, { useState } from "react";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import TransactionForm from "@/components/organisms/TransactionForm";
import TransactionList from "@/components/organisms/TransactionList";
import MonthSelector from "@/components/molecules/MonthSelector";
import { getCurrentMonth } from "@/utils/dateUtils";

const Transactions = () => {
  const [selectedMonth, setSelectedMonth] = useState(getCurrentMonth());
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  return (
    <div className="space-y-8">
      {/* Header */}
<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Transactions</h1>
          <p className="text-gray-600">Manage your income and expenses</p>
        </div>
        
<div className="flex items-center space-x-4">
          <Button 
            onClick={() => setIsFormOpen(true)}
            className="flex items-center space-x-2"
          >
            <ApperIcon name="Plus" size={16} />
            <span>Add Transaction</span>
          </Button>
          <MonthSelector
            selectedMonth={selectedMonth}
            onMonthChange={setSelectedMonth}
          />
        </div>
      </div>

{/* Transaction List */}
      <TransactionList 
        selectedMonth={selectedMonth} 
        isFormOpen={isFormOpen}
        onFormOpenChange={setIsFormOpen}
        refreshTrigger={refreshTrigger}
      />

      {/* Transaction Form Modal */}
      <TransactionForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSuccess={() => {
          setRefreshTrigger(prev => prev + 1);
          setIsFormOpen(false);
        }}
/>
    </div>
  );
};

export default Transactions;