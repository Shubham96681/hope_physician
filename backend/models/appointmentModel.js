
// models/appointmentModel.js
const db = require('../config/db');

const Appointment = {
  // Add a new appointment
  create: ({ name, email, phone, department, message }) => {
    const stmt = db.prepare(`
      INSERT INTO appointments (name, email, phone, department, message)
      VALUES (?, ?, ?, ?, ?)
    `);
    const info = stmt.run(name, email, phone, department, message);
    return info.lastInsertRowid; // Return the new appointment ID
  },

  // Get all appointments (for admin dashboard)
  getAll: () => {
    const stmt = db.prepare(`
      SELECT id, name, email, phone, department, message, created_at
      FROM appointments
      ORDER BY created_at DESC
    `);
    return stmt.all(); // Returns an array of appointment objects
  },

  // Get single appointment by ID (optional, useful for editing or viewing)
  getById: (id) => {
    const stmt = db.prepare(`
      SELECT id, name, email, phone, department, message, created_at
      FROM appointments
      WHERE id = ?
    `);
    return stmt.get(id); // Returns single appointment object or undefined
  }
};

module.exports = Appointment;
