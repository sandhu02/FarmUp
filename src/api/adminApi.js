import axios from 'axios';
import { BASE_URL } from "./base_url";


// Use the correct base URL - adjust port if different

export const marketAPI = {
  // Get all items
  getItems: async (token) => {
    try {
      const response = await axios.get(`${BASE_URL}/admin/marketdata`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        }
      });
      console.log("Get Items Response:", response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching items:', error);
      console.error('Error response:', error.response?.data);
      throw error;
    }
  },

  // Create new item
  createItem: async (itemData, token) => {
    try {
      const response = await axios.post(`${BASE_URL}/admin/marketdata`, itemData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error creating item:', error);
      throw error;
    }
  },

  // Update item
  updateItem: async (itemId, itemData, token) => {
    try {
      const response = await axios.put(`${BASE_URL}/admin/marketdata/${itemId}`, itemData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error updating item:', error);
      throw error;
    }
  },

  // Delete item
  deleteItem: async (itemId, token) => {
    try {
      const response = await axios.delete(`${BASE_URL}/admin/marketdata/${itemId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error deleting item:', error);
      throw error;
    }
  }
};