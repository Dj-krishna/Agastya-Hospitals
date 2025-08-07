const express = require('express');
const router = express.Router();
const departmentController = require('../controllers/departmentController');

// GET Departments (all or filtered)
router.get('/', departmentController.getDepartments);
router.get('/:id', departmentController.getDepartmentById);

// POST create Department(s)
router.post('/', departmentController.addDepartment);

// PUT update Department(s)
router.put('/bulk-update', departmentController.bulkUpdateDepartments);
router.put('/', departmentController.updateDepartment);

// DELETE Department(s)
router.delete('/bulk/:ids', departmentController.bulkDeleteDepartmentsByIds);
router.delete('/', departmentController.deleteDepartmentsByFilter);
router.delete('/:id', departmentController.deleteDepartmentById);

module.exports = router;
