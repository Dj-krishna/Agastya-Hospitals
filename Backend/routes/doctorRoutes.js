const express = require('express');
const router = express.Router();
const doctorController = require('../controllers/doctorController');
const { doctorFilesMiddleware } = require('../middlewares/doctor-files');

// ---------------- GET Routes ----------------
router.get('/', doctorController.getDoctors);

// ---------------- POST Routes ----------------
// Handles file uploads for profilePicture, profileImageGfs, introVideoGfs
router.post(
'/', 
  doctorFilesMiddleware,        // Multer + ImageKit middleware
  doctorController.addDoctor
);

// ---------------- PUT Routes ----------------
// Supports updates with optional file uploads
router.put(
  '/', 
  doctorFilesMiddleware,        // Multer + ImageKit middleware
  doctorController.updateDoctor
);

// ---------------- DELETE Routes ----------------
// Bulk delete via /bulk/:ids
router.delete('/bulk/:ids', doctorController.deleteDoctors);
// Delete via query params or body filter
router.delete('/', doctorController.deleteDoctors);

module.exports = router;
