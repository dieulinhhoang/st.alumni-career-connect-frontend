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
  const trendColor = isNegative ? "#dc2626" : "#059669";
  const trendArrow = isNegative ? "↓" : "↑";

  // Tạo màu nền nhạt từ accentColor (dùng opacity)
  const iconBg = `${accentColor}18`;

  return (
    <div
      style={{
        background: "#ffffff",
        borderRadius: 12,
        border: "1px solid rgba(30, 41, 59, 0.10)",
        boxShadow: "0 1px 3px rgba(30,41,59,0.07), 0 1px 2px rgba(30,41,59,0.04)",
        padding: "20px 22px",
        display: "flex",
        alignItems: "flex-start",
        gap: 16,
        height: "100%",
        transition: "box-shadow 160ms cubic-bezier(0.16,1,0.3,1), transform 160ms cubic-bezier(0.16,1,0.3,1)",
      }}
      onMouseEnter={e => {
        (e.currentTarget as HTMLElement).style.boxShadow = "0 4px 16px rgba(30,41,59,0.09), 0 1px 4px rgba(30,41,59,0.05)";
        (e.currentTarget as HTMLElement).style.transform = "translateY(-1px)";
      }}
      onMouseLeave={e => {
        (e.currentTarget as HTMLElement).style.boxShadow = "0 1px 3px rgba(30,41,59,0.07), 0 1px 2px rgba(30,41,59,0.04)";
        (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
      }}
    >
      {/* Icon */}
      <div style={{
        width: 44,
        height: 44,
        borderRadius: 10,
        background: iconBg,
        color: accentColor,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
        fontSize: 18,
      }}>
        {icon}
      </div>

      {/* Body */}
      <div style={{ flex: 1, minWidth: 0 }}>
        {/* Label + trend */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 4 }}>
          <span style={{ fontSize: 12, color: "#94a3b8", fontWeight: 500, letterSpacing: "0.02em", lineHeight: 1 }}>
            {label}
          </span>
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
        <div style={{
          fontSize: 28,
          fontWeight: 700,
          color: "#1e293b",
          lineHeight: 1.1,
          letterSpacing: "-0.02em",
          fontVariantNumeric: "tabular-nums",
          marginBottom: 4,
        }}>
          {value}
        </div>

        {/* Sub */}
        <div style={{ fontSize: 12, color: "#94a3b8", marginTop: 0 }}>{sub}</div>
      </div>
    </div>
  );
}
