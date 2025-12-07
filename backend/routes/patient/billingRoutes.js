/**
 * Patient Billing Routes
 */

const express = require('express');
const router = express.Router();
const { protect } = require('../../middlewares/authMiddleware');
const { requireRole } = require('../../middlewares/roleMiddleware');
const {
  getBills,
  getBillById,
  getPaymentHistory
} = require('../../controllers/patient/billingController');

router.use(protect);
router.use(requireRole(['patient', 'admin']));

router.get('/', getBills);
router.get('/:id', getBillById);
router.get('/payments/history', getPaymentHistory);

module.exports = router;

