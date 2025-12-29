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

// Auth API calls
export const authService = {
  async login(credentials) {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
      credentials: 'include' // Important for cookies/sessions
    });
    return handleResponse(response);
  },

  async register(userData) {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
      credentials: 'include'
    });
    return handleResponse(response);
  },

  async getCurrentUser() {
    const response = await fetch(`${API_URL}/auth/me`, {
      credentials: 'include'
    });
    return handleResponse(response);
  },

  async logout() {
    const response = await fetch(`${API_URL}/auth/logout`, {
      method: 'POST',
      credentials: 'include'
    });
    return handleResponse(response);
  }
};