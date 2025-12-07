/**
 * Reception Routes
 * Patient registration, appointments, billing
 */

const express = require('express');
const router = express.Router();
const { protect } = require('../../middlewares/authMiddleware');
const { requireRole } = require('../../middlewares/roleMiddleware');
const {
  registerPatient,
  getPatients,
  getPatientById,
  updatePatient,
  createAppointment,
  getAppointments,
  updateAppointment,
  cancelAppointment,
  createBilling,
  getBillings,
  updatePaymentStatus,
  getBillingStats
} = require('../../controllers/staff/receptionController');

// All routes require authentication and reception/admin role
router.use(protect);
router.use(requireRole(['reception', 'admin']));

// Patient routes
router.post('/patients', registerPatient);
router.get('/patients', getPatients);
router.get('/patients/:id', getPatientById);
router.put('/patients/:id', updatePatient);

// Appointment routes
router.post('/appointments', createAppointment);
router.get('/appointments', getAppointments);
router.put('/appointments/:id', updateAppointment);
router.delete('/appointments/:id', cancelAppointment);

// Billing routes
router.post('/billing', createBilling);
router.get('/billing', getBillings);
router.get('/billing/stats', getBillingStats);
router.put('/billing/:id/payment', updatePaymentStatus);

module.exports = router;

