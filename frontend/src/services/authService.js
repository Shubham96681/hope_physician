import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Mock user data for development
const MOCK_USERS = {
  admin: {
    id: 1,
    email: 'admin@hopephysicians.com',
    password: 'admin123',
    role: 'admin',
    name: 'Admin User',
    is_active: true,
    can_access_system: true
  },
  doctor: {
    id: 2,
    email: 'doctor@hopephysicians.com',
    password: 'doctor123',
    role: 'doctor',
    name: 'Dr. Okonkwo',
    is_active: true,
    can_access_system: true,
    specialization: 'Family Medicine'
  },
  patient: {
    id: 3,
    email: 'patient@example.com',
    password: 'patient123',
    role: 'patient',
    name: 'John Doe',
    is_active: true,
    can_access_system: true
  },
  staff: {
    id: 4,
    email: 'staff@hopephysicians.com',
    password: 'staff123',
    role: 'staff',
    name: 'Jane Smith',
    is_active: true,
    can_access_system: true
  }
};

export const login = async (email, password, role = null) => {
  try {
    // Try real API first
    const response = await axios.post(`${API_BASE}/auth/login`, {
      email,
      password,
      role
    });
    return response.data;
  } catch (error) {
    // Fallback to mock for development
    if (error.code === 'ECONNREFUSED' || error.message.includes('Network Error')) {
      console.warn('API not available, using mock data');
      
      // Find user in mock data
      const user = Object.values(MOCK_USERS).find(
        u => u.email === email && u.password === password
      );
      
      if (!user) {
        throw new Error('Invalid email or password');
      }
      
      // Check role if specified
      if (role && user.role !== role) {
        throw new Error(`Access denied. This account is for ${user.role} role.`);
      }
      
      // Generate mock token
      const token = `mock_token_${user.id}_${Date.now()}`;
      
      return {
        token,
        user: {
          ...user,
          password: undefined // Remove password from response
        }
      };
    }
    throw error;
  }
};

export const getCurrentUser = async () => {
  try {
    const token = localStorage.getItem('token');
    if (!token) return null;
    
    const response = await axios.get(`${API_BASE}/auth/me`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  } catch (error) {
    // Fallback to mock
    if (error.code === 'ECONNREFUSED' || error.message.includes('Network Error')) {
      const token = localStorage.getItem('token');
      if (!token) return null;
      
      // Extract user ID from mock token
      const match = token.match(/mock_token_(\d+)_/);
      if (match) {
        const userId = parseInt(match[1]);
        const user = Object.values(MOCK_USERS).find(u => u.id === userId);
        if (user) {
          return { ...user, password: undefined };
        }
      }
    }
    throw error;
  }
};

export const forgotPassword = async (email) => {
  try {
    const response = await axios.post(`${API_BASE}/auth/forgot-password`, { email });
    return response.data;
  } catch (error) {
    // Mock response
    if (error.code === 'ECONNREFUSED') {
      return { message: 'Password reset link sent to your email' };
    }
    throw error;
  }
};

export const resetPassword = async (token, password) => {
  try {
    const response = await axios.post(`${API_BASE}/auth/reset-password`, { token, password });
    return response.data;
  } catch (error) {
    if (error.code === 'ECONNREFUSED') {
      return { message: 'Password reset successfully' };
    }
    throw error;
  }
};

