const { sendEmail } = require('../utils/mailer');

const sendEmailController = async (req, res) => {
  const { to, subject, text, attachments } = req.body;

  if (!to || !subject || !text) {
    return res.status(400).json({ error: 'Missing required fields: to, subject, and text' });
  }

  try {
    await sendEmail(to, subject, text, attachments);
    res.status(200).json({ message: 'Email sent successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { sendEmailController };
