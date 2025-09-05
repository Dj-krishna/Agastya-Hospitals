const express = require('express');
const router = express.Router();
const specialityController = require('../controllers/specialityController');
const { specialityFilesMiddleware } = require('../middlewares/speciality-files');

// GET only Id and Name, all
router.get('/specialityList', specialityController.getSpecialityList);
router.get('/', specialityController.getSpecialities);

// POST add single/bulk with file uploads
router.post(
  '/',
  specialityFilesMiddleware,        // Multer + ImageKit middleware
  specialityController.addSpeciality
);

// PUT update single or many (by query) with optional file uploads
router.put(
  '/',
  specialityFilesMiddleware,        // Multer + ImageKit middleware
  specialityController.updateSpeciality
);

// DELETE using unified handler
router.delete('/bulk/:ids', specialityController.deleteSpecialities); // Bulk delete by IDs
router.delete('/', specialityController.deleteSpecialities);          // Delete by query or body filter

module.exports = router;
