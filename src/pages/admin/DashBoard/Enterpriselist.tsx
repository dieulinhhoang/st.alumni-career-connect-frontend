import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ENTERPRISE_LIST } from "../../../feature/dashboard/api";
import { toSlug } from "../../../components/common/utils";

export function EnterpriseList() {
  const navigate = useNavigate();
  const [hovered, setHovered] = useState<number | null>(null);

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

      {/* List */}
      <div style={{ maxHeight: 400, overflowY: "auto" }}>
        {ENTERPRISE_LIST.map((e, i) => (
          <div key={e.name}
            onClick={() => navigate(`/admin/enterprises/${toSlug(e.name)}`)}
            onMouseEnter={() => setHovered(i)}
            onMouseLeave={() => setHovered(null)}
            style={{
              display: "flex", alignItems: "center", gap: 12, padding: "14px 20px",
              background: hovered === i ? "#eff6ff" : i % 2 === 0 ? "#fff" : "#f8fafc",
              borderBottom: "1px solid #f1f5f9",
              cursor: "pointer", transition: "background 0.1s",
            }}
          >
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                <span style={{ fontSize: 15, fontWeight: 600, color: "#1e293b", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" as const }}>
                  {e.name}
                </span>
              </div>
              <div style={{ fontSize: 13, color: "#94a3b8", marginTop: 3 }}>{e.industry}</div>
            </div>
            <div style={{ textAlign: "right" as const, flexShrink: 0 }}>
              <div style={{ fontSize: 20, fontWeight: 700, color: "#0f172a" }}>{e.jobs}</div>
              <div style={{ fontSize: 12, color: "#94a3b8" }}>vị trí</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}