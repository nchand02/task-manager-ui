/**
 * Validation utility functions
 */

/**
 * Validates email format using a more comprehensive regex
 * Based on the W3C HTML5 email validation pattern
 * @param {string} email - Email address to validate
 * @returns {boolean} True if email format is valid
 */
export const isValidEmail = (email) => {
  if (!email || typeof email !== 'string') {
    return false;
  }
  
  // W3C HTML5 email validation pattern
  // This is a practical validation that catches most common errors
  // while not being as strict as RFC 5322
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
  
  return emailRegex.test(email) && email.length <= 254;
};

/**
 * Validates password strength
 * @param {string} password - Password to validate
 * @returns {Object} Object with isValid boolean and message string
 */
export const validatePassword = (password) => {
  if (!password || typeof password !== 'string') {
    return { isValid: false, message: 'Password is required' };
  }
  
  if (password.length < 8) {
    return { isValid: false, message: 'Password must be at least 8 characters long' };
  }
  
  if (password.length > 128) {
    return { isValid: false, message: 'Password is too long (maximum 128 characters)' };
  }
  
  // Recommend additional complexity for production
  // Uncomment for stricter validation:
  // if (!/[A-Z]/.test(password)) {
  //   return { isValid: false, message: 'Password must contain at least one uppercase letter' };
  // }
  // if (!/[a-z]/.test(password)) {
  //   return { isValid: false, message: 'Password must contain at least one lowercase letter' };
  // }
  // if (!/[0-9]/.test(password)) {
  //   return { isValid: false, message: 'Password must contain at least one number' };
  // }
  // if (!/[!@#$%^&*]/.test(password)) {
  //   return { isValid: false, message: 'Password must contain at least one special character' };
  // }
  
  return { isValid: true, message: 'Password is valid' };
};

/**
 * Validates username format
 * @param {string} username - Username to validate
 * @returns {Object} Object with isValid boolean and message string
 */
export const validateUsername = (username) => {
  if (!username || typeof username !== 'string') {
    return { isValid: false, message: 'Username is required' };
  }
  
  const trimmed = username.trim();
  
  if (trimmed.length < 3) {
    return { isValid: false, message: 'Username must be at least 3 characters long' };
  }
  
  if (trimmed.length > 50) {
    return { isValid: false, message: 'Username is too long (maximum 50 characters)' };
  }
  
  // Allow alphanumeric, underscore, and hyphen
  if (!/^[a-zA-Z0-9_-]+$/.test(trimmed)) {
    return { isValid: false, message: 'Username can only contain letters, numbers, underscores, and hyphens' };
  }
  
  return { isValid: true, message: 'Username is valid' };
};

/**
 * Sanitizes string input to prevent XSS
 * NOTE: This is a basic sanitization function. For production applications
 * that need to handle rich text or HTML content, use a dedicated library
 * like DOMPurify for comprehensive XSS protection.
 * 
 * @param {string} input - Input string to sanitize
 * @returns {string} Sanitized string
 */
export const sanitizeInput = (input) => {
  if (!input || typeof input !== 'string') {
    return '';
  }
  
  // Remove any HTML tags
  let sanitized = input.replace(/<[^>]*>/g, '');
  
  // Escape HTML entities to prevent entity-based XSS
  sanitized = sanitized
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
  
  return sanitized.trim();
};

/**
 * Validates JWT token format
 * Basic validation to ensure token structure is correct
 * Does NOT verify signature - that should be done on the server
 * 
 * @param {string} token - JWT token to validate
 * @returns {boolean} True if token format is valid
 */
export const isValidJWTFormat = (token) => {
  if (!token || typeof token !== 'string') {
    return false;
  }
  
  // JWT tokens should be in format: header.payload.signature
  const parts = token.split('.');
  if (parts.length !== 3) {
    return false;
  }
  
  // Each part should be base64url encoded (alphanumeric, -, _)
  const base64UrlPattern = /^[A-Za-z0-9_-]+$/;
  return parts.every(part => part.length > 0 && base64UrlPattern.test(part));
};

/**
 * Validates token format (supports JWT or opaque tokens)
 * @param {string} token - Authentication token to validate
 * @returns {boolean} True if token format is valid
 */
export const isValidTokenFormat = (token) => {
  if (!token || typeof token !== 'string') {
    return false;
  }
  
  // Check length constraints
  if (token.length < 1 || token.length > 2048) {
    return false;
  }
  
  // If it looks like a JWT, validate JWT format
  if (token.includes('.')) {
    return isValidJWTFormat(token);
  }
  
  // For opaque tokens, just ensure it's alphanumeric with some special chars
  // Adjust this pattern based on your API's token format
  const opaqueTokenPattern = /^[A-Za-z0-9_-]+$/;
  return opaqueTokenPattern.test(token);
};
