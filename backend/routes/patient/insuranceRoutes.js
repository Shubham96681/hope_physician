/**
 * Patient Insurance Routes
 */

const express = require('express');
const router = express.Router();
const multer = require('multer');
const { protect } = require('../../middlewares/authMiddleware');
const { requireRole } = require('../../middlewares/roleMiddleware');
const {
  getInsuranceFiles,
  uploadInsuranceFile,
  deleteInsuranceFile
} = require('../../controllers/patient/insuranceController');

// Configure multer for file uploads
const upload = multer({
  dest: 'uploads/insurance/',
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only JPEG, PNG, and PDF are allowed.'));
    }
  }
});

router.use(protect);
router.use(requireRole(['patient', 'admin']));

router.get('/', getInsuranceFiles);
router.post('/upload', upload.single('file'), uploadInsuranceFile);
router.delete('/:id', deleteInsuranceFile);

module.exports = router;

