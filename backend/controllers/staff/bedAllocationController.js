// Bed Allocation Controller
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

/**
 * Get all beds with status
 */
const getBeds = async (req, res) => {
  try {
    const { status, roomType, floor } = req.query;

    const where = {};
    if (status) where.status = status;
    if (roomType) where.roomType = roomType;
    if (floor) where.floor = floor;

    const beds = await prisma.bedAllocation.findMany({
      where,
      include: {
        patient: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            gender: true,
            dateOfBirth: true
          }
        }
      },
      orderBy: [
        { floor: 'asc' },
        { roomNumber: 'asc' },
        { bedNumber: 'asc' }
      ]
    });

    // Get bed statistics
    const stats = {
      total: beds.length,
      occupied: beds.filter(b => b.status === 'occupied' && b.isActive).length,
      available: beds.filter(b => b.status === 'available').length,
      reserved: beds.filter(b => b.status === 'reserved').length,
      maintenance: beds.filter(b => b.status === 'maintenance').length
    };

    res.json({
      success: true,
      data: beds,
      stats
    });
  } catch (error) {
    console.error('Get beds error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching beds',
      error: error.message
    });
  }
};

/**
 * Allocate bed to patient
 */
const allocateBed = async (req, res) => {
  try {
    const {
      patientId,
      bedNumber,
      roomNumber,
      roomType,
      floor,
      expectedDischargeDate,
      notes
    } = req.body;

    // Validate required fields
    if (!patientId || !bedNumber || !roomNumber || !roomType) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: patientId, bedNumber, roomNumber, roomType'
      });
    }

    // Check if bed is already occupied
    const existingAllocation = await prisma.bedAllocation.findFirst({
      where: {
        bedNumber,
        roomNumber,
        status: 'occupied',
        isActive: true
      }
    });

    if (existingAllocation) {
      return res.status(400).json({
        success: false,
        message: 'Bed is already occupied'
      });
    }

    // Get user ID from request
    const allocatedBy = req.user?.id || req.user?.staffId || 'system';

    // Create bed allocation
    const allocation = await prisma.bedAllocation.create({
      data: {
        patientId,
        bedNumber,
        roomNumber,
        roomType,
        floor,
        allocatedBy,
        allocatedAt: new Date(),
        expectedDischargeDate: expectedDischargeDate ? new Date(expectedDischargeDate) : null,
        status: 'occupied',
        isActive: true,
        notes
      },
      include: {
        patient: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            gender: true,
            dateOfBirth: true,
            phone: true
          }
        }
      }
    });

    res.status(201).json({
      success: true,
      message: 'Bed allocated successfully',
      data: allocation
    });
  } catch (error) {
    console.error('Allocate bed error:', error);
    res.status(500).json({
      success: false,
      message: 'Error allocating bed',
      error: error.message
    });
  }
};

/**
 * Release bed
 */
const releaseBed = async (req, res) => {
  try {
    const { id } = req.params;
    const { dischargeNotes } = req.body;

    // Get current allocation
    const allocation = await prisma.bedAllocation.findUnique({
      where: { id }
    });

    if (!allocation) {
      return res.status(404).json({
        success: false,
        message: 'Bed allocation not found'
      });
    }

    // Update allocation
    const updated = await prisma.bedAllocation.update({
      where: { id },
      data: {
        status: 'available',
        isActive: false,
        actualDischargeDate: new Date(),
        dischargeNotes
      },
      include: {
        patient: {
          select: {
            id: true,
            firstName: true,
            lastName: true
          }
        }
      }
    });

    res.json({
      success: true,
      message: 'Bed released successfully',
      data: updated
    });
  } catch (error) {
    console.error('Release bed error:', error);
    res.status(500).json({
      success: false,
      message: 'Error releasing bed',
      error: error.message
    });
  }
};

/**
 * Get bed by ID
 */
const getBedById = async (req, res) => {
  try {
    const { id } = req.params;

    const bed = await prisma.bedAllocation.findUnique({
      where: { id },
      include: {
        patient: true
      }
    });

    if (!bed) {
      return res.status(404).json({
        success: false,
        message: 'Bed allocation not found'
      });
    }

    res.json({
      success: true,
      data: bed
    });
  } catch (error) {
    console.error('Get bed error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching bed',
      error: error.message
    });
  }
};

module.exports = {
  getBeds,
  allocateBed,
  releaseBed,
  getBedById
};

