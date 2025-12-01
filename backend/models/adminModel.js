
// models/adminModel.js
const db = require('../config/db');

const Admin = {
  // Create a new admin (for initial setup)
  create: ({ username, password_hash }) => {
    const stmt = db.prepare(`
      INSERT INTO admins (username, password_hash)
      VALUES (?, ?)
    `);
    const info = stmt.run(username, password_hash);
    return info.lastInsertRowid;
  },

  // Find admin by username
  findByUsername: (username) => {
    const stmt = db.prepare(`
      SELECT id, username, password_hash
      FROM admins
      WHERE username = ?
    `);
    return stmt.get(username); // Returns single admin object or undefined
  },

  // Get all admins (optional)
  getAll: () => {
    const stmt = db.prepare(`
      SELECT id, username, created_at
      FROM admins
      ORDER BY created_at DESC
    `);
    return stmt.all();
  }
};

module.exports = Admin;
