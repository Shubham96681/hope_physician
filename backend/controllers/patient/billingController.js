/**
 * Patient Billing Controller
 * View bills and payment history
 */

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

/**
 * Get patient's bills
 */
const getBills = async (req, res) => {
  try {
    const { page = 1, limit = 10, paymentStatus } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const patientId = req.user.patientId || req.user.id;

    const where = { patientId };
    if (paymentStatus) where.paymentStatus = paymentStatus;

    const [bills, total] = await Promise.all([
      prisma.billing.findMany({
        where,
        skip,
        take: parseInt(limit),
        orderBy: { invoiceDate: 'desc' },
        include: {
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
      }),
      prisma.billing.count({ where })
    ]);

    // Parse items JSON
    const billsWithParsedItems = bills.map(bill => ({
      ...bill,
      items: JSON.parse(bill.items)
    }));

    res.json({
      success: true,
      data: billsWithParsedItems,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Get bills error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching bills',
      error: error.message
    });
  }
};

/**
 * Get bill by ID
 */
const getBillById = async (req, res) => {
  try {
    const { id } = req.params;
    const patientId = req.user.patientId || req.user.id;

    const bill = await prisma.billing.findUnique({
      where: { id },
      include: {
        appointment: {
          include: {
            doctor: true
          }
        },
        paymentTransactions: {
          orderBy: { createdAt: 'desc' }
        }
      }
    });

    if (!bill) {
      return res.status(404).json({
        success: false,
        message: 'Bill not found'
      });
    }

    if (bill.patientId !== patientId) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized to view this bill'
      });
    }

    res.json({
      success: true,
      data: {
        ...bill,
        items: JSON.parse(bill.items)
      }
    });
  } catch (error) {
    console.error('Get bill error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching bill',
      error: error.message
    });
  }
};

/**
 * Get payment history
 */
const getPaymentHistory = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const patientId = req.user.patientId || req.user.id;

    const [payments, total] = await Promise.all([
      prisma.paymentTransaction.findMany({
        where: { patientId },
        skip,
        take: parseInt(limit),
        orderBy: { createdAt: 'desc' },
        include: {
          billing: {
            select: {
              id: true,
              invoiceNumber: true,
              totalAmount: true
            }
          }
        }
      }),
      prisma.paymentTransaction.count({ where: { patientId } })
    ]);

    res.json({
      success: true,
      data: payments,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Get payment history error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching payment history',
      error: error.message
    });
  }
};

module.exports = {
  getBills,
  getBillById,
  getPaymentHistory
};

