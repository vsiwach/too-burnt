"use client";

import { useState } from "react";

export function AdminBar({ current }: { current: "dashboard" | "invites" }) {
  const [busy, setBusy] = useState(false);
  const logout = async () => {
    setBusy(true);
    try {
      await fetch("/api/admin/logout", { method: "POST" });
    } finally {
      window.location.href = "/admin/login";
    }
  };
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "16px 32px",
        borderBottom: "1px solid var(--rule)",
        background: "var(--cream)",
        gap: 24,
      }}
    >
      <div style={{ display: "flex", gap: 24, alignItems: "baseline" }}>
        <a
          href="/"
          className="serif"
          style={{
            fontSize: 18,
            fontWeight: 500,
            letterSpacing: "-0.02em",
            textDecoration: "none",
            color: "var(--ink)",
          }}
        >
          Too Burnt
        </a>
        <a
          href="/admin"
          style={{
            fontSize: 13,
            textDecoration: "none",
            color: current === "dashboard" ? "var(--sun)" : "var(--ink-soft)",
            fontWeight: current === "dashboard" ? 600 : 400,
          }}
        >
          Saturday prep
        </a>
        <a
          href="/admin/invites"
          style={{
            fontSize: 13,
            textDecoration: "none",
            color: current === "invites" ? "var(--sun)" : "var(--ink-soft)",
            fontWeight: current === "invites" ? 600 : 400,
          }}
        >
          Invites
        </a>
      </div>
      <button
        onClick={logout}
        disabled={busy}
        style={{
          padding: "6px 14px",
          fontSize: 12,
          border: "1px solid var(--rule)",
          borderRadius: 999,
          background: "transparent",
          color: "var(--ink-soft)",
          cursor: busy ? "not-allowed" : "pointer",
          opacity: busy ? 0.6 : 1,
        }}
      >
        {busy ? "…" : "Log out"}
      </button>
    </div>
  );
}
