const express = require('express');
const router = express.Router();
const healthPackageController = require('../controllers/healthPackageController');

// GET
router.get('/', healthPackageController.getHealthPackages);
router.get('/:id', healthPackageController.getHealthPackageById);

// POST
router.post('/', healthPackageController.addHealthPackage);

// PUT
router.put('/bulk-update', healthPackageController.bulkUpdateHealthPackages);
router.put('/', healthPackageController.updateHealthPackage);

// DELETE
router.delete('/:id', healthPackageController.deleteHealthPackageById);
router.delete('/', healthPackageController.deleteHealthPackagesByFilter);
router.delete('/bulk/:ids', healthPackageController.bulkDeleteHealthPackagesByIds);

module.exports = router;
