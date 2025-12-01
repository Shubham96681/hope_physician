// controllers/appointmentController.js
const Appointment = require('../models/appointmentModel');
const transporter = require('../config/mailer'); // Nodemailer transporter
require('dotenv').config();

const appointmentController = {
  // Handle new appointment submission
  createAppointment: async (req, res) => {
    try {
      const { name, email, phone, department, message } = req.body;

      // Basic validation
      if (!name || !email || !phone || !department) {
        console.log('Appointment submission failed: Missing required fields.');
        return res.status(400).json({ error: 'All required fields must be filled.' });
      }

      // Save to database
      const appointmentId = Appointment.create({ name, email, phone, department, message });

      // Log the appointment submission
      console.log('------------------------------------------');
      console.log(`✅ New appointment received!`);


      // Send email notification
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: process.env.EMAIL_USER, // Send to Hope Physician email
        subject: `New Appointment from ${name}`,
        html: `
          <h3>New Appointment Details</h3>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Phone:</strong> ${phone}</p>
          <p><strong>Department:</strong> ${department}</p>
          <p><strong>Message:</strong> ${message || 'N/A'}</p>
          <p><strong>Appointment ID:</strong> ${appointmentId}</p>
        `
      };

      await transporter.sendMail(mailOptions);

      console.log(`📧 Email sent successfully for appointment ID: ${appointmentId}`);

      return res.status(201).json({ message: 'Appointment submitted successfully.', appointmentId });
    } catch (error) {
      console.error('❌ Error creating appointment:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  },

  // Get all appointments (for admin dashboard)
  getAllAppointments: (req, res) => {
    try {
      const appointments = Appointment.getAll();

      console.log(`📋 Admin fetched all appointments. Total: ${appointments.length}`);

      return res.json({ appointments });
    } catch (error) {
      console.error('❌ Error fetching appointments:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }
};

module.exports = appointmentController;
