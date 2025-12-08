/**
 * Staff Controller - General Staff Operations
 * Handles attendance, tasks, stats, and KYC assistance
 */

const { prisma } = require('../../src/lib/prisma.js');

/**
 * Get staff dashboard statistics
 */
const getStaffStats = async (req, res) => {
  try {
    const employeeId = req.user?.employeeId || req.user?.id;
    
    if (!employeeId) {
      return res.status(400).json({
        success: false,
        message: 'Employee ID not found'
      });
    }

    // Get today's date range
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // Count completed tasks (assuming tasks are stored somewhere)
    // For now, we'll use a placeholder - you may need to create a Task model
    const tasksCompleted = 0; // TODO: Implement task counting
    const tasksPending = 0; // TODO: Implement task counting

    // Count pending KYC documents that need assistance
    const kycPending = await prisma.kYCDocument.count({
      where: {
        status: {
          in: ['pending', 'submitted', 'under_review']
        }
      }
    });

    res.json({
      success: true,
      data: {
        tasksCompleted,
        tasksPending,
        kycPending
      }
    });
  } catch (error) {
    console.error('Get staff stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching staff statistics',
      error: error.message
    });
  }
};

/**
 * Get tasks assigned to staff
 */
const getTasks = async (req, res) => {
  try {
    const employeeId = req.user?.employeeId || req.user?.id;
    const { status, page = 1, limit = 100 } = req.query;

    // TODO: Implement actual task fetching when Task model is created
    // For now, return empty array or mock data
    res.json({
      success: true,
      data: [],
      total: 0,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: 0,
        pages: 0
      }
    });
  } catch (error) {
    console.error('Get tasks error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching tasks',
      error: error.message
    });
  }
};

/**
 * Start a task
 */
const startTask = async (req, res) => {
  try {
    const { id } = req.params;
    const employeeId = req.user?.employeeId || req.user?.id;

    // TODO: Implement task starting when Task model is created
    res.json({
      success: true,
      message: 'Task started successfully'
    });
  } catch (error) {
    console.error('Start task error:', error);
    res.status(500).json({
      success: false,
      message: 'Error starting task',
      error: error.message
    });
  }
};

/**
 * Complete a task
 */
const completeTask = async (req, res) => {
  try {
    const { id } = req.params;
    const employeeId = req.user?.employeeId || req.user?.id;

    // TODO: Implement task completion when Task model is created
    res.json({
      success: true,
      message: 'Task completed successfully'
    });
  } catch (error) {
    console.error('Complete task error:', error);
    res.status(500).json({
      success: false,
      message: 'Error completing task',
      error: error.message
    });
  }
};

/**
 * Check in for attendance
 */
const checkIn = async (req, res) => {
  try {
    const employeeId = req.user?.employeeId || req.user?.id;
    const staffId = req.user?.staffId;
    const { checkInPhoto, checkInLocation } = req.body;

    if (!employeeId) {
      return res.status(400).json({
        success: false,
        message: 'Employee ID not found'
      });
    }

    // Check if already checked in today
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const existing = await prisma.attendance.findFirst({
      where: {
        employeeId,
        checkInTime: {
          gte: today,
          lt: tomorrow
        },
        checkOutTime: null
      }
    });

    if (existing) {
      return res.status(400).json({
        success: false,
        message: 'Already checked in today'
      });
    }

    const attendance = await prisma.attendance.create({
      data: {
        employeeId,
        staffId: staffId || null,
        checkInTime: new Date(),
        checkInPhoto: checkInPhoto || null,
        checkInLocation: checkInLocation || null,
        status: 'present'
      }
    });

    res.json({
      success: true,
      message: 'Checked in successfully',
      checkInTime: attendance.checkInTime.toISOString(),
      data: attendance
    });
  } catch (error) {
    console.error('Check-in error:', error);
    res.status(500).json({
      success: false,
      message: 'Error checking in',
      error: error.message
    });
  }
};

/**
 * Check out for attendance
 */
const checkOut = async (req, res) => {
  try {
    const employeeId = req.user?.employeeId || req.user?.id;
    const { checkOutPhoto, checkOutLocation } = req.body;

    if (!employeeId) {
      return res.status(400).json({
        success: false,
        message: 'Employee ID not found'
      });
    }

    // Find today's check-in
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const attendance = await prisma.attendance.findFirst({
      where: {
        employeeId,
        checkInTime: {
          gte: today,
          lt: tomorrow
        },
        checkOutTime: null
      }
    });

    if (!attendance) {
      return res.status(400).json({
        success: false,
        message: 'No check-in record found for today'
      });
    }

    const checkOutTime = new Date();
    const checkInTime = attendance.checkInTime;
    const diffMs = checkOutTime.getTime() - checkInTime.getTime();
    const workingHours = diffMs / (1000 * 60 * 60); // Convert to hours

    // Determine status based on working hours
    let status = 'present';
    if (workingHours < 4) {
      status = 'half_day';
    } else if (workingHours < 6) {
      status = 'late';
    }

    const updated = await prisma.attendance.update({
      where: { id: attendance.id },
      data: {
        checkOutTime,
        checkOutPhoto: checkOutPhoto || null,
        checkOutLocation: checkOutLocation || null,
        workingHours: parseFloat(workingHours.toFixed(2)),
        status
      }
    });

    res.json({
      success: true,
      message: `Checked out successfully! You worked ${workingHours.toFixed(2)} hours today.`,
      checkOutTime: updated.checkOutTime.toISOString(),
      hoursWorked: workingHours.toFixed(2),
      data: updated
    });
  } catch (error) {
    console.error('Check-out error:', error);
    res.status(500).json({
      success: false,
      message: 'Error checking out',
      error: error.message
    });
  }
};

/**
 * Get attendance status for today
 */
const getAttendanceStatus = async (req, res) => {
  try {
    const employeeId = req.user?.employeeId || req.user?.id;

    if (!employeeId) {
      return res.status(400).json({
        success: false,
        message: 'Employee ID not found'
      });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const attendance = await prisma.attendance.findFirst({
      where: {
        employeeId,
        checkInTime: {
          gte: today,
          lt: tomorrow
        }
      },
      orderBy: {
        checkInTime: 'desc'
      }
    });

    res.json({
      success: true,
      checkedIn: !!attendance && !attendance.checkOutTime,
      checkInTime: attendance?.checkInTime?.toISOString() || null,
      checkOutTime: attendance?.checkOutTime?.toISOString() || null,
      workingHours: attendance?.workingHours || null
    });
  } catch (error) {
    console.error('Get attendance status error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching attendance status',
      error: error.message
    });
  }
};

/**
 * Get attendance history
 */
const getAttendanceHistory = async (req, res) => {
  try {
    const employeeId = req.user?.employeeId || req.user?.id;
    const { page = 1, limit = 30, dateFrom, dateTo } = req.query;

    if (!employeeId) {
      return res.status(400).json({
        success: false,
        message: 'Employee ID not found'
      });
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const where = { employeeId };

    if (dateFrom || dateTo) {
      where.checkInTime = {};
      if (dateFrom) where.checkInTime.gte = new Date(dateFrom);
      if (dateTo) {
        const endDate = new Date(dateTo);
        endDate.setHours(23, 59, 59, 999);
        where.checkInTime.lte = endDate;
      }
    }

    const [attendance, total] = await Promise.all([
      prisma.attendance.findMany({
        where,
        skip,
        take: parseInt(limit),
        orderBy: { checkInTime: 'desc' },
        include: {
          employee: {
            select: {
              id: true,
              empId: true,
              firstName: true,
              lastName: true
            }
          }
        }
      }),
      prisma.attendance.count({ where })
    ]);

    res.json({
      success: true,
      data: attendance,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Get attendance history error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching attendance history',
      error: error.message
    });
  }
};

/**
 * Get KYC documents needing assistance
 */
const getKYCAssistance = async (req, res) => {
  try {
    const { status = 'pending', page = 1, limit = 100 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const where = {
      status: {
        in: status === 'pending' ? ['pending', 'submitted', 'under_review'] : [status]
      }
    };

    const [kycDocs, total] = await Promise.all([
      prisma.kYCDocument.findMany({
        where,
        skip,
        take: parseInt(limit),
        include: {
          patient: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
              phone: true
            }
          }
        },
        orderBy: { createdAt: 'desc' }
      }),
      prisma.kYCDocument.count({ where })
    ]);

    // Format KYC documents for display
    const formattedKYC = kycDocs.map(kyc => {
      const docCount = [
        kyc.salarySlip1, kyc.salarySlip2, kyc.salarySlip3,
        kyc.cancelledCheque, kyc.passbook,
        kyc.aadhaarFront, kyc.aadhaarBack,
        kyc.educationalDoc1, kyc.educationalDoc2, kyc.educationalDoc3
      ].filter(Boolean).length;

      return {
        id: kyc.id,
        patient: `${kyc.patient?.firstName || ''} ${kyc.patient?.lastName || ''}`.trim(),
        patientId: kyc.patientId,
        patientEmail: kyc.patient?.email,
        patientPhone: kyc.patient?.phone,
        submitted: new Date(kyc.createdAt).toLocaleDateString(),
        submittedDate: kyc.createdAt,
        documents: docCount,
        status: kyc.status,
        // Full KYC object
        fullKYC: kyc
      };
    });

    res.json({
      success: true,
      data: formattedKYC,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Get KYC assistance error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching KYC assistance requests',
      error: error.message
    });
  }
};

/**
 * Assist with KYC document
 */
const assistKYC = async (req, res) => {
  try {
    const { id } = req.params;
    const { notes } = req.body;
    const employeeId = req.user?.employeeId || req.user?.id;

    const kycDoc = await prisma.kYCDocument.findUnique({
      where: { id },
      include: { patient: true }
    });

    if (!kycDoc) {
      return res.status(404).json({
        success: false,
        message: 'KYC document not found'
      });
    }

    // Update KYC status to under_review if it's pending
    if (kycDoc.status === 'pending' || kycDoc.status === 'submitted') {
      await prisma.kYCDocument.update({
        where: { id },
        data: {
          status: 'under_review'
        }
      });
    }

    res.json({
      success: true,
      message: 'KYC assistance provided successfully',
      data: {
        kycId: id,
        assistedBy: employeeId,
        notes: notes || null
      }
    });
  } catch (error) {
    console.error('Assist KYC error:', error);
    res.status(500).json({
      success: false,
      message: 'Error providing KYC assistance',
      error: error.message
    });
  }
};

module.exports = {
  getStaffStats,
  getTasks,
  startTask,
  completeTask,
  checkIn,
  checkOut,
  getAttendanceStatus,
  getAttendanceHistory,
  getKYCAssistance,
  assistKYC
};

