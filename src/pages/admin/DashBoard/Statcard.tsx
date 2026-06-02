import type { ReactNode } from "react";
import { COLOR, RADIUS, SHADOW } from "./theme";

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
  const trendColor = isNegative ? COLOR.danger : COLOR.success;
  const trendBg    = isNegative ? "#fff1f2" : "#f0fdf4";
  const trendArrow = isNegative ? "↓" : "↑";
  const iconBg = `${accentColor}18`;

  return (
    <div
      style={{
        background: COLOR.bgCard,
        borderRadius: RADIUS.xl,
        padding: "18px 20px",
        height: "100%",
        border: `1px solid ${COLOR.border}`,
        boxShadow: SHADOW.card,
        transition: "box-shadow 0.2s ease, transform 0.2s ease",
        display: "flex",
        flexDirection: "column",
        gap: 14,
        cursor: "default",
      }}
      onMouseEnter={e => {
        const el = e.currentTarget as HTMLElement;
        el.style.boxShadow = SHADOW.hover;
        el.style.transform  = "translateY(-2px)";
      }}
      onMouseLeave={e => {
        const el = e.currentTarget as HTMLElement;
        el.style.boxShadow = SHADOW.card;
        el.style.transform  = "translateY(0)";
      }}
    >
      {/* Row 1: Icon bubble + trend badge */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div
          style={{
            width: 40,
            height: 40,
            borderRadius: RADIUS.lg,
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
              borderRadius: RADIUS.pill,
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
            color: COLOR.textDark,
            lineHeight: 1,
            letterSpacing: "-0.5px",
          }}
        >
          {value}
        </div>
        <div style={{ fontSize: 12, color: COLOR.textMuted, fontWeight: 600, lineHeight: 1.4 }}>
          {label}
        </div>
      </div>

      {/* Row 3: Sub-text */}
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <div
          style={{
            width: 3,
            height: 14,
            borderRadius: RADIUS.pill,
            background: accentColor,
            flexShrink: 0,
            opacity: 0.7,
          }}
        />
        <span style={{ fontSize: 11, color: COLOR.textFaint, lineHeight: 1.4 }}>{sub}</span>
      </div>
    </div>
  );
}
