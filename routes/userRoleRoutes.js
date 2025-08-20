const express = require('express');
const router = express.Router();
const userRoleController = require('../controllers/userRoleController');

// ------------------ GET ------------------
router.get('/', userRoleController.getUserRoles);

// ------------------ POST ------------------
router.post('/', userRoleController.addUserRole);

// ------------------ PUT ------------------
router.put('/', userRoleController.updateUserRole);

// ------------------ DELETE ------------------
router.delete('/bulk/:ids', userRoleController.deleteUserRoles); // Bulk delete by IDs
router.delete('/', userRoleController.deleteUserRoles);          // Delete by query or body filter

module.exports = router;
