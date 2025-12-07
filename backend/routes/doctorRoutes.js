// routes/doctorRoutes.js
const express = require('express');
const router = express.Router();
const doctorController = require('../controllers/doctorController');
const doctorDashboardController = require('../controllers/doctorDashboardController');
// const authMiddleware = require('../middlewares/authMiddleware'); // Uncomment when auth is ready

// Get today's appointments
router.get('/appointments/today', doctorController.getTodayAppointments);

// Get doctor stats
router.get('/stats', doctorController.getDoctorStats);

// Get all appointments
router.get('/appointments', doctorController.getAllAppointments);

// Accept an appointment
router.patch('/appointments/:id/accept', doctorController.acceptAppointment);

// Dashboard Analytics
router.get('/:doctorId/analytics', doctorDashboardController.getDashboardAnalytics);

// Patient Queue
router.get('/:doctorId/queue', doctorDashboardController.getPatientQueue);
router.patch('/queue/:appointmentId', doctorDashboardController.updateQueueStatus);

module.exports = router;

