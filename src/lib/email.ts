import { Resend } from "resend";
import { DISHES, type DishKey } from "./menu";

type ReservationPayload = {
  name: string;
  email: string;
  phone: string;
  party: number;
  date: string;
  time: string;
  seating: string;
  dishes: Record<DishKey, number>;
  allergies: string[];
  allergyNotes: string;
  spice: string;
  occasion: string;
};

export function emailConfigured() {
  return Boolean(process.env.RESEND_API_KEY);
}

function orderLines(r: ReservationPayload) {
  return DISHES.filter((d) => r.dishes[d.key] > 0).map(
    (d) => `${r.dishes[d.key]}× ${d.name}`,
  );
}

function subtotalOf(r: ReservationPayload) {
  return DISHES.reduce((s, d) => s + r.dishes[d.key] * d.price, 0);
}

function escapeHtml(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function prettyDate(iso: string) {
  const [y, m, d] = iso.split("-").map(Number);
  const date = new Date(Date.UTC(y, m - 1, d));
  return date.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });
}

/** Email to the restaurant owner (operational notification). */
async function sendOwnerEmail(resend: Resend, from: string, r: ReservationPayload) {
  const to = process.env.RESTAURANT_EMAIL;
  if (!to) return { sent: false, reason: "no-restaurant-email" };

  const ordered = orderLines(r);
  const subtotal = subtotalOf(r);
  const text = [
    `New reservation — ${r.name}`,
    `Party of ${r.party} · ${r.date} at ${r.time} · ${r.seating}`,
    ``,
    `Contact:`,
    `  ${r.email}`,
    `  ${r.phone}`,
    ``,
    `Pre-order (≈ $${subtotal}):`,
    ordered.length ? ordered.map((l) => `  ${l}`).join("\n") : "  (none — ordering at the table)",
    ``,
    `Allergies: ${r.allergies.length ? r.allergies.join(", ") : "none"}`,
    r.allergyNotes ? `Notes: ${r.allergyNotes}` : "",
    `Spice: ${r.spice} · Occasion: ${r.occasion}`,
  ]
    .filter(Boolean)
    .join("\n");

  try {
    const result = await resend.emails.send({
      from,
      to,
      subject: `Reservation · ${r.name} · party of ${r.party} · ${r.date}`,
      text,
      replyTo: r.email,
    });
    return { sent: true, id: result.data?.id };
  } catch (e) {
    console.error("[email] owner send failed:", e);
    return { sent: false, reason: "send-error" };
  }
}

/** Confirmation email to the guest. */
async function sendGuestEmail(resend: Resend, from: string, r: ReservationPayload) {
  const ordered = orderLines(r);
  const subtotal = subtotalOf(r);
  const dateLabel = prettyDate(r.date);

  const text = [
    `Thanks for booking, ${r.name}.`,
    ``,
    `See you ${dateLabel} at ${r.time}.`,
    ``,
    `Party of ${r.party} · ${r.seating}`,
    r.allergies.length ? `Allergies on file: ${r.allergies.join(", ")}` : "",
    r.allergyNotes ? `Notes for Vikram: ${r.allergyNotes}` : "",
    ``,
    `Pre-order (≈ $${subtotal}):`,
    ordered.length ? ordered.map((l) => `  ${l}`).join("\n") : "  (none — pick at the table)",
    ``,
    `Finding us:`,
    `  The Shed`,
    `  122 Concord St`,
    `  Carlisle, MA 01741`,
    `  Park in front of the stone wall at the top of the driveway.`,
    `  Walk past the flower beds — look for the shed with the gazebo just beyond.`,
    ``,
    `A few things:`,
    `  · Please arrive within 15 min of your slot — we only run one seating.`,
    `  · Need to cancel or change? Just reply to this email.`,
    `  · Vikram will reach out if anything on the allergy list needs a substitute.`,
    ``,
    `— Sophia & Vikram`,
    `Too Burnt · Sunday brunch, in a shed.`,
  ]
    .filter(Boolean)
    .join("\n");

  const html = `<!doctype html>
<html>
<body style="margin:0;padding:0;background:#f4efe3;font-family:-apple-system,BlinkMacSystemFont,sans-serif;color:#1f1d18;">
  <div style="max-width:560px;margin:0 auto;padding:40px 32px;">
    <div style="font-family:'Courier New',monospace;font-size:11px;letter-spacing:0.25em;color:#e8763a;">◦ YOU&#39;RE IN</div>
    <h1 style="font-family:Georgia,serif;font-weight:300;font-size:44px;line-height:1.1;letter-spacing:-0.02em;margin:12px 0 24px;">
      See you <em style="color:#2d4a2b">Sunday</em>.
    </h1>
    <p style="font-size:17px;line-height:1.6;margin:0 0 24px;">
      Thanks for booking, <strong>${escapeHtml(r.name)}</strong>. We&#39;ll be ready for you
      ${escapeHtml(dateLabel)} at ${escapeHtml(r.time)}.
    </p>

    <table style="width:100%;border-collapse:collapse;background:#fff;border:1px solid rgba(31,29,24,0.14);border-radius:4px;margin:24px 0;">
      <tr><td style="padding:16px 20px;">
        <div style="font-family:'Courier New',monospace;font-size:10px;letter-spacing:0.2em;color:#e8763a;margin-bottom:8px;">◦ YOUR RESERVATION</div>
        <div style="font-family:Georgia,serif;font-size:20px;margin-bottom:6px;">${escapeHtml(r.name)} · party of ${r.party}</div>
        <div style="font-size:14px;color:#3d3a30;">${escapeHtml(r.seating)}</div>
      </td></tr>
      ${
        ordered.length
          ? `<tr><td style="padding:0 20px 16px;">
              <div style="font-family:'Courier New',monospace;font-size:10px;letter-spacing:0.2em;color:#e8763a;margin-bottom:6px;">◦ PRE-ORDER (≈ $${subtotal})</div>
              <div style="font-size:14px;color:#3d3a30;line-height:1.6;">${ordered.map(escapeHtml).join(" · ")}</div>
            </td></tr>`
          : ""
      }
      ${
        r.allergies.length
          ? `<tr><td style="padding:0 20px 16px;">
              <div style="font-family:'Courier New',monospace;font-size:10px;letter-spacing:0.2em;color:#e8763a;margin-bottom:6px;">◦ ALLERGIES ON FILE</div>
              <div style="font-size:14px;color:#3d3a30;">${escapeHtml(r.allergies.join(", "))}</div>
            </td></tr>`
          : ""
      }
    </table>

    <h2 style="font-family:Georgia,serif;font-weight:300;font-size:26px;letter-spacing:-0.02em;margin:32px 0 8px;">Finding us</h2>
    <p style="font-size:15px;line-height:1.6;color:#3d3a30;margin:0 0 8px;">
      The Shed · 122 Concord St · Carlisle, MA 01741
    </p>
    <p style="font-size:15px;line-height:1.6;color:#3d3a30;margin:0 0 24px;">
      Park in front of the stone wall at the top of the driveway. Walk past the flower beds —
      look for the shed with the gazebo just beyond.
    </p>

    <p style="font-size:14px;line-height:1.6;color:#3d3a30;margin:0 0 8px;">
      <strong>Arrival:</strong> please arrive within 15 min of your slot — we only run one seating.<br/>
      <strong>Cancel or change:</strong> just reply to this email.<br/>
      <strong>Allergies:</strong> Vikram will reach out if anything needs a substitute.
    </p>

    <div style="font-family:'Caveat','Courier New',cursive;font-size:22px;color:#e8763a;margin-top:32px;">
      — Sophia &amp; Vikram
    </div>
    <div style="font-family:'Courier New',monospace;font-size:10px;letter-spacing:0.15em;color:#3d3a30;opacity:0.6;margin-top:6px;">
      TOO BURNT · SUNDAY BRUNCH, IN A SHED
    </div>
  </div>
</body>
</html>`;

  try {
    const result = await resend.emails.send({
      from,
      to: r.email,
      subject: `You&#39;re booked · ${dateLabel} at ${r.time}`,
      text,
      html,
      replyTo: process.env.RESTAURANT_EMAIL ?? undefined,
    });
    return { sent: true, id: result.data?.id };
  } catch (e) {
    console.error("[email] guest send failed:", e);
    return { sent: false, reason: "send-error" };
  }
}

export async function sendReservationEmail(r: ReservationPayload) {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM ?? "Too Burnt <onboarding@resend.dev>";

  if (!apiKey) {
    console.log(
      "[email] RESEND_API_KEY not set — skipping email. (Telegram still fires if configured.)",
    );
    return { guest: false, owner: false, reason: "no-api-key" };
  }

  const resend = new Resend(apiKey);
  const [guest, owner] = await Promise.all([
    sendGuestEmail(resend, from, r),
    sendOwnerEmail(resend, from, r),
  ]);
  return {
    guest: guest.sent,
    owner: owner.sent,
  };
}
