import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { normalizeInviteCode } from "@/lib/invite";

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const raw = typeof body?.code === "string" ? body.code : "";
  const code = normalizeInviteCode(raw);
  if (!code) {
    return NextResponse.json({ ok: false, error: "missing" }, { status: 400 });
  }
  const invite = await prisma.inviteCode.findUnique({ where: { code } });
  if (!invite || invite.disabled) {
    return NextResponse.json({ ok: false, error: "not-found" }, { status: 404 });
  }
  if (invite.expiresAt && invite.expiresAt < new Date()) {
    return NextResponse.json({ ok: false, error: "expired" }, { status: 410 });
  }
  if (invite.usedCount >= invite.maxUses) {
    return NextResponse.json({ ok: false, error: "exhausted" }, { status: 410 });
  }
  // Don't leak note/usage counts; just confirm it's valid.
  return NextResponse.json({ ok: true });
}
