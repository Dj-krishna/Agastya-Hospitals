// controllers/smsController.js
const smsService = require("../utils/smsService");
const { generateOTP } = require("../utils/generateOtp");
const otpStore = require("../utils/otpStore");

const DEFAULT_OTP_TTL = 300; // 5 minutes

// Generic SMS sender
exports.sendSMS = async (req, res) => {
  try {
    const { to, message, senderId, contentId, peId, username, password, unicode=false } = req.body;
    if (!to || !message) return res.status(400).json({ success: false, error: "to and message required" });

    const resp = await smsService.send({
      to,
      text: message,
      senderId,
      contentId,
      peId,
      username,
      password,
      unicode
    });

    return res.json({ success: true, provider: resp });
  } catch (err) {
    console.error("sendSMS err:", err?.message || err);
    return res.status(500).json({ success: false, error: "SMS sending failed" });
  }
};

// Send OTP: generate + store + send
exports.sendOtp = async (req, res) => {
  try {
    const { to, purpose = "general", ttlSeconds = DEFAULT_OTP_TTL, customMessage } = req.body;
    if (!to) return res.status(400).json({ success: false, error: "to required" });

    const otp = generateOTP();
    const key = `${to}:${purpose}`;
    await otpStore.set(key, otp, ttlSeconds);

    const message = customMessage || `Your OTP for ${purpose} is ${otp}. It will expire in ${Math.floor(ttlSeconds/60)} minute(s). Do not share it with anyone.`;

    const resp = await smsService.send({ to, text: message });

    // For security, do NOT return OTP in production responses.
    const debugReturn = (process.env.NODE_ENV === "development");
    return res.json({
      success: true,
      sent: true,
      provider: resp,
      ...(debugReturn ? { otp } : {})
    });
  } catch (err) {
    console.error("sendOtp err:", err?.message || err);
    return res.status(500).json({ success: false, error: "Send OTP failed" });
  }
};

// Verify OTP
exports.verifyOtp = async (req, res) => {
  try {
    const { to, purpose = "general", otp } = req.body;
    if (!to || !otp) return res.status(400).json({ success: false, error: "to and otp required" });

    const key = `${to}:${purpose}`;
    const ok = await otpStore.verify(key, String(otp));
    if (!ok) return res.status(400).json({ success: false, verified: false, error: "Invalid or expired OTP" });

    // delete after success
    await otpStore.delete(key);
    return res.json({ success: true, verified: true });
  } catch (err) {
    console.error("verifyOtp err:", err?.message || err);
    return res.status(500).json({ success: false, error: "OTP verification failed" });
  }
};
