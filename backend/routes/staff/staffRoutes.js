/**
 * Staff Routes - General Staff Endpoints
 * Attendance, tasks, stats, KYC assistance
 */

const express = require('express');
const router = express.Router();
const { protect } = require('../../middlewares/authMiddleware');
const { requireRole } = require('../../middlewares/roleMiddleware');
const {
  getStaffStats,
  getTasks,
  startTask,
  completeTask,
  checkIn,
  checkOut,
  getAttendanceStatus,
  getAttendanceHistory,
  getKYCAssistance,
  assistKYC
} = require('../../controllers/staff/staffController');

// All routes require authentication and staff role
router.use(protect);
router.use(requireRole(['staff', 'admin']));

// Stats
router.get('/stats', getStaffStats);

// Tasks
router.get('/tasks', getTasks);
router.post('/tasks/:id/start', startTask);
router.post('/tasks/:id/complete', completeTask);

// Attendance
router.post('/attendance/check-in', checkIn);
router.post('/attendance/check-out', checkOut);
router.get('/attendance/status', getAttendanceStatus);
router.get('/attendance/history', getAttendanceHistory);

// KYC Assistance
router.get('/kyc-assistance', getKYCAssistance);
router.post('/kyc-assistance/:id/assist', assistKYC);

module.exports = router;

