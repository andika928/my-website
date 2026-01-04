const express = require('express');
const router = express.Router();
const ppdbController = require('../controllers/ppdbController');
const { verifyToken, isAdmin } = require('../middleware/authMiddleware');

const upload = require('../middleware/uploadMiddleware');

// Public Routes
router.post('/', upload.fields([
    { name: 'ijazah', maxCount: 1 },
    { name: 'kk', maxCount: 1 },
    { name: 'akta', maxCount: 1 },
    { name: 'photo', maxCount: 1 }
]), ppdbController.createSubmission);
router.get('/:id', ppdbController.getSubmissionDetail); // Allow checking by ID publicly (for status check)

// Admin Routes (Protected)
router.get('/', verifyToken, isAdmin, ppdbController.getAllSubmissions);
router.patch('/:id/status', verifyToken, isAdmin, ppdbController.updateSubmissionStatus);
router.delete('/:id', verifyToken, isAdmin, ppdbController.deleteSubmission);

module.exports = router;
