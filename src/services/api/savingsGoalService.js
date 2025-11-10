import { getApperClient } from "@/services/apperClient";
import { toast } from "react-toastify";

export const savingsGoalService = {
  async getAll() {
    try {
      const apperClient = getApperClient();
      
      const response = await apperClient.fetchRecords("savings_goal_c", {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "Name"}},
          {"field": {"Name": "current_amount_c"}},
          {"field": {"Name": "deadline_c"}},
          {"field": {"Name": "name_c"}},
          {"field": {"Name": "priority_c"}},
          {"field": {"Name": "target_amount_c"}}
        ],
        orderBy: [{
          "fieldName": "priority_c",
          "sorttype": "ASC"
        }]
      });
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }
      
      return response.data || [];
    } catch (error) {
      console.error("Error fetching savings goals:", error?.response?.data?.message || error);
      return [];
    }
  },

  async getById(id) {
    try {
      const apperClient = getApperClient();
      
      const response = await apperClient.getRecordById("savings_goal_c", parseInt(id), {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "Name"}},
          {"field": {"Name": "current_amount_c"}},
          {"field": {"Name": "deadline_c"}},
          {"field": {"Name": "name_c"}},
          {"field": {"Name": "priority_c"}},
          {"field": {"Name": "target_amount_c"}}
        ]
      });
      
      if (!response.success) {
        console.error(response.message);
        return null;
      }
      
      return response.data;
    } catch (error) {
      console.error(`Error fetching savings goal ${id}:`, error?.response?.data?.message || error);
      return null;
    }
  },

  async create(goalData) {
    try {
      const apperClient = getApperClient();
      
      const params = {
        records: [{
          Name: goalData.name || goalData.name_c,
          current_amount_c: parseFloat(goalData.currentAmount || 0),
          deadline_c: goalData.deadline || goalData.deadline_c,
          name_c: goalData.name || goalData.name_c,
          priority_c: goalData.priority || goalData.priority_c,
          target_amount_c: parseFloat(goalData.targetAmount || goalData.target_amount_c)
        }]
      };
      
      const response = await apperClient.createRecord("savings_goal_c", params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }
      
      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to create ${failed.length} savings goals:`, failed);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }
        
        return successful.length > 0 ? successful[0].data : null;
      }
      
      return null;
    } catch (error) {
      console.error("Error creating savings goal:", error?.response?.data?.message || error);
      return null;
    }
  },

  async update(id, goalData) {
    try {
      const apperClient = getApperClient();
      
      const params = {
        records: [{
          Id: parseInt(id),
          Name: goalData.name || goalData.name_c,
          current_amount_c: goalData.currentAmount !== undefined ? 
                             parseFloat(goalData.currentAmount) : undefined,
          deadline_c: goalData.deadline || goalData.deadline_c,
          name_c: goalData.name || goalData.name_c,
          priority_c: goalData.priority || goalData.priority_c,
          target_amount_c: goalData.targetAmount !== undefined ? 
                            parseFloat(goalData.targetAmount) : undefined
        }]
      };
      
      const response = await apperClient.updateRecord("savings_goal_c", params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }
      
      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to update ${failed.length} savings goals:`, failed);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }
        
        return successful.length > 0 ? successful[0].data : null;
      }
      
      return null;
    } catch (error) {
      console.error("Error updating savings goal:", error?.response?.data?.message || error);
      return null;
    }
  },

  async addContribution(id, amount) {
    try {
      const apperClient = getApperClient();
      
      // First get current amount
      const goal = await this.getById(id);
      if (!goal) {
        toast.error("Savings goal not found");
        return null;
      }
      
      const newAmount = (goal.current_amount_c || 0) + parseFloat(amount);
      
      const params = {
        records: [{
          Id: parseInt(id),
          current_amount_c: newAmount
        }]
      };
      
      const response = await apperClient.updateRecord("savings_goal_c", params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }
      
      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to add contribution to ${failed.length} savings goals:`, failed);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }
        
        return successful.length > 0 ? successful[0].data : null;
      }
      
      return null;
    } catch (error) {
      console.error("Error adding contribution:", error?.response?.data?.message || error);
      return null;
    }
  },

  async delete(id) {
    try {
      const apperClient = getApperClient();
      
      const params = {
        RecordIds: [parseInt(id)]
      };
      
      const response = await apperClient.deleteRecord("savings_goal_c", params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return false;
      }
      
      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to delete ${failed.length} savings goals:`, failed);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }
        
        return successful.length > 0;
      }
      
      return false;
    } catch (error) {
      console.error("Error deleting savings goal:", error?.response?.data?.message || error);
      return false;
    }
  },

  async getGoalsSummary() {
    try {
      const goals = await this.getAll();
      
      const totalTargetAmount = goals.reduce((sum, goal) => sum + (goal.target_amount_c || 0), 0);
      const totalCurrentAmount = goals.reduce((sum, goal) => sum + (goal.current_amount_c || 0), 0);
      const totalRemaining = totalTargetAmount - totalCurrentAmount;
      const overallProgress = totalTargetAmount > 0 ? (totalCurrentAmount / totalTargetAmount) * 100 : 0;
      
      const activeGoals = goals.filter(goal => 
        (goal.current_amount_c || 0) < (goal.target_amount_c || 0)
      );
      const completedGoals = goals.filter(goal => 
        (goal.current_amount_c || 0) >= (goal.target_amount_c || 0)
      );

      return {
        totalTargetAmount,
        totalCurrentAmount,
        totalRemaining,
        overallProgress,
        activeGoalsCount: activeGoals.length,
        completedGoalsCount: completedGoals.length,
        totalGoalsCount: goals.length
      };
    } catch (error) {
      console.error("Error getting goals summary:", error?.response?.data?.message || error);
      return {
        totalTargetAmount: 0,
        totalCurrentAmount: 0,
        totalRemaining: 0,
        overallProgress: 0,
        activeGoalsCount: 0,
        completedGoalsCount: 0,
        totalGoalsCount: 0
      };
    }
  }
};