// CARD API CLIENT - Functions to call card endpoints
// All functions return promises with card data

import axios from './axios.config';

export const cardAPI = {
  // Get all user's cards
  getCards: async () => {
    return axios.get('/api/cards');
  },

  // Get cards for specific account
  getAccountCards: async (accountId: string) => {
    return axios.get(`/api/accounts/${accountId}/cards`);
  },

  // Get specific card
  getCard: async (cardId: string) => {
    return axios.get(`/api/cards/${cardId}`);
  },

  // Create new card
  createCard: async (data: {
    accountId: string;
    cardType: 'DEBIT' | 'CREDIT';
    cardholderName: string;
    expiryDate: string; // YYYY-MM-DD
    creditLimit?: number;
  }) => {
    return axios.post('/api/cards', data);
  },

  // Update card status
  updateCardStatus: async (cardId: string, status: 'ACTIVE' | 'INACTIVE' | 'BLOCKED') => {
    return axios.patch(`/api/cards/${cardId}/status`, { status });
  },

  // Delete card
  deleteCard: async (cardId: string) => {
    return axios.delete(`/api/cards/${cardId}`);
  },
};
