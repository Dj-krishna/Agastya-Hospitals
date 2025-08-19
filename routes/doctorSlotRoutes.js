const express = require('express');
const router = express.Router();
const doctorSlotController = require('../controllers/doctorSlotController');

// Special API - Get available slots for booking (patients view)
router.get('/available', doctorSlotController.getAvailableSlots);

// CRUD APIs
// Place specific route '/date' BEFORE parameterized '/:id' to avoid shadowing
router.get('/', doctorSlotController.getSlots);

router.post('/', doctorSlotController.addSlots);
router.put('/', doctorSlotController.updateSlot);

router.delete('/', doctorSlotController.deleteSlotsByFilter);
router.delete('/date', doctorSlotController.deleteScheduleDate);
router.delete('/:id', doctorSlotController.deleteSlotById);

module.exports = router;
