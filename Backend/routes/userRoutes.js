const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// GET
router.get('/', userController.getUsers);
router.get('/:id', userController.getUserById);

// POST
router.post('/', userController.addUser);

// PUT
router.put('/bulk-update', userController.bulkUpdateUsers);
router.put('/', userController.updateUser);

// DELETE
router.delete('/:id', userController.deleteUserById);
router.delete('/', userController.deleteUsersByFilter);
router.delete('/bulk/:ids', userController.bulkDeleteUsersByIds);

module.exports = router;
