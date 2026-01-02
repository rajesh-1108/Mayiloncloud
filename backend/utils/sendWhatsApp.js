const axios = require("axios");

module.exports = async function sendWhatsApp(phone, message) {
  try {
    const url = `https://wa.me/91${phone}?text=${encodeURIComponent(message)}`;
    console.log("WhatsApp message:", url);
    // For now: log only (production → WhatsApp Cloud API)
  } catch (err) {
    console.error("WhatsApp error:", err);
  }
};

