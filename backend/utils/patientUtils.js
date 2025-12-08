/**
 * Patient Utility Functions
 * Helper functions for patient-related operations
 */

/**
 * Get and validate patientId from request
 * @param {Object} req - Express request object
 * @returns {string|null} - Patient ID or null if not found
 */
const getPatientId = (req) => {
  return req.user?.patientId || null;
};

/**
 * Validate patientId exists in request
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {string|null} - Patient ID if valid, null if invalid (response sent)
 */
const validatePatientId = (req, res) => {
  const patientId = getPatientId(req);
  if (!patientId) {
    res.status(400).json({ error: 'Patient ID not found. Please log in again.' });
    return null;
  }
  return patientId;
};

module.exports = {
  getPatientId,
  validatePatientId
};

