import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { generateInviteCode } from "@/lib/invite";

function requireAdmin(req: Request) {
  const required = process.env.ADMIN_TOKEN;
  if (!required) return true; // if no token set, allow (dev convenience)
  const url = new URL(req.url);
  const fromQuery = url.searchParams.get("token");
  const fromHeader = req.headers.get("x-admin-token");
  return fromQuery === required || fromHeader === required;
}

export async function GET(req: Request) {
  if (!requireAdmin(req)) {
    return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }
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
  if (!requireAdmin(req)) {
    return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }

  const body = await req.json().catch(() => ({}));
  const parsed = createSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: "invalid", issues: parsed.error.flatten() },
      { status: 400 },
    );
  }

  let code = parsed.data.code ?? generateInviteCode();
  // If user-supplied code collides with an existing one, append a suffix.
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
  if (!requireAdmin(req)) {
    return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }
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
