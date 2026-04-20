import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { sendReservationEmail } from "@/lib/email";
import { sendTelegramNotification } from "@/lib/telegram";
import { DISH_KEYS } from "@/lib/menu";
import { normalizeInviteCode } from "@/lib/invite";

const ALLERGIES = [
  "Gluten",
  "Dairy",
  "Eggs",
  "Nuts (tree)",
  "Peanuts",
  "Soy",
  "Sesame",
  "Shellfish",
  "Fish",
  "Mustard",
] as const;
const SPICE = ["None at all", "Mild", "Medium", "Spicy", "Bring the heat"] as const;
const OCCASIONS = [
  "Just because",
  "Birthday",
  "Anniversary",
  "First date",
  "Family visit",
  "Celebration",
  "Other",
] as const;
const SEATING = ["Indoor (the shed)", "Outdoor (garden)", "No preference"] as const;
const TIMES = [
  "9:00",
  "9:30",
  "10:00",
  "10:30",
  "11:00",
  "11:30",
  "12:00",
  "12:30",
  "13:00",
] as const;

const dishesSchema = z.object(
  DISH_KEYS.reduce(
    (acc, k) => ({ ...acc, [k]: z.number().int().min(0).max(20) }),
    {} as Record<string, z.ZodNumber>,
  ),
);

const schema = z.object({
  name: z.string().min(1).max(120),
  email: z.string().email().max(240),
  phone: z.string().min(7).max(40),
  party: z.number().int().min(1).max(8),
  date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be YYYY-MM-DD")
    .refine(
      (d) => {
        const [y, m, day] = d.split("-").map(Number);
        const parsed = new Date(Date.UTC(y, m - 1, day));
        return parsed.getUTCDay() === 0; // 0 = Sunday
      },
      { message: "We only serve Sundays" },
    ),
  time: z.enum(TIMES),
  seating: z.enum(SEATING),
  dishes: dishesSchema,
  allergies: z.array(z.enum(ALLERGIES)),
  allergyNotes: z.string().max(2000),
  spice: z.enum(SPICE),
  occasion: z.enum(OCCASIONS),
  inviteCode: z.string().min(3).max(40),
  website: z.string().max(0).optional(),
});

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);

  // Honeypot check BEFORE zod — if a bot filled the hidden field, silently 200.
  if (body && typeof body === "object" && typeof body.website === "string" && body.website.length > 0) {
    return NextResponse.json({ ok: true });
  }

  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: "invalid", issues: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const data = parsed.data;
  const code = normalizeInviteCode(data.inviteCode);

  try {
    // Atomically: verify the invite is valid AND increment usedCount in one update.
    // Prisma's updateMany with where-clause is the atomic pattern here (a conditional update).
    const now = new Date();
    const bumped = await prisma.inviteCode.updateMany({
      where: {
        code,
        disabled: false,
        OR: [{ expiresAt: null }, { expiresAt: { gt: now } }],
        usedCount: { lt: prisma.inviteCode.fields.maxUses },
      },
      data: { usedCount: { increment: 1 } },
    });
    if (bumped.count === 0) {
      return NextResponse.json(
        { ok: false, error: "invite-invalid" },
        { status: 403 },
      );
    }

    await prisma.reservation.create({
      data: {
        name: data.name,
        email: data.email,
        phone: data.phone,
        party: data.party,
        date: data.date,
        time: data.time,
        seating: data.seating,
        dishes: JSON.stringify(data.dishes),
        allergies: JSON.stringify(data.allergies),
        allergyNotes: data.allergyNotes,
        spice: data.spice,
        occasion: data.occasion,
        inviteCode: code,
      },
    });
  } catch (e) {
    console.error("[reservations] db insert failed:", e);
    return NextResponse.json({ ok: false, error: "db-error" }, { status: 500 });
  }

  // Telegram fires async (owner notification only)
  sendTelegramNotification(data).catch((e) =>
    console.error("[reservations] telegram failed:", e),
  );

  // Email synchronously so we can tell the client whether a guest confirmation went out.
  const emailResult = await sendReservationEmail(data).catch((e) => {
    console.error("[reservations] email failed:", e);
    return { guest: false, owner: false } as const;
  });

  return NextResponse.json({
    ok: true,
    guestEmailSent: Boolean(
      emailResult && "guest" in emailResult && emailResult.guest,
    ),
  });
}
