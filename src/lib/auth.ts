// Edge-compatible HMAC session helpers.
// Cookie value: `<expiresMs>.<base64urlHmacSha256(expiresMs, SESSION_SECRET)>`

export const SESSION_COOKIE = "tb_admin";
const DEFAULT_MAX_AGE_DAYS = 30;

const encoder = new TextEncoder();

function b64urlEncode(bytes: ArrayBuffer | Uint8Array): string {
  const arr = bytes instanceof Uint8Array ? bytes : new Uint8Array(bytes);
  let bin = "";
  for (let i = 0; i < arr.length; i++) bin += String.fromCharCode(arr[i]);
  return btoa(bin).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function b64urlDecode(s: string): Uint8Array {
  const b64 = s.replace(/-/g, "+").replace(/_/g, "/");
  const pad = b64.length % 4 === 0 ? 0 : 4 - (b64.length % 4);
  const raw = atob(b64 + "=".repeat(pad));
  const out = new Uint8Array(raw.length);
  for (let i = 0; i < raw.length; i++) out[i] = raw.charCodeAt(i);
  return out;
}

async function getKey() {
  const secret = process.env.SESSION_SECRET;
  if (!secret) throw new Error("SESSION_SECRET not set");
  return crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"],
  );
}

export async function createSession(maxAgeDays = DEFAULT_MAX_AGE_DAYS): Promise<string> {
  const expires = Date.now() + maxAgeDays * 86_400_000;
  const payload = String(expires);
  const key = await getKey();
  const sig = await crypto.subtle.sign("HMAC", key, encoder.encode(payload));
  return `${payload}.${b64urlEncode(sig)}`;
}

export async function verifySession(token: string | undefined | null): Promise<boolean> {
  if (!token) return false;
  const dot = token.indexOf(".");
  if (dot <= 0) return false;
  const payload = token.slice(0, dot);
  const sigB64 = token.slice(dot + 1);
  const expires = Number(payload);
  if (!Number.isFinite(expires) || expires < Date.now()) return false;
  const key = await getKey();
  try {
    const sigBytes = b64urlDecode(sigB64);
    // Copy into a fresh ArrayBuffer to satisfy BufferSource (ArrayBuffer, not SharedArrayBuffer)
    const sig = new Uint8Array(sigBytes).buffer;
    return await crypto.subtle.verify("HMAC", key, sig, encoder.encode(payload));
  } catch {
    return false;
  }
}

export async function checkPassword(password: string): Promise<boolean> {
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected) return false;
  if (password.length !== expected.length) return false;
  // Constant-time comparison
  let diff = 0;
  for (let i = 0; i < expected.length; i++) {
    diff |= expected.charCodeAt(i) ^ password.charCodeAt(i);
  }
  return diff === 0;
}

export function sessionCookieOptions(maxAgeDays = DEFAULT_MAX_AGE_DAYS) {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge: maxAgeDays * 86_400,
  };
}
