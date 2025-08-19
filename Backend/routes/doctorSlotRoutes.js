const express = require('express');
const router = express.Router();
const doctorSlotController = require('../controllers/doctorSlotController');

// Special API - Get available slots for booking (patients view)
router.get('/available', doctorSlotController.getAvailableSlots);

// CRUD APIs
router.get('/', doctorSlotController.getSlots);

router.post('/', doctorSlotController.addSlots);
router.put('/', doctorSlotController.updateSlot);

router.delete('/', doctorSlotController.deleteSlotsByFilter);
router.delete('/:id', doctorSlotController.deleteSlotById);
router.delete('/date', doctorSlotController.deleteScheduleDate);

module.exports = router;
