// Emergency Alert Controller
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

/**
 * Trigger emergency alert
 */
const triggerEmergency = async (req, res) => {
  try {
    const {
      patientId,
      alertType = 'medical',
      severity = 'high',
      location,
      description
    } = req.body;

    if (!description) {
      return res.status(400).json({
        success: false,
        message: 'Description is required'
      });
    }

    // Get user ID from request
    const triggeredBy = req.user?.id || req.user?.staffId || 'system';

    // Create emergency alert
    const alert = await prisma.emergencyAlert.create({
      data: {
        patientId: patientId || null,
        triggeredBy,
        alertType,
        severity,
        location,
        description,
        status: 'active'
      },
      include: {
        patient: patientId ? {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            bedAllocations: {
              where: { isActive: true },
              take: 1
            }
          }
        } : undefined
      }
    });

    // TODO: Send notifications to doctors, nurses, admin
    // This could be done via WebSocket, push notifications, or email

    res.status(201).json({
      success: true,
      message: 'Emergency alert triggered successfully',
      data: alert
    });
  } catch (error) {
    console.error('Trigger emergency error:', error);
    res.status(500).json({
      success: false,
      message: 'Error triggering emergency alert',
      error: error.message
    });
  }
};

/**
 * Get emergency alerts
 */
const getEmergencyAlerts = async (req, res) => {
  try {
    const { status = 'active', severity, limit = 50 } = req.query;

    const where = {};
    if (status) where.status = status;
    if (severity) where.severity = severity;

    const alerts = await prisma.emergencyAlert.findMany({
      where,
      take: parseInt(limit),
      include: {
        patient: {
          select: {
            id: true,
            firstName: true,
            lastName: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json({
      success: true,
      data: alerts
    });
  } catch (error) {
    console.error('Get alerts error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching emergency alerts',
      error: error.message
    });
  }
};

/**
 * Acknowledge emergency alert
 */
const acknowledgeAlert = async (req, res) => {
  try {
    const { id } = req.params;

    const acknowledgedBy = req.user?.id || req.user?.staffId || req.user?.doctorId || 'system';

    const alert = await prisma.emergencyAlert.update({
      where: { id },
      data: {
        status: 'acknowledged',
        acknowledgedBy,
        acknowledgedAt: new Date()
      },
      include: {
        patient: true
      }
    });

    res.json({
      success: true,
      message: 'Alert acknowledged successfully',
      data: alert
    });
  } catch (error) {
    console.error('Acknowledge alert error:', error);
    res.status(500).json({
      success: false,
      message: 'Error acknowledging alert',
      error: error.message
    });
  }
};

/**
 * Resolve emergency alert
 */
const resolveAlert = async (req, res) => {
  try {
    const { id } = req.params;
    const { responseNotes } = req.body;

    const resolvedBy = req.user?.id || req.user?.staffId || req.user?.doctorId || 'system';

    const alert = await prisma.emergencyAlert.update({
      where: { id },
      data: {
        status: 'resolved',
        resolvedBy,
        resolvedAt: new Date(),
        responseNotes
      },
      include: {
        patient: true
      }
    });

    res.json({
      success: true,
      message: 'Alert resolved successfully',
      data: alert
    });
  } catch (error) {
    console.error('Resolve alert error:', error);
    res.status(500).json({
      success: false,
      message: 'Error resolving alert',
      error: error.message
    });
  }
};

module.exports = {
  triggerEmergency,
  getEmergencyAlerts,
  acknowledgeAlert,
  resolveAlert
};

