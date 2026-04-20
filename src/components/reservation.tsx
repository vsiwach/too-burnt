"use client";

import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog";
import { Leaf } from "@/components/icons";
import { DISHES, DISH_KEYS, emptyDishOrder, type DishKey } from "@/lib/menu";
import { normalizeInviteCode } from "@/lib/invite";

const ALLERGIES = [
  "Gluten",
  "Dairy",
  "Eggs",
  "Nuts (tree)",
  "Peanuts",
  "Soy",
  "Sesame",
  "Shellfish",
  "Fish",
  "Mustard",
] as const;
const SPICE = ["None at all", "Mild", "Medium", "Spicy", "Bring the heat"] as const;
const OCCASIONS = [
  "Just because",
  "Birthday",
  "Anniversary",
  "First date",
  "Family visit",
  "Celebration",
  "Other",
] as const;
const SEATING = ["Indoor (the shed)", "Outdoor (garden)", "No preference"] as const;
const TIMES = [
  "9:00",
  "9:30",
  "10:00",
  "10:30",
  "11:00",
  "11:30",
  "12:00",
  "12:30",
  "13:00",
] as const;

function upcomingSundays(count = 8, from = new Date()): { iso: string; label: string }[] {
  const d = new Date(from);
  d.setHours(0, 0, 0, 0);
  const day = d.getDay();
  // if today is Sunday keep today; otherwise jump to next Sunday
  const delta = day === 0 ? 0 : 7 - day;
  d.setDate(d.getDate() + delta);
  const out: { iso: string; label: string }[] = [];
  for (let i = 0; i < count; i++) {
    const iso = d.toISOString().slice(0, 10);
    const label = d.toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
    });
    out.push({ iso, label });
    d.setDate(d.getDate() + 7);
  }
  return out;
}

const dishesSchema = z.object(
  DISH_KEYS.reduce(
    (acc, k) => ({ ...acc, [k]: z.number().int().min(0).max(20) }),
    {} as Record<DishKey, z.ZodNumber>,
  ),
);

const schema = z.object({
  name: z.string().min(1, "Name required"),
  email: z.string().email("Valid email required"),
  phone: z.string().min(7, "Phone required"),
  party: z.number().min(1).max(8),
  date: z.string().min(1, "Pick a Sunday"),
  time: z.enum(TIMES),
  seating: z.enum(SEATING),
  dishes: dishesSchema,
  allergies: z.array(z.enum(ALLERGIES)),
  allergyNotes: z.string(),
  spice: z.enum(SPICE),
  occasion: z.enum(OCCASIONS),
  inviteCode: z.string(),
});

type FormValues = z.infer<typeof schema>;

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "14px 16px",
  fontSize: 15,
  background: "var(--cream)",
  border: "1px solid var(--rule)",
  borderRadius: 4,
  color: "var(--ink)",
  outline: "none",
};

const chipStyle = (active: boolean): React.CSSProperties => ({
  padding: "8px 14px",
  fontSize: 13,
  border: active ? "1px solid var(--sun)" : "1px solid var(--rule)",
  background: active ? "var(--sun)" : "transparent",
  color: active ? "#fff" : "var(--ink)",
  borderRadius: 999,
});

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div style={{ marginBottom: 20 }}>
      <div
        className="mono"
        style={{
          fontSize: 10,
          letterSpacing: "0.15em",
          color: "var(--ink-soft)",
          marginBottom: 8,
          textTransform: "uppercase",
        }}
      >
        {label}
      </div>
      {children}
      {error && (
        <div
          className="mono"
          style={{ fontSize: 11, color: "var(--sun)", marginTop: 6 }}
        >
          {error}
        </div>
      )}
    </div>
  );
}

export function ReservationModal({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [step, setStep] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Invite gate
  const [inviteVerified, setInviteVerified] = useState(false);
  const [inviteInput, setInviteInput] = useState("");
  const [inviteChecking, setInviteChecking] = useState(false);
  const [inviteError, setInviteError] = useState<string | null>(null);
  const [guestEmailSent, setGuestEmailSent] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    watch,
    trigger,
    reset,
    setValue,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      party: 2,
      date: "",
      time: "10:30",
      seating: "Indoor (the shed)",
      dishes: emptyDishOrder(),
      allergies: [],
      allergyNotes: "",
      spice: "Medium",
      occasion: "Just because",
      inviteCode: "",
    },
    mode: "onBlur",
  });

  const values = watch();

  const handleClose = (next: boolean) => {
    onOpenChange(next);
    if (!next) {
      setTimeout(() => {
        setStep(0);
        setSubmitted(false);
        setSubmitError(null);
        setInviteVerified(false);
        setInviteInput("");
        setInviteError(null);
        reset();
      }, 200);
    }
  };

  const verifyInvite = async (raw: string) => {
    const code = normalizeInviteCode(raw);
    if (!code) {
      setInviteError("Enter your invite code");
      return false;
    }
    setInviteChecking(true);
    setInviteError(null);
    try {
      const res = await fetch("/api/invites/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
      });
      const json = await res.json();
      if (!res.ok || !json.ok) {
        const map: Record<string, string> = {
          "not-found": "That code doesn't match any invite we've sent.",
          expired: "This invite has expired.",
          exhausted: "This invite has already been used.",
          missing: "Enter your invite code.",
        };
        setInviteError(map[json.error] ?? "Couldn't verify that code.");
        return false;
      }
      setValue("inviteCode", code, { shouldValidate: false });
      setInviteVerified(true);
      return true;
    } catch {
      setInviteError("Network error. Try again.");
      return false;
    } finally {
      setInviteChecking(false);
    }
  };

  // Auto-fill invite from ?invite=X when the modal opens.
  useEffect(() => {
    if (!open || inviteVerified || submitted) return;
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    const fromUrl = params.get("invite");
    if (fromUrl) {
      setInviteInput(fromUrl);
      void verifyInvite(fromUrl);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const steps = ["Who", "When", "What you eat", "Details"];

  const stepFields: Record<number, (keyof FormValues)[]> = {
    0: ["name", "email", "phone"],
    1: ["party", "date", "time", "seating"],
    2: ["dishes", "allergies", "allergyNotes", "spice"],
    3: ["occasion"],
  };

  const goNext = async () => {
    const valid = await trigger(stepFields[step]);
    if (valid) setStep((s) => s + 1);
  };

  const onSubmit = async (data: FormValues) => {
    setSubmitting(true);
    setSubmitError(null);
    // Safety net: if invite code somehow got wiped mid-flow, bounce back to the gate.
    if (!data.inviteCode || data.inviteCode.trim().length < 3) {
      setSubmitting(false);
      setInviteVerified(false);
      setInviteError(
        "Invite code missing. Paste it again to continue.",
      );
      return;
    }
    try {
      const res = await fetch("/api/reservations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        if (json?.error === "invite-invalid") {
          setSubmitError(
            "This invite is no longer valid. It may have been used or revoked.",
          );
        } else {
          setSubmitError(
            "Something went wrong. Try again, or email hello@tooburnt.com.",
          );
        }
        return;
      }
      setGuestEmailSent(Boolean(json?.guestEmailSent));
      setSubmitted(true);
    } catch {
      setSubmitError("Something went wrong. Try again, or email hello@tooburnt.com.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent>
        <DialogTitle>Reserve a seat</DialogTitle>
        <DialogDescription>
          Reservation form for Too Burnt Sunday brunch
        </DialogDescription>
        <DialogClose
          aria-label="Close"
          style={{
            position: "absolute",
            top: 20,
            right: 20,
            width: 32,
            height: 32,
            borderRadius: "50%",
            border: "1px solid var(--rule)",
            fontSize: 16,
            background: "transparent",
          }}
        >
          ×
        </DialogClose>

        {!submitted && !inviteVerified ? (
          <div style={{ padding: "40px 4px 20px" }}>
            <div
              className="mono"
              style={{
                fontSize: 11,
                letterSpacing: "0.25em",
                color: "var(--sun)",
              }}
            >
              ◦ SOFT LAUNCH
            </div>
            <h2
              className="serif"
              style={{
                fontSize: 42,
                fontWeight: 300,
                letterSpacing: "-0.02em",
                margin: "8px 0 12px",
              }}
            >
              <span style={{ fontStyle: "italic", color: "var(--moss)" }}>
                Friends
              </span>{" "}
              only, for now.
            </h2>
            <p
              style={{
                fontSize: 15,
                color: "var(--ink-soft)",
                marginBottom: 32,
                lineHeight: 1.6,
              }}
            >
              The shed&apos;s still new, so we&apos;re serving invitees only while we find
              our rhythm. Enter your code to book a seat.
            </p>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                void verifyInvite(inviteInput);
              }}
            >
              <Field label="Invite code" error={inviteError ?? undefined}>
                <input
                  autoFocus
                  value={inviteInput}
                  onChange={(e) => {
                    setInviteInput(e.target.value);
                    setInviteError(null);
                  }}
                  placeholder="XXXX-XXXX"
                  autoComplete="off"
                  spellCheck={false}
                  style={{
                    ...inputStyle,
                    fontFamily: "var(--font-jetbrains), monospace",
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                  }}
                />
              </Field>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginTop: 32,
                  alignItems: "center",
                }}
              >
                <button
                  type="button"
                  onClick={() => handleClose(false)}
                  style={{
                    padding: "14px 20px",
                    fontSize: 14,
                    color: "var(--ink-soft)",
                  }}
                >
                  ← Cancel
                </button>
                <button
                  type="submit"
                  disabled={inviteChecking}
                  className="cta-hover"
                  style={{
                    padding: "14px 28px",
                    fontSize: 14,
                    fontWeight: 500,
                    background: "var(--moss)",
                    color: "var(--cream)",
                    borderRadius: 999,
                    opacity: inviteChecking ? 0.6 : 1,
                  }}
                >
                  {inviteChecking ? "Checking…" : "Continue →"}
                </button>
              </div>
              <p
                style={{
                  marginTop: 24,
                  fontSize: 13,
                  color: "var(--ink-soft)",
                  opacity: 0.7,
                  fontStyle: "italic",
                }}
              >
                Don&apos;t have a code? We&apos;ll open to everyone once we&apos;re ready —
                for now, ask Sophia or Vikram.
              </p>
            </form>
          </div>
        ) : submitted ? (
          <div style={{ textAlign: "center", padding: "40px 20px" }}>
            <Leaf
              size={64}
              color="var(--moss)"
              style={{ margin: "0 auto 24px", display: "block" }}
            />
            <h2
              className="serif"
              style={{
                fontSize: 48,
                fontWeight: 300,
                letterSpacing: "-0.02em",
                margin: "0 0 16px",
              }}
            >
              See you Sunday.
            </h2>
            <p
              className="serif"
              style={{
                fontSize: 18,
                fontStyle: "italic",
                color: "var(--ink-soft)",
                maxWidth: 420,
                margin: "0 auto 32px",
              }}
            >
              {guestEmailSent ? (
                <>
                  We sent a confirmation to{" "}
                  <strong style={{ fontStyle: "normal", color: "var(--ink)" }}>
                    {values.email}
                  </strong>
                  . Vikram will reach out if anything on the allergy list needs a substitute.
                </>
              ) : (
                <>
                  Your seat is saved. Sophia will text{" "}
                  <strong style={{ fontStyle: "normal", color: "var(--ink)" }}>
                    {values.phone}
                  </strong>{" "}
                  to confirm, and Vikram will reach out if anything on the allergy list needs a
                  substitute.
                </>
              )}
            </p>
            <div className="script" style={{ fontSize: 32, color: "var(--sun)" }}>
              — Sophia
            </div>
            <button
              onClick={() => handleClose(false)}
              style={{
                marginTop: 40,
                padding: "12px 24px",
                border: "1px solid var(--ink)",
                borderRadius: 999,
                fontSize: 14,
              }}
            >
              Close
            </button>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit(onSubmit, (errs) => {
              const first = Object.values(errs)[0];
              const msg =
                (first && typeof first === "object" && "message" in first
                  ? (first as { message?: string }).message
                  : undefined) ?? "Please fill in all required fields.";
              setSubmitError(msg);
            })}
          >
            {/* invite code carried from the gate */}
            <input type="hidden" {...register("inviteCode")} />

            <div style={{ display: "flex", gap: 8, marginBottom: 40 }}>
              {steps.map((s, i) => (
                <div key={s} style={{ flex: 1 }}>
                  <div
                    style={{
                      height: 3,
                      background: i <= step ? "var(--sun)" : "var(--rule)",
                      borderRadius: 2,
                      transition: "background 0.3s",
                    }}
                  />
                  <div
                    className="mono"
                    style={{
                      fontSize: 10,
                      marginTop: 8,
                      letterSpacing: "0.15em",
                      color: i === step ? "var(--ink)" : "var(--ink-soft)",
                      opacity: i === step ? 1 : 0.5,
                    }}
                  >
                    0{i + 1} · {s.toUpperCase()}
                  </div>
                </div>
              ))}
            </div>

            {step === 0 && (
              <div>
                <h2
                  className="serif"
                  style={{
                    fontSize: 42,
                    fontWeight: 300,
                    letterSpacing: "-0.02em",
                    margin: "0 0 8px",
                  }}
                >
                  Let&apos;s start with{" "}
                  <span style={{ fontStyle: "italic", color: "var(--moss)" }}>you</span>.
                </h2>
                <p
                  style={{
                    fontSize: 15,
                    color: "var(--ink-soft)",
                    marginBottom: 32,
                  }}
                >
                  Just so we can find you Sunday morning.
                </p>
                <Field label="Your name" error={errors.name?.message}>
                  <input {...register("name")} placeholder="Sophia Rao" style={inputStyle} />
                </Field>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
                  <Field label="Email" error={errors.email?.message}>
                    <input
                      type="email"
                      {...register("email")}
                      placeholder="you@email.com"
                      style={inputStyle}
                    />
                  </Field>
                  <Field label="Phone" error={errors.phone?.message}>
                    <input
                      {...register("phone")}
                      placeholder="(978) 555-0142"
                      style={inputStyle}
                    />
                  </Field>
                </div>
              </div>
            )}

            {step === 1 && (
              <div>
                <h2
                  className="serif"
                  style={{
                    fontSize: 42,
                    fontWeight: 300,
                    letterSpacing: "-0.02em",
                    margin: "0 0 8px",
                  }}
                >
                  When are you{" "}
                  <span style={{ fontStyle: "italic", color: "var(--moss)" }}>coming</span>?
                </h2>
                <p style={{ fontSize: 15, color: "var(--ink-soft)", marginBottom: 32 }}>
                  We only do Sundays, 9am to 2pm. One seating per table.
                </p>
                <Controller
                  control={control}
                  name="party"
                  render={({ field }) => (
                    <Field
                      label={`Party size · ${field.value} ${
                        field.value === 1 ? "seat" : "seats"
                      }`}
                    >
                      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                        {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
                          <button
                            type="button"
                            key={n}
                            onClick={() => field.onChange(n)}
                            style={{
                              width: 48,
                              height: 48,
                              borderRadius: "50%",
                              border:
                                field.value === n
                                  ? "2px solid var(--sun)"
                                  : "1px solid var(--rule)",
                              background:
                                field.value === n ? "var(--sun)" : "transparent",
                              color: field.value === n ? "#fff" : "var(--ink)",
                              fontSize: 15,
                              fontWeight: 500,
                            }}
                          >
                            {n}
                          </button>
                        ))}
                      </div>
                    </Field>
                  )}
                />
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
                  <Field label="Which Sunday" error={errors.date?.message}>
                    <select {...register("date")} style={inputStyle}>
                      <option value="">Pick a Sunday…</option>
                      {upcomingSundays(8).map((s) => (
                        <option key={s.iso} value={s.iso}>
                          {s.label}
                        </option>
                      ))}
                    </select>
                  </Field>
                  <Field label="Arrival time">
                    <select {...register("time")} style={inputStyle}>
                      {TIMES.map((t) => (
                        <option key={t} value={t}>
                          {t}
                        </option>
                      ))}
                    </select>
                  </Field>
                </div>
                <Controller
                  control={control}
                  name="seating"
                  render={({ field }) => (
                    <Field label="Seating preference">
                      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                        {SEATING.map((s) => (
                          <button
                            type="button"
                            key={s}
                            onClick={() => field.onChange(s)}
                            style={chipStyle(field.value === s)}
                          >
                            {s}
                          </button>
                        ))}
                      </div>
                    </Field>
                  )}
                />
              </div>
            )}

            {step === 2 && (
              <div>
                <h2
                  className="serif"
                  style={{
                    fontSize: 42,
                    fontWeight: 300,
                    letterSpacing: "-0.02em",
                    margin: "0 0 8px",
                  }}
                >
                  What do you want to{" "}
                  <span style={{ fontStyle: "italic", color: "var(--moss)" }}>eat</span>?
                </h2>
                <p style={{ fontSize: 15, color: "var(--ink-soft)", marginBottom: 24 }}>
                  Pre-ordering helps Vikram shop Saturday — menu may adjust slightly, but this
                  gets us close.
                </p>
                <Controller
                  control={control}
                  name="dishes"
                  render={({ field }) => (
                    <div style={{ marginBottom: 32 }}>
                      {DISHES.map((dish) => {
                        const count = field.value[dish.key];
                        const setCount = (n: number) =>
                          field.onChange({ ...field.value, [dish.key]: Math.max(0, Math.min(20, n)) });
                        return (
                          <div
                            key={dish.key}
                            style={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "space-between",
                              padding: "10px 0",
                              borderBottom: "1px dashed var(--rule)",
                              gap: 16,
                            }}
                          >
                            <div style={{ flex: 1, minWidth: 0 }}>
                              <div
                                className="serif"
                                style={{ fontSize: 15, color: "var(--ink)" }}
                              >
                                {dish.name}
                              </div>
                              <div
                                className="mono"
                                style={{
                                  fontSize: 11,
                                  color: "var(--ink-soft)",
                                  opacity: 0.7,
                                }}
                              >
                                ${dish.price}
                              </div>
                            </div>
                            <div
                              style={{ display: "flex", alignItems: "center", gap: 8 }}
                            >
                              <button
                                type="button"
                                onClick={() => setCount(count - 1)}
                                disabled={count === 0}
                                aria-label={`decrease ${dish.name}`}
                                style={{
                                  width: 28,
                                  height: 28,
                                  borderRadius: "50%",
                                  border: "1px solid var(--rule)",
                                  fontSize: 14,
                                  opacity: count === 0 ? 0.3 : 1,
                                }}
                              >
                                −
                              </button>
                              <div
                                className="mono"
                                style={{
                                  minWidth: 24,
                                  textAlign: "center",
                                  fontSize: 14,
                                  color: count > 0 ? "var(--sun)" : "var(--ink-soft)",
                                  fontWeight: 600,
                                }}
                              >
                                {count}
                              </div>
                              <button
                                type="button"
                                onClick={() => setCount(count + 1)}
                                aria-label={`increase ${dish.name}`}
                                style={{
                                  width: 28,
                                  height: 28,
                                  borderRadius: "50%",
                                  border: "1px solid var(--rule)",
                                  fontSize: 14,
                                }}
                              >
                                +
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                />

                <h3
                  className="serif"
                  style={{
                    fontSize: 22,
                    fontWeight: 400,
                    fontStyle: "italic",
                    color: "var(--moss)",
                    margin: "8px 0 16px",
                  }}
                >
                  Any allergies?
                </h3>
                <p style={{ fontSize: 14, color: "var(--ink-soft)", marginBottom: 24 }}>
                  Vikram cooks around allergies, not with them. Be honest — he&apos;d rather
                  remake a plate than guess.
                </p>
                <Controller
                  control={control}
                  name="allergies"
                  render={({ field }) => (
                    <Field
                      label={`Food allergies${
                        field.value.length ? ` · ${field.value.length} selected` : ""
                      }`}
                    >
                      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                        {ALLERGIES.map((a) => {
                          const active = field.value.includes(a);
                          return (
                            <button
                              type="button"
                              key={a}
                              onClick={() =>
                                field.onChange(
                                  active
                                    ? field.value.filter((x) => x !== a)
                                    : [...field.value, a],
                                )
                              }
                              style={chipStyle(active)}
                            >
                              {active && "✓ "}
                              {a}
                            </button>
                          );
                        })}
                      </div>
                    </Field>
                  )}
                />
                <Field label="Anything else? (intolerances, religious, strong dislikes)">
                  <textarea
                    {...register("allergyNotes")}
                    rows={2}
                    placeholder="e.g. avoiding onion & garlic during Navratri"
                    style={{ ...inputStyle, resize: "vertical", minHeight: 64 }}
                  />
                </Field>
                <Controller
                  control={control}
                  name="spice"
                  render={({ field }) => (
                    <Field label="Spice tolerance">
                      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                        {SPICE.map((s, i) => (
                          <button
                            type="button"
                            key={s}
                            onClick={() => field.onChange(s)}
                            style={{
                              ...chipStyle(field.value === s),
                              display: "flex",
                              alignItems: "center",
                              gap: 6,
                            }}
                          >
                            <span style={{ opacity: 0.8 }}>
                              {"🌶".repeat(Math.max(1, i))}
                            </span>
                            {s}
                          </button>
                        ))}
                      </div>
                    </Field>
                  )}
                />
              </div>
            )}

            {step === 3 && (
              <div>
                <h2
                  className="serif"
                  style={{
                    fontSize: 42,
                    fontWeight: 300,
                    letterSpacing: "-0.02em",
                    margin: "0 0 8px",
                  }}
                >
                  One last{" "}
                  <span style={{ fontStyle: "italic", color: "var(--moss)" }}>thing</span>.
                </h2>
                <p style={{ fontSize: 15, color: "var(--ink-soft)", marginBottom: 32 }}>
                  If you&apos;re marking something, tell us — we&apos;ll set an extra sprig of
                  mint at the table.
                </p>
                <Controller
                  control={control}
                  name="occasion"
                  render={({ field }) => (
                    <Field label="Special occasion?">
                      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                        {OCCASIONS.map((o) => (
                          <button
                            type="button"
                            key={o}
                            onClick={() => field.onChange(o)}
                            style={chipStyle(field.value === o)}
                          >
                            {o}
                          </button>
                        ))}
                      </div>
                    </Field>
                  )}
                />

                <div
                  style={{
                    marginTop: 32,
                    padding: "24px 28px",
                    background: "var(--cream-2)",
                    border: "1px solid var(--rule)",
                    borderRadius: 4,
                  }}
                >
                  <div
                    className="mono"
                    style={{
                      fontSize: 10,
                      letterSpacing: "0.2em",
                      color: "var(--sun)",
                      marginBottom: 12,
                    }}
                  >
                    ◦ YOUR RESERVATION
                  </div>
                  <div className="serif" style={{ fontSize: 20, marginBottom: 4 }}>
                    {values.name || "Your name"} · party of {values.party}
                  </div>
                  <div style={{ fontSize: 14, color: "var(--ink-soft)" }}>
                    {values.date || "Sunday, TBD"} at {values.time} · {values.seating}
                  </div>
                  {(values.allergies?.length ?? 0) > 0 && (
                    <div
                      style={{
                        fontSize: 13,
                        color: "var(--ink-soft)",
                        marginTop: 8,
                      }}
                    >
                      <strong style={{ color: "var(--sun)" }}>Allergies:</strong>{" "}
                      {values.allergies?.join(", ")}
                    </div>
                  )}
                  {(() => {
                    const dishes = values.dishes ?? emptyDishOrder();
                    const orderedLines = DISHES.filter((d) => (dishes[d.key] ?? 0) > 0).map(
                      (d) => `${dishes[d.key]}× ${d.name}`,
                    );
                    const total = DISHES.reduce(
                      (s, d) => s + (dishes[d.key] ?? 0) * d.price,
                      0,
                    );
                    if (!orderedLines.length) return null;
                    return (
                      <div
                        style={{
                          fontSize: 13,
                          color: "var(--ink-soft)",
                          marginTop: 8,
                        }}
                      >
                        <strong style={{ color: "var(--sun)" }}>Pre-order:</strong>{" "}
                        {orderedLines.join(" · ")}{" "}
                        <span style={{ opacity: 0.7 }}>(≈ ${total})</span>
                      </div>
                    );
                  })()}
                </div>

                {submitError && (
                  <div
                    style={{
                      marginTop: 20,
                      padding: "12px 16px",
                      background: "rgba(232,118,58,0.12)",
                      border: "1px solid var(--sun)",
                      borderRadius: 4,
                      fontSize: 14,
                      color: "var(--ink)",
                    }}
                  >
                    {submitError}
                  </div>
                )}
              </div>
            )}

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginTop: 40,
              }}
            >
              <button
                type="button"
                onClick={() => (step === 0 ? handleClose(false) : setStep((s) => s - 1))}
                style={{
                  padding: "14px 20px",
                  fontSize: 14,
                  color: "var(--ink-soft)",
                }}
              >
                ← {step === 0 ? "Cancel" : "Back"}
              </button>
              {step < 3 ? (
                <button
                  type="button"
                  onClick={goNext}
                  className="cta-hover"
                  style={{
                    padding: "14px 28px",
                    fontSize: 14,
                    fontWeight: 500,
                    background: "var(--moss)",
                    color: "var(--cream)",
                    borderRadius: 999,
                  }}
                >
                  Continue →
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={submitting}
                  className="cta-hover"
                  style={{
                    padding: "14px 28px",
                    fontSize: 14,
                    fontWeight: 500,
                    background: "var(--sun)",
                    color: "#fff",
                    borderRadius: 999,
                    opacity: submitting ? 0.6 : 1,
                  }}
                >
                  {submitting ? "Booking…" : "Book my seat →"}
                </button>
              )}
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
