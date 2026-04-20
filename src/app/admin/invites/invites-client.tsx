"use client";

import { useState } from "react";

type Invite = {
  id: string;
  code: string;
  note: string;
  maxUses: number;
  usedCount: number;
  disabled: boolean;
  createdAt: string;
  expiresAt: string | null;
};

export default function InvitesClient({
  initialCodes,
}: {
  initialCodes: Invite[];
}) {
  const [codes, setCodes] = useState<Invite[]>(initialCodes);
  const [note, setNote] = useState("");
  const [maxUses, setMaxUses] = useState(1);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [copied, setCopied] = useState<string | null>(null);

  const create = async () => {
    setBusy(true);
    setErr(null);
    try {
      const res = await fetch(`/api/invites`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ note, maxUses }),
      });
      const json = await res.json();
      if (!json.ok) throw new Error(json.error || "create-failed");
      setCodes((c) => [
        {
          ...json.code,
          createdAt: json.code.createdAt,
          expiresAt: json.code.expiresAt ?? null,
        },
        ...c,
      ]);
      setNote("");
    } catch (e) {
      setErr(e instanceof Error ? e.message : "failed");
    } finally {
      setBusy(false);
    }
  };

  const toggleDisabled = async (code: Invite) => {
    const res = await fetch(`/api/invites`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: code.id, disabled: !code.disabled }),
    });
    const json = await res.json();
    if (json.ok) {
      setCodes((all) =>
        all.map((c) =>
          c.id === code.id ? { ...c, disabled: json.code.disabled } : c,
        ),
      );
    }
  };

  const baseUrl =
    typeof window !== "undefined" ? window.location.origin : "";

  const copy = async (code: Invite) => {
    const link = `${baseUrl}/?invite=${encodeURIComponent(code.code)}`;
    await navigator.clipboard.writeText(link);
    setCopied(code.id);
    setTimeout(() => setCopied((c) => (c === code.id ? null : c)), 1500);
  };

  const share = async (code: Invite) => {
    const link = `${baseUrl}/?invite=${encodeURIComponent(code.code)}`;
    const text = `You're invited to Too Burnt — Sunday brunch in a shed. Book with this link: ${link}`;
    if (navigator.share) {
      try {
        await navigator.share({ title: "Too Burnt invite", text, url: link });
      } catch {
        /* user cancelled */
      }
    } else {
      window.open(
        `sms:?body=${encodeURIComponent(text)}`,
        "_blank",
      );
    }
  };

  return (
    <main
      style={{
        fontFamily: "var(--font-inter), system-ui, sans-serif",
        maxWidth: 960,
        margin: "0 auto",
        padding: "48px 32px 80px",
        color: "var(--ink)",
      }}
    >
      <div
        className="mono"
        style={{ fontSize: 11, letterSpacing: "0.25em", color: "var(--sun)" }}
      >
        ◦ SOFT LAUNCH · INVITE LIST
      </div>
      <h1
        className="serif"
        style={{
          fontSize: 48,
          fontWeight: 300,
          letterSpacing: "-0.02em",
          margin: "8px 0 24px",
        }}
      >
        <span style={{ fontStyle: "italic", color: "var(--moss)" }}>Friends</span>{" "}
        only.
      </h1>
      <p style={{ fontSize: 15, color: "var(--ink-soft)", maxWidth: 560 }}>
        Generate a code, copy the link, text it to whoever you want to invite. They
        can only reserve if they have one. Toggle <em>disabled</em> to revoke.
      </p>

      <div
        style={{
          marginTop: 32,
          padding: "20px 24px",
          background: "var(--cream)",
          border: "1px solid var(--rule)",
          borderRadius: 4,
          display: "flex",
          gap: 12,
          alignItems: "end",
          flexWrap: "wrap",
        }}
      >
        <div style={{ flex: "1 1 240px" }}>
          <div
            className="mono"
            style={{
              fontSize: 10,
              letterSpacing: "0.15em",
              color: "var(--ink-soft)",
              marginBottom: 6,
              textTransform: "uppercase",
            }}
          >
            Note — who&apos;s this for?
          </div>
          <input
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="e.g. Mike & Sarah"
            style={{
              width: "100%",
              padding: "10px 12px",
              fontSize: 14,
              background: "var(--cream-2)",
              border: "1px solid var(--rule)",
              borderRadius: 4,
              outline: "none",
              color: "var(--ink)",
            }}
          />
        </div>
        <div style={{ width: 120 }}>
          <div
            className="mono"
            style={{
              fontSize: 10,
              letterSpacing: "0.15em",
              color: "var(--ink-soft)",
              marginBottom: 6,
              textTransform: "uppercase",
            }}
          >
            Max uses
          </div>
          <input
            type="number"
            min={1}
            max={1000}
            value={maxUses}
            onChange={(e) => setMaxUses(Number(e.target.value) || 1)}
            style={{
              width: "100%",
              padding: "10px 12px",
              fontSize: 14,
              background: "var(--cream-2)",
              border: "1px solid var(--rule)",
              borderRadius: 4,
              outline: "none",
              color: "var(--ink)",
            }}
          />
        </div>
        <button
          onClick={create}
          disabled={busy}
          style={{
            padding: "12px 20px",
            background: "var(--moss)",
            color: "var(--cream)",
            borderRadius: 999,
            fontSize: 14,
            fontWeight: 500,
            opacity: busy ? 0.6 : 1,
          }}
        >
          {busy ? "Generating…" : "Generate code"}
        </button>
      </div>
      {err && (
        <div
          style={{
            marginTop: 12,
            fontSize: 13,
            color: "var(--sun)",
          }}
        >
          {err}
        </div>
      )}

      <div
        style={{
          marginTop: 32,
          border: "1px solid var(--rule)",
          borderRadius: 4,
          background: "var(--cream)",
          overflow: "hidden",
        }}
      >
        {codes.length === 0 ? (
          <div
            style={{
              padding: "40px 24px",
              textAlign: "center",
              color: "var(--ink-soft)",
            }}
          >
            No invites yet — generate your first above.
          </div>
        ) : (
          codes.map((c, i) => {
            const used = `${c.usedCount}/${c.maxUses}`;
            const exhausted = c.usedCount >= c.maxUses;
            const expired =
              c.expiresAt && new Date(c.expiresAt) < new Date();
            const status = c.disabled
              ? "disabled"
              : expired
                ? "expired"
                : exhausted
                  ? "used up"
                  : "active";
            const statusColor =
              status === "active"
                ? "var(--moss)"
                : status === "disabled"
                  ? "var(--ink-soft)"
                  : "var(--sun)";
            return (
              <div
                key={c.id}
                style={{
                  padding: "18px 24px",
                  borderTop: i === 0 ? "none" : "1px solid var(--rule)",
                  display: "grid",
                  gridTemplateColumns: "minmax(140px, 1fr) 2fr auto",
                  gap: 20,
                  alignItems: "center",
                }}
              >
                <div>
                  <div
                    className="mono"
                    style={{
                      fontSize: 16,
                      fontWeight: 500,
                      letterSpacing: "0.08em",
                      color: "var(--ink)",
                    }}
                  >
                    {c.code}
                  </div>
                  <div
                    className="mono"
                    style={{
                      fontSize: 10,
                      letterSpacing: "0.12em",
                      color: statusColor,
                      marginTop: 2,
                      textTransform: "uppercase",
                    }}
                  >
                    {status} · {used}
                  </div>
                </div>
                <div style={{ fontSize: 14, color: "var(--ink-soft)" }}>
                  {c.note || <em style={{ opacity: 0.6 }}>(no note)</em>}
                </div>
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                  <button
                    onClick={() => copy(c)}
                    style={{
                      padding: "6px 12px",
                      fontSize: 12,
                      border: "1px solid var(--rule)",
                      borderRadius: 999,
                      background: "transparent",
                    }}
                  >
                    {copied === c.id ? "copied ✓" : "copy link"}
                  </button>
                  <button
                    onClick={() => share(c)}
                    style={{
                      padding: "6px 12px",
                      fontSize: 12,
                      background: "var(--sun)",
                      color: "#fff",
                      borderRadius: 999,
                    }}
                  >
                    share
                  </button>
                  <button
                    onClick={() => toggleDisabled(c)}
                    style={{
                      padding: "6px 12px",
                      fontSize: 12,
                      border: "1px solid var(--rule)",
                      borderRadius: 999,
                      background: "transparent",
                      color: c.disabled ? "var(--moss)" : "var(--ink-soft)",
                    }}
                  >
                    {c.disabled ? "enable" : "disable"}
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </main>
  );
}
