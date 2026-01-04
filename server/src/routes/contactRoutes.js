const express = require('express');
const router = express.Router();
const contactController = require('../controllers/contactController');

router.post('/', contactController.createMessage);
router.get('/', contactController.getAllMessages); // Should be admin protected in real app
router.delete('/:id', contactController.deleteMessage); // Should be admin protected

module.exports = router;
