import { prisma } from "@/lib/db";
import InvitesClient from "./invites-client";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function InvitesPage({
  searchParams,
}: {
  searchParams: { token?: string };
}) {
  const required = process.env.ADMIN_TOKEN;
  if (required && searchParams.token !== required) {
    return (
      <main style={{ padding: 48, fontFamily: "var(--font-inter)" }}>
        <h1 className="serif" style={{ fontSize: 42, fontWeight: 300 }}>
          Not authorized
        </h1>
        <p style={{ fontSize: 15, color: "var(--ink-soft)" }}>
          Append <code>?token=…</code> to the URL (set <code>ADMIN_TOKEN</code> in{" "}
          <code>.env.local</code>).
        </p>
      </main>
    );
  }

  const codes = await prisma.inviteCode.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <InvitesClient
      initialCodes={codes.map((c) => ({
        ...c,
        createdAt: c.createdAt.toISOString(),
        expiresAt: c.expiresAt ? c.expiresAt.toISOString() : null,
      }))}
      token={searchParams.token ?? ""}
    />
  );
}
