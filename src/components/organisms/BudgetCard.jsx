import { useState } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import ProgressBar from "@/components/molecules/ProgressBar";
import Modal from "@/components/molecules/Modal";
import FormField from "@/components/molecules/FormField";
import { budgetService } from "@/services/api/budgetService";
import { formatCurrency } from "@/utils/formatCurrency";
import { cn } from "@/utils/cn";

function BudgetCard({ budget, categoryInfo, onUpdate }) {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [editForm, setEditForm] = useState({
    monthlyLimit: ""
  });

  const progressPercentage = budget.monthly_limit_c > 0 ? 
    ((budget.spent_c || 0) / budget.monthly_limit_c) * 100 : 0;
  
  const remaining = budget.monthly_limit_c - (budget.spent_c || 0);
  const isOverBudget = remaining < 0;

  const getProgressColor = () => {
    if (progressPercentage <= 50) return "success";
    if (progressPercentage <= 80) return "warning";
    return "error";
  };

  const handleEdit = () => {
    setEditForm({
      monthlyLimit: budget.monthly_limit_c?.toString() || ""
    });
    setIsEditModalOpen(true);
  };

  const handleSaveEdit = async () => {
    try {
      const amount = parseFloat(editForm.monthlyLimit);
      if (isNaN(amount) || amount <= 0) {
        toast.error("Please enter a valid budget amount");
        return;
      }

      await budgetService.update(budget.Id, {
        monthlyLimit: amount
      });

      toast.success("Budget updated successfully!");
      setIsEditModalOpen(false);
      onUpdate?.();
    } catch (error) {
      console.error("Failed to update budget:", error);
      toast.error("Failed to update budget");
    }
  };

  const handleDelete = async () => {
    try {
      await budgetService.delete(budget.Id);
      toast.success("Budget deleted successfully!");
      setIsDeleteModalOpen(false);
      onUpdate?.();
    } catch (error) {
      console.error("Failed to delete budget:", error);
      toast.error("Failed to delete budget");
    }
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.2 }}
      >
        <Card className="p-6 hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div 
                className="w-12 h-12 rounded-lg flex items-center justify-center text-white"
                style={{ backgroundColor: categoryInfo.color }}
              >
                <ApperIcon name={categoryInfo.icon} className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">
                  {budget.category_c || budget.category}
                </h3>
                <p className="text-sm text-gray-500">
                  {budget.month_c || budget.month}
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleEdit}
                className="text-gray-400 hover:text-gray-600"
              >
                <ApperIcon name="Edit2" className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsDeleteModalOpen(true)}
                className="text-gray-400 hover:text-red-600"
              >
                <ApperIcon name="Trash2" className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-600">Spent</span>
              <span className="font-medium">
                {formatCurrency(budget.spent_c || 0)} of {formatCurrency(budget.monthly_limit_c || 0)}
              </span>
            </div>

            <ProgressBar
              value={budget.spent_c || 0}
              max={budget.monthly_limit_c || 1}
              color={getProgressColor()}
              showPercentage={true}
            />

            <div className="flex justify-between items-center">
              <div className="text-center">
                <div className={cn(
                  "text-lg font-bold",
                  isOverBudget ? "text-error" : "text-success"
                )}>
                  {formatCurrency(Math.abs(remaining))}
                </div>
                <div className="text-xs text-gray-500">
                  {isOverBudget ? "Over Budget" : "Remaining"}
                </div>
              </div>
              
              <div className="text-center">
                <div className="text-lg font-bold text-primary">
                  {progressPercentage.toFixed(1)}%
                </div>
                <div className="text-xs text-gray-500">Used</div>
              </div>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Edit Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit Budget"
      >
        <div className="space-y-4">
          <FormField
            label="Monthly Budget Limit"
            type="number"
            value={editForm.monthlyLimit}
            onChange={(e) => setEditForm(prev => ({ ...prev, monthlyLimit: e.target.value }))}
            placeholder="Enter budget amount"
          />
          
          <div className="flex space-x-3 pt-4">
            <Button onClick={handleSaveEdit} className="flex-1">
              Save Changes
            </Button>
            <Button 
              variant="outline" 
              onClick={() => setIsEditModalOpen(false)}
              className="flex-1"
            >
              Cancel
            </Button>
          </div>
        </div>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Delete Budget"
      >
        <div className="space-y-4">
          <p className="text-gray-600">
            Are you sure you want to delete the budget for "{budget.category_c || budget.category}"? 
            This action cannot be undone.
          </p>
          
          <div className="flex space-x-3">
            <Button 
              variant="destructive" 
              onClick={handleDelete}
              className="flex-1"
            >
              Delete
            </Button>
            <Button 
              variant="outline" 
              onClick={() => setIsDeleteModalOpen(false)}
              className="flex-1"
            >
              Cancel
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}

export default BudgetCard;