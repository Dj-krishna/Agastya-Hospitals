const express = require('express');
const router = express.Router();
const subSpecialityController = require('../controllers/subSpecialityController');

// GET all/filter and GET by ID
router.get('/', subSpecialityController.getSubSpecialities);
router.get('/:id', subSpecialityController.getSubSpecialityById);

// POST add single/bulk
router.post('/', subSpecialityController.addSubSpeciality);

// PUT update single/many (by query)
router.put('/', subSpecialityController.updateSubSpeciality);

// PUT bulk update
router.put('/bulk-update', subSpecialityController.bulkUpdateSubSpecialities);

// DELETE by ID, by filter, or in bulk
router.delete('/bulk/:ids', subSpecialityController.bulkDeleteSubSpecialitiesByIds);
router.delete('/', subSpecialityController.deleteSubSpecialitiesByFilter);
router.delete('/:id', subSpecialityController.deleteSubSpecialityById);

module.exports = router;
