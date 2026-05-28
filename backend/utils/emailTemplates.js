// Branded email templates for Big Win.
// All templates return { subject, html }.

const BRAND = {
  name: "Big Win",
  tagline: "Pick your lucky number",
  gradient: "linear-gradient(135deg, #9333EA 0%, #EC4899 60%, #F97316 100%)",
  purple: "#9333EA",
  pink: "#EC4899",
  orange: "#F97316",
  yellow: "#FBBF24",
  mint: "#10B981",
  ink: "#1F2937",
  cream: "#FFF7ED",
};

const PLAY_URL = process.env.FRONTEND_URL || "https://your-bigwin-site.com";

const formatINR = (n) => `Rs. ${Number(n || 0).toLocaleString("en-IN")}`;

// Reusable shell: header, body slot, footer.
function shell({ preheader, headline, bodyHtml }) {
  return `<!DOCTYPE html>
<html lang="en"><head><meta charset="utf-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1"/>
<title>${headline}</title></head>
<body style="margin:0;padding:0;background:${BRAND.cream};font-family:Segoe UI,Roboto,Helvetica,Arial,sans-serif;color:${BRAND.ink};">
<div style="display:none;max-height:0;overflow:hidden;opacity:0;">${preheader || ""}</div>
<table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background:${BRAND.cream};padding:24px 12px;">
  <tr><td align="center">
    <table role="presentation" width="600" cellspacing="0" cellpadding="0" border="0" style="max-width:600px;width:100%;background:#fff;border-radius:20px;overflow:hidden;border:1px solid #f1e9fb;box-shadow:0 12px 40px -16px rgba(31,41,55,0.18);">
      <!-- Header -->
      <tr><td style="background:${BRAND.gradient};padding:28px 28px 24px;color:#fff;">
        <table role="presentation" width="100%"><tr>
          <td style="vertical-align:middle;">
            <div style="display:inline-block;width:44px;height:44px;border-radius:14px;background:rgba(255,255,255,0.18);text-align:center;line-height:44px;font-weight:800;font-size:20px;color:#fff;">B</div>
          </td>
          <td style="vertical-align:middle;padding-left:12px;">
            <div style="font-size:20px;font-weight:800;letter-spacing:0.5px;">${BRAND.name}</div>
            <div style="font-size:12px;opacity:0.85;">${BRAND.tagline}</div>
          </td>
        </tr></table>
        <h1 style="margin:18px 0 0;font-size:24px;font-weight:800;line-height:1.25;">${headline}</h1>
      </td></tr>
      <!-- Body -->
      <tr><td style="padding:24px 28px 8px;font-size:15px;line-height:1.65;color:${BRAND.ink};">
        ${bodyHtml}
      </td></tr>
      <!-- Footer -->
      <tr><td style="padding:20px 28px 26px;border-top:1px solid #f1e9fb;background:#fafaf9;color:#888;font-size:12px;line-height:1.6;">
        Sent by ${BRAND.name}. 18+ only. Please gamble responsibly.<br/>
        This is an automated message, please do not reply.
      </td></tr>
    </table>
    <div style="font-size:11px;color:#9ca3af;padding:12px 0;">&copy; ${new Date().getFullYear()} ${BRAND.name}</div>
  </td></tr>
</table>
</body></html>`;
}

function button(label, href, color = BRAND.gradient) {
  return `<a href="${href}" style="display:inline-block;background:${color};color:#fff;text-decoration:none;font-weight:700;padding:13px 24px;border-radius:999px;font-size:15px;letter-spacing:0.2px;">${label}</a>`;
}

// =================== WINNER ===================
function winnerEmail({ name, number, amount }) {
  const numStr = String(number).padStart(2, "0");
  return {
    subject: `🎉 You won ${formatINR(amount)} on Big Win!`,
    html: shell({
      preheader: `Your number ${numStr} won ${formatINR(amount)} in today's draw.`,
      headline: `Congrats ${name} — you just won!`,
      bodyHtml: `
        <p style="margin:0 0 14px;">Your lucky number <strong style="color:${BRAND.purple};">${numStr}</strong> hit the jackpot in today's Big Win draw.</p>
        <div style="margin:18px 0;padding:18px;border-radius:14px;background:linear-gradient(135deg,#FEF3C7 0%,#FCE7F3 100%);border:1px solid #f3e8ff;text-align:center;">
          <div style="font-size:12px;color:#6b7280;letter-spacing:0.5px;text-transform:uppercase;">Your winnings</div>
          <div style="font-size:34px;font-weight:800;color:${BRAND.purple};margin-top:4px;">${formatINR(amount)}</div>
          <div style="font-size:13px;color:#6b7280;margin-top:6px;">Number ${numStr} &middot; 9x payout</div>
        </div>
        <p style="margin:0 0 22px;">Your winnings will be credited per our standard withdrawal process. Thank you for playing!</p>
        <p style="margin:0 0 28px;text-align:center;">${button("Play next round", PLAY_URL)}</p>`,
    }),
  };
}

// =================== NO-WIN / TRY-AGAIN ===================
function noWinEmail({ name, number, totalSpent }) {
  return {
    subject: `So close! Today's lucky number was ${String(number).padStart(2, "0")}`,
    html: shell({
      preheader: `Today's lucky number was ${String(number).padStart(2, "0")}. Try again tomorrow!`,
      headline: `Not this time, ${name}`,
      bodyHtml: `
        <p style="margin:0 0 14px;">Today's lucky number was <strong style="color:${BRAND.pink};">${String(number).padStart(2, "0")}</strong>. Your picks didn't match this round.</p>
        ${totalSpent ? `<p style="margin:0 0 14px;">You staked <strong>${formatINR(totalSpent)}</strong> this round. Better luck next time!</p>` : ""}
        <div style="margin:18px 0;padding:18px;border-radius:14px;background:#fafafa;border:1px solid #f0f0f0;text-align:center;">
          <div style="font-size:14px;color:#374151;">Did you know? Players who join 3+ draws win twice as often.</div>
        </div>
        <p style="margin:0 0 28px;text-align:center;">${button("Pick again", PLAY_URL)}</p>`,
    }),
  };
}

// =================== ADMIN ROUND SUMMARY ===================
function roundSummaryEmail({ winnerNumber, totalPool, totalPayout, winnerCount, roundAt }) {
  return {
    subject: `[Admin] Round complete — number ${String(winnerNumber).padStart(2, "0")}`,
    html: shell({
      preheader: `Pool ${formatINR(totalPool)} · Payout ${formatINR(totalPayout)} · Winners ${winnerCount}`,
      headline: `Round complete`,
      bodyHtml: `
        <p style="margin:0 0 14px;">Round at <strong>${roundAt}</strong></p>
        <table role="presentation" width="100%" style="border-collapse:collapse;margin:8px 0 18px;">
          <tr><td style="padding:8px 0;color:#6b7280;">Winning number</td><td style="padding:8px 0;text-align:right;font-weight:700;">${String(winnerNumber).padStart(2, "0")}</td></tr>
          <tr><td style="padding:8px 0;color:#6b7280;">Total pool</td><td style="padding:8px 0;text-align:right;font-weight:700;">${formatINR(totalPool)}</td></tr>
          <tr><td style="padding:8px 0;color:#6b7280;">Total payout</td><td style="padding:8px 0;text-align:right;font-weight:700;">${formatINR(totalPayout)}</td></tr>
          <tr><td style="padding:8px 0;color:#6b7280;">House margin</td><td style="padding:8px 0;text-align:right;font-weight:700;color:${BRAND.mint};">${formatINR(totalPool - totalPayout)}</td></tr>
          <tr><td style="padding:8px 0;color:#6b7280;">Winners</td><td style="padding:8px 0;text-align:right;font-weight:700;">${winnerCount}</td></tr>
        </table>`,
    }),
  };
}

// =================== PASSWORD RESET ===================
function resetPasswordEmail({ name, resetLink }) {
  return {
    subject: `🔐 Reset your Big Win password`,
    html: shell({
      preheader: `Reset link valid for 1 hour.`,
      headline: `Reset your password`,
      bodyHtml: `
        <p style="margin:0 0 14px;">Hi ${name || "there"},</p>
        <p style="margin:0 0 14px;">We got a request to reset your Big Win password. Click the button below to set a new one:</p>
        <p style="margin:18px 0 22px;text-align:center;">${button("Reset password", resetLink)}</p>
        <p style="margin:0 0 8px;font-size:13px;color:#6b7280;">This link is valid for <strong>1 hour</strong>. If you didn't request this, you can safely ignore the email.</p>
        <p style="margin:0;font-size:12px;color:#9ca3af;word-break:break-all;">Or paste this URL into your browser:<br/>${resetLink}</p>`,
    }),
  };
}

module.exports = {
  winnerEmail,
  noWinEmail,
  roundSummaryEmail,
  resetPasswordEmail,
  formatINR,
};
