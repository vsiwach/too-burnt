import type { CSSProperties, ReactNode } from "react";

type IconProps = {
  size?: number;
  color?: string;
  style?: CSSProperties;
  className?: string;
};

export const Leaf = ({ size = 24, color = "currentColor", style, className }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 40 40" fill="none" style={style} className={className}>
    <path d="M8 32C8 18 18 8 32 8C32 22 22 32 8 32Z" stroke={color} strokeWidth="1.4" strokeLinejoin="round" />
    <path d="M8 32L28 12" stroke={color} strokeWidth="1.4" strokeLinecap="round" />
    <path d="M14 26L22 18M18 30L26 22M10 22L14 18" stroke={color} strokeWidth="1" strokeLinecap="round" />
  </svg>
);

export const Sprig = ({ size = 32, color = "currentColor", style, className }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 60 60" fill="none" style={style} className={className}>
    <path d="M30 8C30 28 30 52 30 52" stroke={color} strokeWidth="1.2" strokeLinecap="round" />
    <path d="M30 16C26 14 22 14 18 16C22 20 26 22 30 20Z" stroke={color} strokeWidth="1.2" strokeLinejoin="round" />
    <path d="M30 24C34 22 38 22 42 24C38 28 34 30 30 28Z" stroke={color} strokeWidth="1.2" strokeLinejoin="round" />
    <path d="M30 32C26 30 22 30 18 32C22 36 26 38 30 36Z" stroke={color} strokeWidth="1.2" strokeLinejoin="round" />
    <path d="M30 40C34 38 38 38 42 40C38 44 34 46 30 44Z" stroke={color} strokeWidth="1.2" strokeLinejoin="round" />
  </svg>
);

export const Sun = ({ size = 40, color = "currentColor", style, className }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 60 60" fill="none" style={style} className={className}>
    <circle cx="30" cy="30" r="10" stroke={color} strokeWidth="1.4" />
    {[0, 45, 90, 135, 180, 225, 270, 315].map((a) => (
      <line
        key={a}
        x1="30"
        y1="30"
        x2={30 + Math.cos((a * Math.PI) / 180) * 24}
        y2={30 + Math.sin((a * Math.PI) / 180) * 24}
        stroke={color}
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeDasharray="1 4"
        opacity="0.6"
      />
    ))}
  </svg>
);

export const WaveRule = ({ color = "currentColor", style }: Omit<IconProps, "size">) => (
  <svg width="100%" height="12" viewBox="0 0 400 12" preserveAspectRatio="none" style={style}>
    <path
      d="M0 6 Q 20 0, 40 6 T 80 6 T 120 6 T 160 6 T 200 6 T 240 6 T 280 6 T 320 6 T 360 6 T 400 6"
      stroke={color}
      strokeWidth="1"
      fill="none"
      opacity="0.5"
    />
  </svg>
);

type PlaceholderTone = "leaf" | "moss" | "sun" | "cream";
type PlaceholderProps = {
  label?: string;
  aspect?: string;
  tone?: PlaceholderTone;
  style?: CSSProperties;
  className?: string;
  src?: string;
  objectPosition?: string;
};

export const Placeholder = ({
  label = "photo",
  aspect = "4/3",
  tone = "leaf",
  style,
  className,
  src,
  objectPosition,
}: PlaceholderProps) => {
  const colors: Record<PlaceholderTone, [string, string]> = {
    leaf: ["#6b8e4e", "#a8c285"],
    moss: ["#2d4a2b", "#6b8e4e"],
    sun: ["#e8763a", "#f1a978"],
    cream: ["#d6cdb6", "#ebe4d1"],
  };
  const [c1, c2] = colors[tone];

  const containerStyle: CSSProperties = {
    position: "relative",
    aspectRatio: aspect === "auto" ? undefined : aspect,
    width: "100%",
    border: `1px solid ${c1}44`,
    borderRadius: 2,
    overflow: "hidden",
    ...style,
  };

  if (src) {
    return (
      <div className={className} style={containerStyle}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src}
          alt={label}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition: objectPosition ?? "center",
            display: "block",
          }}
        />
      </div>
    );
  }

  return (
    <div
      className={className}
      style={{
        ...containerStyle,
        background: `repeating-linear-gradient(135deg, ${c1}22 0 12px, ${c2}22 12px 24px)`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: c1,
      }}
    >
      <span
        className="mono"
        style={{
          fontSize: 11,
          opacity: 0.75,
          textTransform: "lowercase",
          letterSpacing: "0.08em",
        }}
      >
        — {label} —
      </span>
    </div>
  );
};

export const Circled = ({
  children,
  color = "var(--sun)",
}: {
  children: ReactNode;
  color?: string;
}) => (
  <span style={{ position: "relative", display: "inline-block", padding: "0 4px" }}>
    {children}
    <svg
      style={{
        position: "absolute",
        inset: "-8px -6px",
        width: "calc(100% + 12px)",
        height: "calc(100% + 16px)",
        pointerEvents: "none",
      }}
      viewBox="0 0 100 40"
      preserveAspectRatio="none"
    >
      <path
        d="M 8 20 Q 4 4, 50 6 Q 96 8, 94 22 Q 92 36, 50 34 Q 8 32, 10 18"
        stroke={color}
        strokeWidth="1.6"
        fill="none"
        strokeLinecap="round"
        opacity="0.9"
      />
    </svg>
  </span>
);
