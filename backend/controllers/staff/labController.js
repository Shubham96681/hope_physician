/**
 * Lab Controller
 * Handles lab test requests, reports, and status management
 */

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

/**
 * Create lab test request
 */
const createLabTest = async (req, res) => {
  try {
    const {
      patientId,
      appointmentId,
      doctorId,
      testName,
      testType,
      testCategory,
      testCode,
      doctorNotes
    } = req.body;

    const labTest = await prisma.labTest.create({
      data: {
        patientId,
        appointmentId: appointmentId || null,
        doctorId: doctorId || null,
        requestedBy: req.user.id,
        testName,
        testType,
        testCategory,
        testCode,
        doctorNotes,
        status: 'pending'
      },
      include: {
        patient: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            dateOfBirth: true,
            gender: true
          }
        },
        doctor: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            specialization: true
          }
        },
        appointment: {
          select: {
            id: true,
            date: true
          }
        }
      }
    });

    res.status(201).json({
      success: true,
      message: 'Lab test request created successfully',
      data: labTest
    });
  } catch (error) {
    console.error('Create lab test error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating lab test request',
      error: error.message
    });
  }
};

/**
 * Get all lab tests
 */
const getLabTests = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      status,
      testType,
      patientId,
      doctorId
    } = req.query;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const where = {};
    if (status) where.status = status;
    if (testType) where.testType = testType;
    if (patientId) where.patientId = patientId;
    if (doctorId) where.doctorId = doctorId;

    const [labTests, total] = await Promise.all([
      prisma.labTest.findMany({
        where,
        skip,
        take: parseInt(limit),
        orderBy: { requestedDate: 'desc' },
        include: {
          patient: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              dateOfBirth: true,
              gender: true
            }
          },
          doctor: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              specialization: true
            }
          },
          appointment: {
            select: {
              id: true,
              date: true
            }
          }
        }
      }),
      prisma.labTest.count({ where })
    ]);

    // Parse results JSON
    const labTestsWithParsedResults = labTests.map(test => ({
      ...test,
      results: test.results ? JSON.parse(test.results) : null
    }));

    res.json({
      success: true,
      data: labTestsWithParsedResults,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Get lab tests error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching lab tests',
      error: error.message
    });
  }
};

/**
 * Get lab test by ID
 */
const getLabTestById = async (req, res) => {
  try {
    const { id } = req.params;

    const labTest = await prisma.labTest.findUnique({
      where: { id },
      include: {
        patient: true,
        doctor: true,
        appointment: {
          include: {
            doctor: true
          }
        }
      }
    });

    if (!labTest) {
      return res.status(404).json({
        success: false,
        message: 'Lab test not found'
      });
    }

    res.json({
      success: true,
      data: {
        ...labTest,
        results: labTest.results ? JSON.parse(labTest.results) : null
      }
    });
  } catch (error) {
    console.error('Get lab test error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching lab test',
      error: error.message
    });
  }
};

/**
 * Assign lab test to technician
 */
const assignLabTest = async (req, res) => {
  try {
    const { id } = req.params;
    const { assignedTo } = req.body;

    const labTest = await prisma.labTest.update({
      where: { id },
      data: {
        assignedTo,
        assignedAt: new Date(),
        status: 'assigned'
      },
      include: {
        patient: true,
        doctor: true
      }
    });

    res.json({
      success: true,
      message: 'Lab test assigned successfully',
      data: labTest
    });
  } catch (error) {
    console.error('Assign lab test error:', error);
    res.status(500).json({
      success: false,
      message: 'Error assigning lab test',
      error: error.message
    });
  }
};

/**
 * Update lab test status
 */
const updateLabTestStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const updateData = { status };
    if (status === 'completed') {
      updateData.completedDate = new Date();
    }

    const labTest = await prisma.labTest.update({
      where: { id },
      data: updateData,
      include: {
        patient: true,
        doctor: true
      }
    });

    res.json({
      success: true,
      message: 'Lab test status updated successfully',
      data: labTest
    });
  } catch (error) {
    console.error('Update lab test status error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating lab test status',
      error: error.message
    });
  }
};

/**
 * Upload lab report
 */
const uploadLabReport = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      results,
      normalRange,
      abnormalFlag,
      criticalFlag,
      labNotes
    } = req.body;

    // Handle file upload if provided
    const reportUrl = req.file ? req.file.path : null;

    const labTest = await prisma.labTest.findUnique({
      where: { id }
    });

    if (!labTest) {
      return res.status(404).json({
        success: false,
        message: 'Lab test not found'
      });
    }

    const updateData = {
      results: results ? JSON.stringify(results) : labTest.results,
      normalRange: normalRange || labTest.normalRange,
      abnormalFlag: abnormalFlag !== undefined ? abnormalFlag : labTest.abnormalFlag,
      criticalFlag: criticalFlag !== undefined ? criticalFlag : labTest.criticalFlag,
      labNotes: labNotes || labTest.labNotes,
      status: 'completed',
      completedDate: new Date()
    };

    if (reportUrl) {
      updateData.reportUrl = reportUrl;
      updateData.reportUploadedAt = new Date();
      updateData.reportUploadedBy = req.user.id;
    }

    const updated = await prisma.labTest.update({
      where: { id },
      data: updateData,
      include: {
        patient: true,
        doctor: true,
        appointment: true
      }
    });

    res.json({
      success: true,
      message: 'Lab report uploaded successfully',
      data: {
        ...updated,
        results: updated.results ? JSON.parse(updated.results) : null
      }
    });
  } catch (error) {
    console.error('Upload lab report error:', error);
    res.status(500).json({
      success: false,
      message: 'Error uploading lab report',
      error: error.message
    });
  }
};

/**
 * Get lab test statistics
 */
const getLabTestStats = async (req, res) => {
  try {
    const { dateFrom, dateTo } = req.query;

    const where = {};
    if (dateFrom || dateTo) {
      where.requestedDate = {};
      if (dateFrom) where.requestedDate.gte = new Date(dateFrom);
      if (dateTo) where.requestedDate.lte = new Date(dateTo);
    }

    const [total, pending, inProgress, completed, critical] = await Promise.all([
      prisma.labTest.count({ where }),
      prisma.labTest.count({ where: { ...where, status: 'pending' } }),
      prisma.labTest.count({ where: { ...where, status: 'in_progress' } }),
      prisma.labTest.count({ where: { ...where, status: 'completed' } }),
      prisma.labTest.count({ where: { ...where, criticalFlag: true } })
    ]);

    res.json({
      success: true,
      data: {
        total,
        pending,
        inProgress,
        completed,
        critical
      }
    });
  } catch (error) {
    console.error('Get lab test stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching lab test statistics',
      error: error.message
    });
  }
};

module.exports = {
  createLabTest,
  getLabTests,
  getLabTestById,
  assignLabTest,
  updateLabTestStatus,
  uploadLabReport,
  getLabTestStats
};

