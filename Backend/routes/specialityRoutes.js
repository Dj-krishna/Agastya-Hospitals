const express = require('express');
const router = express.Router();
const specialityController = require('../controllers/specialityController');

// GET
router.get('/', specialityController.getSpecialities);
router.get('/:id', specialityController.getSpecialityById);

// POST
router.post('/', specialityController.addSpeciality);

// PUT
router.put('/bulk-update', specialityController.bulkUpdateSpecialities);
router.put('/', specialityController.updateSpeciality);

// DELETE
router.delete('/:id', specialityController.deleteSpecialityById);
router.delete('/', specialityController.deleteSpecialitiesByFilter);
router.delete('/bulk/:ids', specialityController.bulkDeleteSpecialitiesByIds);

module.exports = router;
