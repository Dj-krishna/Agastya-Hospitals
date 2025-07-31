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
router.get('/:id', patientController.getPatientById);

// POST
router.post('/', patientController.addPatient);
router.post('/upload-profile-image', upload.single('profileImage'), patientController.uploadPatientImage);

// PUT
router.put('/bulk-update', patientController.bulkUpdatePatients);
router.put('/', patientController.updatePatient);

// DELETE
router.delete('/bulk/:ids', patientController.bulkDeletePatientsByIds);
router.delete('/', patientController.deletePatientsByFilter);
router.delete('/:id', patientController.deletePatientById);

module.exports = router;
