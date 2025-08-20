const express = require('express');
const router = express.Router();
const healthPackageController = require('../controllers/healthPackageController');

// ------------------ GET ------------------
router.get('/', healthPackageController.getHealthPackages);

// ------------------ POST ------------------
router.post('/', healthPackageController.addHealthPackage);

// ------------------ PUT ------------------
router.put('/', healthPackageController.updateHealthPackage);

// ------------------ DELETE ------------------
router.delete('/bulk/:ids', healthPackageController.deleteHealthPackages); // Bulk delete by IDs
router.delete('/', healthPackageController.deleteHealthPackages);          // Delete by query/body filter

module.exports = router;
