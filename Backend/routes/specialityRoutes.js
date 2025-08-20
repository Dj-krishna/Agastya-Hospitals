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

// GET only Id and Name, all
router.get('/specialityList', specialityController.getSpecialityList);
router.get('/', specialityController.getSpecialities);

// POST add single/bulk
router.post('/', specialityController.addSpeciality);

// POST upload icon or banner
// type must be: icon OR banner (in req.body)
router.post('/upload-image', upload.single('specialityImage'), specialityController.uploadSpecialityImage);

// PUT update single or many (by query)
router.put('/', specialityController.updateSpeciality);

// DELETE using unified handler
router.delete('/bulk/:ids', specialityController.deleteSpecialities); // Bulk delete by IDs
router.delete('/', specialityController.deleteSpecialities);          // Delete by query or body filter

module.exports = router;
