const express = require('express');
const router = express.Router();
const patientController = require('../controllers/patientController');

// GET
router.get('/', patientController.getPatients);

// POST
router.post('/', patientController.addPatient);
router.post('/verify', patientController.verifyPatient);

// PUT
router.put('/', patientController.updatePatient);

// DELETE
router.delete('/bulk/:ids', patientController.deletePatients);
router.delete('/', patientController.deletePatients);

module.exports = router;
