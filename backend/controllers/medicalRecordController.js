// controllers/medicalRecordController.js
const { prisma } = require('../src/lib/prisma.js');

const medicalRecordController = {
  // Create a new medical record
  createMedicalRecord: async (req, res) => {
    try {
      const {
        appointmentId,
        patientId,
        doctorId,
        recordType,
        title,
        description,
        diagnosis,
        diagnosisCode,
        attachments,
        bloodPressure,
        temperature,
        heartRate,
        weight,
        height,
        bmi,
        testName,
        testResults,
        normalRange,
        abnormalFlag,
        doctorNotes,
        followUpRequired,
      } = req.body;

      // Validate required fields
      if (!patientId || !doctorId || !recordType || !title) {
        return res.status(400).json({ error: 'Missing required fields' });
      }

      // Parse JSON fields
      let attachmentsArray = [];
      if (attachments) {
        try {
          attachmentsArray = typeof attachments === 'string' ? JSON.parse(attachments) : attachments;
        } catch (error) {
          return res.status(400).json({ error: 'Invalid attachments format' });
        }
      }

      let testResultsObj = {};
      if (testResults) {
        try {
          testResultsObj = typeof testResults === 'string' ? JSON.parse(testResults) : testResults;
        } catch (error) {
          return res.status(400).json({ error: 'Invalid testResults format' });
        }
      }

      const medicalRecord = await prisma.medicalRecord.create({
        data: {
          appointmentId: appointmentId || null,
          patientId,
          doctorId,
          recordType,
          title,
          description,
          diagnosis,
          diagnosisCode,
          attachments: attachmentsArray.length > 0 ? JSON.stringify(attachmentsArray) : null,
          bloodPressure,
          temperature,
          heartRate,
          weight,
          height,
          bmi,
          testName,
          testResults: Object.keys(testResultsObj).length > 0 ? JSON.stringify(testResultsObj) : null,
          normalRange,
          abnormalFlag: abnormalFlag || false,
          doctorNotes,
          followUpRequired: followUpRequired || false,
        },
        include: {
          patient: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
              phone: true,
            },
          },
          doctor: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              specialization: true,
            },
          },
          appointment: {
            select: {
              id: true,
              date: true,
              time: true,
            },
          },
        },
      });

      // Parse JSON fields for response
      if (medicalRecord.attachments) {
        medicalRecord.attachments = JSON.parse(medicalRecord.attachments);
      }
      if (medicalRecord.testResults) {
        medicalRecord.testResults = JSON.parse(medicalRecord.testResults);
      }

      return res.status(201).json({
        success: true,
        message: 'Medical record created successfully',
        data: medicalRecord,
      });
    } catch (error) {
      console.error('Error creating medical record:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  },

  // Get medical record by ID
  getMedicalRecord: async (req, res) => {
    try {
      const { id } = req.params;

      const medicalRecord = await prisma.medicalRecord.findUnique({
        where: { id },
        include: {
          patient: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
              phone: true,
              dateOfBirth: true,
            },
          },
          doctor: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              specialization: true,
            },
          },
          appointment: {
            select: {
              id: true,
              date: true,
              time: true,
              type: true,
            },
          },
        },
      });

      if (!medicalRecord) {
        return res.status(404).json({ error: 'Medical record not found' });
      }

      // Parse JSON fields
      if (medicalRecord.attachments) {
        medicalRecord.attachments = JSON.parse(medicalRecord.attachments);
      }
      if (medicalRecord.testResults) {
        medicalRecord.testResults = JSON.parse(medicalRecord.testResults);
      }

      return res.json({ data: medicalRecord });
    } catch (error) {
      console.error('Error fetching medical record:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  },

  // Get all medical records for a patient
  getPatientMedicalRecords: async (req, res) => {
    try {
      const { patientId } = req.params;
      const { recordType, startDate, endDate } = req.query;

      const where = { patientId };
      if (recordType) where.recordType = recordType;
      if (startDate || endDate) {
        where.createdAt = {};
        if (startDate) where.createdAt.gte = new Date(startDate);
        if (endDate) where.createdAt.lte = new Date(endDate);
      }

      const medicalRecords = await prisma.medicalRecord.findMany({
        where,
        include: {
          doctor: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              specialization: true,
            },
          },
          appointment: {
            select: {
              id: true,
              date: true,
              time: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      });

      // Parse JSON fields
      medicalRecords.forEach(record => {
        if (record.attachments) {
          record.attachments = JSON.parse(record.attachments);
        }
        if (record.testResults) {
          record.testResults = JSON.parse(record.testResults);
        }
      });

      return res.json({ data: medicalRecords });
    } catch (error) {
      console.error('Error fetching patient medical records:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  },

  // Get all medical records for a doctor
  getDoctorMedicalRecords: async (req, res) => {
    try {
      const { doctorId } = req.params;
      const { recordType, patientId } = req.query;

      const where = { doctorId };
      if (recordType) where.recordType = recordType;
      if (patientId) where.patientId = patientId;

      const medicalRecords = await prisma.medicalRecord.findMany({
        where,
        include: {
          patient: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
              phone: true,
            },
          },
          appointment: {
            select: {
              id: true,
              date: true,
              time: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      });

      // Parse JSON fields
      medicalRecords.forEach(record => {
        if (record.attachments) {
          record.attachments = JSON.parse(record.attachments);
        }
        if (record.testResults) {
          record.testResults = JSON.parse(record.testResults);
        }
      });

      return res.json({ data: medicalRecords });
    } catch (error) {
      console.error('Error fetching doctor medical records:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  },

  // Update medical record
  updateMedicalRecord: async (req, res) => {
    try {
      const { id } = req.params;
      const updateData = {};

      // Allow updating most fields
      const allowedFields = [
        'title', 'description', 'diagnosis', 'diagnosisCode',
        'attachments', 'bloodPressure', 'temperature', 'heartRate',
        'weight', 'height', 'bmi', 'testName', 'testResults',
        'normalRange', 'abnormalFlag', 'doctorNotes', 'followUpRequired'
      ];

      allowedFields.forEach(field => {
        if (req.body[field] !== undefined) {
          if (field === 'attachments' || field === 'testResults') {
            // Parse JSON if string
            const value = typeof req.body[field] === 'string' 
              ? JSON.parse(req.body[field]) 
              : req.body[field];
            updateData[field] = JSON.stringify(value);
          } else {
            updateData[field] = req.body[field];
          }
        }
      });

      const medicalRecord = await prisma.medicalRecord.update({
        where: { id },
        data: updateData,
        include: {
          patient: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
            },
          },
          doctor: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
            },
          },
        },
      });

      // Parse JSON fields
      if (medicalRecord.attachments) {
        medicalRecord.attachments = JSON.parse(medicalRecord.attachments);
      }
      if (medicalRecord.testResults) {
        medicalRecord.testResults = JSON.parse(medicalRecord.testResults);
      }

      return res.json({
        success: true,
        message: 'Medical record updated successfully',
        data: medicalRecord,
      });
    } catch (error) {
      console.error('Error updating medical record:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  },

  // Delete medical record
  deleteMedicalRecord: async (req, res) => {
    try {
      const { id } = req.params;

      await prisma.medicalRecord.delete({
        where: { id },
      });

      return res.json({
        success: true,
        message: 'Medical record deleted successfully',
      });
    } catch (error) {
      console.error('Error deleting medical record:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  },
};

module.exports = medicalRecordController;

