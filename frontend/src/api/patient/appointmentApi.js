/**
 * Patient Appointment API Client
 */

import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const getAuthToken = () => {
  return localStorage.getItem('token');
};

const api = axios.create({
  baseURL: `${API_URL}/patient/appointments`,
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

export const appointmentApi = {
  getAll: (params) => api.get('/', { params }),
  book: (data) => api.post('/', data),
  cancel: (id, reason) => api.delete(`/${id}`, { data: { reason } }),
  reschedule: (id, data) => api.put(`/${id}/reschedule`, data),
  getAvailableDoctors: (params) => api.get('/doctors/available', { params }),
  getDoctorAvailability: (doctorId, params) => api.get(`/doctors/${doctorId}/availability`, { params })
};

export default { appointmentApi };

