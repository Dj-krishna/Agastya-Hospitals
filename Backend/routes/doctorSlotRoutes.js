const express = require('express');
const router = express.Router();
const doctorSlotController = require('../controllers/doctorSlotController');

router.get('/', doctorSlotController.getSlots);
router.get('/:id', doctorSlotController.getSlotById);

router.post('/', doctorSlotController.addSlots);

router.put('/', doctorSlotController.updateSlot);

router.delete('/', doctorSlotController.deleteSlotsByFilter);
router.delete('/:id', doctorSlotController.deleteSlotById);
router.delete('/date', doctorSlotController.deleteScheduleDate);

module.exports = router;
