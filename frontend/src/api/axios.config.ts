// AXIOS CONFIGURATION - HTTP Client Setup
// Configures axios for making API requests to backend

import axios from 'axios';

// Get API URL from environment variable (without /api since routes include it)
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// Create axios instance with default config
const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 second timeout
});

// REQUEST INTERCEPTOR
// Automatically add JWT token to all requests
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// RESPONSE INTERCEPTOR
// Handle errors globally
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle 401 Unauthorized (token expired or invalid)
    if (error.response?.status === 401) {
      // Clear token and redirect to login
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;

// HOW THIS WORKS:
//
// REQUEST FLOW:
// 1. Component calls API function
// 2. Request interceptor adds Authorization header
// 3. Request sent to backend
// 4. Response interceptor checks for errors
// 5. Returns data or throws error
//
// EXAMPLE:
// axios.get('/api/user/profile')
// → Request interceptor adds: Authorization: Bearer token123
// → Backend validates token
// → Returns user data
// → Response interceptor passes it through
// → Component receives data
//
// ERROR HANDLING:
// If backend returns 401:
// → Response interceptor catches it
// → Removes invalid token
// → Redirects to login
// → User must log in again
