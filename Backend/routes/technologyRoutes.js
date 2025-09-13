const express = require('express');
const router = express.Router();
const technologyController = require('../controllers/technologyController');
const { technologyFilesMiddleware } = require('../middlewares/technology-files');

// ---------------- GET ----------------
router.get('/', technologyController.getTechnologies);

// ---------------- POST ----------------
router.post('/', technologyFilesMiddleware, technologyController.addTechnology);

// ---------------- PUT ----------------
router.put('/', technologyFilesMiddleware, technologyController.updateTechnology);

// ---------------- DELETE ----------------
router.delete('/bulk/:ids', technologyController.deleteTechnologies);
router.delete('/', technologyController.deleteTechnologies);

module.exports = router;
