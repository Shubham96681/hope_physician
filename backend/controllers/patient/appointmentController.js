/**
 * Patient Appointment Controller
 * Handles appointment booking, cancellation, rescheduling
 */

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

/**
 * Get patient's appointments
 */
const getAppointments = async (req, res) => {
  try {
    const { page = 1, limit = 10, status } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const patientId = req.user.patientId || req.user.id;

    const where = { patientId };
    if (status) where.status = status;

    const [appointments, total] = await Promise.all([
      prisma.appointment.findMany({
        where,
        skip,
        take: parseInt(limit),
        orderBy: { date: 'desc' },
        include: {
          doctor: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              specialization: true,
              profileImage: true,
              email: true,
              phone: true
            }
          }
        }
      }),
      prisma.appointment.count({ where })
    ]);

    res.json({
      success: true,
      data: appointments,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Get appointments error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching appointments',
      error: error.message
    });
  }
};

/**
 * Book new appointment
 */
const bookAppointment = async (req, res) => {
  try {
    const { doctorId, date, time, type, notes, department } = req.body;
    const patientId = req.user.patientId || req.user.id;

    // Check if doctor is available
    const doctor = await prisma.doctor.findUnique({
      where: { id: doctorId }
    });

    if (!doctor || !doctor.isAvailable) {
      return res.status(400).json({
        success: false,
        message: 'Doctor is not available'
      });
    }

    // Check for conflicting appointments
    const conflictingAppointment = await prisma.appointment.findFirst({
      where: {
        doctorId,
        date: new Date(date),
        time,
        status: {
          in: ['scheduled', 'confirmed', 'in_progress']
        }
      }
    });

    if (conflictingAppointment) {
      return res.status(400).json({
        success: false,
        message: 'Doctor already has an appointment at this time'
      });
    }

    const appointment = await prisma.appointment.create({
      data: {
        patientId,
        doctorId,
        date: new Date(date),
        time,
        type,
        notes,
        department,
        status: 'scheduled'
      },
      include: {
        doctor: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            specialization: true,
            email: true,
            phone: true
          }
        },
        patient: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            phone: true
          }
        }
      }
    });

    // TODO: Send confirmation email/SMS
    // TODO: Create reminder for appointment

    res.status(201).json({
      success: true,
      message: 'Appointment booked successfully',
      data: appointment
    });
  } catch (error) {
    console.error('Book appointment error:', error);
    res.status(500).json({
      success: false,
      message: 'Error booking appointment',
      error: error.message
    });
  }
};

/**
 * Cancel appointment
 */
const cancelAppointment = async (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;
    const patientId = req.user.patientId || req.user.id;

    const appointment = await prisma.appointment.findUnique({
      where: { id }
    });

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found'
      });
    }

    if (appointment.patientId !== patientId) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized to cancel this appointment'
      });
    }

    if (appointment.status === 'cancelled') {
      return res.status(400).json({
        success: false,
        message: 'Appointment is already cancelled'
      });
    }

    const updated = await prisma.appointment.update({
      where: { id },
      data: {
        status: 'cancelled',
        notes: reason ? `${appointment.notes || ''}\nCancelled: ${reason}` : appointment.notes
      },
      include: {
        doctor: true
      }
    });

    // TODO: Send cancellation email/SMS
    // TODO: Cancel related reminders

    res.json({
      success: true,
      message: 'Appointment cancelled successfully',
      data: updated
    });
  } catch (error) {
    console.error('Cancel appointment error:', error);
    res.status(500).json({
      success: false,
      message: 'Error cancelling appointment',
      error: error.message
    });
  }
};

/**
 * Reschedule appointment
 */
const rescheduleAppointment = async (req, res) => {
  try {
    const { id } = req.params;
    const { date, time, reason } = req.body;
    const patientId = req.user.patientId || req.user.id;

    const appointment = await prisma.appointment.findUnique({
      where: { id },
      include: { doctor: true }
    });

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found'
      });
    }

    if (appointment.patientId !== patientId) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized to reschedule this appointment'
      });
    }

    // Check for conflicting appointments
    const conflictingAppointment = await prisma.appointment.findFirst({
      where: {
        doctorId: appointment.doctorId,
        date: new Date(date),
        time,
        status: {
          in: ['scheduled', 'confirmed', 'in_progress']
        },
        id: { not: id }
      }
    });

    if (conflictingAppointment) {
      return res.status(400).json({
        success: false,
        message: 'Doctor already has an appointment at this time'
      });
    }

    const updated = await prisma.appointment.update({
      where: { id },
      data: {
        date: new Date(date),
        time,
        status: 'rescheduled',
        notes: reason ? `${appointment.notes || ''}\nRescheduled: ${reason}` : appointment.notes
      },
      include: {
        doctor: true,
        patient: true
      }
    });

    // TODO: Send rescheduling email/SMS
    // TODO: Update reminders

    res.json({
      success: true,
      message: 'Appointment rescheduled successfully',
      data: updated
    });
  } catch (error) {
    console.error('Reschedule appointment error:', error);
    res.status(500).json({
      success: false,
      message: 'Error rescheduling appointment',
      error: error.message
    });
  }
};

/**
 * Get available doctors
 */
const getAvailableDoctors = async (req, res) => {
  try {
    const { specialization, date } = req.query;

    const where = {
      isAvailable: true
    };

    if (specialization) {
      where.specialization = specialization;
    }

    const doctors = await prisma.doctor.findMany({
      where,
      select: {
        id: true,
        firstName: true,
        lastName: true,
        specialization: true,
        profileImage: true,
        email: true,
        phone: true,
        yearsOfExperience: true,
        bio: true,
        availability: {
          where: date ? {
            validFrom: { lte: new Date(date) },
            validUntil: { gte: new Date(date) }
          } : {}
        }
      }
    });

    res.json({
      success: true,
      data: doctors
    });
  } catch (error) {
    console.error('Get available doctors error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching available doctors',
      error: error.message
    });
  }
};

/**
 * Get doctor availability for specific date
 */
const getDoctorAvailability = async (req, res) => {
  try {
    const { doctorId } = req.params;
    const { date } = req.query;

    if (!date) {
      return res.status(400).json({
        success: false,
        message: 'Date parameter is required'
      });
    }

    const selectedDate = new Date(date);
    const dayOfWeek = selectedDate.getDay();

    // Get doctor's weekly availability
    const availability = await prisma.doctorAvailability.findMany({
      where: {
        doctorId,
        dayOfWeek,
        isAvailable: true,
        OR: [
          { validFrom: null },
          { validFrom: { lte: selectedDate } }
        ],
        OR: [
          { validUntil: null },
          { validUntil: { gte: selectedDate } }
        ]
      }
    });

    // Get existing appointments for the date
    const appointments = await prisma.appointment.findMany({
      where: {
        doctorId,
        date: selectedDate,
        status: {
          in: ['scheduled', 'confirmed', 'in_progress']
        }
      },
      select: {
        time: true
      }
    });

    const bookedTimes = appointments.map(apt => apt.time);

    // Generate available time slots
    const availableSlots = [];
    availability.forEach(avail => {
      const [startHour, startMin] = avail.startTime.split(':').map(Number);
      const [endHour, endMin] = avail.endTime.split(':').map(Number);
      
      let currentHour = startHour;
      let currentMin = startMin;

      while (currentHour < endHour || (currentHour === endHour && currentMin < endMin)) {
        const timeSlot = `${String(currentHour).padStart(2, '0')}:${String(currentMin).padStart(2, '0')}`;
        const timeSlot12h = formatTime12h(timeSlot);
        
        if (!bookedTimes.includes(timeSlot12h)) {
          availableSlots.push(timeSlot12h);
        }

        currentMin += 30; // 30-minute slots
        if (currentMin >= 60) {
          currentMin = 0;
          currentHour++;
        }
      }
    });

    res.json({
      success: true,
      data: {
        doctorId,
        date,
        availableSlots
      }
    });
  } catch (error) {
    console.error('Get doctor availability error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching doctor availability',
      error: error.message
    });
  }
};

// Helper function to format time to 12-hour format
const formatTime12h = (time24h) => {
  const [hours, minutes] = time24h.split(':').map(Number);
  const period = hours >= 12 ? 'PM' : 'AM';
  const hours12 = hours % 12 || 12;
  return `${hours12}:${String(minutes).padStart(2, '0')} ${period}`;
};

module.exports = {
  getAppointments,
  bookAppointment,
  cancelAppointment,
  rescheduleAppointment,
  getAvailableDoctors,
  getDoctorAvailability
};

