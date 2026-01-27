
const API_URL = 'https://ecommercejava-2.onrender.com/api'; // Update with your backend URL



// Helper function to handle API responses
async function handleResponse(response) {
  const data = await response.json();
  if (!response.ok) {
    const error = data.message || 'Something went wrong';
    return { success: false, error };
  }
  return { success: true, data };
}

// Helper to get auth headers
function getAuthHeaders() {
  const token = localStorage.getItem('token');
  const headers = { 'Content-Type': 'application/json' };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
}

// Auth API calls
export const authService = {
  async login(credentials) {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials)
    });
    const result = await handleResponse(response);
    // Store token if login successful
    if (result.success && result.data?.token) {
      localStorage.setItem('token', result.data.token);
    }
    return result;
  },

  async register(userData) {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    });
    const result = await handleResponse(response);
    // Store token if registration successful
    if (result.success && result.data?.token) {
      localStorage.setItem('token', result.data.token);
    }
    return result;
  },

  async getCurrentUser() {
    const token = localStorage.getItem('token');
    if (!token) {
      return { success: false, error: 'No token found' };
    }

    const response = await fetch(`${API_URL}/auth/me`, {
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  },

  async logout() {
    localStorage.removeItem('token');
    return { success: true };
  }
};

// Cart API calls
export const cartService = {
  /**
   * Get user's cart
   * @param {number} userId - User ID
   * @returns {Promise} Cart data with items
   */
  async getCart(userId) {
    const response = await fetch(`${API_URL}/cart/${userId}`, {
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  },

  /**
   * Add item to cart
   * @param {number} userId - User ID
   * @param {number} productId - Product ID to add
   * @param {number} quantity - Quantity to add
   * @returns {Promise} Updated cart
   */
  async addToCart(userId, productId, quantity = 1) {
    const response = await fetch(`${API_URL}/cart/${userId}/add`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ productId, quantity })
    });
    return handleResponse(response);
  },

  /**
   * Update cart item quantity
   * @param {number} userId - User ID
   * @param {number} itemId - Cart item ID
   * @param {number} quantity - New quantity
   * @returns {Promise} Updated cart
   */
  async updateCartItem(userId, itemId, quantity) {
    const response = await fetch(`${API_URL}/cart/${userId}/item/${itemId}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify({ quantity })
    });
    return handleResponse(response);
  },

  /**
   * Remove item from cart
   * @param {number} userId - User ID
   * @param {number} itemId - Cart item ID
   * @returns {Promise} Updated cart
   */
  async removeCartItem(userId, itemId) {
    const response = await fetch(`${API_URL}/cart/${userId}/item/${itemId}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  },

  /**
   * Clear all items from cart
   * @param {number} userId - User ID
   * @returns {Promise} Success response
   */
  async clearCart(userId) {
    const response = await fetch(`${API_URL}/cart/${userId}/clear`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  },

  /**
   * Get cart item count
   * @param {number} userId - User ID
   * @returns {Promise} Cart count
   */
  async getCartCount(userId) {
    const response = await fetch(`${API_URL}/cart/${userId}`, {
      headers: getAuthHeaders()
    });
    const result = await handleResponse(response);
    if (result.success && result.data?.items) {
      const count = result.data.items.reduce((sum, item) => sum + item.quantity, 0);
      return { success: true, data: count };
    }
    return { success: false, data: 0 };
  }
};