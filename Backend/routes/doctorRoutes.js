const express = require('express');
const router = express.Router();
const doctorController = require('../controllers/doctorController');
const { doctorFilesMiddleware } = require('../middlewares/doctor-files');

// ---------------- GET ----------------
router.get('/', doctorController.getDoctors);

// ---------------- POST ----------------
router.post('/', doctorFilesMiddleware, doctorController.addDoctor);

// ---------------- PUT ----------------
router.put('/', doctorFilesMiddleware, doctorController.updateDoctor);

// ---------------- DELETE ----------------
router.delete('/bulk/:ids', doctorController.deleteDoctors);
router.delete('/', doctorController.deleteDoctors);

module.exports = router;
