// utils/smsService.js
const axios = require("axios");

const VISPL_URL = process.env.VISPL_URL || "https://pgapi.vispl.in/fe/api/v1/multiSend";

async function send({ to, text, senderId, contentId, peId, username, password, unicode=false }) {
  if (!to || !text) throw new Error("to and text required");

  // fallback to env
  const params = {
    username: username || process.env.VISPL_USERNAME,
    password: password || process.env.VISPL_PASSWORD,
    unicode,
    from: senderId || process.env.VISPL_SENDER_ID,
    to,
    dltContentId: contentId || process.env.VISPL_DLT_CONTENT_ID,
    dltPrincipalEntityId: peId || process.env.VISPL_DLT_PE_ID,
    text
  };

  const response = await axios.get(VISPL_URL, { params, timeout: 10000 });
  // return provider response object (can be adapted)
  return response.data;
}

module.exports = { send };
