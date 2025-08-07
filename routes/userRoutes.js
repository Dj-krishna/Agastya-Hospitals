const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// GET
router.get('/', userController.getUsers);
router.get('/:id', userController.getUserById);

// PUT
router.put('/bulk-update', userController.bulkUpdateUsers);
router.put('/', userController.updateUser);

// DELETE
router.delete('/bulk/:ids', userController.bulkDeleteUsersByIds);
router.delete('/', userController.deleteUsersByFilter);
router.delete('/:id', userController.deleteUserById);

module.exports = router;
