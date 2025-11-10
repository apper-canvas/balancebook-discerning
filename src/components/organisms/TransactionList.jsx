import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Card from "@/components/atoms/Card";
import Badge from "@/components/atoms/Badge";
import Button from "@/components/atoms/Button";
import { transactionService } from "@/services/api/transactionService";
import { formatCurrency } from "@/utils/formatCurrency";
import { formatDate } from "@/utils/dateUtils";
import { cn } from "@/utils/cn";

function TransactionList({ selectedMonth, limit }) {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadTransactions();
  }, [selectedMonth, limit]);

  const loadTransactions = async () => {
    try {
      setLoading(true);
      let data;
      if (selectedMonth) {
        data = await transactionService.getByMonth(selectedMonth);
      } else {
        data = await transactionService.getAll();
      }
      
      // Apply limit if specified
      if (limit && data.length > limit) {
        data = data.slice(0, limit);
      }
      
      setTransactions(data);
      setError(null);
    } catch (error) {
      console.error("Failed to load transactions:", error);
      setError("Failed to load transactions");
    } finally {
      setLoading(false);
    }
  };

  const getTypeIcon = (type) => {
    return type === "income" ? "TrendingUp" : "TrendingDown";
  };

  const getTypeColor = (type) => {
    return type === "income" ? "text-success" : "text-error";
  };

  if (loading) {
    return (
      <Card className="p-6">
        <div className="animate-pulse space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
              <div className="h-6 bg-gray-200 rounded w-16"></div>
            </div>
          ))}
        </div>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="p-6 text-center">
        <div className="text-error mb-4">
          <ApperIcon name="AlertCircle" className="h-12 w-12 mx-auto mb-2" />
          <p className="text-lg font-semibold">Error Loading Transactions</p>
          <p className="text-sm text-gray-600 mt-1">{error}</p>
        </div>
        <Button onClick={loadTransactions} variant="outline">
          <ApperIcon name="RefreshCw" className="h-4 w-4 mr-2" />
          Retry
        </Button>
      </Card>
    );
  }

  if (transactions.length === 0) {
    return (
      <Card className="p-6 text-center">
        <div className="text-gray-400 mb-4">
          <ApperIcon name="Receipt" className="h-12 w-12 mx-auto mb-2" />
          <p className="text-lg font-semibold">No Transactions</p>
          <p className="text-sm text-gray-600 mt-1">
            {selectedMonth ? `No transactions found for ${selectedMonth}` : "No transactions found"}
          </p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <div className="space-y-4">
        <AnimatePresence mode="wait">
          {transactions.map((transaction) => (
            <motion.div
              key={transaction.Id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
              className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-lg transition-colors"
            >
              <div className="flex items-center space-x-4">
                <div className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center",
                  (transaction.type_c || transaction.type) === "income" 
                    ? "bg-success/10" 
                    : "bg-error/10"
                )}>
                  <ApperIcon 
                    name={getTypeIcon(transaction.type_c || transaction.type)} 
                    className={cn("h-5 w-5", getTypeColor(transaction.type_c || transaction.type))}
                  />
                </div>
                <div>
                  <p className="font-medium text-gray-900">
                    {transaction.description_c || transaction.description || transaction.Name}
                  </p>
                  <div className="flex items-center space-x-2 text-sm text-gray-500">
                    <span>{transaction.category_c || transaction.category}</span>
                    <span>•</span>
                    <span>{formatDate(transaction.date_c || transaction.date)}</span>
                  </div>
                </div>
              </div>
              
              <div className="text-right">
                <div className={cn(
                  "font-semibold",
                  getTypeColor(transaction.type_c || transaction.type)
                )}>
                  {(transaction.type_c || transaction.type) === "income" ? "+" : "-"}
                  {formatCurrency(transaction.amount_c || transaction.amount)}
                </div>
                {transaction.notes_c || transaction.notes ? (
                  <p className="text-xs text-gray-400 mt-1 truncate max-w-32">
                    {transaction.notes_c || transaction.notes}
                  </p>
                ) : null}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </Card>
  );
}

export default TransactionList;