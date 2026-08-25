// Cloudflare Pages Function
// Route: POST /api/send-lead-notification
// Sends a lead notification email via the Resend API. Requires the
// RESEND_API_KEY secret to be configured in the Cloudflare Pages project.

const RESEND_ENDPOINT = "https://api.resend.com/emails";

const FROM_EMAIL = "Las Vegas Warehouse <leads@newleadrelay.com>";
const TO_EMAILS = [
  "maryjanemurphy@lasvegascrating.com",
  "tyler@lasvegascrating.com",
  "chrislong@lasvegascrating.com",
];

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

const KNOWN_LABELS = {
  name: "Name",
  email: "Email",
  phone: "Phone",
  message: "Message",
};

function jsonResponse(body, status) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
  });
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function labelFor(key) {
  if (KNOWN_LABELS[key]) return KNOWN_LABELS[key];
  return key.replace(/[_-]+/g, " ").replace(/\b\w/g, (char) => char.toUpperCase());
}

function buildEmailHtml(fields) {
  const name = (fields.name || "").trim();
  const email = (fields.email || "").trim();
  const phone = (fields.phone || "").trim();

  const contactLinks = [
    email
      ? `<a href="mailto:${escapeHtml(email)}" style="display:block;color:#ffffff;background:#1f2937;border-radius:6px;font-size:18px;font-weight:600;text-decoration:none;padding:14px 18px;margin-top:10px;">✉ ${escapeHtml(email)}</a>`
      : "",
    phone
      ? `<a href="tel:${escapeHtml(phone)}" style="display:block;color:#ffffff;background:#1f2937;border-radius:6px;font-size:18px;font-weight:600;text-decoration:none;padding:14px 18px;margin-top:10px;">☎ ${escapeHtml(phone)}</a>`
      : "",
  ]
    .filter(Boolean)
    .join("");

  const tableRows = Object.entries(fields)
    .filter(([, value]) => value)
    .map(
      ([key, value]) => `
      <tr>
        <td style="padding:10px 14px;border-bottom:1px solid #e5e7eb;font-weight:600;color:#374151;background:#f9fafb;white-space:nowrap;vertical-align:top;">${escapeHtml(
          labelFor(key)
        )}</td>
        <td style="padding:10px 14px;border-bottom:1px solid #e5e7eb;color:#111827;">${escapeHtml(value)}</td>
      </tr>`
    )
    .join("");

  return `
  <div style="font-family:Arial,Helvetica,sans-serif;max-width:600px;margin:0 auto;background:#ffffff;">
    <div style="background:#111827;padding:24px 20px;text-align:center;">
      <p style="margin:0 0 8px;font-size:12px;letter-spacing:1.5px;text-transform:uppercase;color:#9ca3af;">Contact This Lead</p>
      <p style="margin:0;font-size:24px;font-weight:700;color:#ffffff;">${escapeHtml(name || "New Website Lead")}</p>
      ${contactLinks}
    </div>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;margin-top:24px;">
      <tbody>
        ${tableRows}
      </tbody>
    </table>
  </div>`;
}

export async function onRequestOptions() {
  return new Response(null, { status: 204, headers: CORS_HEADERS });
}

export async function onRequestPost({ request, env }) {
  let fields;
  try {
    fields = await request.json();
  } catch {
    return jsonResponse({ error: "Invalid JSON body" }, 400);
  }

  const name = String(fields.name || "").trim();
  const email = String(fields.email || "").trim();

  const apiKey = env.RESEND_API_KEY;
  if (!apiKey) {
    console.error("send-lead-notification: RESEND_API_KEY is not configured");
    return jsonResponse({ error: "Email service is not configured" }, 500);
  }

  const payload = {
    from: FROM_EMAIL,
    to: TO_EMAILS,
    subject: `New Lead - ${name || "Website Form"}`,
    html: buildEmailHtml(fields),
  };
  if (email) payload.reply_to = email;

  try {
    const resendResponse = await fetch(RESEND_ENDPOINT, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const result = await resendResponse.json().catch(() => ({}));

    if (!resendResponse.ok) {
      console.error("send-lead-notification: Resend API error", resendResponse.status, result);
      return jsonResponse({ error: "Failed to send email" }, 502);
    }

    return jsonResponse({ success: true, id: result?.id }, 200);
  } catch (err) {
    console.error("send-lead-notification: error calling Resend API", err);
    return jsonResponse({ error: "Failed to send email" }, 500);
  }
}
