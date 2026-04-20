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

function esc(s: string) {
  // Telegram MarkdownV2 escape
  return s.replace(/([_*[\]()~`>#+\-=|{}.!\\])/g, "\\$1");
}

export async function sendTelegramNotification(r: ReservationPayload) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) {
    console.log("[telegram] TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID not set — skipping");
    return { sent: false, reason: "env-not-configured" };
  }

  const orderedLines = DISHES.filter((d) => r.dishes[d.key] > 0).map(
    (d) => `  • ${r.dishes[d.key]}× ${d.name}`,
  );
  const subtotal = DISHES.reduce((s, d) => s + r.dishes[d.key] * d.price, 0);

  const lines = [
    `🍳 *New reservation · ${esc(r.name)}*`,
    ``,
    `Party of *${r.party}* · ${esc(r.date)} at ${esc(r.time)}`,
    `${esc(r.seating)}`,
    ``,
    `📞 ${esc(r.phone)}`,
    `✉️ ${esc(r.email)}`,
    ``,
    `*Pre\\-order* \\(≈ $${subtotal}\\):`,
    orderedLines.length
      ? orderedLines.map((l) => esc(l)).join("\n")
      : esc("  (none — will decide at the table)"),
    ``,
  ];

  if (r.allergies.length > 0) {
    lines.push(`⚠️ *Allergies:* ${esc(r.allergies.join(", "))}`);
  }
  if (r.allergyNotes) {
    lines.push(`📝 ${esc(r.allergyNotes)}`);
  }
  lines.push(
    `Spice: ${esc(r.spice)} · Occasion: ${esc(r.occasion)}`,
  );

  const text = lines.join("\n");

  try {
    const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text,
        parse_mode: "MarkdownV2",
        disable_web_page_preview: true,
      }),
    });
    if (!res.ok) {
      const body = await res.text();
      console.error("[telegram] send failed:", res.status, body);
      return { sent: false, reason: "api-error" };
    }
    return { sent: true };
  } catch (e) {
    console.error("[telegram] send error:", e);
    return { sent: false, reason: "network-error" };
  }
}
