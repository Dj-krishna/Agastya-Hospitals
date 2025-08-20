const express = require('express');
const router = express.Router();
const doctorSlotController = require('../controllers/doctorSlotController');

// ------------------ Special GET ------------------
router.get('/available', doctorSlotController.getAvailableSlots); // Get available slots (patients view)

// ------------------ CRUD ------------------
router.get('/', doctorSlotController.getSlots);         // Get slots
router.post('/', doctorSlotController.addSlots);        // Add slot(s)
router.put('/', doctorSlotController.updateSlot);       // Update slots

// ------------------ DELETE ------------------
router.delete('/bulk/:ids', doctorSlotController.deleteSlots);     // Bulk delete by IDs
router.delete('/', doctorSlotController.deleteSlots);              // Delete by query/body filter
router.delete('/schedule/date', doctorSlotController.deleteScheduleDate); // Special: remove specific date from schedule

module.exports = router;
