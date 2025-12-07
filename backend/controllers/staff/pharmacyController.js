/**
 * Pharmacy Controller
 * Handles medicine stock, expiry management, and prescription orders
 */

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

/**
 * Get all medicines with stock
 */
const getMedicines = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      search = '',
      status,
      category,
      lowStock = false
    } = req.query;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const where = {};
    if (search) {
      where.OR = [
        { medicineName: { contains: search, mode: 'insensitive' } },
        { genericName: { contains: search, mode: 'insensitive' } },
        { brandName: { contains: search, mode: 'insensitive' } }
      ];
    }
    if (status) where.status = status;
    if (category) where.category = category;
    if (lowStock) {
      where.quantity = { lte: prisma.raw('reorderLevel') };
    }

    const [medicines, total] = await Promise.all([
      prisma.pharmacy.findMany({
        where,
        skip,
        take: parseInt(limit),
        orderBy: { medicineName: 'asc' }
      }),
      prisma.pharmacy.count({ where })
    ]);

    res.json({
      success: true,
      data: medicines,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Get medicines error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching medicines',
      error: error.message
    });
  }
};

/**
 * Add or update medicine stock
 */
const updateMedicineStock = async (req, res) => {
  try {
    const {
      id,
      medicineName,
      genericName,
      brandName,
      quantity,
      unit = 'unit',
      reorderLevel = 10,
      maxStock,
      unitPrice,
      sellingPrice,
      category,
      manufacturer,
      batchNumber,
      expiryDate,
      shelfLocation
    } = req.body;

    // Check if medicine exists
    let medicine;
    if (id) {
      medicine = await prisma.pharmacy.findUnique({ where: { id } });
    }

    // Update status based on quantity
    let status = 'available';
    if (quantity <= 0) {
      status = 'out_of_stock';
    } else if (quantity <= reorderLevel) {
      status = 'low_stock';
    }

    // Check expiry
    if (expiryDate && new Date(expiryDate) < new Date()) {
      status = 'expired';
    }

    if (medicine) {
      // Update existing
      medicine = await prisma.pharmacy.update({
        where: { id },
        data: {
          medicineName,
          genericName,
          brandName,
          quantity,
          unit,
          reorderLevel,
          maxStock,
          unitPrice,
          sellingPrice,
          category,
          manufacturer,
          batchNumber,
          expiryDate: expiryDate ? new Date(expiryDate) : null,
          shelfLocation,
          status
        }
      });
    } else {
      // Create new
      medicine = await prisma.pharmacy.create({
        data: {
          medicineName,
          genericName,
          brandName,
          quantity,
          unit,
          reorderLevel,
          maxStock,
          unitPrice,
          sellingPrice,
          category,
          manufacturer,
          batchNumber,
          expiryDate: expiryDate ? new Date(expiryDate) : null,
          shelfLocation,
          status
        }
      });
    }

    res.json({
      success: true,
      message: 'Medicine stock updated successfully',
      data: medicine
    });
  } catch (error) {
    console.error('Update medicine stock error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating medicine stock',
      error: error.message
    });
  }
};

/**
 * Get expiring medicines
 */
const getExpiringMedicines = async (req, res) => {
  try {
    const { days = 30 } = req.query;
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + parseInt(days));

    const medicines = await prisma.pharmacy.findMany({
      where: {
        expiryDate: {
          lte: expiryDate,
          gte: new Date()
        },
        status: { not: 'expired' }
      },
      orderBy: { expiryDate: 'asc' }
    });

    res.json({
      success: true,
      data: medicines
    });
  } catch (error) {
    console.error('Get expiring medicines error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching expiring medicines',
      error: error.message
    });
  }
};

/**
 * Get prescription orders
 */
const getPrescriptionOrders = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      status,
      priority
    } = req.query;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const where = {};
    if (status) where.status = status;
    if (priority) where.priority = priority;

    const [orders, total] = await Promise.all([
      prisma.prescriptionOrder.findMany({
        where,
        skip,
        take: parseInt(limit),
        orderBy: [
          { priority: 'desc' },
          { createdAt: 'asc' }
        ],
        include: {
          prescription: {
            include: {
              patient: {
                select: {
                  id: true,
                  firstName: true,
                  lastName: true,
                  phone: true
                }
              },
              doctor: {
                select: {
                  firstName: true,
                  lastName: true
                }
              }
            }
          },
          pharmacy: {
            select: {
              id: true,
              medicineName: true,
              quantity: true,
              unit: true,
              sellingPrice: true
            }
          }
        }
      }),
      prisma.prescriptionOrder.count({ where })
    ]);

    res.json({
      success: true,
      data: orders,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Get prescription orders error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching prescription orders',
      error: error.message
    });
  }
};

/**
 * Update prescription order status
 */
const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, notes } = req.body;

    const updateData = { status };
    if (notes) updateData.notes = notes;

    if (status === 'processing') {
      updateData.processedBy = req.user.id;
      updateData.processedAt = new Date();
    } else if (status === 'ready') {
      updateData.readyAt = new Date();
    } else if (status === 'delivered') {
      updateData.deliveredAt = new Date();
    }

    const order = await prisma.prescriptionOrder.update({
      where: { id },
      data: updateData,
      include: {
        prescription: {
          include: {
            patient: true,
            doctor: true
          }
        },
        pharmacy: true
      }
    });

    res.json({
      success: true,
      message: 'Order status updated successfully',
      data: order
    });
  } catch (error) {
    console.error('Update order status error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating order status',
      error: error.message
    });
  }
};

/**
 * Create prescription order from prescription
 */
const createPrescriptionOrder = async (req, res) => {
  try {
    const { prescriptionId, pharmacyId, quantity, priority = 'normal', notes } = req.body;

    // Check stock availability
    const pharmacy = await prisma.pharmacy.findUnique({
      where: { id: pharmacyId }
    });

    if (!pharmacy) {
      return res.status(404).json({
        success: false,
        message: 'Medicine not found'
      });
    }

    if (pharmacy.quantity < quantity) {
      return res.status(400).json({
        success: false,
        message: `Insufficient stock. Available: ${pharmacy.quantity} ${pharmacy.unit}`
      });
    }

    const order = await prisma.prescriptionOrder.create({
      data: {
        prescriptionId,
        pharmacyId,
        quantity,
        priority,
        notes,
        status: 'pending'
      },
      include: {
        prescription: {
          include: {
            patient: true,
            doctor: true
          }
        },
        pharmacy: true
      }
    });

    res.status(201).json({
      success: true,
      message: 'Prescription order created successfully',
      data: order
    });
  } catch (error) {
    console.error('Create prescription order error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating prescription order',
      error: error.message
    });
  }
};

/**
 * Get pharmacy statistics
 */
const getPharmacyStats = async (req, res) => {
  try {
    const [totalMedicines, lowStock, outOfStock, expiringSoon, totalOrders, pendingOrders] = await Promise.all([
      prisma.pharmacy.count({ where: { isActive: true } }),
      prisma.pharmacy.count({
        where: {
          isActive: true,
          status: 'low_stock'
        }
      }),
      prisma.pharmacy.count({
        where: {
          isActive: true,
          status: 'out_of_stock'
        }
      }),
      prisma.pharmacy.count({
        where: {
          expiryDate: {
            lte: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
            gte: new Date()
          },
          status: { not: 'expired' }
        }
      }),
      prisma.prescriptionOrder.count(),
      prisma.prescriptionOrder.count({ where: { status: 'pending' } })
    ]);

    res.json({
      success: true,
      data: {
        totalMedicines,
        lowStock,
        outOfStock,
        expiringSoon,
        totalOrders,
        pendingOrders
      }
    });
  } catch (error) {
    console.error('Get pharmacy stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching pharmacy statistics',
      error: error.message
    });
  }
};

module.exports = {
  getMedicines,
  updateMedicineStock,
  getExpiringMedicines,
  getPrescriptionOrders,
  updateOrderStatus,
  createPrescriptionOrder,
  getPharmacyStats
};

