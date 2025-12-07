/**
 * Patient Appointment Routes
 */

const express = require('express');
const router = express.Router();
const { protect } = require('../../middlewares/authMiddleware');
const { requireRole } = require('../../middlewares/roleMiddleware');
const {
  getAppointments,
  bookAppointment,
  cancelAppointment,
  rescheduleAppointment,
  getAvailableDoctors,
  getDoctorAvailability
} = require('../../controllers/patient/appointmentController');

// All routes require authentication and patient role
router.use(protect);
router.use(requireRole(['patient', 'admin']));

router.get('/', getAppointments);
router.post('/', bookAppointment);
router.put('/:id/reschedule', rescheduleAppointment);
router.delete('/:id', cancelAppointment);
router.get('/doctors/available', getAvailableDoctors);
router.get('/doctors/:doctorId/availability', getDoctorAvailability);

module.exports = router;

