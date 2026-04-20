"use client";

import { Leaf } from "@/components/icons";

function FooterCol({
  title,
  links,
}: {
  title: string;
  links: [string, string][];
}) {
  return (
    <div>
      <div
        className="mono"
        style={{
          fontSize: 10,
          letterSpacing: "0.25em",
          color: "var(--sun)",
          marginBottom: 16,
        }}
      >
        {title.toUpperCase()}
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {links.map(([label, href]) => (
          <a
            key={label}
            href={href}
            style={{ fontSize: 14, opacity: 0.75, textDecoration: "none" }}
          >
            {label}
          </a>
        ))}
      </div>
    </div>
  );
}

export function Footer({ onReserve }: { onReserve: () => void }) {
  return (
    <footer
      style={{ padding: "80px 0 40px", background: "var(--ink)", color: "var(--cream)" }}
    >
      <div className="container-site">
        <div className="footer-grid">
          <div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                marginBottom: 16,
              }}
            >
              <Leaf size={28} color="var(--leaf-soft)" />
              <span
                className="serif"
                style={{ fontSize: 28, fontWeight: 400, letterSpacing: "-0.02em" }}
              >
                Too Burnt
              </span>
            </div>
            <p
              className="serif"
              style={{
                fontSize: 16,
                fontStyle: "italic",
                opacity: 0.7,
                maxWidth: 340,
                lineHeight: 1.6,
              }}
            >
              A Sunday brunch in a backyard shed. Food with prāṇa. Made slow, eaten slower.
            </p>
            <button
              onClick={onReserve}
              className="cta-hover"
              style={{
                marginTop: 24,
                padding: "12px 24px",
                background: "var(--sun)",
                color: "var(--ink)",
                borderRadius: 999,
                fontSize: 14,
                fontWeight: 500,
              }}
            >
              Reserve a seat →
            </button>
          </div>
          <FooterCol
            title="Visit"
            links={[
              ["Story", "#story"],
              ["Menu", "#menu"],
              ["Find us", "#visit"],
              ["Gallery", "#gallery"],
            ]}
          />
          <FooterCol
            title="Hello"
            links={[
              ["hello@tooburnt.com", "mailto:hello@tooburnt.com"],
              ["(978) 555-0142", "tel:+19785550142"],
              ["@tooburnt.shed", "https://instagram.com/tooburnt.shed"],
            ]}
          />
          <FooterCol
            title="Fine print"
            links={[
              ["Cancellation", "#"],
              ["Private events", "#"],
              ["Allergen info", "#"],
            ]}
          />
        </div>

        <div
          style={{
            paddingTop: 32,
            borderTop: "1px solid rgba(241,236,221,0.15)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 16,
          }}
        >
          <div
            className="mono"
            style={{ fontSize: 11, opacity: 0.5, letterSpacing: "0.15em" }}
          >
            © 2026 TOO BURNT · MADE WITH CARE IN CARLISLE, MA
          </div>
          <div className="script" style={{ fontSize: 22, color: "var(--sun)" }}>
            ♡ — Sophia &amp; Vikram
          </div>
        </div>
      </div>

      <style jsx>{`
        .footer-grid {
          display: grid;
          grid-template-columns: 2fr 1fr 1fr 1fr;
          gap: 48px;
          margin-bottom: 64px;
        }
        @media (max-width: 720px) {
          .footer-grid {
            grid-template-columns: 1fr 1fr;
            gap: 32px;
          }
        }
      `}</style>
    </footer>
  );
}
