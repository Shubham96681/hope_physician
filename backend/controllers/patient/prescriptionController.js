/**
 * Patient Prescription Controller
 * View prescriptions and medication details
 */

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

/**
 * Get patient's prescriptions
 */
const getPrescriptions = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const patientId = req.user.patientId || req.user.id;

    const [prescriptions, total] = await Promise.all([
      prisma.prescription.findMany({
        where: { patientId },
        skip,
        take: parseInt(limit),
        orderBy: { issuedDate: 'desc' },
        include: {
          doctor: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              specialization: true,
              licenseNumber: true
            }
          },
          appointment: {
            select: {
              id: true,
              date: true,
              type: true
            }
          }
        }
      }),
      prisma.prescription.count({ where: { patientId } })
    ]);

    // Parse medications JSON
    const prescriptionsWithParsedMeds = prescriptions.map(prescription => ({
      ...prescription,
      medications: JSON.parse(prescription.medications)
    }));

    res.json({
      success: true,
      data: prescriptionsWithParsedMeds,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Get prescriptions error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching prescriptions',
      error: error.message
    });
  }
};

/**
 * Get prescription by ID
 */
const getPrescriptionById = async (req, res) => {
  try {
    const { id } = req.params;
    const patientId = req.user.patientId || req.user.id;

    const prescription = await prisma.prescription.findUnique({
      where: { id },
      include: {
        doctor: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            specialization: true,
            licenseNumber: true,
            email: true,
            phone: true
          }
        },
        appointment: {
          include: {
            doctor: true
          }
        }
      }
    });

    if (!prescription) {
      return res.status(404).json({
        success: false,
        message: 'Prescription not found'
      });
    }

    if (prescription.patientId !== patientId) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized to view this prescription'
      });
    }

    res.json({
      success: true,
      data: {
        ...prescription,
        medications: JSON.parse(prescription.medications)
      }
    });
  } catch (error) {
    console.error('Get prescription error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching prescription',
      error: error.message
    });
  }
};

module.exports = {
  getPrescriptions,
  getPrescriptionById
};

