import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Mock data for development
const MOCK_STATS = {
  totalPatients: 1247,
  totalDoctors: 12,
  totalStaff: 45,
  appointmentsToday: 28,
  pendingKYC: 8
};

export const getDashboardStats = async () => {
  try {
    const response = await axios.get(`${API_BASE}/admin/stats`);
    return response.data;
  } catch (error) {
    if (error.code === 'ECONNREFUSED') {
      return MOCK_STATS;
    }
    throw error;
  }
};

export const getEmployees = async (params = {}) => {
  try {
    const response = await axios.get(`${API_BASE}/admin/employees`, { params });
    return response.data;
  } catch (error) {
    if (error.code === 'ECONNREFUSED') {
      // Mock employees
      return {
        data: [
          { id: 1, name: 'John Doe', email: 'john@example.com', role: 'staff', is_active: true },
          { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'hr', is_active: true }
        ],
        total: 2
      };
    }
    throw error;
  }
};

export const getPatients = async (params = {}) => {
  try {
    const response = await axios.get(`${API_BASE}/admin/patients`, { params });
    return response.data;
  } catch (error) {
    if (error.code === 'ECONNREFUSED') {
      return {
        data: [
          { id: 1, name: 'Patient One', email: 'patient1@example.com', kyc_status: 'approved' },
          { id: 2, name: 'Patient Two', email: 'patient2@example.com', kyc_status: 'pending' }
        ],
        total: 2
      };
    }
    throw error;
  }
};

export const getDoctors = async (params = {}) => {
  try {
    const response = await axios.get(`${API_BASE}/admin/doctors`, { params });
    return response.data;
  } catch (error) {
    if (error.code === 'ECONNREFUSED') {
      return {
        data: [
          { id: 1, name: 'Dr. Okonkwo', email: 'doctor@hopephysicians.com', specialization: 'Family Medicine' }
        ],
        total: 1
      };
    }
    throw error;
  }
};

export const getAppointments = async (params = {}) => {
  try {
    const response = await axios.get(`${API_BASE}/admin/appointments`, { params });
    return response.data;
  } catch (error) {
    if (error.code === 'ECONNREFUSED') {
      return {
        data: [
          { id: 1, patient_name: 'John Doe', doctor_name: 'Dr. Okonkwo', date: '2024-01-15', time: '10:00 AM', status: 'scheduled' }
        ],
        total: 1
      };
    }
    throw error;
  }
};

export const reviewKYC = async (kycId, action, remark = '') => {
  try {
    const response = await axios.post(`${API_BASE}/admin/kyc/${kycId}/review`, { action, remark });
    return response.data;
  } catch (error) {
    if (error.code === 'ECONNREFUSED') {
      return { success: true, message: `KYC ${action}ed successfully` };
    }
    throw error;
  }
};

export const getAttendance = async (params = {}) => {
  try {
    const response = await axios.get(`${API_BASE}/admin/attendance`, { params });
    return response.data;
  } catch (error) {
    if (error.code === 'ECONNREFUSED') {
      return {
        data: [
          { id: 1, employee_name: 'John Doe', check_in: '2024-01-15 09:00:00', check_out: '2024-01-15 17:00:00', hours: 8 }
        ],
        total: 1
      };
    }
    throw error;
  }
};

