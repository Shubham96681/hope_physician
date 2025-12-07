/**
 * Nurse Routes
 * Vitals, medication, bed allocation, emergency alerts
 */

const express = require('express');
const router = express.Router();
const { protect } = require('../../middlewares/authMiddleware');
const { requireRole } = require('../../middlewares/roleMiddleware');
const {
  recordVitals,
  getPatientVitals,
  getAdmittedPatients,
  updateMedicationSchedule,
  getMedicationSchedules,
  markMedicationAdministered,
  allocateBed,
  getBeds,
  releaseBed,
  triggerEmergencyAlert,
  getEmergencyAlerts,
  acknowledgeEmergencyAlert
} = require('../../controllers/staff/nurseController');

// All routes require authentication and nurse/admin role
router.use(protect);
router.use(requireRole(['nurse', 'admin']));

// Vitals routes
router.post('/vitals', recordVitals);
router.get('/vitals/patient/:patientId', getPatientVitals);

// Patient monitoring routes
router.get('/patients/admitted', getAdmittedPatients);

// Medication routes
router.post('/medication', updateMedicationSchedule);
router.get('/medication', getMedicationSchedules);
router.put('/medication/:id/administer', markMedicationAdministered);

// Bed allocation routes
router.post('/beds/allocate', allocateBed);
router.get('/beds', getBeds);
router.put('/beds/:id/release', releaseBed);

// Emergency alert routes
router.post('/emergency', triggerEmergencyAlert);
router.get('/emergency', getEmergencyAlerts);
router.put('/emergency/:id/acknowledge', acknowledgeEmergencyAlert);

module.exports = router;

