/**
 * Format currency amount
 * @param {number} amount - Amount to format
 * @param {string} currency - Currency code (default: USD)
 * @returns {string} Formatted currency string
 */
export const formatCurrency = (amount, currency = 'NGN') => {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: currency
  }).format(amount);
};

/**
 * Format date to local string
 * @param {Date|string} date - Date to format
 * @returns {string} Formatted date string
 */
export const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

/**
 * Generate a unique ID
 * @returns {string} Unique ID
 */
export const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

/**
 * Debounce function
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in milliseconds
 * @returns {Function} Debounced function
 */
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

/**
 * Check if device is online
 * @returns {boolean} Online status
 */
export const isOnline = () => {
  return typeof navigator !== 'undefined' && navigator.onLine;
};

/**
 * Convert file to base64
 * @param {File} file - File to convert
 * @returns {Promise<string>} Base64 string
 */
export const fileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
};

/**
 * Calculate total value of products
 * @param {Array} products - Array of products
 * @returns {number} Total value
 */
export const calculateInventoryValue = (products) => {
  return products.reduce((total, product) => {
    return total + (product.price * product.quantity);
  }, 0);
};

/**
 * Sort array by field
 * @param {Array} array - Array to sort
 * @param {string} field - Field to sort by
 * @param {string} direction - Sort direction (asc/desc)
 * @returns {Array} Sorted array
 */
export const sortArrayByField = (array, field, direction = 'asc') => {
  return [...array].sort((a, b) => {
    if (direction === 'asc') {
      return a[field] > b[field] ? 1 : -1;
    }
    return a[field] < b[field] ? 1 : -1;
  });
};

/**
 * Filter array by search query
 * @param {Array} array - Array to filter
 * @param {string} query - Search query
 * @param {Array} fields - Fields to search in
 * @returns {Array} Filtered array
 */
export const filterArrayBySearch = (array, query, fields) => {
  const lowercaseQuery = query.toLowerCase();
  return array.filter(item => {
    return fields.some(field => {
      const value = item[field];
      return value && value.toString().toLowerCase().includes(lowercaseQuery);
    });
  });
};

/**
 * Truncate text to specified length
 * @param {string} text - Text to truncate
 * @param {number} length - Max length
 * @returns {string} Truncated text
 */
export const truncateText = (text, length = 50) => {
  if (!text || text.length <= length) return text;
  return `${text.substring(0, length)}...`;
};