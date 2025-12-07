/**
 * Lab Routes
 * Lab test requests, reports, status management
 */

const express = require('express');
const router = express.Router();
const { protect } = require('../../middlewares/authMiddleware');
const { requireRole } = require('../../middlewares/roleMiddleware');
const {
  createLabTest,
  getLabTests,
  getLabTestById,
  assignLabTest,
  updateLabTestStatus,
  uploadLabReport,
  getLabTestStats
} = require('../../controllers/staff/labController');

// All routes require authentication and lab/admin role
router.use(protect);
router.use(requireRole(['lab', 'admin', 'doctor']));

// Lab test routes
router.post('/tests', createLabTest);
router.get('/tests', getLabTests);
router.get('/tests/stats', getLabTestStats);
router.get('/tests/:id', getLabTestById);
router.put('/tests/:id/assign', assignLabTest);
router.put('/tests/:id/status', updateLabTestStatus);
router.post('/tests/:id/report', uploadLabReport);

module.exports = router;

