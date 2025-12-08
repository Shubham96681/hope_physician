/**
 * Patient Payment Controller
 * Handle payment gateway integration
 */

const { prisma } = require('../../src/lib/prisma.js');
const { createPaymentIntent, verifyPayment } = require('../../services/paymentService');

/**
 * Create payment intent
 */
const createPayment = async (req, res) => {
  try {
    const { billingId, amount, paymentMethod = 'razorpay' } = req.body;
    const patientId = req.user.patientId || req.user.id;

    const billing = await prisma.billing.findUnique({
      where: { id: billingId }
    });

    if (!billing) {
      return res.status(404).json({
        success: false,
        message: 'Bill not found'
      });
    }

    if (billing.patientId !== patientId) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized'
      });
    }

    if (billing.paymentStatus === 'paid') {
      return res.status(400).json({
        success: false,
        message: 'Bill is already paid'
      });
    }

    const paymentAmount = amount || (billing.totalAmount - billing.paidAmount);

    // Create payment intent with gateway
    const paymentIntent = await createPaymentIntent({
      amount: paymentAmount,
      currency: 'USD',
      billingId,
      patientId,
      paymentMethod
    });

    // Create payment transaction record
    const transaction = await prisma.paymentTransaction.create({
      data: {
        patientId,
        billingId,
        amount: paymentAmount,
        currency: 'USD',
        paymentMethod,
        gatewayOrderId: paymentIntent.orderId,
        status: 'pending'
      }
    });

    res.json({
      success: true,
      data: {
        transactionId: transaction.id,
        orderId: paymentIntent.orderId,
        amount: paymentAmount,
        key: paymentIntent.key, // Public key for frontend
        ...paymentIntent
      }
    });
  } catch (error) {
    console.error('Create payment error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating payment',
      error: error.message
    });
  }
};

/**
 * Verify payment
 */
const verifyPaymentTransaction = async (req, res) => {
  try {
    const { transactionId, paymentId, signature } = req.body;

    const transaction = await prisma.paymentTransaction.findUnique({
      where: { id: transactionId },
      include: {
        billing: true
      }
    });

    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: 'Transaction not found'
      });
    }

    // Verify payment with gateway
    const verification = await verifyPayment({
      paymentId,
      orderId: transaction.gatewayOrderId,
      signature,
      amount: transaction.amount
    });

    if (!verification.success) {
      await prisma.paymentTransaction.update({
        where: { id: transactionId },
        data: {
          status: 'failed',
          failureReason: verification.message
        }
      });

      return res.status(400).json({
        success: false,
        message: verification.message || 'Payment verification failed'
      });
    }

    // Update transaction
    const updatedTransaction = await prisma.paymentTransaction.update({
      where: { id: transactionId },
      data: {
        status: 'completed',
        gatewayPaymentId: paymentId,
        gatewaySignature: signature,
        completedAt: new Date()
      }
    });

    // Update billing
    const newPaidAmount = transaction.billing.paidAmount + transaction.amount;
    const paymentStatus = newPaidAmount >= transaction.billing.totalAmount ? 'paid' : 'partial';

    await prisma.billing.update({
      where: { id: transaction.billingId },
      data: {
        paidAmount: newPaidAmount,
        paymentStatus,
        paymentMethod: transaction.paymentMethod,
        paymentDate: new Date()
      }
    });

    res.json({
      success: true,
      message: 'Payment verified successfully',
      data: updatedTransaction
    });
  } catch (error) {
    console.error('Verify payment error:', error);
    res.status(500).json({
      success: false,
      message: 'Error verifying payment',
      error: error.message
    });
  }
};

module.exports = {
  createPayment,
  verifyPaymentTransaction
};

