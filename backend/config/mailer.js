// config/mailer.js
const nodemailer = require('nodemailer');
require('dotenv').config();

// Create transporter using your email credentials
const transporter = nodemailer.createTransport({
  service: 'gmail', // e.g., Gmail; change if using another provider
  auth: {
    user: process.env.EMAIL_USER, // Your email from .env
    pass: process.env.EMAIL_PASS  // Your app password or email password
  },
  tls: {
    rejectUnauthorized: false // <-- allow self-signed certs (for dev only)
  }
});

// Verify connection configuration
transporter.verify((error, success) => {
  if (error) {
    console.error('Nodemailer connection error:', error);
  } else {
    console.log('Nodemailer is ready to send emails.');
  }
});

module.exports = transporter;
