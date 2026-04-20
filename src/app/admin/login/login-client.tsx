"use client";

import { useState } from "react";
import { Leaf } from "@/components/icons";

export default function LoginClient({ next }: { next: string }) {
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setErr(null);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (!res.ok) {
        setErr(res.status === 401 ? "Wrong password." : "Something went wrong.");
        return;
      }
      // Successful login — go to the intended destination
      const target = next.startsWith("/admin") ? next : "/admin";
      window.location.href = target;
    } catch {
      setErr("Network error.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 420,
          padding: "40px 32px",
          background: "var(--cream)",
          border: "1px solid var(--rule)",
          borderRadius: 6,
          boxShadow: "0 40px 80px rgba(0,0,0,0.08)",
        }}
      >
        <Leaf
          size={36}
          color="var(--moss)"
          style={{ margin: "0 auto 16px", display: "block" }}
        />
        <div
          className="mono"
          style={{
            fontSize: 10,
            letterSpacing: "0.25em",
            color: "var(--sun)",
            textAlign: "center",
          }}
        >
          ◦ ADMIN
        </div>
        <h1
          className="serif"
          style={{
            fontSize: 36,
            fontWeight: 300,
            letterSpacing: "-0.02em",
            margin: "8px 0 24px",
            textAlign: "center",
          }}
        >
          Sign in to{" "}
          <span style={{ fontStyle: "italic", color: "var(--moss)" }}>Too Burnt</span>.
        </h1>

        <form onSubmit={submit}>
          <label
            className="mono"
            style={{
              display: "block",
              fontSize: 10,
              letterSpacing: "0.15em",
              color: "var(--ink-soft)",
              marginBottom: 8,
              textTransform: "uppercase",
            }}
          >
            Password
          </label>
          <input
            autoFocus
            type="password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setErr(null);
            }}
            autoComplete="current-password"
            style={{
              width: "100%",
              padding: "14px 16px",
              fontSize: 15,
              background: "var(--cream-2)",
              border: "1px solid var(--rule)",
              borderRadius: 4,
              outline: "none",
              color: "var(--ink)",
            }}
          />
          {err && (
            <div
              style={{
                marginTop: 12,
                padding: "10px 14px",
                background: "rgba(232,118,58,0.12)",
                border: "1px solid var(--sun)",
                borderRadius: 4,
                fontSize: 13,
                color: "var(--ink)",
              }}
            >
              {err}
            </div>
          )}
          <button
            type="submit"
            disabled={busy || password.length === 0}
            style={{
              marginTop: 20,
              width: "100%",
              padding: "14px 28px",
              fontSize: 14,
              fontWeight: 500,
              background: "var(--moss)",
              color: "var(--cream)",
              borderRadius: 999,
              opacity: busy || password.length === 0 ? 0.5 : 1,
              cursor: busy || password.length === 0 ? "not-allowed" : "pointer",
            }}
          >
            {busy ? "Signing in…" : "Sign in →"}
          </button>
        </form>
      </div>
    </main>
  );
}
