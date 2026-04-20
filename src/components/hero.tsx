"use client";

import { Placeholder, Sprig } from "@/components/icons";

export function Hero({ onReserve }: { onReserve: () => void }) {
  return (
    <section id="top" style={{ padding: "20px 0 120px", position: "relative" }}>
      <div className="container-site" style={{ position: "relative" }}>
        <div className="hero-grid">
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 32 }}>
              <span
                className="mono"
                style={{ fontSize: 11, color: "var(--sun)", letterSpacing: "0.2em" }}
              >
                SUNDAY BRUNCH · BY RESERVATION
              </span>
              <div style={{ flex: 1, height: 1, background: "var(--rule)" }} />
            </div>
            <h1
              className="serif"
              style={{
                fontSize: "clamp(64px, 9vw, 132px)",
                fontWeight: 300,
                lineHeight: 0.92,
                letterSpacing: "-0.035em",
                margin: "0 0 32px",
              }}
            >
              Breakfast
              <br />
              with a little
              <br />
              <span
                style={{ fontStyle: "italic", fontWeight: 400, color: "var(--moss)" }}
              >
                prāṇa
              </span>
              <span style={{ color: "var(--sun)" }}>.</span>
            </h1>
            <p
              style={{
                fontSize: 19,
                lineHeight: 1.55,
                maxWidth: 520,
                color: "var(--ink-soft)",
                margin: "0 0 40px",
              }}
            >
              A father–daughter kitchen in a backyard shed, serving Sunday brunch made with the
              old Indian idea that food should carry{" "}
              <span className="serif" style={{ fontStyle: "italic" }}>
                life itself
              </span>
              . Cooked slow, eaten slower.
            </p>
            <div style={{ display: "flex", gap: 16, alignItems: "center", flexWrap: "wrap" }}>
              <button
                onClick={onReserve}
                className="cta-hover"
                style={{
                  background: "var(--sun)",
                  color: "#fff",
                  padding: "16px 28px",
                  borderRadius: 999,
                  fontSize: 15,
                  fontWeight: 500,
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                }}
              >
                Reserve this Sunday →
              </button>
              <a
                href="#menu"
                style={{
                  padding: "16px 8px",
                  fontSize: 15,
                  borderBottom: "1px solid var(--ink)",
                  textDecoration: "none",
                }}
              >
                See what Vikram is cooking
              </a>
            </div>
          </div>

          <div style={{ position: "relative", minHeight: 520 }}>
            <div
              style={{
                position: "absolute",
                top: 0,
                right: 40,
                width: "70%",
                transform: "rotate(3deg)",
              }}
            >
              <Placeholder
                label="waffles, maple, sprig of mint"
                tone="sun"
                aspect="3/4"
                src="/photos/waffles.jpg"
                style={{ boxShadow: "0 20px 40px rgba(0,0,0,0.08)" }}
              />
              <div
                className="script"
                style={{
                  fontSize: 22,
                  color: "var(--ink-soft)",
                  marginTop: 8,
                  textAlign: "right",
                  paddingRight: 12,
                }}
              >
                sunday 9am
              </div>
            </div>
            <div
              style={{
                position: "absolute",
                bottom: 0,
                left: 0,
                width: "55%",
                transform: "rotate(-4deg)",
              }}
            >
              <Placeholder
                label="fresh OJ, glass pitcher"
                tone="leaf"
                aspect="1/1"
                src="/photos/oj.jpg"
                style={{ boxShadow: "0 16px 32px rgba(0,0,0,0.08)" }}
              />
            </div>
            <Sprig
              size={80}
              color="var(--leaf)"
              style={{ position: "absolute", top: 160, left: 0, opacity: 0.5 }}
            />
          </div>
        </div>

        <div
          style={{
            marginTop: 80,
            padding: "18px 0",
            borderTop: "1px solid var(--rule)",
            borderBottom: "1px solid var(--rule)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            fontSize: 13,
            color: "var(--ink-soft)",
            flexWrap: "wrap",
            gap: 12,
          }}
        >
          <span className="mono">◦ SEATS 14</span>
          <span className="mono">◦ SUNDAYS ONLY · 9AM–2PM</span>
          <span className="mono">◦ THE SHED, BACKYARD</span>
          <span className="mono">◦ 100% PRANIC</span>
          <span className="mono">◦ NO PHONES ON THE TABLE</span>
        </div>
      </div>

      <style jsx>{`
        .hero-grid {
          display: grid;
          grid-template-columns: 1.1fr 0.9fr;
          gap: 64px;
          align-items: end;
        }
        @media (max-width: 900px) {
          .hero-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </section>
  );
}
