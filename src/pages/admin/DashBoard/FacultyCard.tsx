import { useState } from "react";
import { Select } from "antd";
import { useNavigate } from "react-router-dom";
import { KHOA_LIST, getLatestDot, getSoSVPhanhoi } from "../../../feature/dashboard/api";
import type { KhoaFilter } from "../../../feature/dashboard/type";

const ACCENT_COLORS = [
  "#6366f1", "#0ea5e9", "#10b981", "#f59e0b",
  "#ef4444", "#8b5cf6", "#ec4899", "#14b8a6",
];

export function FacultyCard() {
  const navigate = useNavigate();
  const [filter, setFilter] = useState<KhoaFilter>("all");
  const latestDot = getLatestDot();

  const filtered = KHOA_LIST.filter(k =>
    filter === "all" ? true : filter === "daNop" ? k.daNop : !k.daNop
  );

  return (
    <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #e2e8f0", overflow: "hidden" }}>
      {/* Header */}
      <div style={{ padding: "18px 20px 16px", borderBottom: "1px solid #e2e8f0", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ width: 4, height: 22, borderRadius: 99, background: "#6366f1", flexShrink: 0 }} />
          <span style={{ fontSize: 18, fontWeight: 700, color: "#0f172a" }}>Tình trạng nộp báo cáo</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 13, color: "#64748b", background: "#f1f5f9", padding: "3px 12px", borderRadius: 99 }}>{latestDot}</span>
          <Select
            value={filter}
            onChange={v => setFilter(v as KhoaFilter)}
            size="small"
            style={{ width: 160 }}
          >
            <Select.Option value="all">Tất cả ({KHOA_LIST.length})</Select.Option>
            <Select.Option value="daNop">Đã nộp ({KHOA_LIST.filter(k => k.daNop).length})</Select.Option>
            <Select.Option value="chuaNop">Chưa nộp ({KHOA_LIST.filter(k => !k.daNop).length})</Select.Option>
          </Select>
        </div>
      </div>

      {/* Grid KPI cards */}
      <div style={{ padding: 16, display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 12 }}>
        {filtered.map((k, i) => {
          const soSVPhanhoi = getSoSVPhanhoi(k.viet_tat);
          const accentColor = ACCENT_COLORS[i % ACCENT_COLORS.length];
          const iconBg = `${accentColor}18`;
          const pct = k.tongSV > 0 ? Math.round((soSVPhanhoi / k.tongSV) * 100) : 0;
          return (
            <div
              key={k.viet_tat}
              onClick={() => navigate(`/admin/bao-cao/${k.viet_tat.toLowerCase()}`)}
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
                width: 44, height: 44, borderRadius: 10,
                background: iconBg, color: accentColor,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 18, fontWeight: 700, flexShrink: 0,
              }}>
                {k.viet_tat.slice(0, 2)}
              </div>
              {/* Body */}
              <div style={{ flex: 1, minWidth: 0 }}>
                {/* Label + badge */}
                <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 6 }}>
                  <span style={{ fontSize: 12, color: "#64748b", fontWeight: 500, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{k.ten}</span>
                  <span style={{
                    fontSize: 11, fontWeight: 600, padding: "2px 8px", borderRadius: 99,
                    background: k.daNop ? "#dcfce7" : "#fef9c3",
                    color: k.daNop ? "#16a34a" : "#b45309",
                    flexShrink: 0,
                  }}>{k.daNop ? "Đã nộp" : "Chưa nộp"}</span>
                </div>
                {/* Value */}
                <div style={{ fontSize: 24, fontWeight: 700, color: accentColor, lineHeight: 1.1, marginBottom: 4 }}>
                  {soSVPhanhoi}<span style={{ fontSize: 14, fontWeight: 500, color: "#94a3b8", marginLeft: 2 }}>/{k.tongSV} SV</span>
                </div>
                {/* Sub */}
                <div style={{ fontSize: 12, color: "#94a3b8" }}>
                  {k.daNop && k.ngayNop ? `Nộp: ${k.ngayNop}` : `Phản hồi: ${pct}%`}
                </div>
                {/* Progress bar */}
                <div style={{ marginTop: 8, height: 4, borderRadius: 99, background: "#e2e8f0", overflow: "hidden" }}>
                  <div style={{ height: "100%", width: `${pct}%`, background: accentColor, borderRadius: 99, transition: "width 0.5s ease" }} />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
