// Admin-only endpoint — gated by middleware (src/middleware.ts) via the session cookie.
import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { generateInviteCode } from "@/lib/invite";

export async function GET() {
  const codes = await prisma.inviteCode.findMany({
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json({ ok: true, codes });
}

const createSchema = z.object({
  note: z.string().max(200).default(""),
  maxUses: z.number().int().min(1).max(1000).default(1),
  expiresAt: z.string().datetime().optional(),
  code: z.string().min(3).max(40).optional(),
});

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const parsed = createSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: "invalid", issues: parsed.error.flatten() },
      { status: 400 },
    );
  }

  let code = parsed.data.code ?? generateInviteCode();
  for (let i = 0; i < 5; i++) {
    const exists = await prisma.inviteCode.findUnique({ where: { code } });
    if (!exists) break;
    code = generateInviteCode();
  }

  const created = await prisma.inviteCode.create({
    data: {
      code,
      note: parsed.data.note,
      maxUses: parsed.data.maxUses,
      expiresAt: parsed.data.expiresAt ? new Date(parsed.data.expiresAt) : null,
    },
  });
  return NextResponse.json({ ok: true, code: created });
}

const patchSchema = z.object({
  id: z.string().min(1),
  disabled: z.boolean().optional(),
});

export async function PATCH(req: Request) {
  const body = await req.json().catch(() => ({}));
  const parsed = patchSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: "invalid", issues: parsed.error.flatten() },
      { status: 400 },
    );
  }
  const { id, ...rest } = parsed.data;
  const updated = await prisma.inviteCode.update({ where: { id }, data: rest });
  return NextResponse.json({ ok: true, code: updated });
}
