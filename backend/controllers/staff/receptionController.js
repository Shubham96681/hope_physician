/**
 * Reception Controller
 * Handles patient registration, appointments, and billing
 */

const { PrismaClient } = require('@prisma/client');
const { generateInvoiceNumber } = require('../../utils/constants');
const prisma = new PrismaClient();

/**
 * Register a new patient
 */
const registerPatient = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      phone,
      dateOfBirth,
      gender,
      address,
      city,
      state,
      zipCode,
      emergencyContact,
      emergencyPhone,
      insuranceProvider,
      insuranceNumber
    } = req.body;

    // Check if patient already exists
    const existingPatient = await prisma.patient.findUnique({
      where: { email }
    });

    if (existingPatient) {
      return res.status(400).json({
        success: false,
        message: 'Patient with this email already exists'
      });
    }

    const patient = await prisma.patient.create({
      data: {
        firstName,
        lastName,
        email,
        phone,
        dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : null,
        gender,
        address,
        city,
        state,
        zipCode,
        emergencyContact,
        emergencyPhone,
        insuranceProvider,
        insuranceNumber
      }
    });

    res.status(201).json({
      success: true,
      message: 'Patient registered successfully',
      data: patient
    });
  } catch (error) {
    console.error('Register patient error:', error);
    res.status(500).json({
      success: false,
      message: 'Error registering patient',
      error: error.message
    });
  }
};

/**
 * Get all patients with pagination
 */
const getPatients = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = '' } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const where = search ? {
      OR: [
        { firstName: { contains: search, mode: 'insensitive' } },
        { lastName: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { phone: { contains: search } }
      ]
    } : {};

    const [patients, total] = await Promise.all([
      prisma.patient.findMany({
        where,
        skip,
        take: parseInt(limit),
        orderBy: { createdAt: 'desc' },
        include: {
          appointments: {
            take: 5,
            orderBy: { date: 'desc' }
          }
        }
      }),
      prisma.patient.count({ where })
    ]);

    res.json({
      success: true,
      data: patients,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Get patients error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching patients',
      error: error.message
    });
  }
};

/**
 * Get patient by ID
 */
const getPatientById = async (req, res) => {
  try {
    const { id } = req.params;

    const patient = await prisma.patient.findUnique({
      where: { id },
      include: {
        appointments: {
          include: {
            doctor: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                specialization: true
              }
            }
          },
          orderBy: { date: 'desc' }
        },
        billings: {
          orderBy: { invoiceDate: 'desc' },
          take: 10
        },
        vitals: {
          orderBy: { createdAt: 'desc' },
          take: 10
        }
      }
    });

    if (!patient) {
      return res.status(404).json({
        success: false,
        message: 'Patient not found'
      });
    }

    res.json({
      success: true,
      data: patient
    });
  } catch (error) {
    console.error('Get patient error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching patient',
      error: error.message
    });
  }
};

/**
 * Update patient information
 */
const updatePatient = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    if (updateData.dateOfBirth) {
      updateData.dateOfBirth = new Date(updateData.dateOfBirth);
    }

    const patient = await prisma.patient.update({
      where: { id },
      data: updateData
    });

    res.json({
      success: true,
      message: 'Patient updated successfully',
      data: patient
    });
  } catch (error) {
    console.error('Update patient error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating patient',
      error: error.message
    });
  }
};

/**
 * Create appointment
 */
const createAppointment = async (req, res) => {
  try {
    const {
      patientId,
      doctorId,
      date,
      time,
      type,
      notes,
      department
    } = req.body;

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
        patient: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            phone: true
          }
        },
        doctor: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            specialization: true
          }
        }
      }
    });

    res.status(201).json({
      success: true,
      message: 'Appointment created successfully',
      data: appointment
    });
  } catch (error) {
    console.error('Create appointment error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating appointment',
      error: error.message
    });
  }
};

/**
 * Get appointments with filters
 */
const getAppointments = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      status,
      date,
      doctorId,
      patientId
    } = req.query;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const where = {};
    if (status) where.status = status;
    if (date) where.date = new Date(date);
    if (doctorId) where.doctorId = doctorId;
    if (patientId) where.patientId = patientId;

    const [appointments, total] = await Promise.all([
      prisma.appointment.findMany({
        where,
        skip,
        take: parseInt(limit),
        orderBy: { date: 'desc' },
        include: {
          patient: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
              phone: true
            }
          },
          doctor: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              specialization: true
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
 * Update appointment
 */
const updateAppointment = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    if (updateData.date) {
      updateData.date = new Date(updateData.date);
    }

    const appointment = await prisma.appointment.update({
      where: { id },
      data: updateData,
      include: {
        patient: true,
        doctor: true
      }
    });

    res.json({
      success: true,
      message: 'Appointment updated successfully',
      data: appointment
    });
  } catch (error) {
    console.error('Update appointment error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating appointment',
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

    const appointment = await prisma.appointment.update({
      where: { id },
      data: {
        status: 'cancelled',
        notes: reason ? `${appointment.notes || ''}\nCancelled: ${reason}` : appointment.notes
      }
    });

    res.json({
      success: true,
      message: 'Appointment cancelled successfully',
      data: appointment
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
 * Create billing/invoice
 */
const createBilling = async (req, res) => {
  try {
    const {
      patientId,
      appointmentId,
      items,
      subtotal,
      tax = 0,
      discount = 0,
      dueDate,
      insuranceCovered = false,
      insuranceAmount = 0
    } = req.body;

    const totalAmount = subtotal + tax - discount - insuranceAmount;
    const invoiceNumber = generateInvoiceNumber();

    const billing = await prisma.billing.create({
      data: {
        patientId,
        appointmentId: appointmentId || null,
        invoiceNumber,
        items: JSON.stringify(items),
        subtotal,
        tax,
        discount,
        totalAmount,
        dueDate: dueDate ? new Date(dueDate) : null,
        insuranceCovered,
        insuranceAmount,
        paymentStatus: 'unpaid'
      },
      include: {
        patient: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            phone: true,
            insuranceProvider: true,
            insuranceNumber: true
          }
        },
        appointment: {
          include: {
            doctor: {
              select: {
                firstName: true,
                lastName: true,
                specialization: true
              }
            }
          }
        }
      }
    });

    res.status(201).json({
      success: true,
      message: 'Invoice created successfully',
      data: billing
    });
  } catch (error) {
    console.error('Create billing error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating invoice',
      error: error.message
    });
  }
};

/**
 * Get all billings
 */
const getBillings = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      paymentStatus,
      patientId,
      dateFrom,
      dateTo
    } = req.query;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const where = {};
    if (paymentStatus) where.paymentStatus = paymentStatus;
    if (patientId) where.patientId = patientId;
    if (dateFrom || dateTo) {
      where.invoiceDate = {};
      if (dateFrom) where.invoiceDate.gte = new Date(dateFrom);
      if (dateTo) where.invoiceDate.lte = new Date(dateTo);
    }

    const [billings, total] = await Promise.all([
      prisma.billing.findMany({
        where,
        skip,
        take: parseInt(limit),
        orderBy: { invoiceDate: 'desc' },
        include: {
          patient: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
              phone: true
            }
          },
          appointment: {
            include: {
              doctor: {
                select: {
                  firstName: true,
                  lastName: true
                }
              }
            }
          }
        }
      }),
      prisma.billing.count({ where })
    ]);

    // Parse items JSON
    const billingsWithParsedItems = billings.map(billing => ({
      ...billing,
      items: JSON.parse(billing.items)
    }));

    res.json({
      success: true,
      data: billingsWithParsedItems,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Get billings error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching billings',
      error: error.message
    });
  }
};

/**
 * Update payment status
 */
const updatePaymentStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      paymentStatus,
      paidAmount,
      paymentMethod,
      paymentNotes
    } = req.body;

    const billing = await prisma.billing.findUnique({
      where: { id }
    });

    if (!billing) {
      return res.status(404).json({
        success: false,
        message: 'Invoice not found'
      });
    }

    const updateData = {
      paymentStatus,
      paidAmount: paidAmount || billing.paidAmount,
      paymentMethod,
      paymentNotes
    };

    if (paymentStatus === 'paid') {
      updateData.paymentDate = new Date();
    }

    const updatedBilling = await prisma.billing.update({
      where: { id },
      data: updateData,
      include: {
        patient: true,
        appointment: true
      }
    });

    res.json({
      success: true,
      message: 'Payment status updated successfully',
      data: {
        ...updatedBilling,
        items: JSON.parse(updatedBilling.items)
      }
    });
  } catch (error) {
    console.error('Update payment status error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating payment status',
      error: error.message
    });
  }
};

/**
 * Get billing statistics
 */
const getBillingStats = async (req, res) => {
  try {
    const { dateFrom, dateTo } = req.query;

    const where = {};
    if (dateFrom || dateTo) {
      where.invoiceDate = {};
      if (dateFrom) where.invoiceDate.gte = new Date(dateFrom);
      if (dateTo) where.invoiceDate.lte = new Date(dateTo);
    }

    const [totalInvoices, paidInvoices, unpaidInvoices, totalRevenue, paidRevenue] = await Promise.all([
      prisma.billing.count({ where }),
      prisma.billing.count({ where: { ...where, paymentStatus: 'paid' } }),
      prisma.billing.count({ where: { ...where, paymentStatus: 'unpaid' } }),
      prisma.billing.aggregate({
        where,
        _sum: { totalAmount: true }
      }),
      prisma.billing.aggregate({
        where: { ...where, paymentStatus: 'paid' },
        _sum: { paidAmount: true }
      })
    ]);

    res.json({
      success: true,
      data: {
        totalInvoices,
        paidInvoices,
        unpaidInvoices,
        totalRevenue: totalRevenue._sum.totalAmount || 0,
        paidRevenue: paidRevenue._sum.paidAmount || 0,
        pendingRevenue: (totalRevenue._sum.totalAmount || 0) - (paidRevenue._sum.paidAmount || 0)
      }
    });
  } catch (error) {
    console.error('Get billing stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching billing statistics',
      error: error.message
    });
  }
};

module.exports = {
  registerPatient,
  getPatients,
  getPatientById,
  updatePatient,
  createAppointment,
  getAppointments,
  updateAppointment,
  cancelAppointment,
  createBilling,
  getBillings,
  updatePaymentStatus,
  getBillingStats
};
