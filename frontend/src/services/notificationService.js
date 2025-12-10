import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

/**
 * Notification Service - API methods for doctor notifications
 */

/**
 * Get notifications for a doctor
 */
export const getDoctorNotifications = async (doctorId, filters = {}) => {
  try {
    const token = localStorage.getItem('token');
    const params = new URLSearchParams(filters);
    
    const response = await axios.get(
      `${API_BASE}/notifications/doctor${doctorId ? `/${doctorId}` : ''}?${params}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        timeout: 5000,
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching doctor notifications:', error);
    throw error;
  }
};

/**
 * Get unread notification count for a doctor
 */
export const getUnreadCount = async (doctorId) => {
  try {
    const token = localStorage.getItem('token');
    
    const response = await axios.get(
      `${API_BASE}/notifications/doctor${doctorId ? `/${doctorId}` : ''}/unread/count`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        timeout: 5000,
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching unread count:', error);
    throw error;
  }
};

/**
 * Mark notification as read
 */
export const markAsRead = async (notificationId) => {
  try {
    const token = localStorage.getItem('token');
    
    const response = await axios.patch(
      `${API_BASE}/notifications/${notificationId}/read`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        timeout: 5000,
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error marking notification as read:', error);
    throw error;
  }
};

/**
 * Mark all notifications as read for a doctor
 */
export const markAllAsRead = async (doctorId) => {
  try {
    const token = localStorage.getItem('token');
    
    const response = await axios.patch(
      `${API_BASE}/notifications/doctor${doctorId ? `/${doctorId}` : ''}/mark-all-read`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        timeout: 5000,
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error marking all notifications as read:', error);
    throw error;
  }
};

/**
 * Delete notification
 */
export const deleteNotification = async (notificationId) => {
  try {
    const token = localStorage.getItem('token');
    
    const response = await axios.delete(
      `${API_BASE}/notifications/${notificationId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        timeout: 5000,
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error deleting notification:', error);
    throw error;
  }
};

/**
 * Archive notification
 */
export const archiveNotification = async (notificationId) => {
  try {
    const token = localStorage.getItem('token');
    
    const response = await axios.patch(
      `${API_BASE}/notifications/${notificationId}/archive`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        timeout: 5000,
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error archiving notification:', error);
    throw error;
  }
};

