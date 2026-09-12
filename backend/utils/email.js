// src/utils/email.js
const nodemailer = require("nodemailer");

// Cloud hosts (Render, etc.) block SMTP ports 25/465/587, so Gmail SMTP hangs
// in production. Send through Brevo's relay on port 2525 (not blocked) — this
// keeps nodemailer/sendMail unchanged, only the transport host/port/creds
// differ. Verify EMAIL_USER as a sender in Brevo so the "from" is allowed.
const transporter = nodemailer.createTransport({
  host: "smtp-relay.brevo.com",
  port: 2525,
  secure: false, // 2525 upgrades via STARTTLS
  auth: {
    user: process.env.BREVO_SMTP_USER, // Brevo → SMTP & API → SMTP: "Login"
    pass: process.env.BREVO_SMTP_KEY, // Brevo → SMTP & API → SMTP: "Master Password"
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
