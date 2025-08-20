const express = require('express');
const router = express.Router();
const moduleController = require('../controllers/moduleController');

// ------------------ GET ------------------
router.get('/', moduleController.getModules);

// ------------------ POST ------------------
router.post('/', moduleController.addModule);

// ------------------ PUT ------------------
router.put('/', moduleController.updateModule);

// ------------------ DELETE ------------------
router.delete('/bulk/:ids', moduleController.deleteModules); // Bulk delete by IDs
router.delete('/', moduleController.deleteModules);          // Delete by query/body filter

module.exports = router;
