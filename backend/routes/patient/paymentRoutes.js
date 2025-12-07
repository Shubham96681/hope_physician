/**
 * Patient Payment Routes
 */

const express = require('express');
const router = express.Router();
const { protect } = require('../../middlewares/authMiddleware');
const { requireRole } = require('../../middlewares/roleMiddleware');
const {
  createPayment,
  verifyPaymentTransaction
} = require('../../controllers/patient/paymentController');

router.use(protect);
router.use(requireRole(['patient', 'admin']));

router.post('/create', createPayment);
router.post('/verify', verifyPaymentTransaction);

module.exports = router;

