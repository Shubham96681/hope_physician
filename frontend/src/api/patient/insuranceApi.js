/**
 * Patient Insurance API Client
 */

import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const getAuthToken = () => {
  return localStorage.getItem('token');
};

const api = axios.create({
  baseURL: `${API_URL}/patient/insurance`,
  headers: {
    'Content-Type': 'multipart/form-data'
  }
});

api.interceptors.request.use((config) => {
  const token = getAuthToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const insuranceApi = {
  getAll: () => api.get('/'),
  upload: (formData) => api.post('/upload', formData),
  delete: (id) => api.delete(`/${id}`)
};

export default { insuranceApi };

