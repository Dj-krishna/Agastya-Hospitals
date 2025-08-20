const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// ------------------ GET ------------------
router.get('/', userController.getUsers);

// ------------------ POST ------------------
router.post('/', userController.addUser);

// ------------------ PUT ------------------
router.put('/', userController.updateUser);

// ------------------ DELETE ------------------
router.delete('/bulk/:ids', userController.deleteUsers); // Bulk delete by IDs
router.delete('/', userController.deleteUsers);          // Delete by query or body filter

module.exports = router;
