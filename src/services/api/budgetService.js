import { getApperClient } from "@/services/apperClient";
import { toast } from "react-toastify";

export const budgetService = {
  async getAll() {
    try {
      const apperClient = getApperClient();
      
      const response = await apperClient.fetchRecords("budget_c", {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "Name"}},
          {"field": {"Name": "category_c"}},
          {"field": {"Name": "month_c"}},
          {"field": {"Name": "monthly_limit_c"}},
          {"field": {"Name": "rollover_c"}},
          {"field": {"Name": "spent_c"}}
        ]
      });
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }
      
      return response.data || [];
    } catch (error) {
      console.error("Error fetching budgets:", error?.response?.data?.message || error);
      return [];
    }
  },

  async getById(id) {
    try {
      const apperClient = getApperClient();
      
      const response = await apperClient.getRecordById("budget_c", parseInt(id), {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "Name"}},
          {"field": {"Name": "category_c"}},
          {"field": {"Name": "month_c"}},
          {"field": {"Name": "monthly_limit_c"}},
          {"field": {"Name": "rollover_c"}},
          {"field": {"Name": "spent_c"}}
        ]
      });
      
      if (!response.success) {
        console.error(response.message);
        return null;
      }
      
      return response.data;
    } catch (error) {
      console.error(`Error fetching budget ${id}:`, error?.response?.data?.message || error);
      return null;
    }
  },

  async getByMonth(month) {
    try {
      const apperClient = getApperClient();
      
      const response = await apperClient.fetchRecords("budget_c", {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "Name"}},
          {"field": {"Name": "category_c"}},
          {"field": {"Name": "month_c"}},
          {"field": {"Name": "monthly_limit_c"}},
          {"field": {"Name": "rollover_c"}},
          {"field": {"Name": "spent_c"}}
        ],
        where: [{
          "FieldName": "month_c",
          "Operator": "EqualTo",
          "Values": [month],
          "Include": true
        }]
      });
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }
      
      return response.data || [];
    } catch (error) {
      console.error("Error fetching budgets by month:", error?.response?.data?.message || error);
      return [];
    }
  },

  async create(budgetData) {
    try {
      const apperClient = getApperClient();
      
      const params = {
        records: [{
          Name: `${budgetData.category} - ${budgetData.month}`,
          category_c: budgetData.category,
          month_c: budgetData.month,
          monthly_limit_c: parseFloat(budgetData.monthlyLimit || budgetData.monthly_limit_c),
          rollover_c: parseFloat(budgetData.rollover || 0),
          spent_c: parseFloat(budgetData.spent || 0)
        }]
      };
      
      const response = await apperClient.createRecord("budget_c", params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }
      
      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to create ${failed.length} budgets:`, failed);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }
        
        return successful.length > 0 ? successful[0].data : null;
      }
      
      return null;
    } catch (error) {
      console.error("Error creating budget:", error?.response?.data?.message || error);
      return null;
    }
  },

  async update(id, budgetData) {
    try {
      const apperClient = getApperClient();
      
      const params = {
        records: [{
          Id: parseInt(id),
          Name: budgetData.category && budgetData.month ? 
                `${budgetData.category} - ${budgetData.month}` : undefined,
          category_c: budgetData.category,
          month_c: budgetData.month,
          monthly_limit_c: budgetData.monthlyLimit !== undefined ? 
                            parseFloat(budgetData.monthlyLimit) : undefined,
          rollover_c: budgetData.rollover !== undefined ? 
                      parseFloat(budgetData.rollover) : undefined,
          spent_c: budgetData.spent !== undefined ? 
                   parseFloat(budgetData.spent) : undefined
        }]
      };
      
      const response = await apperClient.updateRecord("budget_c", params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }
      
      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to update ${failed.length} budgets:`, failed);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }
        
        return successful.length > 0 ? successful[0].data : null;
      }
      
      return null;
    } catch (error) {
      console.error("Error updating budget:", error?.response?.data?.message || error);
      return null;
    }
  },

  async updateSpent(category, month, amount) {
    try {
      const apperClient = getApperClient();
      
      // First find the budget
      const response = await apperClient.fetchRecords("budget_c", {
        fields: [{"field": {"Name": "Id"}}],
        where: [{
          "FieldName": "category_c",
          "Operator": "EqualTo",
          "Values": [category],
          "Include": true
        }, {
          "FieldName": "month_c",
          "Operator": "EqualTo",
          "Values": [month],
          "Include": true
        }],
        pagingInfo: {
          "limit": 1,
          "offset": 0
        }
      });
      
      if (!response.success || !response.data || response.data.length === 0) {
        return null;
      }
      
      const budgetId = response.data[0].Id;
      
      // Update the spent amount
      const updateParams = {
        records: [{
          Id: budgetId,
          spent_c: parseFloat(amount)
        }]
      };
      
      const updateResponse = await apperClient.updateRecord("budget_c", updateParams);
      
      if (!updateResponse.success) {
        console.error(updateResponse.message);
        return null;
      }
      
      if (updateResponse.results && updateResponse.results.length > 0) {
        const successful = updateResponse.results.filter(r => r.success);
        return successful.length > 0 ? successful[0].data : null;
      }
      
      return null;
    } catch (error) {
      console.error("Error updating spent amount:", error?.response?.data?.message || error);
      return null;
    }
  },

  async delete(id) {
    try {
      const apperClient = getApperClient();
      
      const params = {
        RecordIds: [parseInt(id)]
      };
      
      const response = await apperClient.deleteRecord("budget_c", params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return false;
      }
      
      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to delete ${failed.length} budgets:`, failed);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }
        
        return successful.length > 0;
      }
      
      return false;
    } catch (error) {
      console.error("Error deleting budget:", error?.response?.data?.message || error);
      return false;
    }
  },

  async getBudgetSummary(month) {
    try {
      const monthBudgets = await this.getByMonth(month);
      
      const totalBudget = monthBudgets.reduce((sum, b) => sum + (b.monthly_limit_c || 0), 0);
      const totalSpent = monthBudgets.reduce((sum, b) => sum + (b.spent_c || 0), 0);
      const remaining = totalBudget - totalSpent;
      const percentage = totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0;

      return {
        totalBudget,
        totalSpent,
        remaining,
        percentage,
        categories: monthBudgets.length
      };
    } catch (error) {
      console.error("Error getting budget summary:", error?.response?.data?.message || error);
      return {
        totalBudget: 0,
        totalSpent: 0,
        remaining: 0,
        percentage: 0,
        categories: 0
      };
    }
  }
};