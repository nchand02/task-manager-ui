import authService from './authService';
import { isValidTokenFormat } from '../utils/validation';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080';

/**
 * Task Service
 * Handles task-related API operations
 */
const taskService = {
  /**
   * Get authorization headers
   * @returns {Object} Headers with authorization token
   */
  getAuthHeaders: () => {
    const token = authService.getToken();
    // Validate token format before using it to prevent injection attacks
    const isValidToken = token && isValidTokenFormat(token);
    return {
      'Content-Type': 'application/json',
      ...(isValidToken && { 'Authorization': `Bearer ${token}` }),
    };
  },

  /**
   * Fetch all tasks for the current user
   * @returns {Promise<Array>} Array of tasks
   */
  getTasks: async () => {
    const response = await fetch(`${API_URL}/tasks`, {
      method: 'GET',
      headers: taskService.getAuthHeaders(),
    });

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('Unauthorized - please login');
      }
      throw new Error('Failed to fetch tasks');
    }

    const data = await response.json();
    
    if (!Array.isArray(data)) {
      throw new Error('Invalid response format');
    }

    return data;
  },

  /**
   * Get a single task by ID
   * @param {string|number} taskId - Task ID
   * @returns {Promise<Object>} Task data
   */
  getTask: async (taskId) => {
    if (!taskId) {
      throw new Error('Task ID is required');
    }

    const response = await fetch(`${API_URL}/tasks/${taskId}`, {
      method: 'GET',
      headers: taskService.getAuthHeaders(),
    });

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('Unauthorized - please login');
      }
      if (response.status === 404) {
        throw new Error('Task not found');
      }
      throw new Error('Failed to fetch task');
    }

    return await response.json();
  },

  /**
   * Create a new task
   * @param {Object} taskData - Task data
   * @returns {Promise<Object>} Created task
   */
  createTask: async (taskData) => {
    if (!taskData.title) {
      throw new Error('Task title is required');
    }

    const response = await fetch(`${API_URL}/tasks`, {
      method: 'POST',
      headers: taskService.getAuthHeaders(),
      body: JSON.stringify(taskData),
    });

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('Unauthorized - please login');
      }
      throw new Error('Failed to create task');
    }

    return await response.json();
  },

  /**
   * Update an existing task
   * @param {string|number} taskId - Task ID
   * @param {Object} taskData - Updated task data
   * @returns {Promise<Object>} Updated task
   */
  updateTask: async (taskId, taskData) => {
    if (!taskId) {
      throw new Error('Task ID is required');
    }

    const response = await fetch(`${API_URL}/tasks/${taskId}`, {
      method: 'PUT',
      headers: taskService.getAuthHeaders(),
      body: JSON.stringify(taskData),
    });

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('Unauthorized - please login');
      }
      if (response.status === 404) {
        throw new Error('Task not found');
      }
      throw new Error('Failed to update task');
    }

    return await response.json();
  },

  /**
   * Delete a task
   * @param {string|number} taskId - Task ID
   * @returns {Promise<void>}
   */
  deleteTask: async (taskId) => {
    if (!taskId) {
      throw new Error('Task ID is required');
    }

    const response = await fetch(`${API_URL}/tasks/${taskId}`, {
      method: 'DELETE',
      headers: taskService.getAuthHeaders(),
    });

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('Unauthorized - please login');
      }
      if (response.status === 404) {
        throw new Error('Task not found');
      }
      throw new Error('Failed to delete task');
    }
  },
};

export default taskService;
