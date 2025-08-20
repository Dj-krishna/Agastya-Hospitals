const express = require('express');
const router = express.Router();
const subSpecialityController = require('../controllers/subSpecialityController');

// ------------------ GET ------------------
router.get('/', subSpecialityController.getSubSpecialities);

// ------------------ POST ------------------
router.post('/', subSpecialityController.addSubSpeciality);

// ------------------ PUT ------------------
router.put('/', subSpecialityController.updateSubSpeciality);

// ------------------ DELETE ------------------
router.delete('/bulk/:ids', subSpecialityController.deleteSubSpecialities); // Bulk delete by IDs
router.delete('/', subSpecialityController.deleteSubSpecialities);         // Delete by query or body filter

module.exports = router;
