const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: false, // SSL
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASS,
  },
  logger: true,
  debug: true,
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
