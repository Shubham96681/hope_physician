/**
 * Admin Routes - Staff Management
 * Staff CRUD, roles, permissions, attendance, inventory
 */

const express = require('express');
const router = express.Router();
const { protect } = require('../../middlewares/authMiddleware');
const { requireRole } = require('../../middlewares/roleMiddleware');
const {
  getStaff,
  getEmployees,
  addStaff,
  updateStaff,
  deleteStaff,
  getRolePermissions,
  updateRolePermissions,
  getAttendance,
  getInventory,
  addInventoryItem,
  updateInventoryItem,
  getAdminStats
} = require('../../controllers/admin/staffManagementController');

// All routes require authentication and admin role
router.use(protect);
router.use(requireRole(['admin']));

// Staff management routes
router.get('/staff', getStaff);
router.get('/employees', getEmployees);
router.post('/staff', addStaff);
router.put('/staff/:id', updateStaff);
router.delete('/staff/:id', deleteStaff);

// Role & permissions routes
router.get('/roles', getRolePermissions);
router.put('/roles/:role/permissions', updateRolePermissions);

// Attendance routes
router.get('/attendance', getAttendance);

// Inventory/Asset management routes
router.get('/inventory', getInventory);
router.post('/inventory', addInventoryItem);
router.put('/inventory/:id', updateInventoryItem);

// Statistics
router.get('/stats', getAdminStats);

module.exports = router;

