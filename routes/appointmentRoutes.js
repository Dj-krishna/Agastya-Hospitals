const express = require("express");
const router = express.Router();
const appointmentController = require("../controllers/appointmentController");

// ------------------ CRUD ------------------
router.get("/", appointmentController.getAppointments);          // Get all appointments
router.get("/:id", appointmentController.getAppointmentById);    // Get by ID

router.post("/", appointmentController.addAppointment);          // Create appointment
router.put("/:id", appointmentController.updateAppointment);     // Update appointment
router.delete("/:id", appointmentController.deleteAppointmentById); // Delete by ID

// ------------------ Bulk ------------------
router.post("/deleteMany", appointmentController.deleteAppointmentsByFilter);

// ------------------ Special Actions ------------------
router.put("/:id/cancel", appointmentController.cancelAppointment);   // Cancel appointment
router.put("/:id/complete", appointmentController.completeAppointment); // Complete appointment

module.exports = router;
