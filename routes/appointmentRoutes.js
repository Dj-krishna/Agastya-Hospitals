const express = require('express');
const router = express.Router();
const appointmentController = require('../controllers/appointmentController');

// GET routes — general first
router.get('/', appointmentController.getAppointments);           // ?doctorID=1 etc.
router.get('/:id', appointmentController.getAppointmentById);     // by appointmentID

// POST routes
router.post('/', appointmentController.addAppointments);          // single or array

// PUT routes
router.put('/', appointmentController.updateAppointment);         // ?doctorID=1

// DELETE routes
router.delete('/', appointmentController.deleteAppointmentsByFilter);     // bulk by filter in req.body
router.delete('/:id', appointmentController.deleteAppointmentById);        // by appointmentID

module.exports = router;
