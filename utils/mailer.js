const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASS,
  },
});

const sendEmail = async (to, subject, text, attachments = []) => {
  const mailOptions = {
    from: process.env.GMAIL_USER,
    to,
    subject,
    text,
    attachments,  // nodemailer accepts an array of attachment objects
  };

  return transporter.sendMail(mailOptions);
};

module.exports = { sendEmail };
