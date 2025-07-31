const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// POST routes
router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/forgot-password', authController.forgotPassword);

module.exports = router;
