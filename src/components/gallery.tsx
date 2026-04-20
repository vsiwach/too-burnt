import { Placeholder } from "@/components/icons";

export function Gallery() {
  return (
    <section id="gallery" style={{ padding: "120px 0" }}>
      <div className="container-site">
        <div
          style={{
            display: "flex",
            alignItems: "baseline",
            justifyContent: "space-between",
            marginBottom: 48,
            gap: 24,
            flexWrap: "wrap",
          }}
        >
          <div>
            <span
              className="mono"
              style={{ fontSize: 11, letterSpacing: "0.25em", color: "var(--sun)" }}
            >
              ◦ THE SHED, IN PIECES
            </span>
            <h2
              className="serif"
              style={{
                fontSize: "clamp(42px, 5vw, 72px)",
                fontWeight: 300,
                letterSpacing: "-0.025em",
                margin: "12px 0 0",
              }}
            >
              A little{" "}
              <span style={{ fontStyle: "italic", color: "var(--moss)" }}>
                look around
              </span>
              .
            </h2>
          </div>
          <a
            href="https://instagram.com/tooburnt.shed"
            target="_blank"
            rel="noopener noreferrer"
            className="cta-hover"
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              fontSize: 14,
              padding: "10px 16px",
              border: "1px solid var(--ink)",
              borderRadius: 999,
              textDecoration: "none",
            }}
          >
            <span>@tooburnt.shed</span>
            <span>↗</span>
          </a>
        </div>

        <div className="bento">
          <div style={{ gridColumn: "span 2", gridRow: "span 2" }}>
            <Placeholder
              label="morning light, waffles"
              tone="sun"
              aspect="auto"
              src="/photos/waffles.jpg"
              style={{ height: "100%" }}
            />
          </div>
          <div style={{ gridColumn: "span 2" }}>
            <Placeholder
              label="pour-over setup"
              tone="moss"
              aspect="auto"
              src="/photos/pour-over.jpg"
              style={{ height: "100%" }}
            />
          </div>
          <div style={{ gridColumn: "span 2", gridRow: "span 2" }}>
            <Placeholder
              label="vikram at the stove"
              tone="moss"
              aspect="auto"
              src="/photos/vikram-stove.jpg"
              objectPosition="center top"
              style={{ height: "100%" }}
            />
          </div>
          <div style={{ gridColumn: "span 2" }}>
            <Placeholder
              label="herbs, cutting board"
              tone="leaf"
              aspect="auto"
              src="/photos/herbs.jpg"
              style={{ height: "100%" }}
            />
          </div>
        </div>

        <div style={{ marginTop: 48 }}>
          <div
            className="mono"
            style={{
              fontSize: 11,
              letterSpacing: "0.25em",
              color: "var(--ink-soft)",
              marginBottom: 16,
            }}
          >
            ◦ FROM INSTAGRAM
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(6, 1fr)",
              gap: 8,
            }}
          >
            {[
              { label: "toast", src: "/photos/ig-toast.jpg" },
              { label: "ju oranges", src: "/photos/ig-oranges.jpg" },
              { label: "garden haul", src: "/photos/sophia-garden.jpg" },
              { label: "plate up", src: "/photos/ig-plateup.jpg" },
              { label: "sophia", src: "/photos/sophia.jpg" },
              { label: "flowers", src: "/photos/ig-flowers.jpg" },
            ].map((item) => (
              <Placeholder
                key={item.label}
                label={item.label}
                tone="leaf"
                aspect="1/1"
                src={item.src}
              />
            ))}
          </div>
        </div>
      </div>

      <style jsx>{`
        .bento {
          display: grid;
          grid-template-columns: repeat(6, 1fr);
          grid-template-rows: repeat(2, 200px);
          gap: 12px;
        }
        @media (max-width: 720px) {
          .bento {
            grid-template-columns: repeat(2, 1fr);
            grid-template-rows: auto;
          }
          .bento > div {
            grid-column: span 1 !important;
            grid-row: auto !important;
            height: 180px;
          }
        }
      `}</style>
    </section>
  );
}
