/**
 * Patient Admission Controller
 * Track admission status
 */

const { prisma } = require('../../src/lib/prisma.js');

/**
 * Get admission status
 */
const getAdmissionStatus = async (req, res) => {
  try {
    const patientId = req.user.patientId || req.user.id;

    const admissionStatus = await prisma.admissionStatus.findFirst({
      where: {
        patientId,
        currentStatus: { not: 'discharged' }
      },
      include: {
        bedAllocation: {
          select: {
            bedNumber: true,
            roomNumber: true,
            roomType: true,
            floor: true
          }
        }
      },
      orderBy: { admissionDate: 'desc' }
    });

    if (!admissionStatus) {
      return res.json({
        success: true,
        data: null,
        message: 'No active admission'
      });
    }

    res.json({
      success: true,
      data: admissionStatus
    });
  } catch (error) {
    console.error('Get admission status error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching admission status',
      error: error.message
    });
  }
};

/**
 * Get admission history
 */
const getAdmissionHistory = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const patientId = req.user.patientId || req.user.id;

    const [admissions, total] = await Promise.all([
      prisma.admissionStatus.findMany({
        where: { patientId },
        skip,
        take: parseInt(limit),
        orderBy: { admissionDate: 'desc' },
        include: {
          bedAllocation: {
            select: {
              bedNumber: true,
              roomNumber: true,
              roomType: true,
              floor: true
            }
          }
        }
      }),
      prisma.admissionStatus.count({ where: { patientId } })
    ]);

    res.json({
      success: true,
      data: admissions,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Get admission history error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching admission history',
      error: error.message
    });
  }
};

module.exports = {
  getAdmissionStatus,
  getAdmissionHistory
};

