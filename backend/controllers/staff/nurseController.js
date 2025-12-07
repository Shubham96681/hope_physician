/**
 * Nurse Controller
 * Handles vitals, medication, bed allocation, and emergency alerts
 */

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

/**
 * Record patient vitals
 */
const recordVitals = async (req, res) => {
  try {
    const {
      patientId,
      appointmentId,
      bloodPressure,
      systolicBP,
      diastolicBP,
      pulse,
      temperature,
      temperatureUnit = 'celsius',
      respiratoryRate,
      oxygenSaturation,
      bloodSugar,
      weight,
      height,
      painLevel,
      consciousness,
      notes
    } = req.body;

    // Calculate BMI if weight and height provided
    let bmi = null;
    if (weight && height) {
      const heightInMeters = height / 100;
      bmi = weight / (heightInMeters * heightInMeters);
    }

    const vitals = await prisma.patientVitals.create({
      data: {
        patientId,
        appointmentId: appointmentId || null,
        recordedBy: req.user.id,
        recordedByType: 'nurse',
        bloodPressure,
        systolicBP,
        diastolicBP,
        pulse,
        temperature,
        temperatureUnit,
        respiratoryRate,
        oxygenSaturation,
        bloodSugar,
        weight,
        height,
        bmi,
        painLevel,
        consciousness,
        notes
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

    res.status(201).json({
      success: true,
      message: 'Vitals recorded successfully',
      data: vitals
    });
  } catch (error) {
    console.error('Record vitals error:', error);
    res.status(500).json({
      success: false,
      message: 'Error recording vitals',
      error: error.message
    });
  }
};

/**
 * Get patient vitals history
 */
const getPatientVitals = async (req, res) => {
  try {
    const { patientId } = req.params;
    const { limit = 50 } = req.query;

    const vitals = await prisma.patientVitals.findMany({
      where: { patientId },
      take: parseInt(limit),
      orderBy: { createdAt: 'desc' },
      include: {
        appointment: {
          select: {
            id: true,
            date: true,
            doctor: {
              select: {
                firstName: true,
                lastName: true
              }
            }
          }
        }
      }
    });

    res.json({
      success: true,
      data: vitals
    });
  } catch (error) {
    console.error('Get vitals error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching vitals',
      error: error.message
    });
  }
};

/**
 * Get admitted patients
 */
const getAdmittedPatients = async (req, res) => {
  try {
    const { status = 'occupied' } = req.query;

    const bedAllocations = await prisma.bedAllocation.findMany({
      where: {
        status,
        isActive: true
      },
      include: {
        patient: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            dateOfBirth: true,
            gender: true,
            phone: true,
            emergencyContact: true,
            emergencyPhone: true
          }
        }
      },
      orderBy: { allocatedAt: 'desc' }
    });

    // Get latest vitals for each patient
    const patientsWithVitals = await Promise.all(
      bedAllocations.map(async (allocation) => {
        const latestVitals = await prisma.patientVitals.findFirst({
          where: { patientId: allocation.patientId },
          orderBy: { createdAt: 'desc' }
        });

        return {
          ...allocation,
          latestVitals
        };
      })
    );

    res.json({
      success: true,
      data: patientsWithVitals
    });
  } catch (error) {
    console.error('Get admitted patients error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching admitted patients',
      error: error.message
    });
  }
};

/**
 * Update medication schedule
 */
const updateMedicationSchedule = async (req, res) => {
  try {
    const {
      patientId,
      prescriptionId,
      medicationName,
      dosage,
      frequency,
      route,
      startDate,
      endDate,
      timesPerDay = 1,
      specificTimes,
      notes
    } = req.body;

    // Calculate next dose time
    let nextDoseTime = null;
    if (startDate && specificTimes) {
      const times = JSON.parse(specificTimes);
      if (times.length > 0) {
        const now = new Date();
        const start = new Date(startDate);
        const firstTime = times[0].split(':');
        start.setHours(parseInt(firstTime[0]), parseInt(firstTime[1]), 0);
        if (start > now) {
          nextDoseTime = start;
        }
      }
    }

    const medication = await prisma.medicationSchedule.create({
      data: {
        patientId,
        prescriptionId: prescriptionId || null,
        medicationName,
        dosage,
        frequency,
        route,
        startDate: new Date(startDate),
        endDate: endDate ? new Date(endDate) : null,
        timesPerDay,
        specificTimes: specificTimes ? JSON.stringify(specificTimes) : null,
        nextDoseTime,
        notes,
        status: 'active'
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

    res.status(201).json({
      success: true,
      message: 'Medication schedule created successfully',
      data: medication
    });
  } catch (error) {
    console.error('Update medication schedule error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating medication schedule',
      error: error.message
    });
  }
};

/**
 * Get medication schedules
 */
const getMedicationSchedules = async (req, res) => {
  try {
    const { patientId, status = 'active' } = req.query;

    const where = {};
    if (patientId) where.patientId = patientId;
    if (status) where.status = status;

    const medications = await prisma.medicationSchedule.findMany({
      where,
      include: {
        patient: {
          select: {
            id: true,
            firstName: true,
            lastName: true
          }
        },
        prescription: {
          include: {
            doctor: {
              select: {
                firstName: true,
                lastName: true
              }
            }
          }
        }
      },
      orderBy: { startDate: 'desc' }
    });

    // Parse specificTimes JSON
    const medicationsWithParsedTimes = medications.map(med => ({
      ...med,
      specificTimes: med.specificTimes ? JSON.parse(med.specificTimes) : null
    }));

    res.json({
      success: true,
      data: medicationsWithParsedTimes
    });
  } catch (error) {
    console.error('Get medication schedules error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching medication schedules',
      error: error.message
    });
  }
};

/**
 * Mark medication as administered
 */
const markMedicationAdministered = async (req, res) => {
  try {
    const { id } = req.params;
    const { notes } = req.body;

    const medication = await prisma.medicationSchedule.findUnique({
      where: { id }
    });

    if (!medication) {
      return res.status(404).json({
        success: false,
        message: 'Medication schedule not found'
      });
    }

    // Calculate next dose time
    let nextDoseTime = null;
    if (medication.specificTimes) {
      const times = JSON.parse(medication.specificTimes);
      const now = new Date();
      const nextTime = times.find(time => {
        const [hours, minutes] = time.split(':');
        const doseTime = new Date(now);
        doseTime.setHours(parseInt(hours), parseInt(minutes), 0);
        return doseTime > now;
      });

      if (nextTime) {
        const [hours, minutes] = nextTime.split(':');
        nextDoseTime = new Date(now);
        nextDoseTime.setHours(parseInt(hours), parseInt(minutes), 0);
      } else {
        // Next day first dose
        const [hours, minutes] = times[0].split(':');
        nextDoseTime = new Date(now);
        nextDoseTime.setDate(nextDoseTime.getDate() + 1);
        nextDoseTime.setHours(parseInt(hours), parseInt(minutes), 0);
      }
    }

    const updated = await prisma.medicationSchedule.update({
      where: { id },
      data: {
        lastAdministered: new Date(),
        nextDoseTime,
        administeredBy: req.user.id,
        notes: notes ? `${medication.notes || ''}\n${notes}` : medication.notes
      }
    });

    res.json({
      success: true,
      message: 'Medication marked as administered',
      data: updated
    });
  } catch (error) {
    console.error('Mark medication administered error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating medication',
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

    // Check if bed is available
    const existingAllocation = await prisma.bedAllocation.findFirst({
      where: {
        bedNumber,
        status: { in: ['occupied', 'reserved'] },
        isActive: true
      }
    });

    if (existingAllocation) {
      return res.status(400).json({
        success: false,
        message: 'Bed is already occupied or reserved'
      });
    }

    const allocation = await prisma.bedAllocation.create({
      data: {
        patientId,
        bedNumber,
        roomNumber,
        roomType,
        floor,
        allocatedBy: req.user.id,
        expectedDischargeDate: expectedDischargeDate ? new Date(expectedDischargeDate) : null,
        notes,
        status: 'occupied',
        isActive: true
      },
      include: {
        patient: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            dateOfBirth: true,
            gender: true,
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
 * Get all beds
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
            dateOfBirth: true,
            gender: true
          }
        }
      },
      orderBy: [
        { floor: 'asc' },
        { roomNumber: 'asc' },
        { bedNumber: 'asc' }
      ]
    });

    res.json({
      success: true,
      data: beds
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
 * Release bed
 */
const releaseBed = async (req, res) => {
  try {
    const { id } = req.params;
    const { dischargeNotes } = req.body;

    const allocation = await prisma.bedAllocation.findUnique({
      where: { id }
    });

    if (!allocation) {
      return res.status(404).json({
        success: false,
        message: 'Bed allocation not found'
      });
    }

    const updated = await prisma.bedAllocation.update({
      where: { id },
      data: {
        status: 'available',
        isActive: false,
        actualDischargeDate: new Date(),
        dischargeNotes
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
 * Trigger emergency alert
 */
const triggerEmergencyAlert = async (req, res) => {
  try {
    const {
      patientId,
      alertType = 'medical',
      severity = 'high',
      location,
      description
    } = req.body;

    const alert = await prisma.emergencyAlert.create({
      data: {
        patientId: patientId || null,
        triggeredBy: req.user.id,
        alertType,
        severity,
        location,
        description,
        status: 'active'
      },
      include: {
        patient: patientId ? {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            roomNumber: true,
            bedNumber: true
          }
        } : undefined
      }
    });

    // TODO: Send notifications to relevant staff/doctors
    // TODO: Trigger real-time alerts via WebSocket

    res.status(201).json({
      success: true,
      message: 'Emergency alert triggered successfully',
      data: alert
    });
  } catch (error) {
    console.error('Trigger emergency alert error:', error);
    res.status(500).json({
      success: false,
      message: 'Error triggering emergency alert',
      error: error.message
    });
  }
};

/**
 * Get emergency alerts
 */
const getEmergencyAlerts = async (req, res) => {
  try {
    const { status = 'active', severity } = req.query;

    const where = {};
    if (status) where.status = status;
    if (severity) where.severity = severity;

    const alerts = await prisma.emergencyAlert.findMany({
      where,
      include: {
        patient: {
          select: {
            id: true,
            firstName: true,
            lastName: true
          }
        }
      },
      orderBy: { createdAt: 'desc' },
      take: 50
    });

    res.json({
      success: true,
      data: alerts
    });
  } catch (error) {
    console.error('Get emergency alerts error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching emergency alerts',
      error: error.message
    });
  }
};

/**
 * Acknowledge emergency alert
 */
const acknowledgeEmergencyAlert = async (req, res) => {
  try {
    const { id } = req.params;

    const alert = await prisma.emergencyAlert.update({
      where: { id },
      data: {
        status: 'acknowledged',
        acknowledgedBy: req.user.id,
        acknowledgedAt: new Date()
      }
    });

    res.json({
      success: true,
      message: 'Emergency alert acknowledged',
      data: alert
    });
  } catch (error) {
    console.error('Acknowledge emergency alert error:', error);
    res.status(500).json({
      success: false,
      message: 'Error acknowledging alert',
      error: error.message
    });
  }
};

module.exports = {
  recordVitals,
  getPatientVitals,
  getAdmittedPatients,
  updateMedicationSchedule,
  getMedicationSchedules,
  markMedicationAdministered,
  allocateBed,
  getBeds,
  releaseBed,
  triggerEmergencyAlert,
  getEmergencyAlerts,
  acknowledgeEmergencyAlert
};
