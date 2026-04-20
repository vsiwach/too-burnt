import { Circled, Placeholder, Sprig } from "@/components/icons";

export function Story() {
  return (
    <section
      id="story"
      style={{
        padding: "120px 0",
        background: "var(--cream-2)",
        borderTop: "1px solid var(--rule)",
        borderBottom: "1px solid var(--rule)",
      }}
    >
      <div className="container-site">
        <div className="story-grid">
          <div className="story-side">
            <span
              className="mono"
              style={{ fontSize: 11, letterSpacing: "0.25em", color: "var(--sun)" }}
            >
              ◦ CHAPTER ONE
            </span>
            <h2
              className="serif"
              style={{
                fontSize: "clamp(42px, 5vw, 72px)",
                fontWeight: 300,
                lineHeight: 1,
                letterSpacing: "-0.025em",
                margin: "16px 0 32px",
              }}
            >
              A father.
              <br />
              A daughter.
              <br />
              <span style={{ fontStyle: "italic", color: "var(--moss)" }}>A shed.</span>
            </h2>
            <div style={{ position: "relative", width: 300, transform: "rotate(-2deg)" }}>
              <Placeholder
                label="sophia + vikram, day one"
                tone="moss"
                aspect="4/5"
                src="/photos/sophia-vikram.jpg"
                style={{ boxShadow: "0 20px 40px rgba(0,0,0,0.1)" }}
              />
              <div
                className="script"
                style={{
                  position: "absolute",
                  bottom: -36,
                  right: 12,
                  fontSize: 22,
                  color: "var(--ink-soft)",
                  transform: "rotate(3deg)",
                }}
              >
                day one — april &apos;26
              </div>
            </div>
          </div>

          <div style={{ fontSize: 18, lineHeight: 1.8, color: "var(--ink-soft)" }}>
            <p
              className="serif"
              style={{
                fontSize: 24,
                lineHeight: 1.5,
                color: "var(--ink)",
                marginTop: 0,
              }}
            >
              This started as a Sunday habit. Dad would cook. I&apos;d set the table. Friends kept
              asking when they could come back.
            </p>

            <p>
              My dad <strong style={{ color: "var(--moss)" }}>Vikram</strong> grew up in a house
              where meals weren&apos;t rushed. In the Indian tradition he learned, food carries{" "}
              <span className="serif" style={{ fontStyle: "italic" }}>
                prāṇa
              </span>{" "}
              — a word that doesn&apos;t translate cleanly, but means something like the{" "}
              <em>living breath</em> of a thing. A just-picked tomato has it. A microwaved one
              doesn&apos;t.
            </p>

            <p>
              Cooking <em>pranic</em> food isn&apos;t a diet. It&apos;s a way of paying attention.
              You pick what&apos;s in season. You cook it slowly. You don&apos;t drown it in oil or
              overthink it. You let it taste like itself.
            </p>

            <p>
              When you eat this way for a while, something quiet happens. You get less foggy. You
              sleep better. You start noticing the tea you&apos;re drinking instead of scrolling
              past it. People on this kind of diet, my dad says,{" "}
              <Circled>become naturally meditative</Circled> — not because they&apos;re trying to,
              but because the food stops getting in the way.
            </p>

            <p>
              So we built a shed in the backyard, put in fourteen seats, and opened for brunch.
              That&apos;s the whole plan.
            </p>

            <div
              style={{
                marginTop: 56,
                padding: "32px 36px",
                background: "var(--cream)",
                border: "1px solid var(--rule)",
                borderRadius: 2,
                position: "relative",
              }}
            >
              <Sprig
                size={50}
                color="var(--leaf)"
                style={{ position: "absolute", top: -20, right: 24, opacity: 0.6 }}
              />
              <div
                style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 32 }}
              >
                <div>
                  <div
                    className="mono"
                    style={{
                      fontSize: 10,
                      color: "var(--sun)",
                      letterSpacing: "0.2em",
                      marginBottom: 8,
                    }}
                  >
                    CEO · SERVER · DAUGHTER
                  </div>
                  <div
                    className="serif"
                    style={{ fontSize: 28, fontWeight: 400, color: "var(--ink)" }}
                  >
                    Sophia
                  </div>
                  <div
                    className="script"
                    style={{ fontSize: 28, color: "var(--sun)", marginTop: 4 }}
                  >
                    Sophia ♡
                  </div>
                </div>
                <div>
                  <div
                    className="mono"
                    style={{
                      fontSize: 10,
                      color: "var(--sun)",
                      letterSpacing: "0.2em",
                      marginBottom: 8,
                    }}
                  >
                    CHEF · DAD
                  </div>
                  <div
                    className="serif"
                    style={{ fontSize: 28, fontWeight: 400, color: "var(--ink)" }}
                  >
                    Vikram
                  </div>
                  <div
                    className="script"
                    style={{ fontSize: 28, color: "var(--moss)", marginTop: 4 }}
                  >
                    — V.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .story-grid {
          display: grid;
          grid-template-columns: 1fr 1.3fr;
          gap: 96px;
          align-items: start;
        }
        .story-side {
          position: sticky;
          top: 40px;
        }
        @media (max-width: 900px) {
          .story-grid {
            grid-template-columns: 1fr;
            gap: 48px;
          }
          .story-side {
            position: static;
          }
        }
      `}</style>
    </section>
  );
}
