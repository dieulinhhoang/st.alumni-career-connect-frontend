import type { ReactNode } from "react";

interface Props {
  index: number;
  label: string;
  value: string;
  sub: string;
  icon: ReactNode;
  accentColor: string;
  trend?: string;
}

export function StatCard({ label, value, sub, icon, accentColor, trend }: Props) {
  const isNegative = trend?.startsWith("-");
  const trendColor = isNegative ? "#e11d48" : "#059669";
  const trendBg    = isNegative ? "#fff1f2" : "#f0fdf4";
  const trendArrow = isNegative ? "↓" : "↑";

  // Derive a very light tint from accent for the icon bubble
  const iconBg = `${accentColor}18`;

  return (
    <div
      style={{
        background: "#ffffff",
        borderRadius: 16,
        padding: "18px 20px",
        height: "100%",
        border: "1px solid rgba(0,0,0,0.07)",
        boxShadow: "0 1px 4px rgba(0,0,0,0.05), 0 4px 16px rgba(0,0,0,0.04)",
        transition: "box-shadow 0.2s ease, transform 0.2s ease",
        display: "flex",
        flexDirection: "column",
        gap: 14,
        cursor: "default",
      }}
      onMouseEnter={e => {
        const el = e.currentTarget as HTMLElement;
        el.style.boxShadow = "0 4px 12px rgba(0,0,0,0.08), 0 12px 32px rgba(0,0,0,0.08)";
        el.style.transform  = "translateY(-2px)";
      }}
      onMouseLeave={e => {
        const el = e.currentTarget as HTMLElement;
        el.style.boxShadow = "0 1px 4px rgba(0,0,0,0.05), 0 4px 16px rgba(0,0,0,0.04)";
        el.style.transform  = "translateY(0)";
      }}
    >
      {/* Row 1: Icon bubble + trend badge */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div
          style={{
            width: 40,
            height: 40,
            borderRadius: 12,
            background: iconBg,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 18,
            color: accentColor,
          }}
        >
          {icon}
        </div>

        {trend && (
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 3,
              fontSize: 11,
              fontWeight: 600,
              color: trendColor,
              background: trendBg,
              padding: "3px 8px",
              borderRadius: 99,
              letterSpacing: "0.2px",
            }}
          >
            {trendArrow} {trend}
          </span>
        )}
      </div>

      {/* Row 2: Value + Label */}
      <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
        <div
          style={{
            fontSize: 30,
            fontWeight: 700,
            color: "#0f172a",
            lineHeight: 1,
            letterSpacing: "-0.5px",
          }}
        >
          {value}
        </div>
        <div style={{ fontSize: 13, fontWeight: 600, color: "#374151" }}>{label}</div>
      </div>

      {/* Row 3: Sub-text + thin accent line */}
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <div
          style={{
            width: 3,
            height: 14,
            borderRadius: 99,
            background: accentColor,
            flexShrink: 0,
            opacity: 0.7,
          }}
        />
        <span style={{ fontSize: 11, color: "#94a3b8", lineHeight: 1.4 }}>{sub}</span>
      </div>
    </div>
  );
}
