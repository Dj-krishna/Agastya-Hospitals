// utils/generateOtp.js
exports.generateOTP = (digits = 6) => {
    const min = Math.pow(10, digits - 1);
    return String(Math.floor(min + Math.random() * 9 * min));
  };
  