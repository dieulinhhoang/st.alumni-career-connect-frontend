import { useState } from "react";
import { Select } from "antd";
import { useNavigate } from "react-router-dom";
import { KHOA_LIST, getLatestDot, getSoSVPhanhoi } from "../../../feature/dashboard/api";
import type { KhoaFilter } from "../../../feature/dashboard/type";

function ProgressBar({ value, total, color }: { value: number; total: number; color: string }) {
  const pct = total > 0 ? Math.round((value / total) * 100) : 0;
  return (
    <div style={{ width: 88 }}>
      <div style={{ height: 5, borderRadius: 99, background: "#e2e8f0", overflow: "hidden" }}>
        <div style={{ height: "100%", width: `${pct}%`, background: color, borderRadius: 99, transition: "width 0.5s ease" }} />
      </div>
      <div style={{ fontSize: 11, color: "#94a3b8", marginTop: 3, textAlign: "right" as const }}>
        {value}/{total} SV
      </div>
    </div>
  );
}

export function FacultyCard() {
  const navigate = useNavigate();
  const [filter, setFilter] = useState<KhoaFilter>("all");
  const [hovered, setHovered] = useState<number | null>(null);
  const latestDot = getLatestDot();

  const filtered = KHOA_LIST.filter(k =>
    filter === "all" ? true : filter === "daNop" ? k.daNop : !k.daNop
  );

  return (
    <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #e2e8f0", overflow: "hidden" }}>
      {/* Header */}
      <div style={{ padding: "14px 16px 12px", borderBottom: "1px solid #e2e8f0", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}><div style={{ width: 3, height: 18, borderRadius: 99, background: "#6366f1", flexShrink: 0 }} /><span style={{ fontSize: 14, fontWeight: 600, color: "#0f172a" }}>Tình trạng nộp báo cáo</span></div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <Select
            value={filter}
            onChange={v => setFilter(v as KhoaFilter)}
            size="small"
            style={{ width: 150 }}
          >
            <Select.Option value="all">Tất cả ({KHOA_LIST.length})</Select.Option>
            <Select.Option value="daNop">Đã nộp ({KHOA_LIST.filter(k => k.daNop).length})</Select.Option>
            <Select.Option value="chuaNop">Chưa nộp ({KHOA_LIST.filter(k => !k.daNop).length})</Select.Option>
          </Select>
          <span style={{ fontSize: 11, color: "#64748b", background: "#f1f5f9", padding: "2px 10px", borderRadius: 99 }}>
            {latestDot}
          </span>
        </div>
      </div>

      {/* List */}
      <div style={{ maxHeight: 400, overflowY: "auto" }}>
        {filtered.map((k, i) => {
          const soSVPhanhoi = getSoSVPhanhoi(k.viet_tat);
          return (
            <div key={k.ten}
              onClick={() => navigate(`/admin/bao-cao/${k.viet_tat.toLowerCase()}`)}
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
              style={{
                display: "flex", alignItems: "center", gap: 12, padding: "10px 16px",
                background: hovered === i ? "#eff6ff" : i % 2 === 0 ? "#fff" : "#f8fafc",
                borderBottom: "1px solid #f1f5f9",
                cursor: "pointer", transition: "background 0.1s",
              }}
            >
              <span style={{ flex: 1, fontSize: 13, color: "#1e293b" }}>{k.ten}</span>
              <ProgressBar value={soSVPhanhoi} total={k.tongSV} color={k.mau} />
              <div style={{ minWidth: 90, textAlign: "right" as const }}>
                <span style={{
                  fontSize: 11, fontWeight: 600, padding: "3px 10px", borderRadius: 99,
                  background: k.daNop ? "#f0fdf4" : "#fef2f2",
                  color: k.daNop ? "#15803d" : "#dc2626",
                  border: `1px solid ${k.daNop ? "#bbf7d0" : "#fecaca"}`,
                }}>
                  {k.daNop ? "Đã nộp" : "Chưa nộp"}
                </span>
                {k.daNop && (
                  <div style={{ fontSize: 10, color: "#94a3b8", marginTop: 3 }}>{k.ngayNop}</div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}