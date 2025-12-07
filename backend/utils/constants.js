/**
 * Constants and Enums for Staff Dashboard
 */

// Role Types
exports.ROLES = {
  ADMIN: 'admin',
  RECEPTION: 'reception',
  NURSE: 'nurse',
  LAB: 'lab',
  PHARMACY: 'pharmacy',
  DOCTOR: 'doctor'
};

// Appointment Status
exports.APPOINTMENT_STATUS = {
  SCHEDULED: 'scheduled',
  CONFIRMED: 'confirmed',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
  RESCHEDULED: 'rescheduled'
};

// Payment Status
exports.PAYMENT_STATUS = {
  UNPAID: 'unpaid',
  PARTIAL: 'partial',
  PAID: 'paid',
  REFUNDED: 'refunded'
};

// Lab Test Status
exports.LAB_TEST_STATUS = {
  PENDING: 'pending',
  ASSIGNED: 'assigned',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled'
};

// Bed Allocation Status
exports.BED_STATUS = {
  OCCUPIED: 'occupied',
  RESERVED: 'reserved',
  AVAILABLE: 'available',
  MAINTENANCE: 'maintenance'
};

// Room Types
exports.ROOM_TYPES = {
  GENERAL: 'general',
  PRIVATE: 'private',
  ICU: 'icu',
  EMERGENCY: 'emergency',
  ISOLATION: 'isolation'
};

// Prescription Order Status
exports.ORDER_STATUS = {
  PENDING: 'pending',
  PROCESSING: 'processing',
  READY: 'ready',
  DELIVERED: 'delivered',
  CANCELLED: 'cancelled'
};

// Emergency Alert Severity
exports.ALERT_SEVERITY = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  CRITICAL: 'critical'
};

// Emergency Alert Status
exports.ALERT_STATUS = {
  ACTIVE: 'active',
  ACKNOWLEDGED: 'acknowledged',
  RESOLVED: 'resolved',
  CANCELLED: 'cancelled'
};

// Inventory Status
exports.INVENTORY_STATUS = {
  AVAILABLE: 'available',
  IN_USE: 'in_use',
  MAINTENANCE: 'maintenance',
  DAMAGED: 'damaged',
  DISPOSED: 'disposed'
};

// Pharmacy Status
exports.PHARMACY_STATUS = {
  AVAILABLE: 'available',
  LOW_STOCK: 'low_stock',
  OUT_OF_STOCK: 'out_of_stock',
  EXPIRED: 'expired'
};

// Medication Schedule Status
exports.MEDICATION_STATUS = {
  ACTIVE: 'active',
  COMPLETED: 'completed',
  STOPPED: 'stopped',
  MISSED: 'missed'
};

// Generate Invoice Number
exports.generateInvoiceNumber = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  return `INV-${year}-${month}${day}-${random}`;
};

// Status Badge Colors
exports.getStatusColor = (status, type = 'default') => {
  const colorMap = {
    // Payment Status
    unpaid: 'red',
    partial: 'yellow',
    paid: 'green',
    refunded: 'gray',
    
    // Appointment Status
    scheduled: 'blue',
    confirmed: 'green',
    in_progress: 'purple',
    completed: 'green',
    cancelled: 'red',
    rescheduled: 'yellow',
    
    // Lab Test Status
    pending: 'yellow',
    assigned: 'blue',
    in_progress: 'purple',
    completed: 'green',
    cancelled: 'red',
    
    // Bed Status
    occupied: 'red',
    reserved: 'yellow',
    available: 'green',
    maintenance: 'gray',
    
    // Order Status
    processing: 'blue',
    ready: 'green',
    delivered: 'green',
    
    // Alert Severity
    low: 'green',
    medium: 'yellow',
    high: 'orange',
    critical: 'red'
  };
  
  return colorMap[status] || 'gray';
};

