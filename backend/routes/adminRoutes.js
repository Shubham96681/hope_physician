
// routes/adminRoutes.js
const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');

// Admin login
router.post('/login', adminController.login);

// Optional: get all admins (protected route)
const authMiddleware = require('../middlewares/authMiddleware');
router.get('/', authMiddleware.verifyToken, adminController.getAllAdmins);

module.exports = router;
