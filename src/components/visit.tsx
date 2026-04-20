export function Visit() {
  return (
    <section
      id="visit"
      style={{
        padding: "120px 0",
        background: "var(--cream-2)",
        borderTop: "1px solid var(--rule)",
        borderBottom: "1px solid var(--rule)",
      }}
    >
      <div className="container-site">
        <div className="visit-grid">
          <div>
            <span
              className="mono"
              style={{ fontSize: 11, letterSpacing: "0.25em", color: "var(--sun)" }}
            >
              ◦ FINDING US
            </span>
            <h2
              className="serif"
              style={{
                fontSize: "clamp(42px, 5vw, 72px)",
                fontWeight: 300,
                letterSpacing: "-0.025em",
                margin: "12px 0 32px",
              }}
            >
              Through the
              <br />
              <span style={{ fontStyle: "italic", color: "var(--moss)" }}>
                gate on the right
              </span>
              .
            </h2>

            <div style={{ fontSize: 18, lineHeight: 1.7, color: "var(--ink-soft)" }}>
              <p style={{ marginTop: 0 }}>
                Park in front of the stone wall at the top of the driveway. Walk past the flower
                beds — you&apos;ll see the shed with the gazebo just beyond. If you hear Vikram
                laughing, you&apos;re close.
              </p>
            </div>

            <div
              style={{
                marginTop: 40,
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 32,
              }}
            >
              <div>
                <div
                  className="mono"
                  style={{
                    fontSize: 10,
                    letterSpacing: "0.2em",
                    color: "var(--sun)",
                    marginBottom: 8,
                  }}
                >
                  ADDRESS
                </div>
                <div className="serif" style={{ fontSize: 20, lineHeight: 1.3 }}>
                  The Shed
                  <br />
                  122 Concord St
                  <br />
                  Carlisle, MA 01741
                </div>
              </div>
              <div>
                <div
                  className="mono"
                  style={{
                    fontSize: 10,
                    letterSpacing: "0.2em",
                    color: "var(--sun)",
                    marginBottom: 8,
                  }}
                >
                  HOURS
                </div>
                <div className="serif" style={{ fontSize: 20, lineHeight: 1.3 }}>
                  Sunday
                  <br />
                  9:00 – 14:00
                  <br />
                  <span
                    style={{
                      color: "var(--ink-soft)",
                      fontSize: 15,
                      fontStyle: "italic",
                    }}
                  >
                    closed mon–sat
                  </span>
                </div>
              </div>
            </div>

            <div
              style={{
                marginTop: 40,
                padding: "20px 24px",
                background: "var(--cream)",
                borderRadius: 4,
                border: "1px solid var(--rule)",
              }}
            >
              <div
                className="script"
                style={{ fontSize: 22, color: "var(--moss)", marginBottom: 4 }}
              >
                a note —
              </div>
              <div style={{ fontSize: 15, color: "var(--ink-soft)", lineHeight: 1.6 }}>
                Reservation only. We don&apos;t take walk-ins because we don&apos;t have the
                seats. Please arrive within 15 min of your slot.
              </div>
            </div>
          </div>

          <div style={{ position: "relative" }}>
            <a
              href="https://www.google.com/maps/search/?api=1&query=122+Concord+St+Carlisle+MA+01741"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "block",
                width: "100%",
                aspectRatio: "1/1",
                background: `
                  radial-gradient(circle at 60% 40%, var(--sun) 0 8px, transparent 9px),
                  repeating-linear-gradient(0deg, var(--rule) 0 1px, transparent 1px 40px),
                  repeating-linear-gradient(90deg, var(--rule) 0 1px, transparent 1px 40px),
                  var(--cream)
                `,
                border: "1px solid var(--rule)",
                borderRadius: 4,
                position: "relative",
                textDecoration: "none",
              }}
            >
              <svg
                style={{
                  position: "absolute",
                  inset: 0,
                  width: "100%",
                  height: "100%",
                  pointerEvents: "none",
                }}
                viewBox="0 0 400 400"
              >
                <path
                  d="M 40 340 Q 120 280, 200 240 T 340 180"
                  stroke="var(--moss)"
                  strokeWidth="2"
                  fill="none"
                  strokeDasharray="4 6"
                />
                <path
                  d="M 340 180 Q 300 160, 280 160"
                  stroke="var(--sun)"
                  strokeWidth="2"
                  fill="none"
                />
                <circle cx="280" cy="160" r="8" fill="var(--sun)" />
              </svg>
              <div
                style={{
                  position: "absolute",
                  bottom: 16,
                  left: 16,
                  right: 16,
                  background: "var(--cream)",
                  padding: "12px 16px",
                  borderRadius: 4,
                  border: "1px solid var(--rule)",
                  fontSize: 13,
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <span
                  className="mono"
                  style={{ letterSpacing: "0.15em", fontSize: 10 }}
                >
                  ◦ THE SHED
                </span>
                <span style={{ color: "var(--sun)", fontWeight: 500 }}>
                  Open in Maps →
                </span>
              </div>
            </a>
          </div>
        </div>
      </div>

      <style jsx>{`
        .visit-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 80px;
        }
        @media (max-width: 900px) {
          .visit-grid {
            grid-template-columns: 1fr;
            gap: 48px;
          }
        }
      `}</style>
    </section>
  );
}
