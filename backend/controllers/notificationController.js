// controllers/notificationController.js
const { prisma } = require('../src/lib/prisma.js');

const notificationController = {
  // Get notifications for the logged-in doctor
  getDoctorNotifications: async (req, res) => {
    try {
      const { status, type, unreadOnly, search } = req.query;
      
      // Get doctorId from authenticated user
      let doctorId = null;
      if (req.user && req.user.doctorId) {
        doctorId = req.user.doctorId;
      } else if (req.params.doctorId) {
        doctorId = req.params.doctorId;
      }

      if (!doctorId) {
        return res.status(400).json({
          success: false,
          error: 'Doctor ID is required'
        });
      }

      const where = { doctorId };

      // Filter by status
      if (status) {
        where.status = status;
      } else if (unreadOnly === 'true' || unreadOnly === true) {
        where.status = 'unread';
      }

      // Filter by type
      if (type) {
        where.type = type;
      }

      // Search in title and message
      if (search) {
        where.OR = [
          { title: { contains: search, mode: 'insensitive' } },
          { message: { contains: search, mode: 'insensitive' } }
        ];
      }

      const notifications = await prisma.notification.findMany({
        where,
        include: {
          appointment: {
            select: {
              id: true,
              date: true,
              time: true,
              patient: {
                select: {
                  id: true,
                  firstName: true,
                  lastName: true,
                  email: true
                }
              }
            }
          },
          event: {
            select: {
              id: true,
              title: true,
              startDate: true,
              endDate: true
            }
          },
          patient: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true
            }
          }
        },
        orderBy: { createdAt: 'desc' }
      });

      return res.json({
        success: true,
        data: notifications,
        total: notifications.length
      });
    } catch (error) {
      console.error('❌ Error fetching doctor notifications:', error);
      return res.status(500).json({
        success: false,
        error: 'Failed to fetch notifications',
        message: error.message
      });
    }
  },

  // Get unread notification count
  getUnreadCount: async (req, res) => {
    try {
      let doctorId = null;
      if (req.user && req.user.doctorId) {
        doctorId = req.user.doctorId;
      } else if (req.params.doctorId) {
        doctorId = req.params.doctorId;
      }

      if (!doctorId) {
        return res.status(400).json({
          success: false,
          error: 'Doctor ID is required'
        });
      }

      const count = await prisma.notification.count({
        where: {
          doctorId,
          status: 'unread'
        }
      });

      return res.json({
        success: true,
        count
      });
    } catch (error) {
      console.error('❌ Error fetching unread count:', error);
      return res.status(500).json({
        success: false,
        error: 'Failed to fetch unread count',
        message: error.message
      });
    }
  },

  // Mark notification as read
  markAsRead: async (req, res) => {
    try {
      const { id } = req.params;

      const notification = await prisma.notification.findUnique({
        where: { id }
      });

      if (!notification) {
        return res.status(404).json({
          success: false,
          error: 'Notification not found'
        });
      }

      // Verify the notification belongs to the logged-in doctor
      let doctorId = null;
      if (req.user && req.user.doctorId) {
        doctorId = req.user.doctorId;
      }

      if (doctorId && notification.doctorId !== doctorId) {
        return res.status(403).json({
          success: false,
          error: 'Unauthorized to access this notification'
        });
      }

      const updated = await prisma.notification.update({
        where: { id },
        data: {
          status: 'read',
          readAt: new Date()
        }
      });

      return res.json({
        success: true,
        data: updated
      });
    } catch (error) {
      console.error('❌ Error marking notification as read:', error);
      return res.status(500).json({
        success: false,
        error: 'Failed to mark notification as read',
        message: error.message
      });
    }
  },

  // Mark all notifications as read
  markAllAsRead: async (req, res) => {
    try {
      let doctorId = null;
      if (req.user && req.user.doctorId) {
        doctorId = req.user.doctorId;
      } else if (req.params.doctorId) {
        doctorId = req.params.doctorId;
      }

      if (!doctorId) {
        return res.status(400).json({
          success: false,
          error: 'Doctor ID is required'
        });
      }

      const result = await prisma.notification.updateMany({
        where: {
          doctorId,
          status: 'unread'
        },
        data: {
          status: 'read',
          readAt: new Date()
        }
      });

      return res.json({
        success: true,
        count: result.count,
        message: `${result.count} notification(s) marked as read`
      });
    } catch (error) {
      console.error('❌ Error marking all notifications as read:', error);
      return res.status(500).json({
        success: false,
        error: 'Failed to mark all notifications as read',
        message: error.message
      });
    }
  },

  // Delete notification
  deleteNotification: async (req, res) => {
    try {
      const { id } = req.params;

      const notification = await prisma.notification.findUnique({
        where: { id }
      });

      if (!notification) {
        return res.status(404).json({
          success: false,
          error: 'Notification not found'
        });
      }

      // Verify the notification belongs to the logged-in doctor
      let doctorId = null;
      if (req.user && req.user.doctorId) {
        doctorId = req.user.doctorId;
      }

      if (doctorId && notification.doctorId !== doctorId) {
        return res.status(403).json({
          success: false,
          error: 'Unauthorized to delete this notification'
        });
      }

      await prisma.notification.delete({
        where: { id }
      });

      return res.json({
        success: true,
        message: 'Notification deleted successfully'
      });
    } catch (error) {
      console.error('❌ Error deleting notification:', error);
      return res.status(500).json({
        success: false,
        error: 'Failed to delete notification',
        message: error.message
      });
    }
  },

  // Archive notification
  archiveNotification: async (req, res) => {
    try {
      const { id } = req.params;

      const notification = await prisma.notification.findUnique({
        where: { id }
      });

      if (!notification) {
        return res.status(404).json({
          success: false,
          error: 'Notification not found'
        });
      }

      // Verify the notification belongs to the logged-in doctor
      let doctorId = null;
      if (req.user && req.user.doctorId) {
        doctorId = req.user.doctorId;
      }

      if (doctorId && notification.doctorId !== doctorId) {
        return res.status(403).json({
          success: false,
          error: 'Unauthorized to archive this notification'
        });
      }

      const updated = await prisma.notification.update({
        where: { id },
        data: {
          status: 'archived'
        }
      });

      return res.json({
        success: true,
        data: updated
      });
    } catch (error) {
      console.error('❌ Error archiving notification:', error);
      return res.status(500).json({
        success: false,
        error: 'Failed to archive notification',
        message: error.message
      });
    }
  }
};

module.exports = notificationController;

