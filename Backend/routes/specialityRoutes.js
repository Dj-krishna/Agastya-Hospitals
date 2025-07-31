const express = require('express');
const router = express.Router();
const specialityController = require('../controllers/specialityController');
const multer = require('multer');

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

// GET all, GET by ID
router.get('/', specialityController.getSpecialities);
router.get('/:id', specialityController.getSpecialityById);

// POST add single/bulk
router.post('/', specialityController.addSpeciality);

// POST upload icon or banner
// type must be: icon OR banner (in req.body)
router.post('/upload-image', upload.single('specialityImage'), specialityController.uploadSpecialityImage);

// PUT update single or many (by query)
router.put('/', specialityController.updateSpeciality);

// PUT bulk update
router.put('/bulk-update', specialityController.bulkUpdateSpecialities);

// DELETE by ID, by filter, or in bulk
router.delete('/bulk/:ids', specialityController.bulkDeleteSpecialitiesByIds);
router.delete('/', specialityController.deleteSpecialitiesByFilter);
router.delete('/:id', specialityController.deleteSpecialityById);

module.exports = router;
