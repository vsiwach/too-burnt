"use client";

import { Leaf } from "@/components/icons";
import { useTheme } from "@/components/theme-provider";

export function Nav({ onReserve }: { onReserve: () => void }) {
  const { theme, toggle } = useTheme();
  return (
    <nav
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "28px 48px",
        maxWidth: 1440,
        margin: "0 auto",
      }}
    >
      <a
        href="#top"
        style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}
      >
        <Leaf size={26} color="var(--moss)" />
        <span
          className="serif"
          style={{ fontSize: 22, fontWeight: 500, letterSpacing: "-0.02em" }}
        >
          Too Burnt
        </span>
        <span
          className="mono"
          style={{ fontSize: 10, color: "var(--ink-soft)", opacity: 0.6, marginLeft: 4 }}
        >
          EST. 2026
        </span>
      </a>
      <div style={{ display: "flex", gap: 32, alignItems: "center" }}>
        {["Story", "Menu", "Visit", "Gallery"].map((item) => (
          <a
            key={item}
            href={`#${item.toLowerCase()}`}
            style={{ textDecoration: "none", fontSize: 14, opacity: 0.8 }}
          >
            {item}
          </a>
        ))}
        <button
          onClick={toggle}
          aria-label="Toggle theme"
          style={{
            width: 32,
            height: 32,
            borderRadius: "50%",
            border: "1px solid var(--rule)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {theme === "light" ? "☾" : "☼"}
        </button>
        <button
          onClick={onReserve}
          className="cta-hover"
          style={{
            background: "var(--moss)",
            color: "var(--cream)",
            padding: "10px 20px",
            borderRadius: 999,
            fontSize: 14,
            fontWeight: 500,
          }}
        >
          Reserve a seat →
        </button>
      </div>
    </nav>
  );
}
