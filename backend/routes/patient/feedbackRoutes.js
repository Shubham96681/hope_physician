/**
 * Patient Feedback Routes
 */

const express = require('express');
const router = express.Router();
const { protect } = require('../../middlewares/authMiddleware');
const { requireRole } = require('../../middlewares/roleMiddleware');
const {
  getFeedback,
  submitFeedback,
  updateFeedback
} = require('../../controllers/patient/feedbackController');

router.use(protect);
router.use(requireRole(['patient', 'admin']));

router.get('/', getFeedback);
router.post('/', submitFeedback);
router.put('/:id', updateFeedback);

module.exports = router;

