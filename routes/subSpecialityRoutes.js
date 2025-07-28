const express = require('express');
const router = express.Router();
const subSpecialityController = require('../controllers/subSpecialityController');

// GET
router.get('/', subSpecialityController.getSubSpecialities);
router.get('/:id', subSpecialityController.getSubSpecialityById);

// POST
router.post('/', subSpecialityController.addSubSpeciality);

// PUT
router.put('/bulk-update', subSpecialityController.bulkUpdateSubSpecialities);
router.put('/', subSpecialityController.updateSubSpeciality);

// DELETE
router.delete('/:id', subSpecialityController.deleteSubSpecialityById);
router.delete('/', subSpecialityController.deleteSubSpecialitiesByFilter);
router.delete('/bulk/:ids', subSpecialityController.bulkDeleteSubSpecialitiesByIds);

module.exports = router;
