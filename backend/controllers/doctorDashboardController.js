// controllers/doctorDashboardController.js
// Combined controller for doctor dashboard features
const { prisma } = require('../src/lib/prisma.js');

const doctorDashboardController = {
  // Get doctor dashboard analytics
  getDashboardAnalytics: async (req, res) => {
    try {
      const { doctorId } = req.params;
      const { startDate, endDate } = req.query;

      const start = startDate ? new Date(startDate) : new Date();
      start.setHours(0, 0, 0, 0);
      const end = endDate ? new Date(endDate) : new Date();
      end.setHours(23, 59, 59, 999);

      // Today's appointments
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);

      const todayAppointments = await prisma.appointment.count({
        where: {
          doctorId,
          date: { gte: today, lt: tomorrow },
          status: { not: 'cancelled' },
        },
      });

      // Completed appointments in date range
      const completedAppointments = await prisma.appointment.count({
        where: {
          doctorId,
          date: { gte: start, lte: end },
          status: 'completed',
        },
      });

      // Total patients (unique)
      const uniquePatients = await prisma.appointment.groupBy({
        by: ['patientId'],
        where: { doctorId },
      });

      // Revenue/Consultation summary (if you have pricing)
      const appointments = await prisma.appointment.findMany({
        where: {
          doctorId,
          date: { gte: start, lte: end },
          status: 'completed',
        },
        select: {
          id: true,
          date: true,
          type: true,
        },
      });

      // Daily patient count (for graph)
      const dailyCounts = await prisma.appointment.groupBy({
        by: ['date'],
        where: {
          doctorId,
          date: { gte: start, lte: end },
          status: 'completed',
        },
        _count: {
          id: true,
        },
        orderBy: {
          date: 'asc',
        },
      });

      // Pending prescriptions
      const pendingPrescriptions = await prisma.prescription.count({
        where: {
          doctorId,
          status: 'active',
        },
      });

      // Upcoming follow-ups
      const upcomingFollowUps = await prisma.followUp.count({
        where: {
          doctorId,
          status: 'scheduled',
          scheduledDate: { gte: new Date() },
        },
      });

      return res.json({
        data: {
          todayAppointments,
          completedAppointments,
          totalPatients: uniquePatients.length,
          pendingPrescriptions,
          upcomingFollowUps,
          dailyPatientCount: dailyCounts.map(d => ({
            date: d.date,
            count: d._count.id,
          })),
          consultationSummary: {
            total: appointments.length,
            byType: appointments.reduce((acc, apt) => {
              acc[apt.type || 'Consultation'] = (acc[apt.type || 'Consultation'] || 0) + 1;
              return acc;
            }, {}),
          },
        },
      });
    } catch (error) {
      console.error('Error fetching dashboard analytics:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  },

  // Get patient queue status (real-time)
  getPatientQueue: async (req, res) => {
    try {
      const { doctorId } = req.params;

      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);

      // Get today's appointments
      const appointments = await prisma.appointment.findMany({
        where: {
          doctorId,
          date: { gte: today, lt: tomorrow },
          status: { in: ['scheduled', 'confirmed', 'in_progress'] },
        },
        include: {
          patient: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              phone: true,
            },
          },
          patientQueue: true,
        },
        orderBy: [
          { date: 'asc' },
          { time: 'asc' },
        ],
      });

      // Build queue with positions
      const queue = appointments.map((apt, index) => ({
        appointmentId: apt.id,
        patient: apt.patient,
        time: apt.time,
        status: apt.status,
        queueNumber: apt.patientQueue?.queueNumber || index + 1,
        currentPosition: apt.patientQueue?.currentPosition || index + 1,
        estimatedWaitTime: apt.patientQueue?.estimatedWaitTime || null,
        checkedInAt: apt.patientQueue?.checkedInAt || apt.createdAt,
      }));

      return res.json({ data: queue });
    } catch (error) {
      console.error('Error fetching patient queue:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  },

  // Update patient queue status
  updateQueueStatus: async (req, res) => {
    try {
      const { appointmentId } = req.params;
      const { status, queueNumber, estimatedWaitTime } = req.body;

      // Get or create patient queue entry
      let patientQueue = await prisma.patientQueue.findUnique({
        where: { appointmentId },
      });

      if (!patientQueue) {
        // Get appointment details
        const appointment = await prisma.appointment.findUnique({
          where: { id: appointmentId },
          include: { patient: true, doctor: true },
        });

        if (!appointment) {
          return res.status(404).json({ error: 'Appointment not found' });
        }

        // Count existing queue entries for today
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        const queueCount = await prisma.patientQueue.count({
          where: {
            doctorId: appointment.doctorId,
            createdAt: { gte: today, lt: tomorrow },
          },
        });

        patientQueue = await prisma.patientQueue.create({
          data: {
            appointmentId,
            patientId: appointment.patientId,
            doctorId: appointment.doctorId,
            queueNumber: queueNumber || queueCount + 1,
            currentPosition: queueNumber || queueCount + 1,
            estimatedWaitTime: estimatedWaitTime || null,
            status: status || 'waiting',
          },
        });
      } else {
        // Update existing queue entry
        const updateData = {};
        if (status) updateData.status = status;
        if (queueNumber !== undefined) {
          updateData.queueNumber = queueNumber;
          updateData.currentPosition = queueNumber;
        }
        if (estimatedWaitTime !== undefined) updateData.estimatedWaitTime = estimatedWaitTime;
        if (status === 'in_progress') updateData.calledAt = new Date();
        if (status === 'completed') updateData.seenAt = new Date();

        patientQueue = await prisma.patientQueue.update({
          where: { appointmentId },
          data: updateData,
        });
      }

      // Update appointment status if needed
      if (status && ['waiting', 'in_progress', 'completed'].includes(status)) {
        await prisma.appointment.update({
          where: { id: appointmentId },
          data: { status: status === 'waiting' ? 'confirmed' : status },
        });
      }

      return res.json({
        success: true,
        message: 'Queue status updated successfully',
        data: patientQueue,
      });
    } catch (error) {
      console.error('Error updating queue status:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  },
};

module.exports = doctorDashboardController;

