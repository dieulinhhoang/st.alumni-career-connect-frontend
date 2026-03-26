import { ArrowUpOutlined } from "@ant-design/icons";

interface Props {
  index: number;
  label: string;
  value: string;
  sub: string;
  icon: React.ReactNode;
  accentColor: string;
  trend?: string;
}

export function StatCard({ label, value, sub, icon, accentColor, trend }: Props) {
  return (
    <div
      style={{
        background: `linear-gradient(145deg, ${accentColor}12 0%, ${accentColor}06 100%)`,
        borderRadius: 16,
        padding: "14px 18px 12px",
        height: "100%",
        boxShadow: `0 2px 12px ${accentColor}18`,
        border: `1px solid ${accentColor}25`,
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Decorative circles */}
      <div style={{ position: "absolute", top: -15, right: -15, width: 70, height: 70, borderRadius: "50%", background: `${accentColor}12` }} />
      <div style={{ position: "absolute", bottom: -20, right: 15, width: 55, height: 55, borderRadius: "50%", background: `${accentColor}08` }} />

      {/* Top row */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
        <div style={{
          width: 34, height: 34, borderRadius: 10,
          background: `${accentColor}18`,
          display: "flex", alignItems: "center", justifyContent: "center",
          color: accentColor, fontSize: 15,
        }}>
          {icon}
        </div>
        {trend && (
          <div style={{
            display: "flex", alignItems: "center", gap: 4,
            fontSize: 11, fontWeight: 700, color: accentColor,
            background: `${accentColor}15`, padding: "3px 8px", borderRadius: 100,
          }}>
            <ArrowUpOutlined style={{ fontSize: 9 }} />
            {trend}
          </div>
        )}
      </div>

      {/* Value */}
      <div style={{ fontSize: 26, fontWeight: 800, color: "#0f172a", lineHeight: 1, marginBottom: 4, fontVariantNumeric: "tabular-nums" }}>
        {value}
      </div>
      <div style={{ fontSize: 12, fontWeight: 600, color: "#475569", marginBottom: 2 }}>{label}</div>
      <div style={{ fontSize: 11, color: "#94a3b8" }}>{sub}</div>
    </div>
  );
}