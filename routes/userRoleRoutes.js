const express = require('express');
const router = express.Router();
const userRoleController = require('../controllers/userRoleController');

// GET user roles (all or filtered)
router.get('/', userRoleController.getUserRoles);
router.get('/:id', userRoleController.getUserRoleById);

// POST create user role(s)
router.post('/', userRoleController.addUserRole);

// PUT update user role(s)
router.put('/bulk-update', userRoleController.bulkUpdateUserRoles);
router.put('/', userRoleController.updateUserRole);

// DELETE user role(s)
router.delete('/:id', userRoleController.deleteUserRoleById);
router.delete('/', userRoleController.deleteUserRolesByFilter);
router.delete('/bulk/:ids', userRoleController.bulkDeleteUserRolesByIds);

module.exports = router;
