const express = require('express');
const router = express.Router();
const patientController = require('../controllers/patientController');
const multer = require('multer');
const Busboy = require('busboy');
const Patient = require('../models/Patients');
const { getBuckets } = require('../db/gridfs');

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

// New: GridFS upload for patient profile image (streamed)
router.post('/:patientID/upload/profile-image', async (req, res) => {
  try {
    const { images } = getBuckets();
    if (!images) return res.status(503).json({ message: 'Storage not ready' });
    const patient = await Patient.findOne({ patientID: Number(req.params.patientID) });
    if (!patient) return res.status(404).json({ message: 'Patient not found' });

    const busboy = Busboy({ headers: req.headers, limits: { files: 1 } });
    let responded = false;
    busboy.on('file', (fieldname, file, info) => {
      const filename = info.filename || `upload_${Date.now()}`;
      const contentType = info.mimeType || 'application/octet-stream';
      const uploadStream = images.openUploadStream(filename, { contentType });
      file.pipe(uploadStream)
        .on('error', (err) => {
          if (!responded) {
            responded = true;
            res.status(400).json({ message: err.message });
          }
        })
        .on('finish', async () => {
          if (responded) return;
          patient.profileImageGfs = {
            fileId: uploadStream.id,
            filename: uploadStream.filename,
            contentType,
            length: uploadStream.length,
            uploadDate: uploadStream.uploadDate,
            bucket: 'images'
          };
          await patient.save();
          responded = true;
          res.status(201).json({ message: 'Profile image uploaded', file: patient.profileImageGfs });
        });
    });
    busboy.on('finish', () => {
      if (!responded) res.status(400).json({ message: 'No file uploaded' });
    });
    req.pipe(busboy);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// PUT
router.put('/', patientController.updatePatient);

// DELETE
router.delete('/bulk/:ids', patientController.deletePatients);
router.delete('/', patientController.deletePatients);

module.exports = router;
