/**
 * Patient Reminder API Client
 */

import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const getAuthToken = () => {
  return localStorage.getItem('token');
};

const api = axios.create({
  baseURL: `${API_URL}/patient/reminders`,
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

export const reminderApi = {
  getAll: (params) => api.get('/', { params }),
  create: (data) => api.post('/', data),
  update: (id, data) => api.put(`/${id}`, data),
  delete: (id) => api.delete(`/${id}`)
};

export default { reminderApi };

