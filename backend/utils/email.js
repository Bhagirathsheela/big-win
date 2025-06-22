// src/utils/email.js
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  tls: {
    rejectUnauthorized: false,
  },
});

/**
 * Send a generic email using the transporter
 * @param {Object} options - mail options like to, subject, html
 */
async function sendEmail(options) {
  try {
    await transporter.sendMail({
      from: `"Big Win Lottery 🎰" <${process.env.EMAIL_USER}>`,
      ...options,
    });
    console.log("✅ Email sent to:", options.to);
  } catch (err) {
    console.error("❌ Failed to send email:", err);
    throw err;
  }
}

module.exports = { sendEmail };
