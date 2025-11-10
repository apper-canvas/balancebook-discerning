import { getApperClient } from "@/services/apperClient";
import { toast } from "react-toastify";

export const transactionService = {
  async getAll() {
    try {
      const apperClient = getApperClient();
      
      const response = await apperClient.fetchRecords("transaction_c", {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "Name"}},
          {"field": {"Name": "amount_c"}},
          {"field": {"Name": "category_c"}},
          {"field": {"Name": "date_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "notes_c"}},
          {"field": {"Name": "type_c"}}
        ],
        orderBy: [{"fieldName": "date_c", "sorttype": "DESC"}]
      });
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }
      
      return response.data || [];
    } catch (error) {
      console.error("Error fetching transactions:", error?.response?.data?.message || error);
      return [];
    }
  },

  async getById(id) {
    try {
      const apperClient = getApperClient();
      
      const response = await apperClient.getRecordById("transaction_c", parseInt(id), {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "Name"}},
          {"field": {"Name": "amount_c"}},
          {"field": {"Name": "category_c"}},
          {"field": {"Name": "date_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "notes_c"}},
          {"field": {"Name": "type_c"}}
        ]
      });
      
      if (!response.success) {
        console.error(response.message);
        return null;
      }
      
      return response.data;
    } catch (error) {
      console.error(`Error fetching transaction ${id}:`, error?.response?.data?.message || error);
      return null;
    }
  },

  async getByMonth(month) {
    try {
      const apperClient = getApperClient();
      
      const response = await apperClient.fetchRecords("transaction_c", {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "Name"}},
          {"field": {"Name": "amount_c"}},
          {"field": {"Name": "category_c"}},
          {"field": {"Name": "date_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "notes_c"}},
          {"field": {"Name": "type_c"}}
        ],
        where: [{
          "FieldName": "date_c",
          "Operator": "StartsWith",
          "Values": [month],
          "Include": true
        }],
        orderBy: [{"fieldName": "date_c", "sorttype": "DESC"}]
      });
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }
      
      return response.data || [];
    } catch (error) {
      console.error("Error fetching transactions by month:", error?.response?.data?.message || error);
      return [];
    }
  },

  async getByCategory(category) {
    try {
      const apperClient = getApperClient();
      
      const response = await apperClient.fetchRecords("transaction_c", {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "Name"}},
          {"field": {"Name": "amount_c"}},
          {"field": {"Name": "category_c"}},
          {"field": {"Name": "date_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "notes_c"}},
          {"field": {"Name": "type_c"}}
        ],
        where: [{
          "FieldName": "category_c",
          "Operator": "EqualTo",
          "Values": [category],
          "Include": true
        }]
      });
      
      if (!response.success) {
        console.error(response.message);
        return [];
      }
      
      return response.data || [];
    } catch (error) {
      console.error("Error fetching transactions by category:", error?.response?.data?.message || error);
      return [];
    }
  },

  async create(transactionData) {
    try {
      const apperClient = getApperClient();
      
      const params = {
        records: [{
          Name: transactionData.description || "Transaction",
          amount_c: parseFloat(transactionData.amount),
          category_c: transactionData.category,
          date_c: transactionData.date,
          description_c: transactionData.description,
          notes_c: transactionData.notes || "",
          type_c: transactionData.type
        }]
      };
      
      const response = await apperClient.createRecord("transaction_c", params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }
      
      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to create ${failed.length} transactions:`, failed);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }
        
        return successful.length > 0 ? successful[0].data : null;
      }
      
      return null;
    } catch (error) {
      console.error("Error creating transaction:", error?.response?.data?.message || error);
      return null;
    }
  },

  async update(id, transactionData) {
    try {
      const apperClient = getApperClient();
      
      const params = {
        records: [{
          Id: parseInt(id),
          Name: transactionData.description || "Transaction",
          amount_c: parseFloat(transactionData.amount),
          category_c: transactionData.category,
          date_c: transactionData.date,
          description_c: transactionData.description,
          notes_c: transactionData.notes || "",
          type_c: transactionData.type
        }]
      };
      
      const response = await apperClient.updateRecord("transaction_c", params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }
      
      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to update ${failed.length} transactions:`, failed);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }
        
        return successful.length > 0 ? successful[0].data : null;
      }
      
      return null;
    } catch (error) {
      console.error("Error updating transaction:", error?.response?.data?.message || error);
      return null;
    }
  },

  async delete(id) {
    try {
      const apperClient = getApperClient();
      
      const params = {
        RecordIds: [parseInt(id)]
      };
      
      const response = await apperClient.deleteRecord("transaction_c", params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return false;
      }
      
      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to delete ${failed.length} transactions:`, failed);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }
        
        return successful.length > 0;
      }
      
      return false;
    } catch (error) {
      console.error("Error deleting transaction:", error?.response?.data?.message || error);
      return false;
    }
  },

  async getIncomeExpenseTrend(months) {
    try {
      const apperClient = getApperClient();
      
      const trendData = [];
      
      for (const month of months) {
        const response = await apperClient.fetchRecords("transaction_c", {
          fields: [
            {"field": {"Name": "amount_c"}},
            {"field": {"Name": "type_c"}}
          ],
          where: [{
            "FieldName": "date_c",
            "Operator": "StartsWith",
            "Values": [month],
            "Include": true
          }]
        });
        
        if (response.success && response.data) {
          const income = response.data
            .filter(t => t.type_c === "income")
            .reduce((sum, t) => sum + (t.amount_c || 0), 0);
          const expenses = response.data
            .filter(t => t.type_c === "expense")
            .reduce((sum, t) => sum + (t.amount_c || 0), 0);
          
          trendData.push({
            month,
            income,
            expenses,
            net: income - expenses
          });
        } else {
          trendData.push({
            month,
            income: 0,
            expenses: 0,
            net: 0
          });
        }
      }
      
      return trendData;
    } catch (error) {
      console.error("Error fetching income expense trend:", error?.response?.data?.message || error);
      return [];
    }
  },

  async getCategoryBreakdown(month) {
    try {
      const apperClient = getApperClient();
      
      const response = await apperClient.fetchRecords("transaction_c", {
        fields: [
          {"field": {"Name": "amount_c"}},
          {"field": {"Name": "category_c"}}
        ],
        where: [{
          "FieldName": "date_c",
          "Operator": "StartsWith",
          "Values": [month],
          "Include": true
        }, {
          "FieldName": "type_c",
          "Operator": "EqualTo",
          "Values": ["expense"],
          "Include": true
        }]
      });
      
      if (!response.success) {
        console.error(response.message);
        return [];
      }
      
      const categoryTotals = (response.data || []).reduce((acc, transaction) => {
        const category = transaction.category_c || "Uncategorized";
        acc[category] = (acc[category] || 0) + (transaction.amount_c || 0);
        return acc;
      }, {});

      return Object.entries(categoryTotals).map(([category, amount]) => ({
        category,
        amount
      }));
    } catch (error) {
      console.error("Error fetching category breakdown:", error?.response?.data?.message || error);
      return [];
    }
  }
};