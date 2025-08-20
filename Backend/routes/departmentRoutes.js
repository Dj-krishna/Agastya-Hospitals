const express = require('express');
const router = express.Router();
const departmentController = require('../controllers/departmentController');

// ------------------ GET ------------------
router.get('/', departmentController.getDepartments);   // Get all or filtered

// ------------------ POST ------------------
router.post('/', departmentController.addDepartment);   // Create one or many departments

// ------------------ PUT ------------------
router.put('/', departmentController.updateDepartment); // Update by query filter(s)

// ------------------ DELETE ------------------
router.delete('/bulk/:ids', departmentController.deleteDepartments); // Bulk delete by IDs (comma separated)
router.delete('/', departmentController.deleteDepartments);          // Delete by query params or request body filter

module.exports = router;
