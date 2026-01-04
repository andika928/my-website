const express = require('express');
const router = express.Router();
const sppController = require('../controllers/sppController');
const { verifyToken, isAdmin } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');
const multer = require('multer');

router.get('/', verifyToken, isAdmin, sppController.getAllPayments);
router.get('/my-payments', verifyToken, sppController.getMyPayments);
router.get('/student/:studentId', verifyToken, isAdmin, sppController.getStudentPayments);
router.post('/', verifyToken, isAdmin, sppController.createPayment);
router.put('/:id/status', verifyToken, isAdmin, sppController.updatePaymentStatus); // Old status update
router.delete('/:id', verifyToken, isAdmin, sppController.deletePayment);

// New Routes for Online Payment
router.post('/upload-proof/:id', verifyToken, (req, res, next) => {
    upload.single('proof')(req, res, function (err) {
        if (err instanceof multer.MulterError) {
            // A Multer error occurred when uploading.
            return res.status(401).json({ error: `Upload error: ${err.message}` });
        } else if (err) {
            // An unknown error occurred when uploading.
            return res.status(500).json({ error: `Upload error: ${err.message}` });
        }
        // Everything went fine.
        next();
    });
}, sppController.uploadPaymentProof);

router.patch('/verify/:id', verifyToken, isAdmin, sppController.verifyPayment);

module.exports = router;
