const express = require("express");
const router = express.Router();
const Contact = require("../models/contact");
const nodemailer = require("nodemailer");

router.post("/", async (req, res) => {
  try {
    const { name, email, message } = req.body;

    // Save to DB
    const contact = await Contact.create({ name, email, message });

    // Send email to admin
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.ADMIN_EMAIL,
        pass: process.env.ADMIN_EMAIL_PASS
      }
    });

    await transporter.sendMail({
      from: `"Cloud Kitchen" <${process.env.ADMIN_EMAIL}>`,
      to: process.env.ADMIN_EMAIL,
      subject: "New Contact Message",
      html: `
        <h3>New Contact Message</h3>
        <p><b>Name:</b> ${name}</p>
        <p><b>Email:</b> ${email}</p>
        <p><b>Message:</b> ${message}</p>
      `
    });

    res.json({ message: "Message sent successfully" });
  } catch (err) {
    res.status(500).json({ message: "Failed to send message" });
  }
});

module.exports = router;
