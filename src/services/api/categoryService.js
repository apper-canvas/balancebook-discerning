import { getApperClient } from "@/services/apperClient";
import { toast } from "react-toastify";
import React from "react";

export const categoryService = {
  async getAll() {
    try {
      const apperClient = getApperClient();
      
      const response = await apperClient.fetchRecords("category_c", {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "Name"}},
          {"field": {"Name": "color_c"}},
          {"field": {"Name": "icon_c"}},
          {"field": {"Name": "is_custom_c"}},
          {"field": {"Name": "name_c"}}
        ]
      });
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }
      
      return response.data || [];
    } catch (error) {
      console.error("Error fetching categories:", error?.response?.data?.message || error);
      return [];
    }
  },

  async getById(id) {
    try {
      const apperClient = getApperClient();
      
      const response = await apperClient.getRecordById("category_c", parseInt(id), {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "Name"}},
          {"field": {"Name": "color_c"}},
          {"field": {"Name": "icon_c"}},
          {"field": {"Name": "is_custom_c"}},
          {"field": {"Name": "name_c"}}
        ]
      });
      
      if (!response.success) {
        console.error(response.message);
        return null;
      }
      
      return response.data;
    } catch (error) {
      console.error(`Error fetching category ${id}:`, error?.response?.data?.message || error);
      return null;
    }
  },

  async getByName(name) {
    try {
      const apperClient = getApperClient();
      
      const response = await apperClient.fetchRecords("category_c", {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "Name"}},
          {"field": {"Name": "color_c"}},
          {"field": {"Name": "icon_c"}},
          {"field": {"Name": "is_custom_c"}},
          {"field": {"Name": "name_c"}}
        ],
        where: [{
          "FieldName": "name_c",
          "Operator": "EqualTo",
          "Values": [name],
          "Include": true
        }],
        pagingInfo: {
          "limit": 1,
          "offset": 0
        }
      });
      
      if (!response.success) {
        console.error(response.message);
        return null;
      }
      
      return response.data && response.data.length > 0 ? response.data[0] : null;
    } catch (error) {
      console.error("Error fetching category by name:", error?.response?.data?.message || error);
      return null;
    }
  },

  async create(categoryData) {
    try {
      const apperClient = getApperClient();
      
      const params = {
        records: [{
          Name: categoryData.name || categoryData.name_c,
          color_c: categoryData.color || categoryData.color_c,
          icon_c: categoryData.icon || categoryData.icon_c,
          is_custom_c: categoryData.isCustom !== undefined ? categoryData.isCustom : true,
          name_c: categoryData.name || categoryData.name_c
        }]
      };
      
      const response = await apperClient.createRecord("category_c", params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }
      
      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to create ${failed.length} categories:`, failed);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }
        
        return successful.length > 0 ? successful[0].data : null;
      }
      
      return null;
    } catch (error) {
      console.error("Error creating category:", error?.response?.data?.message || error);
      return null;
    }
  },

  async update(id, categoryData) {
    try {
      const apperClient = getApperClient();
      
      const params = {
        records: [{
          Id: parseInt(id),
          Name: categoryData.name || categoryData.name_c,
          color_c: categoryData.color || categoryData.color_c,
          icon_c: categoryData.icon || categoryData.icon_c,
          is_custom_c: categoryData.isCustom !== undefined ? categoryData.isCustom : undefined,
          name_c: categoryData.name || categoryData.name_c
        }]
      };
      
      const response = await apperClient.updateRecord("category_c", params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }
      
      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to update ${failed.length} categories:`, failed);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }
        
        return successful.length > 0 ? successful[0].data : null;
      }
      
      return null;
    } catch (error) {
      console.error("Error updating category:", error?.response?.data?.message || error);
      return null;
    }
  },

  async delete(id) {
    try {
      const apperClient = getApperClient();
      
      // First check if category is custom
      const category = await this.getById(id);
      if (!category || !category.is_custom_c) {
        toast.error("Category not found or cannot be deleted");
        return false;
      }
      
      const params = {
        RecordIds: [parseInt(id)]
      };
      
      const response = await apperClient.deleteRecord("category_c", params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return false;
      }
      
      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to delete ${failed.length} categories:`, failed);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }
        
        return successful.length > 0;
      }
      
      return false;
    } catch (error) {
      console.error("Error deleting category:", error?.response?.data?.message || error);
      return false;
}
  }
};