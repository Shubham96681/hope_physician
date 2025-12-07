/**
 * Pharmacy Routes
 * Medicine stock, expiry management, prescription orders
 */

const express = require('express');
const router = express.Router();
const { protect } = require('../../middlewares/authMiddleware');
const { requireRole } = require('../../middlewares/roleMiddleware');
const {
  getMedicines,
  updateMedicineStock,
  getExpiringMedicines,
  getPrescriptionOrders,
  updateOrderStatus,
  createPrescriptionOrder,
  getPharmacyStats
} = require('../../controllers/staff/pharmacyController');

// All routes require authentication and pharmacy/admin role
router.use(protect);
router.use(requireRole(['pharmacy', 'admin']));

// Medicine stock routes
router.get('/medicines', getMedicines);
router.post('/medicines', updateMedicineStock);
router.put('/medicines/:id', updateMedicineStock);
router.get('/medicines/expiring', getExpiringMedicines);

// Prescription order routes
router.get('/orders', getPrescriptionOrders);
router.post('/orders', createPrescriptionOrder);
router.put('/orders/:id/status', updateOrderStatus);

// Statistics
router.get('/stats', getPharmacyStats);

module.exports = router;

