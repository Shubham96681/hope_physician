/**
 * Patient Prescription Routes
 */

const express = require('express');
const router = express.Router();
const { protect } = require('../../middlewares/authMiddleware');
const { requireRole } = require('../../middlewares/roleMiddleware');
const {
  getPrescriptions,
  getPrescriptionById
} = require('../../controllers/patient/prescriptionController');

router.use(protect);
router.use(requireRole(['patient', 'admin']));

router.get('/', getPrescriptions);
router.get('/:id', getPrescriptionById);

module.exports = router;

