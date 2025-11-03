// USER API - User Profile & Accounts Endpoints
// Functions to call backend user endpoints

import axios from './axios.config';

export const userAPI = {
  // Get user profile
  getProfile: async () => {
    return axios.get('/api/user/profile');
  },

  // Update user profile
  updateProfile: async (data: {
    firstName?: string;
    lastName?: string;
    phoneNumber?: string;
    dateOfBirth?: string;
    address?: string;
  }) => {
    return axios.put('/api/user/profile', data);
  },

  // Change password
  changePassword: async (data: {
    currentPassword: string;
    newPassword: string;
  }) => {
    return axios.put('/api/user/password', data);
  },

  // Get all accounts
  getAccounts: async () => {
    return axios.get('/api/accounts');
  },

  // Get account summary
  getAccountSummary: async () => {
    return axios.get('/api/accounts/summary');
  },

  // Get specific account
  getAccount: async (accountId: string) => {
    return axios.get(`/api/accounts/${accountId}`);
  },

  // Get account transactions
  getTransactions: async (accountId: string, params?: {
    startDate?: string;
    endDate?: string;
    type?: string;
    limit?: number;
    offset?: number;
  }) => {
    return axios.get(`/api/accounts/${accountId}/transactions`, { params });
  },
};

// HOW TO USE:
//
// In a component:
// import { userAPI } from '../api/user.api';
//
// const profile = await userAPI.getProfile();
// const accounts = await userAPI.getAccounts();
// const transactions = await userAPI.getTransactions(accountId);
