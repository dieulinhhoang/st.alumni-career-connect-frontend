import { Typography } from "antd";
import { useNavigate } from "react-router-dom";
import { ENTERPRISE_LIST } from "../../../feature/dashboard/api";
import { toSlug } from "../../../components/common/utils";

const { Text } = Typography;

export function EnterpriseList() {
  const navigate = useNavigate();

  return (
    <div style={{
      background: "#fff", borderRadius: 16,
      border: "1px solid #f1f5f9",
      boxShadow: "0 1px 4px rgba(0,0,0,0.05), 0 4px 16px rgba(0,0,0,0.04)",
      overflow: "hidden",
      display: "flex", flexDirection: "column",
    }}>
      {/* Header */}
      <div style={{ padding: "16px 20px 14px", borderBottom: "1px solid #f1f5f9", flexShrink: 0 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ width: 3, height: 18, borderRadius: 99, background: "#6366f1" }} />
            <span style={{ fontSize: 15, fontWeight: 700, color: "#0f172a" }}>Doanh nghiệp đối tác</span>
          </div>
          <button
            onClick={() => navigate("/admin/enterprises")}
            style={{
              background: "none", border: "1.5px solid #e2e8f0", borderRadius: 8,
              padding: "4px 12px", cursor: "pointer", fontSize: 12,
              color: "#6366f1", fontWeight: 600, transition: "all 0.15s",
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = "#eef2ff"; }}
            onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = "none"; }}
          >
            Xem tất cả →
          </button>
        </div>
      </div>

      {/* List */}
      <div style={{ maxHeight: 380, overflowY: "auto", padding: "4px 0" }}>
        {ENTERPRISE_LIST.map((e, i) => (
          <div key={e.name}
            onClick={() => navigate(`/admin/enterprises/${toSlug(e.name)}`)}
            style={{
              display: "flex", alignItems: "center", gap: 12, padding: "9px 20px",
              background: i % 2 === 0 ? "#fff" : "#fafbfc",
              borderBottom: "1px solid #f8fafc", cursor: "pointer", transition: "background 0.12s",
            }}
            onMouseEnter={ev => { (ev.currentTarget as HTMLDivElement).style.background = e.mau + "10"; }}
            onMouseLeave={ev => { (ev.currentTarget as HTMLDivElement).style.background = i % 2 === 0 ? "#fff" : "#fafbfc"; }}
          >
            {/* <div style={{ width: 36, height: 36, borderRadius: 10, background: e.mau + "15", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span style={{ fontSize: 9, fontWeight: 800, color: e.mau }}>{e.viet_tat}</span>
            </div> */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <Text style={{ fontSize: 13, fontWeight: 600, color: "#1e293b" }} ellipsis={{ tooltip: e.name }}>{e.name}</Text>
                {e.verified && (
                  <span style={{ fontSize: 9, color: "#059669", background: "#f0fdf4", border: "1px solid #bbf7d0", padding: "1px 6px", borderRadius: 100, fontWeight: 700, flexShrink: 0 }}>
                    ✓ 
                  </span>
                )}
              </div>
              <Text style={{ fontSize: 11, color: "#94a3b8" }}>{e.industry}</Text>
            </div>
            <div style={{ textAlign: "center", background: "#eef2ff", borderRadius: 10, padding: "4px 10px", minWidth: 52, flexShrink: 0 }}>
              <div style={{ fontSize: 15, fontWeight: 800, color: "#6366f1", lineHeight: 1 }}>{e.jobs}</div>
              <div style={{ fontSize: 9, color: "#818cf8", fontWeight: 600 }}>vị trí</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}