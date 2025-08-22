const express = require('express');
const router = express.Router();
const patientController = require('../controllers/patientController');
const multer = require('multer');

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

// GET
router.get('/', patientController.getPatients);

// POST
router.post('/', patientController.addPatient);
router.post('/verify', patientController.verifyPatient);
router.post('/upload-profile-image', upload.single('profileImage'), patientController.uploadPatientImage);

// PUT
router.put('/', patientController.updatePatient);

// DELETE
router.delete('/bulk/:ids', patientController.deletePatients);
router.delete('/', patientController.deletePatients);

module.exports = router;
