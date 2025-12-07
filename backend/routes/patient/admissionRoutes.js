/**
 * Patient Admission Routes
 */

const express = require('express');
const router = express.Router();
const { protect } = require('../../middlewares/authMiddleware');
const { requireRole } = require('../../middlewares/roleMiddleware');
const {
  getAdmissionStatus,
  getAdmissionHistory
} = require('../../controllers/patient/admissionController');

router.use(protect);
router.use(requireRole(['patient', 'admin']));

router.get('/status', getAdmissionStatus);
router.get('/history', getAdmissionHistory);

module.exports = router;

