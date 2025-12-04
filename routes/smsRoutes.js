// routes/smsRoutes.js
const express = require("express");
const router = express.Router();
const { sendSMS, sendOtp, verifyOtp } = require("../controllers/smsController");

// Generic SMS
router.post("/send", sendSMS);

// Generate & send OTP
router.post("/send-otp", sendOtp);

// Verify OTP
router.post("/verify-otp", verifyOtp);

module.exports = router;
