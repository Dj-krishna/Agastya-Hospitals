const express = require('express');
const router = express.Router();
const specialityController = require('../controllers/specialityController');

// GET only Id and Name, all
router.get('/specialityList', specialityController.getSpecialityList);
router.get('/', specialityController.getSpecialities);

// POST add single/bulk
router.post('/', specialityController.addSpeciality);

// PUT update single or many (by query)
router.put('/', specialityController.updateSpeciality);

// DELETE using unified handler
router.delete('/bulk/:ids', specialityController.deleteSpecialities); // Bulk delete by IDs
router.delete('/', specialityController.deleteSpecialities);          // Delete by query or body filter

module.exports = router;
