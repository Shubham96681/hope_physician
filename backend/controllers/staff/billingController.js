// Billing Controller - Invoice generation and payment tracking
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

/**
 * Generate invoice number
 */
const generateInvoiceNumber = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  return `INV-${year}-${month}${day}-${random}`;
};

/**
 * Create invoice/billing
 */
const createInvoice = async (req, res) => {
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

    // Validate required fields
    if (!patientId || !items || !subtotal) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: patientId, items, subtotal'
      });
    }

    // Validate items is array
    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Items must be a non-empty array'
      });
    }

    // Calculate total
    const totalAmount = subtotal + tax - discount;

    // Generate invoice number
    let invoiceNumber;
    let isUnique = false;
    while (!isUnique) {
      invoiceNumber = generateInvoiceNumber();
      const existing = await prisma.billing.findUnique({
        where: { invoiceNumber }
      });
      if (!existing) isUnique = true;
    }

    // Create billing
    const billing = await prisma.billing.create({
      data: {
        patientId,
        appointmentId: appointmentId || null,
        invoiceNumber,
        invoiceDate: new Date(),
        dueDate: dueDate ? new Date(dueDate) : null,
        items: JSON.stringify(items),
        subtotal: parseFloat(subtotal),
        tax: parseFloat(tax),
        discount: parseFloat(discount),
        totalAmount: parseFloat(totalAmount),
        paymentStatus: 'unpaid',
        paidAmount: 0,
        insuranceCovered,
        insuranceAmount: parseFloat(insuranceAmount || 0)
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
        appointment: {
          select: {
            id: true,
            date: true,
            time: true,
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
    console.error('Create invoice error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating invoice',
      error: error.message
    });
  }
};

/**
 * Get all invoices with filters
 */
const getInvoices = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      patientId,
      paymentStatus,
      startDate,
      endDate,
      search
    } = req.query;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const where = {};
    if (patientId) where.patientId = patientId;
    if (paymentStatus) where.paymentStatus = paymentStatus;
    if (startDate && endDate) {
      where.invoiceDate = {
        gte: new Date(startDate),
        lte: new Date(endDate)
      };
    }
    if (search) {
      where.OR = [
        { invoiceNumber: { contains: search, mode: 'insensitive' } },
        { patient: { firstName: { contains: search, mode: 'insensitive' } } },
        { patient: { lastName: { contains: search, mode: 'insensitive' } } }
      ];
    }

    const [invoices, total] = await Promise.all([
      prisma.billing.findMany({
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
          },
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
        },
        orderBy: { invoiceDate: 'desc' }
      }),
      prisma.billing.count({ where })
    ]);

    // Parse items JSON for each invoice
    const invoicesWithParsedItems = invoices.map(invoice => ({
      ...invoice,
      items: JSON.parse(invoice.items)
    }));

    res.json({
      success: true,
      data: invoicesWithParsedItems,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Get invoices error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching invoices',
      error: error.message
    });
  }
};

/**
 * Get invoice by ID
 */
const getInvoiceById = async (req, res) => {
  try {
    const { id } = req.params;

    const invoice = await prisma.billing.findUnique({
      where: { id },
      include: {
        patient: true,
        appointment: {
          include: {
            doctor: true
          }
        }
      }
    });

    if (!invoice) {
      return res.status(404).json({
        success: false,
        message: 'Invoice not found'
      });
    }

    // Parse items JSON
    invoice.items = JSON.parse(invoice.items);

    res.json({
      success: true,
      data: invoice
    });
  } catch (error) {
    console.error('Get invoice error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching invoice',
      error: error.message
    });
  }
};

/**
 * Update payment status
 */
const updatePayment = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      paidAmount,
      paymentMethod,
      paymentNotes
    } = req.body;

    // Get current invoice
    const invoice = await prisma.billing.findUnique({
      where: { id }
    });

    if (!invoice) {
      return res.status(404).json({
        success: false,
        message: 'Invoice not found'
      });
    }

    const newPaidAmount = parseFloat(paidAmount || 0);
    const totalPaid = invoice.paidAmount + newPaidAmount;
    const remaining = invoice.totalAmount - totalPaid;

    let paymentStatus = 'unpaid';
    if (remaining <= 0) {
      paymentStatus = 'paid';
    } else if (totalPaid > 0) {
      paymentStatus = 'partial';
    }

    // Update invoice
    const updatedInvoice = await prisma.billing.update({
      where: { id },
      data: {
        paidAmount: totalPaid,
        paymentStatus,
        paymentMethod: paymentMethod || invoice.paymentMethod,
        paymentDate: paymentStatus === 'paid' ? new Date() : invoice.paymentDate,
        paymentNotes: paymentNotes || invoice.paymentNotes
      },
      include: {
        patient: true
      }
    });

    // Parse items
    updatedInvoice.items = JSON.parse(updatedInvoice.items);

    res.json({
      success: true,
      message: 'Payment updated successfully',
      data: updatedInvoice
    });
  } catch (error) {
    console.error('Update payment error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating payment',
      error: error.message
    });
  }
};

/**
 * Get payment statistics
 */
const getPaymentStats = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    const where = {};
    if (startDate && endDate) {
      where.invoiceDate = {
        gte: new Date(startDate),
        lte: new Date(endDate)
      };
    }

    const invoices = await prisma.billing.findMany({
      where,
      select: {
        totalAmount: true,
        paidAmount: true,
        paymentStatus: true
      }
    });

    const stats = {
      totalInvoices: invoices.length,
      totalAmount: invoices.reduce((sum, inv) => sum + inv.totalAmount, 0),
      totalPaid: invoices.reduce((sum, inv) => sum + inv.paidAmount, 0),
      totalPending: invoices.reduce((sum, inv) => sum + (inv.totalAmount - inv.paidAmount), 0),
      byStatus: {
        paid: invoices.filter(inv => inv.paymentStatus === 'paid').length,
        partial: invoices.filter(inv => inv.paymentStatus === 'partial').length,
        unpaid: invoices.filter(inv => inv.paymentStatus === 'unpaid').length
      }
    };

    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('Get payment stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching payment statistics',
      error: error.message
    });
  }
};

module.exports = {
  createInvoice,
  getInvoices,
  getInvoiceById,
  updatePayment,
  getPaymentStats
};

