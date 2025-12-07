/**
 * Patient Report Controller
 * View and download medical reports
 */

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

/**
 * Get patient's medical reports
 */
const getReports = async (req, res) => {
  try {
    const { page = 1, limit = 10, type } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const patientId = req.user.patientId || req.user.id;

    const where = { patientId };
    if (type) where.recordType = type;

    const [reports, total] = await Promise.all([
      prisma.medicalRecord.findMany({
        where,
        skip,
        take: parseInt(limit),
        orderBy: { createdAt: 'desc' },
        include: {
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
      prisma.medicalRecord.count({ where })
    ]);

    // Parse attachments JSON
    const reportsWithParsedAttachments = reports.map(report => ({
      ...report,
      attachments: report.attachments ? JSON.parse(report.attachments) : [],
      testResults: report.testResults ? JSON.parse(report.testResults) : null
    }));

    res.json({
      success: true,
      data: reportsWithParsedAttachments,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Get reports error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching reports',
      error: error.message
    });
  }
};

/**
 * Get report by ID
 */
const getReportById = async (req, res) => {
  try {
    const { id } = req.params;
    const patientId = req.user.patientId || req.user.id;

    const report = await prisma.medicalRecord.findUnique({
      where: { id },
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
          include: {
            doctor: true
          }
        }
      }
    });

    if (!report) {
      return res.status(404).json({
        success: false,
        message: 'Report not found'
      });
    }

    if (report.patientId !== patientId) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized to view this report'
      });
    }

    res.json({
      success: true,
      data: {
        ...report,
        attachments: report.attachments ? JSON.parse(report.attachments) : [],
        testResults: report.testResults ? JSON.parse(report.testResults) : null
      }
    });
  } catch (error) {
    console.error('Get report error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching report',
      error: error.message
    });
  }
};

/**
 * Download report PDF
 */
const downloadReport = async (req, res) => {
  try {
    const { id } = req.params;
    const patientId = req.user.patientId || req.user.id;

    const report = await prisma.medicalRecord.findUnique({
      where: { id }
    });

    if (!report) {
      return res.status(404).json({
        success: false,
        message: 'Report not found'
      });
    }

    if (report.patientId !== patientId) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized to download this report'
      });
    }

    // Check if report has PDF attachment
    const attachments = report.attachments ? JSON.parse(report.attachments) : [];
    const pdfAttachment = attachments.find(att => att.type === 'pdf' || att.url.endsWith('.pdf'));

    if (!pdfAttachment) {
      return res.status(404).json({
        success: false,
        message: 'PDF not available for this report'
      });
    }

    // TODO: Return PDF file
    // For now, return the URL
    res.json({
      success: true,
      data: {
        pdfUrl: pdfAttachment.url,
        fileName: pdfAttachment.name || `report-${id}.pdf`
      }
    });
  } catch (error) {
    console.error('Download report error:', error);
    res.status(500).json({
      success: false,
      message: 'Error downloading report',
      error: error.message
    });
  }
};

/**
 * Get lab test reports
 */
const getLabReports = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const patientId = req.user.patientId || req.user.id;

    const [labTests, total] = await Promise.all([
      prisma.labTest.findMany({
        where: {
          patientId,
          status: 'completed',
          reportUrl: { not: null }
        },
        skip,
        take: parseInt(limit),
        orderBy: { completedDate: 'desc' },
        include: {
          doctor: {
            select: {
              firstName: true,
              lastName: true,
              specialization: true
            }
          }
        }
      }),
      prisma.labTest.count({
        where: {
          patientId,
          status: 'completed',
          reportUrl: { not: null }
        }
      })
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
    console.error('Get lab reports error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching lab reports',
      error: error.message
    });
  }
};

module.exports = {
  getReports,
  getReportById,
  downloadReport,
  getLabReports
};

