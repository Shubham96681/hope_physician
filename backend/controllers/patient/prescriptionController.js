/**
 * Patient Prescription Controller
 * View prescriptions and medication details
 */

const { prisma } = require('../../src/lib/prisma.js');

/**
 * Get patient's prescriptions
 */
const getPrescriptions = async (req, res) => {
  try {
    console.log('💊 Get prescriptions request - req.user:', req.user ? { id: req.user.id, role: req.user.role, patientId: req.user.patientId } : 'UNDEFINED');
    
    const { page = 1, limit = 10 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const patientId = req.user?.patientId;
    
    if (!patientId) {
      console.error('❌ Patient ID missing in request:', { user: req.user });
      return res.status(400).json({ 
        success: false,
        error: 'Patient ID not found. Please log in again.',
        debug: { hasUser: !!req.user, userId: req.user?.id, role: req.user?.role }
      });
    }

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

    // Parse medications JSON (safely handle null/undefined)
    const prescriptionsWithParsedMeds = prescriptions.map(prescription => {
      try {
        return {
          ...prescription,
          medications: prescription.medications 
            ? (typeof prescription.medications === 'string' 
                ? JSON.parse(prescription.medications) 
                : prescription.medications)
            : []
        };
      } catch (parseError) {
        console.error('Error parsing medications JSON:', parseError, prescription.id);
        return {
          ...prescription,
          medications: []
        };
      }
    });

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

