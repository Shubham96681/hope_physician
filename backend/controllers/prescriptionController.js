// controllers/prescriptionController.js
const { prisma } = require('../src/lib/prisma.js');
const { generatePrescriptionPDF } = require('../services/pdfService');

const prescriptionController = {
  // Create a new prescription
  createPrescription: async (req, res) => {
    try {
      const { appointmentId, patientId, doctorId, medications, instructions, diagnosis, notes, expiryDate } = req.body;

      // Validate required fields
      if (!appointmentId || !patientId || !doctorId || !medications) {
        return res.status(400).json({ error: 'Missing required fields' });
      }

      // Validate medications is valid JSON array
      let medicationsArray;
      try {
        medicationsArray = typeof medications === 'string' ? JSON.parse(medications) : medications;
        if (!Array.isArray(medicationsArray)) {
          throw new Error('Medications must be an array');
        }
      } catch (error) {
        return res.status(400).json({ error: 'Invalid medications format. Must be a valid JSON array.' });
      }

      // Create prescription
      const prescription = await prisma.prescription.create({
        data: {
          appointmentId,
          patientId,
          doctorId,
          medications: JSON.stringify(medicationsArray),
          instructions,
          diagnosis,
          notes,
          expiryDate: expiryDate ? new Date(expiryDate) : null,
        },
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
              licenseNumber: true,
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

      // Generate PDF asynchronously
      generatePrescriptionPDF(prescription).catch(err => {
        console.error('Error generating prescription PDF:', err);
      });

      return res.status(201).json({
        success: true,
        message: 'Prescription created successfully',
        data: prescription,
      });
    } catch (error) {
      console.error('Error creating prescription:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  },

  // Get prescription by ID
  getPrescription: async (req, res) => {
    try {
      const { id } = req.params;

      const prescription = await prisma.prescription.findUnique({
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
              licenseNumber: true,
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

      if (!prescription) {
        return res.status(404).json({ error: 'Prescription not found' });
      }

      // Parse medications JSON
      prescription.medications = JSON.parse(prescription.medications);

      return res.json({ data: prescription });
    } catch (error) {
      console.error('Error fetching prescription:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  },

  // Get all prescriptions for a doctor
  getDoctorPrescriptions: async (req, res) => {
    try {
      const { doctorId } = req.params;
      const { status, patientId, startDate, endDate } = req.query;

      const where = { doctorId };
      if (status) where.status = status;
      if (patientId) where.patientId = patientId;
      if (startDate || endDate) {
        where.issuedDate = {};
        if (startDate) where.issuedDate.gte = new Date(startDate);
        if (endDate) where.issuedDate.lte = new Date(endDate);
      }

      const prescriptions = await prisma.prescription.findMany({
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
        orderBy: { issuedDate: 'desc' },
      });

      // Parse medications JSON for each prescription
      prescriptions.forEach(p => {
        p.medications = JSON.parse(p.medications);
      });

      return res.json({ data: prescriptions });
    } catch (error) {
      console.error('Error fetching prescriptions:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  },

  // Get all prescriptions for a patient
  getPatientPrescriptions: async (req, res) => {
    try {
      const { patientId } = req.params;
      const { status } = req.query;

      const where = { patientId };
      if (status) where.status = status;

      const prescriptions = await prisma.prescription.findMany({
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
        orderBy: { issuedDate: 'desc' },
      });

      // Parse medications JSON
      prescriptions.forEach(p => {
        p.medications = JSON.parse(p.medications);
      });

      return res.json({ data: prescriptions });
    } catch (error) {
      console.error('Error fetching patient prescriptions:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  },

  // Update prescription
  updatePrescription: async (req, res) => {
    try {
      const { id } = req.params;
      const { medications, instructions, diagnosis, notes, status, expiryDate } = req.body;

      const updateData = {};
      if (medications) {
        const medicationsArray = typeof medications === 'string' ? JSON.parse(medications) : medications;
        updateData.medications = JSON.stringify(medicationsArray);
      }
      if (instructions !== undefined) updateData.instructions = instructions;
      if (diagnosis !== undefined) updateData.diagnosis = diagnosis;
      if (notes !== undefined) updateData.notes = notes;
      if (status !== undefined) updateData.status = status;
      if (expiryDate !== undefined) updateData.expiryDate = expiryDate ? new Date(expiryDate) : null;

      const prescription = await prisma.prescription.update({
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

      // Regenerate PDF if medications or other key fields changed
      if (medications || instructions || diagnosis) {
        generatePrescriptionPDF(prescription).catch(err => {
          console.error('Error regenerating prescription PDF:', err);
        });
      }

      prescription.medications = JSON.parse(prescription.medications);

      return res.json({
        success: true,
        message: 'Prescription updated successfully',
        data: prescription,
      });
    } catch (error) {
      console.error('Error updating prescription:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  },

  // Delete prescription
  deletePrescription: async (req, res) => {
    try {
      const { id } = req.params;

      await prisma.prescription.delete({
        where: { id },
      });

      return res.json({
        success: true,
        message: 'Prescription deleted successfully',
      });
    } catch (error) {
      console.error('Error deleting prescription:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  },

  // Generate/Regenerate prescription PDF
  generatePDF: async (req, res) => {
    try {
      const { id } = req.params;

      const prescription = await prisma.prescription.findUnique({
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
              licenseNumber: true,
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

      if (!prescription) {
        return res.status(404).json({ error: 'Prescription not found' });
      }

      const pdfUrl = await generatePrescriptionPDF(prescription);

      // Update prescription with PDF URL
      await prisma.prescription.update({
        where: { id },
        data: {
          pdfUrl,
          pdfGeneratedAt: new Date(),
        },
      });

      return res.json({
        success: true,
        message: 'PDF generated successfully',
        data: { pdfUrl },
      });
    } catch (error) {
      console.error('Error generating PDF:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  },
};

module.exports = prescriptionController;

