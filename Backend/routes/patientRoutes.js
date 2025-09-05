const express = require('express');
const router = express.Router();
const patientController = require('../controllers/patientController');
const { patientFilesMiddleware } = require('../middlewares/patient-files'); // import the middleware

// ---------------- GET Routes ----------------
router.get('/', patientController.getPatients);

// ---------------- POST Routes ----------------
// Handles file uploads for profilePicture, profileImageGfs
router.post(
  '/', 
  patientFilesMiddleware,      // Multer + ImageKit middleware
  patientController.addPatient
);

// Verify patient (no file uploads needed)
router.post('/verify', patientController.verifyPatient);

// ---------------- PUT Routes ----------------
// Supports updates with optional file uploads
router.put(
  '/', 
  patientFilesMiddleware,      // Multer + ImageKit middleware
  patientController.updatePatient
);

// ---------------- DELETE Routes ----------------
// Bulk delete via /bulk/:ids
router.delete('/bulk/:ids', patientController.deletePatients);
// Delete via query params or body filter
router.delete('/', patientController.deletePatients);

module.exports = router;
