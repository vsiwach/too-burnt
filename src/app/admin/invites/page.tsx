import { prisma } from "@/lib/db";
import InvitesClient from "./invites-client";
import { AdminBar } from "@/components/admin-bar";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function InvitesPage() {
  const codes = await prisma.inviteCode.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <>
      <AdminBar current="invites" />
      <InvitesClient
        initialCodes={codes.map((c) => ({
          ...c,
          createdAt: c.createdAt.toISOString(),
          expiresAt: c.expiresAt ? c.expiresAt.toISOString() : null,
        }))}
      />
    </>
  );
}
