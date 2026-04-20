import { prisma } from "@/lib/db";
import { DISHES, type DishKey } from "@/lib/menu";

export const dynamic = "force-dynamic";
export const revalidate = 0;

function nextSundayISO(base = new Date()) {
  const d = new Date(base);
  d.setHours(0, 0, 0, 0);
  const day = d.getDay(); // 0 = Sun
  const delta = (7 - day) % 7;
  d.setDate(d.getDate() + delta);
  return d.toISOString().slice(0, 10);
}

type ReservationRow = Awaited<
  ReturnType<typeof prisma.reservation.findMany>
>[number];

function parseDishes(s: string): Record<DishKey, number> {
  try {
    return JSON.parse(s);
  } catch {
    return {} as Record<DishKey, number>;
  }
}

function parseAllergies(s: string): string[] {
  try {
    const v = JSON.parse(s);
    return Array.isArray(v) ? v : [];
  } catch {
    return [];
  }
}

export default async function AdminPage({
  searchParams,
}: {
  searchParams: { token?: string; date?: string };
}) {
  const required = process.env.ADMIN_TOKEN;
  if (required && searchParams.token !== required) {
    return (
      <main style={{ padding: 48, fontFamily: "var(--font-inter)" }}>
        <h1 className="serif" style={{ fontSize: 42, fontWeight: 300 }}>
          Not authorized
        </h1>
        <p style={{ fontSize: 15, color: "var(--ink-soft)" }}>
          Append <code>?token=…</code> to the URL (set <code>ADMIN_TOKEN</code> in{" "}
          <code>.env.local</code>).
        </p>
      </main>
    );
  }

  const targetDate = searchParams.date ?? nextSundayISO();
  const reservations: ReservationRow[] = await prisma.reservation.findMany({
    where: { date: targetDate, status: "confirmed" },
    orderBy: [{ time: "asc" }, { createdAt: "asc" }],
  });

  const upcoming = await prisma.reservation.findMany({
    where: { status: "confirmed" },
    orderBy: [{ date: "asc" }, { time: "asc" }],
    select: { date: true },
  });
  const upcomingDates = Array.from(new Set(upcoming.map((r) => r.date))).sort();

  // Aggregations
  const totalGuests = reservations.reduce((s, r) => s + r.party, 0);
  const seatingAgg: Record<string, number> = {};
  const timeAgg: Record<string, number> = {};
  const allergyAgg: Record<string, number> = {};
  const spiceAgg: Record<string, number> = {};
  const occasionAgg: Record<string, number> = {};
  const dishAgg: Record<DishKey, number> = DISHES.reduce(
    (acc, d) => ({ ...acc, [d.key]: 0 }),
    {} as Record<DishKey, number>,
  );
  let subtotal = 0;

  for (const r of reservations) {
    seatingAgg[r.seating] = (seatingAgg[r.seating] ?? 0) + r.party;
    timeAgg[r.time] = (timeAgg[r.time] ?? 0) + r.party;
    spiceAgg[r.spice] = (spiceAgg[r.spice] ?? 0) + 1;
    occasionAgg[r.occasion] = (occasionAgg[r.occasion] ?? 0) + 1;
    for (const a of parseAllergies(r.allergies)) {
      allergyAgg[a] = (allergyAgg[a] ?? 0) + 1;
    }
    const dishes = parseDishes(r.dishes);
    for (const d of DISHES) {
      const n = dishes[d.key] ?? 0;
      dishAgg[d.key] += n;
      subtotal += n * d.price;
    }
  }

  return (
    <main
      style={{
        fontFamily: "var(--font-inter), system-ui, sans-serif",
        maxWidth: 1100,
        margin: "0 auto",
        padding: "48px 32px 80px",
        color: "var(--ink)",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "baseline",
          flexWrap: "wrap",
          gap: 16,
        }}
      >
        <div>
          <div
            className="mono"
            style={{
              fontSize: 11,
              letterSpacing: "0.25em",
              color: "var(--sun)",
            }}
          >
            ◦ SATURDAY PREP
          </div>
          <h1
            className="serif"
            style={{
              fontSize: 56,
              fontWeight: 300,
              letterSpacing: "-0.02em",
              margin: "8px 0 0",
            }}
          >
            What we&apos;re{" "}
            <span style={{ fontStyle: "italic", color: "var(--moss)" }}>cooking</span>{" "}
            <span style={{ fontSize: 28, color: "var(--ink-soft)" }}>
              · {targetDate}
            </span>
          </h1>
        </div>
        <div
          className="mono"
          style={{
            fontSize: 12,
            color: "var(--ink-soft)",
            display: "flex",
            flexDirection: "column",
            gap: 4,
            alignItems: "flex-end",
          }}
        >
          <div>{reservations.length} reservations</div>
          <div style={{ color: "var(--sun)", fontSize: 18, fontWeight: 500 }}>
            {totalGuests} guests
          </div>
          <div>≈ ${subtotal} pre-ordered</div>
        </div>
      </div>

      {upcomingDates.length > 0 && (
        <div
          style={{
            marginTop: 24,
            display: "flex",
            gap: 8,
            flexWrap: "wrap",
            fontSize: 12,
          }}
        >
          <span className="mono" style={{ color: "var(--ink-soft)" }}>
            other dates:
          </span>
          {upcomingDates.map((d) => (
            <a
              key={d}
              href={`?date=${d}${required ? `&token=${searchParams.token}` : ""}`}
              className="mono"
              style={{
                padding: "2px 8px",
                borderRadius: 999,
                border: "1px solid var(--rule)",
                color: d === targetDate ? "var(--sun)" : "var(--ink-soft)",
                background: d === targetDate ? "rgba(232,118,58,0.1)" : "transparent",
                textDecoration: "none",
              }}
            >
              {d}
            </a>
          ))}
        </div>
      )}

      <div
        style={{
          marginTop: 40,
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
          gap: 20,
        }}
      >
        <Card title="Shopping list — dishes to prep">
          {DISHES.map((d) => (
            <Row key={d.key} label={d.name} value={dishAgg[d.key]} />
          ))}
        </Card>

        <Card title="Allergies to watch">
          {Object.keys(allergyAgg).length === 0 ? (
            <Empty>No allergies reported 🎉</Empty>
          ) : (
            Object.entries(allergyAgg)
              .sort((a, b) => b[1] - a[1])
              .map(([k, v]) => <Row key={k} label={k} value={`${v} guest(s)`} highlight />)
          )}
        </Card>

        <Card title="Arrivals by time">
          {Object.keys(timeAgg).length === 0 ? (
            <Empty>—</Empty>
          ) : (
            Object.entries(timeAgg)
              .sort()
              .map(([t, n]) => <Row key={t} label={t} value={`${n} ppl`} />)
          )}
        </Card>

        <Card title="Seating">
          {Object.entries(seatingAgg).map(([k, v]) => (
            <Row key={k} label={k} value={`${v} ppl`} />
          ))}
        </Card>

        <Card title="Spice tolerance">
          {Object.entries(spiceAgg).map(([k, v]) => (
            <Row key={k} label={k} value={v} />
          ))}
        </Card>

        <Card title="Occasions">
          {Object.entries(occasionAgg).map(([k, v]) => (
            <Row key={k} label={k} value={v} />
          ))}
        </Card>
      </div>

      <h2
        className="serif"
        style={{
          fontSize: 32,
          fontWeight: 300,
          letterSpacing: "-0.02em",
          margin: "56px 0 16px",
        }}
      >
        Guest list
      </h2>
      {reservations.length === 0 ? (
        <p style={{ color: "var(--ink-soft)" }}>No reservations yet for {targetDate}.</p>
      ) : (
        <div
          style={{
            border: "1px solid var(--rule)",
            borderRadius: 4,
            background: "var(--cream)",
          }}
        >
          {reservations.map((r, i) => {
            const dishes = parseDishes(r.dishes);
            const allergies = parseAllergies(r.allergies);
            const orderedLines = DISHES.filter((d) => (dishes[d.key] ?? 0) > 0).map(
              (d) => `${dishes[d.key]}× ${d.name}`,
            );
            return (
              <div
                key={r.id}
                style={{
                  padding: "20px 24px",
                  borderTop: i === 0 ? "none" : "1px solid var(--rule)",
                  display: "grid",
                  gridTemplateColumns: "minmax(140px, 1fr) 2fr auto",
                  gap: 20,
                  fontSize: 14,
                }}
              >
                <div>
                  <div
                    className="serif"
                    style={{ fontSize: 18, color: "var(--ink)" }}
                  >
                    {r.name}
                  </div>
                  <div className="mono" style={{ fontSize: 11, color: "var(--ink-soft)" }}>
                    party of {r.party} · {r.time}
                  </div>
                  <div
                    style={{
                      fontSize: 12,
                      color: "var(--ink-soft)",
                      marginTop: 4,
                    }}
                  >
                    <a href={`mailto:${r.email}`}>{r.email}</a>
                    <br />
                    <a href={`tel:${r.phone}`}>{r.phone}</a>
                  </div>
                </div>
                <div style={{ color: "var(--ink-soft)", lineHeight: 1.5 }}>
                  {orderedLines.length > 0 ? (
                    <div>
                      <strong style={{ color: "var(--sun)" }}>Pre-order:</strong>{" "}
                      {orderedLines.join(" · ")}
                    </div>
                  ) : (
                    <div style={{ opacity: 0.6, fontStyle: "italic" }}>
                      no pre-order — ordering at the table
                    </div>
                  )}
                  {allergies.length > 0 && (
                    <div style={{ marginTop: 4 }}>
                      <strong style={{ color: "var(--sun)" }}>Allergies:</strong>{" "}
                      {allergies.join(", ")}
                    </div>
                  )}
                  {r.allergyNotes && (
                    <div style={{ marginTop: 4 }}>
                      <strong>Notes:</strong> {r.allergyNotes}
                    </div>
                  )}
                  <div
                    className="mono"
                    style={{
                      fontSize: 11,
                      color: "var(--ink-soft)",
                      marginTop: 6,
                      opacity: 0.7,
                    }}
                  >
                    {r.seating} · spice: {r.spice} · occasion: {r.occasion}
                  </div>
                </div>
                <div
                  className="mono"
                  style={{
                    fontSize: 10,
                    color: "var(--ink-soft)",
                    opacity: 0.6,
                    textAlign: "right",
                    minWidth: 90,
                  }}
                >
                  booked
                  <br />
                  {new Date(r.createdAt).toLocaleDateString()}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </main>
  );
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div
      style={{
        background: "var(--cream)",
        border: "1px solid var(--rule)",
        borderRadius: 4,
        padding: "20px 22px",
      }}
    >
      <div
        className="mono"
        style={{
          fontSize: 10,
          letterSpacing: "0.25em",
          color: "var(--sun)",
          marginBottom: 14,
        }}
      >
        ◦ {title.toUpperCase()}
      </div>
      <div>{children}</div>
    </div>
  );
}

function Row({
  label,
  value,
  highlight = false,
}: {
  label: string;
  value: string | number;
  highlight?: boolean;
}) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        padding: "6px 0",
        fontSize: 14,
        color: highlight ? "var(--sun)" : "var(--ink)",
        borderBottom: "1px dashed var(--rule)",
      }}
    >
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

function Empty({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ fontSize: 13, color: "var(--ink-soft)", fontStyle: "italic" }}>
      {children}
    </div>
  );
}
