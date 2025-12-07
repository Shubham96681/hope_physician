/**
 * Patient Insurance Controller
 * Handle insurance document uploads
 */

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

/**
 * Get patient's insurance files
 */
const getInsuranceFiles = async (req, res) => {
  try {
    const patientId = req.user.patientId || req.user.id;

    const files = await prisma.insuranceFile.findMany({
      where: { patientId },
      orderBy: { uploadedAt: 'desc' }
    });

    res.json({
      success: true,
      data: files
    });
  } catch (error) {
    console.error('Get insurance files error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching insurance files',
      error: error.message
    });
  }
};

/**
 * Upload insurance file
 */
const uploadInsuranceFile = async (req, res) => {
  try {
    const { fileName, fileType, description } = req.body;
    const patientId = req.user.patientId || req.user.id;
    const fileUrl = req.file ? req.file.path : null;

    if (!fileUrl) {
      return res.status(400).json({
        success: false,
        message: 'File is required'
      });
    }

    const file = await prisma.insuranceFile.create({
      data: {
        patientId,
        fileName: fileName || req.file.originalname,
        fileUrl,
        fileType: fileType || 'insurance_card',
        fileSize: req.file.size,
        description
      }
    });

    res.status(201).json({
      success: true,
      message: 'Insurance file uploaded successfully',
      data: file
    });
  } catch (error) {
    console.error('Upload insurance file error:', error);
    res.status(500).json({
      success: false,
      message: 'Error uploading insurance file',
      error: error.message
    });
  }
};

/**
 * Delete insurance file
 */
const deleteInsuranceFile = async (req, res) => {
  try {
    const { id } = req.params;
    const patientId = req.user.patientId || req.user.id;

    const file = await prisma.insuranceFile.findUnique({
      where: { id }
    });

    if (!file) {
      return res.status(404).json({
        success: false,
        message: 'File not found'
      });
    }

    if (file.patientId !== patientId) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized'
      });
    }

    // TODO: Delete file from storage
    await prisma.insuranceFile.delete({
      where: { id }
    });

    res.json({
      success: true,
      message: 'Insurance file deleted successfully'
    });
  } catch (error) {
    console.error('Delete insurance file error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting insurance file',
      error: error.message
    });
  }
};

module.exports = {
  getInsuranceFiles,
  uploadInsuranceFile,
  deleteInsuranceFile
};

