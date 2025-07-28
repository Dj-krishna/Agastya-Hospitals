const express = require('express');
const router = express.Router();
const userRoleController = require('../controllers/userRoleController');

// GET
router.get('/', userRoleController.getUserRoles);
router.get('/:id', userRoleController.getUserRoleById);

// POST
router.post('/', userRoleController.addUserRole);

// PUT
router.put('/bulk-update', userRoleController.bulkUpdateUserRoles);
router.put('/', userRoleController.updateUserRole);

// DELETE
router.delete('/:id', userRoleController.deleteUserRoleById);
router.delete('/', userRoleController.deleteUserRolesByFilter);
router.delete('/bulk/:ids', userRoleController.bulkDeleteUserRolesByIds);

module.exports = router;
