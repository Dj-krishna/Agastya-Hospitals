const express = require('express');
const router = express.Router();
const healthPackageController = require('../controllers/healthPackageController');
const { healthPackageFilesMiddleware } = require('../middlewares/health-package-files');

// ------------------ GET ------------------
router.get('/', healthPackageController.getHealthPackages);

// ------------------ POST ------------------
router.post('/', healthPackageFilesMiddleware, healthPackageController.addHealthPackage);

// ------------------ PUT ------------------
router.put('/', healthPackageFilesMiddleware, healthPackageController.updateHealthPackage);

// ------------------ DELETE ------------------
router.delete('/bulk/:ids', healthPackageController.deleteHealthPackages); // Bulk delete by IDs
router.delete('/', healthPackageController.deleteHealthPackages);          // Delete by query/body filter

module.exports = router;
