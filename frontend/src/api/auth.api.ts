// Authentication API client

// AUTH API - Authentication Endpoints
// Functions to call backend auth endpoints

import axios from './axios.config';

// Login
export const authAPI = {
  // Login user
  login: async (credentials: { email: string; password: string }) => {
    return axios.post('/api/auth/login', credentials);
  },

  // Register new user
  register: async (userData: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
  }) => {
    return axios.post('/api/auth/register', userData);
  },

  // Get current user
  me: async () => {
    return axios.get('/api/auth/me');
  },

  // Logout
  logout: async () => {
    return axios.post('/api/auth/logout');
  },
};

// HOW TO USE:
//
// In a component:
// import { authAPI } from '../api/auth.api';
//
// const response = await authAPI.login({ email, password });
// console.log(response.data.token);
//
// The axios instance automatically:
// - Adds Authorization header if token exists
// - Handles 401 errors (redirects to login)
// - Sets correct Content-Type
