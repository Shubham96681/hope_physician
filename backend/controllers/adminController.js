
// controllers/adminController.js
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Admin = require('../models/adminModel');
require('dotenv').config();

const adminController = {
  // Admin login
  login: (req, res) => {
    try {
      const { username, password } = req.body;

      if (!username || !password) {
        return res.status(400).json({ error: 'Username and password are required.' });
      }

      // Find admin by username
      const admin = Admin.findByUsername(username);
      if (!admin) {
        return res.status(401).json({ error: 'Invalid credentials.' });
      }

      // Compare password
      const isMatch = bcrypt.compareSync(password, admin.password_hash);
      if (!isMatch) {
        return res.status(401).json({ error: 'Invalid credentials.' });
      }

      // Generate JWT token
      const token = jwt.sign(
        { id: admin.id, username: admin.username },
        process.env.JWT_SECRET,
        { expiresIn: '8h' } // Token valid for 8 hours
      );

      return res.json({ message: 'Login successful', token });
    } catch (error) {
      console.error('Admin login error:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  },

  // Optional: get all admins (for admin management)
  getAllAdmins: (req, res) => {
    try {
      const admins = Admin.getAll();
      return res.json({ admins });
    } catch (error) {
      console.error('Error fetching admins:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }
};

module.exports = adminController;
