const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080';

/**
 * Authentication Service
 * Handles user authentication operations
 */
const authService = {
  /**
   * Login user with credentials
   * @param {string} username - User's username
   * @param {string} password - User's password
   * @returns {Promise<Object>} User data and authentication token
   */
  login: async (username, password) => {
    if (!username || !password) {
      throw new Error('Username and password are required');
    }

    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });

    if (!response.ok) {
      throw new Error('Authentication failed');
    }

    const data = await response.json();
    
    // Validate and store token securely
    // WARNING: sessionStorage is vulnerable to XSS attacks
    // For production, implement one of these alternatives:
    // 1. Use httpOnly, secure cookies (recommended - requires backend support)
    // 2. Store in memory only and require re-authentication on page refresh
    // 3. Use a secure token storage library
    if (data.token && typeof data.token === 'string') {
      // Basic validation - in production, consider using a JWT validation library
      if (data.token.length > 0 && data.token.length < 2048) {
        sessionStorage.setItem('authToken', data.token);
      } else {
        throw new Error('Invalid token format received from server');
      }
    }

    return data;
  },

  /**
   * Register new user
   * @param {Object} userData - User registration data
   * @returns {Promise<Object>} Created user data
   */
  register: async (userData) => {
    if (!userData.username || !userData.password || !userData.email) {
      throw new Error('Username, password, and email are required');
    }

    const response = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      throw new Error('Registration failed');
    }

    return await response.json();
  },

  /**
   * Logout current user
   */
  logout: () => {
    sessionStorage.removeItem('authToken');
  },

  /**
   * Get current authentication token
   * @returns {string|null} Authentication token
   */
  getToken: () => {
    return sessionStorage.getItem('authToken');
  },

  /**
   * Check if user is authenticated
   * @returns {boolean} True if user is authenticated
   */
  isAuthenticated: () => {
    return !!sessionStorage.getItem('authToken');
  },
};

export default authService;
