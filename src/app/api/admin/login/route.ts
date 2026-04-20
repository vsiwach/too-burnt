import { NextResponse } from "next/server";
import { z } from "zod";
import {
  SESSION_COOKIE,
  checkPassword,
  createSession,
  sessionCookieOptions,
} from "@/lib/auth";

const schema = z.object({
  password: z.string().min(1).max(200),
});

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: "invalid" }, { status: 400 });
  }

  // Tiny constant-time guard against timing-based probing
  await new Promise((r) => setTimeout(r, 200 + Math.random() * 200));

  const ok = await checkPassword(parsed.data.password);
  if (!ok) {
    return NextResponse.json({ ok: false, error: "wrong-password" }, { status: 401 });
  }

  const token = await createSession();
  const res = NextResponse.json({ ok: true });
  res.cookies.set(SESSION_COOKIE, token, sessionCookieOptions());
  return res;
}
