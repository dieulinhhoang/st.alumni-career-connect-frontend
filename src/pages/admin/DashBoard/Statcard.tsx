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

export function StatCard({ label, value, sub, accentColor, trend }: Props) {
  const isNegative = trend?.startsWith("-");
  const trendColor = isNegative ? "#dc2626" : "#059669";
  const trendArrow = isNegative ? "↓" : "↑";

  return (
    <div
      style={{
        background: "#fff",
        borderRadius: 12,
        padding: "16px 18px",
        height: "100%",
        border: "1px solid #e2e8f0",
        borderLeft: `4px solid ${accentColor}`,
        transition: "box-shadow 0.2s",
      }}
      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.boxShadow = "0 4px 16px rgba(0,0,0,0.08)"; }}
      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.boxShadow = "none"; }}
    >
      {/* Label + trend */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
        <span style={{ fontSize: 12, color: "#64748b", fontWeight: 500 }}>{label}</span>
        {trend && (
          <span style={{
            display: "inline-flex", alignItems: "center", gap: 3,
            fontSize: 11, fontWeight: 600, color: trendColor,
            background: `${trendColor}12`, border: `1px solid ${trendColor}25`,
            padding: "2px 7px", borderRadius: 99,
          }}>
            {trendArrow} {trend}
          </span>
        )}
      </div>

      {/* Value */}
      <div style={{ fontSize: 28, fontWeight: 700, color: "#0f172a", lineHeight: 1, marginBottom: 6, letterSpacing: "-0.5px" }}>
        {value}
      </div>

      {/* Sub */}
      <div style={{ fontSize: 11, color: "#94a3b8" }}>{sub}</div>
    </div>
  );
}