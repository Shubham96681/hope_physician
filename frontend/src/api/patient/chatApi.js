/**
 * Patient Chat API Client
 */

import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const getAuthToken = () => {
  return localStorage.getItem('token');
};

const api = axios.create({
  baseURL: `${API_URL}/patient/chat`,
  headers: {
    'Content-Type': 'application/json'
  }
});

api.interceptors.request.use((config) => {
  const token = getAuthToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const chatApi = {
  getMessages: (params) => api.get('/messages', { params }),
  sendMessage: (data) => api.post('/messages', data),
  markAsRead: (data) => api.put('/messages/read', data),
  getSupportAgents: () => api.get('/support')
};

export default { chatApi };

