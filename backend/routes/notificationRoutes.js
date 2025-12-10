// routes/notificationRoutes.js
const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/authMiddleware');
const notificationController = require('../controllers/notificationController');

// All routes require authentication
router.use(protect);

// Get notifications for logged-in doctor
router.get('/doctor', notificationController.getDoctorNotifications);

// Get notifications for specific doctor (by ID)
router.get('/doctor/:doctorId', notificationController.getDoctorNotifications);

// Get unread count for logged-in doctor
router.get('/doctor/unread/count', notificationController.getUnreadCount);

// Get unread count for specific doctor
router.get('/doctor/:doctorId/unread/count', notificationController.getUnreadCount);

// Mark notification as read
router.patch('/:id/read', notificationController.markAsRead);

// Mark all notifications as read for logged-in doctor
router.patch('/doctor/mark-all-read', notificationController.markAllAsRead);

// Mark all notifications as read for specific doctor
router.patch('/doctor/:doctorId/mark-all-read', notificationController.markAllAsRead);

// Archive notification
router.patch('/:id/archive', notificationController.archiveNotification);

// Delete notification
router.delete('/:id', notificationController.deleteNotification);

module.exports = router;

