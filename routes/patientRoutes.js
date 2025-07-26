const express = require('express');
const router = express.Router();
const patientController = require('../controllers/patientController');
const multer = require('multer');

// Multer storage config for profile images
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/patient-profiles/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  }
});
const upload = multer({ storage });

// Routes
router.get('/', patientController.getPatients);
router.post('/', patientController.addPatient);
router.post('/upload-profile-image', upload.single('profileImage'), patientController.uploadPatientImage);
router.put('/bulk-update', patientController.bulkUpdatePatients);
router.put('/', patientController.updatePatient);
router.delete('/:id', patientController.deletePatientById);
router.delete('/', patientController.deletePatientsByFilter);
router.delete('/bulk/:ids', patientController.bulkDeletePatientsByIds);
router.get('/:id', patientController.getPatientById);

module.exports = router; 