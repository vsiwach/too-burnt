// Invite code utilities

// Excludes 0/O/1/I/L for readability.
const ALPHABET = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";

export function generateInviteCode(): string {
  const rand = (n: number) =>
    Array.from(crypto.getRandomValues(new Uint8Array(n)))
      .map((b) => ALPHABET[b % ALPHABET.length])
      .join("");
  return `${rand(4)}-${rand(4)}`;
}

export function normalizeInviteCode(raw: string): string {
  return raw.trim().toUpperCase().replace(/\s+/g, "");
}
