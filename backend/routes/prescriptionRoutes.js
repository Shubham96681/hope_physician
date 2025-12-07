// routes/prescriptionRoutes.js
const express = require('express');
const router = express.Router();
const prescriptionController = require('../controllers/prescriptionController');
const authMiddleware = require('../middlewares/authMiddleware');

// All routes require authentication
router.use(authMiddleware.authenticate);

// Create prescription (doctor only)
router.post('/', authMiddleware.authorize(['doctor', 'admin']), prescriptionController.createPrescription);

// Get prescription by ID
router.get('/:id', prescriptionController.getPrescription);

// Get all prescriptions for a doctor
router.get('/doctor/:doctorId', authMiddleware.authorize(['doctor', 'admin']), prescriptionController.getDoctorPrescriptions);

// Get all prescriptions for a patient
router.get('/patient/:patientId', prescriptionController.getPatientPrescriptions);

// Update prescription
router.put('/:id', authMiddleware.authorize(['doctor', 'admin']), prescriptionController.updatePrescription);

// Delete prescription
router.delete('/:id', authMiddleware.authorize(['doctor', 'admin']), prescriptionController.deletePrescription);

// Generate prescription PDF
router.post('/:id/generate-pdf', authMiddleware.authorize(['doctor', 'admin']), prescriptionController.generatePDF);

module.exports = router;

