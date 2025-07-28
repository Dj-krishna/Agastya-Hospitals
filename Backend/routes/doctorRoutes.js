const express = require('express');
const router = express.Router();
const doctorController = require('../controllers/doctorController');
const multer = require('multer');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/doctor-profiles/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  }
});
const upload = multer({ storage });

// GET routes — general first
router.get('/', doctorController.getDoctors);
router.get('/:id', doctorController.getDoctorById);

// POST routes
router.post('/', doctorController.addDoctor);
router.post('/upload-profile-image', upload.single('profileImage'), doctorController.uploadDoctorImage);

// PUT routes
router.put('/bulk-update', doctorController.bulkUpdateDoctors);
router.put('/', doctorController.updateDoctor);

// DELETE routes
router.delete('/bulk/:ids', doctorController.bulkDeleteDoctorsByIds);
router.delete('/', doctorController.deleteDoctorsByFilter);
router.delete('/:id', doctorController.deleteDoctorById);

module.exports = router;
