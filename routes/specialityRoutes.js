const express = require('express');
const router = express.Router();
const specialityController = require('../controllers/specialityController');
const multer = require('multer');
const Busboy = require('busboy');
const Speciality = require('../models/Specialities');
const { getBuckets } = require('../db/gridfs');

// Set up multer for icon/banner uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/speciality/');
  },
  filename: function (req, file, cb) {
    const uniq = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniq + '-' + file.originalname);
  }
});
const upload = multer({ storage });

// GET only Id and Name, all
router.get('/specialityList', specialityController.getSpecialityList);
router.get('/', specialityController.getSpecialities);

// POST add single/bulk
router.post('/', specialityController.addSpeciality);

// POST upload icon or banner
// type must be: icon OR banner (in req.body)
router.post('/upload-image', upload.single('specialityImage'), specialityController.uploadSpecialityImage);

// New: GridFS upload for icon/banner via type query (?type=icon|banner)
router.post('/:specialityID/upload', async (req, res) => {
  try {
    const type = (req.query.type || '').toLowerCase();
    if (!['icon', 'banner'].includes(type)) return res.status(400).json({ message: 'type must be icon or banner' });
    const { images } = getBuckets();
    if (!images) return res.status(503).json({ message: 'Storage not ready' });
    const speciality = await Speciality.findOne({ specialityID: Number(req.params.specialityID) });
    if (!speciality) return res.status(404).json({ message: 'Speciality not found' });

    const busboy = Busboy({ headers: req.headers, limits: { files: 1 } });
    let responded = false;
    busboy.on('file', (fieldname, file, info) => {
      const filename = info.filename || `upload_${Date.now()}`;
      const contentType = info.mimeType || 'application/octet-stream';
      const uploadStream = images.openUploadStream(filename, { contentType });
      file.pipe(uploadStream)
        .on('error', (err) => {
          if (!responded) { responded = true; res.status(400).json({ message: err.message }); }
        })
        .on('finish', async () => {
          if (responded) return;
          const ref = {
            fileId: uploadStream.id,
            filename: uploadStream.filename,
            contentType,
            length: uploadStream.length,
            uploadDate: uploadStream.uploadDate,
            bucket: 'images'
          };
          if (type === 'icon') speciality.iconGfs = ref; else speciality.bannerGfs = ref;
          await speciality.save();
          responded = true;
          res.status(201).json({ message: `${type} uploaded`, file: ref });
        });
    });
    busboy.on('finish', () => { if (!responded) res.status(400).json({ message: 'No file uploaded' }); });
    req.pipe(busboy);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// PUT update single or many (by query)
router.put('/', specialityController.updateSpeciality);

// DELETE using unified handler
router.delete('/bulk/:ids', specialityController.deleteSpecialities); // Bulk delete by IDs
router.delete('/', specialityController.deleteSpecialities);          // Delete by query or body filter

module.exports = router;
