/**
 * Patient Report Routes
 */

const express = require('express');
const router = express.Router();
const { protect } = require('../../middlewares/authMiddleware');
const { requireRole } = require('../../middlewares/roleMiddleware');
const {
  getReports,
  getReportById,
  downloadReport,
  getLabReports
} = require('../../controllers/patient/reportController');

router.use(protect);
router.use(requireRole(['patient', 'admin']));

router.get('/', getReports);
router.get('/lab', getLabReports);
router.get('/:id', getReportById);
router.get('/:id/download', downloadReport);

module.exports = router;

