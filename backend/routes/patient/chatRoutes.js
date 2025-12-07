/**
 * Patient Chat Routes
 */

const express = require('express');
const router = express.Router();
const { protect } = require('../../middlewares/authMiddleware');
const { requireRole } = require('../../middlewares/roleMiddleware');
const {
  getChatMessages,
  sendMessage,
  markAsRead,
  getSupportAgents
} = require('../../controllers/patient/chatController');

router.use(protect);
router.use(requireRole(['patient', 'admin']));

router.get('/messages', getChatMessages);
router.post('/messages', sendMessage);
router.put('/messages/read', markAsRead);
router.get('/support', getSupportAgents);

module.exports = router;

