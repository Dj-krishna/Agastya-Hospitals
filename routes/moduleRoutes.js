const express = require('express');
const router = express.Router();
const moduleController = require('../controllers/moduleController');

// GET Modules (all or filtered)
router.get('/', moduleController.getModules);
router.get('/:id', moduleController.getModuleById);

// POST create Module(s)
router.post('/', moduleController.addModule);

// PUT update Module(s)
router.put('/bulk-update', moduleController.bulkUpdateModules);
router.put('/', moduleController.updateModule);

// DELETE user role(s)
router.delete('/bulk/:ids', moduleController.bulkDeleteModulesByIds);
router.delete('/', moduleController.deleteModulesByFilter);
router.delete('/:id', moduleController.deleteModuleById);

module.exports = router;
