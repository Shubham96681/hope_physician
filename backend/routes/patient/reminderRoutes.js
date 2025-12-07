/**
 * Patient Reminder Routes
 */

const express = require('express');
const router = express.Router();
const { protect } = require('../../middlewares/authMiddleware');
const { requireRole } = require('../../middlewares/roleMiddleware');
const {
  getReminders,
  createReminder,
  updateReminder,
  deleteReminder
} = require('../../controllers/patient/reminderController');

router.use(protect);
router.use(requireRole(['patient', 'admin']));

router.get('/', getReminders);
router.post('/', createReminder);
router.put('/:id', updateReminder);
router.delete('/:id', deleteReminder);

module.exports = router;

