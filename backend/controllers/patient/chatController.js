/**
 * Patient Chat Controller
 * Handle real-time chat with support
 */

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

/**
 * Get chat messages
 */
const getChatMessages = async (req, res) => {
  try {
    const { page = 1, limit = 50 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const patientId = req.user.patientId || req.user.id;

    const [messages, total] = await Promise.all([
      prisma.chatMessage.findMany({
        where: { patientId },
        skip,
        take: parseInt(limit),
        orderBy: { createdAt: 'desc' }
      }),
      prisma.chatMessage.count({ where: { patientId } })
    ]);

    res.json({
      success: true,
      data: messages.reverse(), // Reverse to show oldest first
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Get chat messages error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching chat messages',
      error: error.message
    });
  }
};

/**
 * Send chat message
 */
const sendMessage = async (req, res) => {
  try {
    const { message, messageType = 'text', fileUrl } = req.body;
    const patientId = req.user.patientId || req.user.id;

    const chatMessage = await prisma.chatMessage.create({
      data: {
        patientId,
        senderId: patientId,
        senderType: 'patient',
        message,
        messageType,
        fileUrl
      }
    });

    // TODO: Emit WebSocket event for real-time delivery
    // TODO: Notify support staff

    res.status(201).json({
      success: true,
      message: 'Message sent successfully',
      data: chatMessage
    });
  } catch (error) {
    console.error('Send message error:', error);
    res.status(500).json({
      success: false,
      message: 'Error sending message',
      error: error.message
    });
  }
};

/**
 * Mark messages as read
 */
const markAsRead = async (req, res) => {
  try {
    const { messageIds } = req.body;
    const patientId = req.user.patientId || req.user.id;

    await prisma.chatMessage.updateMany({
      where: {
        id: { in: messageIds },
        patientId,
        senderType: { not: 'patient' } // Only mark staff messages as read
      },
      data: {
        isRead: true,
        readAt: new Date()
      }
    });

    res.json({
      success: true,
      message: 'Messages marked as read'
    });
  } catch (error) {
    console.error('Mark as read error:', error);
    res.status(500).json({
      success: false,
      message: 'Error marking messages as read',
      error: error.message
    });
  }
};

/**
 * Get support agents
 */
const getSupportAgents = async (req, res) => {
  try {
    // Get available support staff
    const supportStaff = await prisma.staff.findMany({
      where: {
        designation: { contains: 'support', mode: 'insensitive' },
        portalUser: {
          isActive: true,
          canAccessSystem: true
        }
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true
      },
      take: 10
    });

    res.json({
      success: true,
      data: supportStaff
    });
  } catch (error) {
    console.error('Get support agents error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching support agents',
      error: error.message
    });
  }
};

module.exports = {
  getChatMessages,
  sendMessage,
  markAsRead,
  getSupportAgents
};

