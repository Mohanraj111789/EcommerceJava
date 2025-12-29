const API_URL = 'http://localhost:8080/api'; // Update with your backend URL

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