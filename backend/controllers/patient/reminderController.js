/**
 * Patient Reminder Controller
 * Manage medication and appointment reminders
 */

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

/**
 * Get patient's reminders
 */
const getReminders = async (req, res) => {
  try {
    const { status, reminderType } = req.query;
    const patientId = req.user.patientId || req.user.id;

    const where = { patientId };
    if (status) where.status = status;
    if (reminderType) where.reminderType = reminderType;

    const reminders = await prisma.reminder.findMany({
      where,
      orderBy: { scheduledDate: 'asc' }
    });

    res.json({
      success: true,
      data: reminders
    });
  } catch (error) {
    console.error('Get reminders error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching reminders',
      error: error.message
    });
  }
};

/**
 * Create reminder
 */
const createReminder = async (req, res) => {
  try {
    const {
      reminderType,
      title,
      description,
      scheduledDate,
      scheduledTime,
      isRecurring,
      recurrenceRule,
      notificationMethod,
      medicationScheduleId
    } = req.body;
    const patientId = req.user.patientId || req.user.id;

    const reminder = await prisma.reminder.create({
      data: {
        patientId,
        reminderType,
        title,
        description,
        scheduledDate: new Date(scheduledDate),
        scheduledTime,
        isRecurring,
        recurrenceRule,
        notificationMethod: notificationMethod || 'app',
        medicationScheduleId,
        status: 'pending'
      }
    });

    res.status(201).json({
      success: true,
      message: 'Reminder created successfully',
      data: reminder
    });
  } catch (error) {
    console.error('Create reminder error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating reminder',
      error: error.message
    });
  }
};

/**
 * Update reminder
 */
const updateReminder = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    const patientId = req.user.patientId || req.user.id;

    const reminder = await prisma.reminder.findUnique({
      where: { id }
    });

    if (!reminder) {
      return res.status(404).json({
        success: false,
        message: 'Reminder not found'
      });
    }

    if (reminder.patientId !== patientId) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized'
      });
    }

    if (updateData.scheduledDate) {
      updateData.scheduledDate = new Date(updateData.scheduledDate);
    }

    const updated = await prisma.reminder.update({
      where: { id },
      data: updateData
    });

    res.json({
      success: true,
      message: 'Reminder updated successfully',
      data: updated
    });
  } catch (error) {
    console.error('Update reminder error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating reminder',
      error: error.message
    });
  }
};

/**
 * Delete reminder
 */
const deleteReminder = async (req, res) => {
  try {
    const { id } = req.params;
    const patientId = req.user.patientId || req.user.id;

    const reminder = await prisma.reminder.findUnique({
      where: { id }
    });

    if (!reminder) {
      return res.status(404).json({
        success: false,
        message: 'Reminder not found'
      });
    }

    if (reminder.patientId !== patientId) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized'
      });
    }

    await prisma.reminder.delete({
      where: { id }
    });

    res.json({
      success: true,
      message: 'Reminder deleted successfully'
    });
  } catch (error) {
    console.error('Delete reminder error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting reminder',
      error: error.message
    });
  }
};

module.exports = {
  getReminders,
  createReminder,
  updateReminder,
  deleteReminder
};

