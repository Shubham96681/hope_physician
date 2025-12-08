/**
 * Patient Feedback Controller
 * Submit and manage feedback
 */

const { prisma } = require('../../src/lib/prisma.js');

/**
 * Get patient's feedback
 */
const getFeedback = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const patientId = req.user.patientId || req.user.id;

    const [feedbacks, total] = await Promise.all([
      prisma.feedback.findMany({
        where: { patientId },
        skip,
        take: parseInt(limit),
        orderBy: { createdAt: 'desc' },
        include: {
          doctor: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              specialization: true
            }
          },
          appointment: {
            select: {
              id: true,
              date: true
            }
          }
        }
      }),
      prisma.feedback.count({ where: { patientId } })
    ]);

    res.json({
      success: true,
      data: feedbacks,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Get feedback error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching feedback',
      error: error.message
    });
  }
};

/**
 * Submit feedback
 */
const submitFeedback = async (req, res) => {
  try {
    const {
      appointmentId,
      doctorId,
      feedbackType,
      rating,
      comment,
      cleanliness,
      staffBehavior,
      waitTime,
      overallExperience
    } = req.body;
    const patientId = req.user.patientId || req.user.id;

    const feedback = await prisma.feedback.create({
      data: {
        patientId,
        appointmentId: appointmentId || null,
        doctorId: doctorId || null,
        feedbackType,
        rating,
        comment,
        cleanliness,
        staffBehavior,
        waitTime,
        overallExperience,
        status: 'submitted'
      },
      include: {
        doctor: true,
        appointment: true
      }
    });

    res.status(201).json({
      success: true,
      message: 'Feedback submitted successfully',
      data: feedback
    });
  } catch (error) {
    console.error('Submit feedback error:', error);
    res.status(500).json({
      success: false,
      message: 'Error submitting feedback',
      error: error.message
    });
  }
};

/**
 * Update feedback
 */
const updateFeedback = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    const patientId = req.user.patientId || req.user.id;

    const feedback = await prisma.feedback.findUnique({
      where: { id }
    });

    if (!feedback) {
      return res.status(404).json({
        success: false,
        message: 'Feedback not found'
      });
    }

    if (feedback.patientId !== patientId) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized'
      });
    }

    const updated = await prisma.feedback.update({
      where: { id },
      data: updateData
    });

    res.json({
      success: true,
      message: 'Feedback updated successfully',
      data: updated
    });
  } catch (error) {
    console.error('Update feedback error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating feedback',
      error: error.message
    });
  }
};

module.exports = {
  getFeedback,
  submitFeedback,
  updateFeedback
};

