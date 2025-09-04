const express = require('express');
const router = express.Router();
const doctorController = require('../controllers/doctorController');

// GET routes — general first
router.get('/', doctorController.getDoctors);

// POST routes
router.post('/', doctorController.addDoctor);

// PUT routes
router.put('/', doctorController.updateDoctor);

// DELETE routes
router.delete('/bulk/:ids', doctorController.deleteDoctors);
router.delete('/', doctorController.deleteDoctors);

module.exports = router;
