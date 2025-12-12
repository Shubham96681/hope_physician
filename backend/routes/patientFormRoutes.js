// routes/patientFormRoutes.js
const express = require("express");
const router = express.Router();
const patientFormController = require("../controllers/patientFormController");
const authMiddleware = require("../middlewares/authMiddleware");

// Patient form submission routes (public - anyone can submit)
router.post("/patient-info", patientFormController.submitPatientInfoForm);
router.post("/privacy-ack", patientFormController.submitPrivacyForm);
router.post(
  "/parental-consent",
  patientFormController.submitParentalConsentForm
);
router.post("/release-info", patientFormController.submitReleaseInfoForm);

// Protected routes (require authentication)
router.get(
  "/patient/:patientId",
  authMiddleware.authenticate,
  patientFormController.getPatientFormSubmissions
);
router.get(
  "/all",
  authMiddleware.authenticate,
  authMiddleware.authorize(["admin", "staff", "doctor"]),
  patientFormController.getAllFormSubmissions
);

module.exports = router;
