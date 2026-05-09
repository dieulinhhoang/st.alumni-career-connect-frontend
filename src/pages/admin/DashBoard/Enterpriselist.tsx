import { useNavigate } from "react-router-dom";
import { ENTERPRISE_LIST } from "../../../feature/dashboard/api";
import { toSlug } from "../../../components/common/utils";

const ACCENT_COLORS = [
  "#6366f1", "#0ea5e9", "#10b981", "#f59e0b",
  "#ef4444", "#8b5cf6", "#ec4899", "#14b8a6",
];

export function EnterpriseList() {
  const navigate = useNavigate();

  return (
    <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #e2e8f0", overflow: "hidden" }}>
      {/* Header */}
      <div style={{ padding: "18px 20px 16px", borderBottom: "1px solid #e2e8f0", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ width: 4, height: 22, borderRadius: 99, background: "#6366f1", flexShrink: 0 }} />
          <span style={{ fontSize: 18, fontWeight: 700, color: "#0f172a" }}>Doanh nghiệp đối tác</span>
        </div>
        <button
          onClick={() => navigate("/admin/enterprises")}
          style={{ background: "none", border: "none", cursor: "pointer", fontSize: 14, color: "#6366f1", fontWeight: 600, padding: 0 }}
        >
          Xem tất cả →
        </button>
      </div>

      {/* Grid KPI cards */}
      <div style={{ padding: 16, display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 12 }}>
        {ENTERPRISE_LIST.map((e, i) => {
          const accentColor = ACCENT_COLORS[i % ACCENT_COLORS.length];
          const iconBg = `${accentColor}18`;
          const initials = e.name.split(" ").slice(0, 2).map((w: string) => w[0]).join("").toUpperCase();
          return (
            <div
              key={e.name}
              onClick={() => navigate(`/admin/enterprises/${toSlug(e.name)}`)}
              style={{
                background: "#ffffff",
                borderRadius: 12,
                border: "1px solid rgba(30,41,59,0.10)",
                boxShadow: "0 1px 3px rgba(30,41,59,0.07), 0 1px 2px rgba(30,41,59,0.04)",
                padding: "20px 22px",
                display: "flex",
                alignItems: "flex-start",
                gap: 16,
                cursor: "pointer",
                transition: "box-shadow 160ms cubic-bezier(0.16,1,0.3,1), transform 160ms cubic-bezier(0.16,1,0.3,1)",
              }}
              onMouseEnter={ev => {
                (ev.currentTarget as HTMLElement).style.boxShadow = "0 4px 16px rgba(30,41,59,0.09), 0 1px 4px rgba(30,41,59,0.05)";
                (ev.currentTarget as HTMLElement).style.transform = "translateY(-1px)";
              }}
              onMouseLeave={ev => {
                (ev.currentTarget as HTMLElement).style.boxShadow = "0 1px 3px rgba(30,41,59,0.07), 0 1px 2px rgba(30,41,59,0.04)";
                (ev.currentTarget as HTMLElement).style.transform = "translateY(0)";
              }}
            >
              {/* Icon */}
              <div style={{
                width: 44, height: 44, borderRadius: 10,
                background: iconBg, color: accentColor,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 16, fontWeight: 700, flexShrink: 0,
              }}>
                {initials}
              </div>
              {/* Body */}
              <div style={{ flex: 1, minWidth: 0 }}>
                {/* Label */}
                <div style={{ fontSize: 12, color: "#64748b", fontWeight: 500, marginBottom: 6, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {e.industry}
                </div>
                {/* Value */}
                <div style={{ fontSize: 24, fontWeight: 700, color: accentColor, lineHeight: 1.1, marginBottom: 4 }}>
                  {e.jobs}<span style={{ fontSize: 14, fontWeight: 500, color: "#94a3b8", marginLeft: 4 }}>vị trí</span>
                </div>
                {/* Name */}
                <div style={{ fontSize: 12, color: "#94a3b8", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {e.name}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
