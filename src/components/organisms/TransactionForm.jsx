import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import FormField from "@/components/molecules/FormField";
import Button from "@/components/atoms/Button";
import Modal from "@/components/molecules/Modal";
import { transactionService } from "@/services/api/transactionService";
import { categoryService } from "@/services/api/categoryService";
import { formatShortDate, getCurrentMonth } from "@/utils/dateUtils";

const TransactionForm = ({ 
  isOpen, 
  onClose, 
  transaction = null, 
  onSuccess 
}) => {
  const [formData, setFormData] = useState({
    amount: "",
    category: "",
    type: "expense",
    date: formatShortDate(new Date()),
    description: "",
    notes: ""
  });
  const [categories, setCategories] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    loadCategories();
  }, []);

  useEffect(() => {
    if (transaction) {
      setFormData({
amount: (transaction.amount_c || transaction.amount || 0).toString(),
        category: transaction.category_c || transaction.category || "",
        type: transaction.type_c || transaction.type || "expense",
        date: formatShortDate(new Date(transaction.date_c || transaction.date || new Date())),
        description: transaction.description_c || transaction.description || "",
        notes: transaction.notes_c || transaction.notes || ""
      });
    } else {
      setFormData({
        amount: "",
        category: "",
        type: "expense",
        date: formatShortDate(new Date()),
        description: "",
        notes: ""
      });
    }
    setErrors({});
  }, [transaction, isOpen]);

const loadCategories = async () => {
    try {
      const data = await categoryService.getAll();
      console.log("Loaded categories:", data);
      console.log("Categories count:", data?.length || 0);
      if (data && data.length > 0) {
        console.log("First category sample:", data[0]);
      }
      setCategories(data || []);
    } catch (error) {
      console.error("Failed to load categories:", error);
      setCategories([]);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      newErrors.amount = "Amount must be greater than 0";
    }
    
    if (!formData.category) {
      newErrors.category = "Category is required";
    }
    
    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      const transactionData = {
        ...formData,
        amount: parseFloat(formData.amount),
        date: new Date(formData.date).toISOString()
      };

      if (transaction) {
        await transactionService.update(transaction.Id, transactionData);
        toast.success("Transaction updated successfully!");
      } else {
        await transactionService.create(transactionData);
        toast.success("Transaction added successfully!");
      }

      onSuccess?.();
      onClose();
    } catch (error) {
      toast.error("Failed to save transaction. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

const filteredCategories = categories.filter(cat => {
    const categoryName = cat.name_c || cat.name || "";
    const isIncomeCategory = categoryName.toLowerCase() === "income";
    const shouldInclude = formData.type === "income" ? isIncomeCategory : !isIncomeCategory;
    return shouldInclude;
  });

  console.log("Transaction type:", formData.type);
  console.log("All categories:", categories.length);
  console.log("Filtered categories:", filteredCategories.length);
  console.log("Filtered categories data:", filteredCategories);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={transaction ? "Edit Transaction" : "Add New Transaction"}
      size="lg"
      footer={
        <>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Saving..." : transaction ? "Update" : "Add"} Transaction
          </Button>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            label="Transaction Type"
            type="select"
            value={formData.type}
            onChange={(e) => handleChange("type", e.target.value)}
            error={errors.type}
            required
          >
            <option value="expense">Expense</option>
            <option value="income">Income</option>
          </FormField>

          <FormField
            label="Amount"
            type="input"
            inputType="number"
            step="0.01"
            min="0"
            placeholder="0.00"
            value={formData.amount}
            onChange={(e) => handleChange("amount", e.target.value)}
            error={errors.amount}
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            label="Category"
            type="select"
            value={formData.category}
            onChange={(e) => handleChange("category", e.target.value)}
            error={errors.category}
            required
          >
            <option value="">Select a category</option>
{filteredCategories.map((category) => {
              const categoryName = category.name_c || category.name || `Category ${category.Id}`;
              console.log("Rendering option:", {id: category.Id, name: categoryName});
              return (
                <option key={category.Id} value={categoryName}>
                  {categoryName}
                </option>
              );
            })}
            ))}
          </FormField>

          <FormField
            label="Date"
            type="input"
            inputType="date"
            value={formData.date}
            onChange={(e) => handleChange("date", e.target.value)}
            error={errors.date}
            required
          />
        </div>

        <FormField
          label="Description"
          type="input"
          placeholder="e.g., Grocery shopping at Whole Foods"
          value={formData.description}
          onChange={(e) => handleChange("description", e.target.value)}
          error={errors.description}
          required
        />

        <FormField
          label="Notes (Optional)"
          type="textarea"
          placeholder="Additional notes about this transaction..."
          value={formData.notes}
          onChange={(e) => handleChange("notes", e.target.value)}
          error={errors.notes}
        />
      </form>
    </Modal>
  );
};

export default TransactionForm;