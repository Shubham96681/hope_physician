// routes/medicalRecordRoutes.js
const express = require('express');
const router = express.Router();
const medicalRecordController = require('../controllers/medicalRecordController');
const authMiddleware = require('../middlewares/authMiddleware');

// All routes require authentication
router.use(authMiddleware.authenticate);

// Create medical record (doctor only)
router.post('/', authMiddleware.authorize(['doctor', 'admin']), medicalRecordController.createMedicalRecord);

// Get medical record by ID
router.get('/:id', medicalRecordController.getMedicalRecord);

// Get all medical records for a patient
router.get('/patient/:patientId', medicalRecordController.getPatientMedicalRecords);

// Get all medical records for a doctor
router.get('/doctor/:doctorId', authMiddleware.authorize(['doctor', 'admin']), medicalRecordController.getDoctorMedicalRecords);

// Update medical record
router.put('/:id', authMiddleware.authorize(['doctor', 'admin']), medicalRecordController.updateMedicalRecord);

// Delete medical record
router.delete('/:id', authMiddleware.authorize(['doctor', 'admin']), medicalRecordController.deleteMedicalRecord);

module.exports = router;

