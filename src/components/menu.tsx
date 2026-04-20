import { Sprig } from "@/components/icons";

type Dish = {
  name: string;
  desc: string;
  price: string;
  tag: "house favorite" | "pranic" | null;
};

const MENU_DISHES: Dish[] = [
  {
    name: "Belgian Waffles",
    desc: "Classic batter, crisp-edged, finished with local New England maple syrup",
    price: "$ 14",
    tag: "house favorite",
  },
  {
    name: "Toasted Bread & Butter",
    desc: "Wheat loaf, toasted golden, organic butter, flaky sea salt",
    price: "$ 8",
    tag: null,
  },
  {
    name: "Eggs, Black Pepper",
    desc: "Soft-scrambled farm eggs, fresh-cracked Tellicherry pepper",
    price: "$ 10",
    tag: null,
  },
  {
    name: "Fresh-squeezed OJ",
    desc: "Cara Cara oranges, pressed this morning, not yesterday",
    price: "$ 6",
    tag: "pranic",
  },
  {
    name: "Black Coffee",
    desc: "Single-origin Arabica, medium roast, pour-over, no sugar unless you ask",
    price: "$ 5",
    tag: null,
  },
];

const MEAL_DEAL = {
  name: "The Sunday Plate",
  items: ["Toasted bread & butter", "Eggs with black pepper", "Fresh OJ"],
  price: "$ 20",
  save: "save $4",
};

export function Menu() {
  return (
    <section
      id="menu"
      style={{
        padding: "120px 0",
        position: "relative",
        overflow: "hidden",
        background: "var(--moss)",
        color: "var(--cream)",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='300' height='300'><filter id='c'><feTurbulence type='fractalNoise' baseFrequency='1.2' numOctaves='3'/><feColorMatrix values='0 0 0 0 0.95 0 0 0 0 0.93 0 0 0 0 0.86 0 0 0 0.08 0'/></filter><rect width='100%' height='100%' filter='url(%23c)'/></svg>\")",
          pointerEvents: "none",
          opacity: 0.7,
        }}
      />
      <Sprig
        size={180}
        color="var(--leaf-soft)"
        style={{ position: "absolute", top: 40, left: -40, opacity: 0.2 }}
      />
      <Sprig
        size={160}
        color="var(--leaf-soft)"
        style={{
          position: "absolute",
          bottom: 80,
          right: -30,
          opacity: 0.2,
          transform: "rotate(135deg)",
        }}
      />

      <div className="container-site" style={{ position: "relative" }}>
        <div style={{ textAlign: "center", marginBottom: 80 }}>
          <span
            className="mono"
            style={{ fontSize: 11, letterSpacing: "0.3em", color: "var(--sun)" }}
          >
            ◦ THIS SUNDAY&apos;S MENU · APRIL 26 ◦
          </span>
          <h2
            className="script"
            style={{
              fontSize: "clamp(72px, 11vw, 156px)",
              fontWeight: 700,
              lineHeight: 0.95,
              margin: "16px 0 8px",
              color: "var(--cream)",
            }}
          >
            What we&apos;re
            <br />
            cooking.
          </h2>
          <div
            className="serif"
            style={{ fontSize: 18, fontStyle: "italic", opacity: 0.7, marginTop: 16 }}
          >
            small menu · one seating · everything made to order
          </div>
        </div>

        <div style={{ maxWidth: 780, margin: "0 auto" }}>
          {MENU_DISHES.map((d, i) => (
            <div
              key={d.name}
              style={{
                display: "grid",
                gridTemplateColumns: "1fr auto",
                gap: 24,
                padding: "28px 0",
                borderBottom:
                  i === MENU_DISHES.length - 1
                    ? "none"
                    : "1px dashed rgba(241,236,221,0.2)",
                alignItems: "baseline",
              }}
            >
              <div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "baseline",
                    gap: 16,
                    flexWrap: "wrap",
                  }}
                >
                  <h3
                    className="script"
                    style={{
                      fontSize: 44,
                      fontWeight: 600,
                      margin: 0,
                      lineHeight: 1,
                      color: "var(--cream)",
                    }}
                  >
                    {d.name}
                  </h3>
                  {d.tag && (
                    <span
                      className="mono"
                      style={{
                        fontSize: 10,
                        letterSpacing: "0.2em",
                        color: d.tag === "pranic" ? "var(--sun)" : "var(--leaf-soft)",
                        border: `1px solid ${
                          d.tag === "pranic" ? "var(--sun)" : "var(--leaf-soft)"
                        }`,
                        padding: "3px 8px",
                        borderRadius: 2,
                      }}
                    >
                      {d.tag.toUpperCase()}
                    </span>
                  )}
                </div>
                <p
                  className="serif"
                  style={{
                    fontSize: 16,
                    fontStyle: "italic",
                    opacity: 0.75,
                    margin: "8px 0 0",
                    maxWidth: 500,
                  }}
                >
                  {d.desc}
                </p>
              </div>
              <div
                className="script"
                style={{
                  fontSize: 36,
                  fontWeight: 600,
                  color: "var(--sun)",
                  whiteSpace: "nowrap",
                }}
              >
                {d.price}
              </div>
            </div>
          ))}
        </div>

        <div
          style={{
            maxWidth: 780,
            margin: "64px auto 0",
            padding: "36px 40px",
            border: "2px dashed var(--sun)",
            borderRadius: 4,
            position: "relative",
            background: "rgba(232, 118, 58, 0.08)",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: -12,
              left: 32,
              background: "var(--moss)",
              padding: "0 12px",
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            <span
              className="mono"
              style={{ fontSize: 10, letterSpacing: "0.25em", color: "var(--sun)" }}
            >
              ◦ THE MEAL DEAL ◦
            </span>
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr auto",
              gap: 32,
              alignItems: "center",
            }}
          >
            <div>
              <h3
                className="script"
                style={{
                  fontSize: 52,
                  fontWeight: 700,
                  margin: "0 0 8px",
                  color: "var(--cream)",
                }}
              >
                {MEAL_DEAL.name}
              </h3>
              <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
                {MEAL_DEAL.items.map((it, i) => (
                  <span
                    key={it}
                    className="serif"
                    style={{ fontSize: 16, fontStyle: "italic", opacity: 0.8 }}
                  >
                    {it}
                    {i < MEAL_DEAL.items.length - 1 && (
                      <span style={{ marginLeft: 20, color: "var(--sun)" }}>+</span>
                    )}
                  </span>
                ))}
              </div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div
                className="script"
                style={{
                  fontSize: 56,
                  fontWeight: 700,
                  color: "var(--sun)",
                  lineHeight: 1,
                }}
              >
                {MEAL_DEAL.price}
              </div>
              <div
                className="mono"
                style={{
                  fontSize: 11,
                  color: "var(--sun-soft)",
                  letterSpacing: "0.15em",
                  marginTop: 4,
                }}
              >
                {MEAL_DEAL.save.toUpperCase()}
              </div>
            </div>
          </div>
        </div>

        <div
          className="serif"
          style={{ textAlign: "center", marginTop: 64, fontSize: 14, opacity: 0.6 }}
        >
          <em>
            Menu changes weekly with what the garden and market give us. Vegetarian. Allergy-aware
            — tell us on the form and Vikram will figure it out.
          </em>
        </div>
      </div>
    </section>
  );
}
