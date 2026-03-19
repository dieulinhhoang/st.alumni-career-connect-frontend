import { useState } from "react";
import { Typography } from "antd";
import { useNavigate } from "react-router-dom";
import type { KhoaItem, KhoaFilter } from "../../../feature/dashboard/type";
import { KHOA_LIST } from "../../../feature/dashboard/api";

const { Text } = Typography;

function MiniProgress({ value, total, color }: { value: number; total: number; color: string }) {
  const pct = total > 0 ? Math.round((value / total) * 100) : 0;
  return (
    <div style={{ width: 72 }}>
      <div style={{ height: 5, borderRadius: 99, background: "#f1f5f9", overflow: "hidden" }}>
        <div style={{ height: "100%", width: `${pct}%`, background: color, borderRadius: 99, transition: "width 0.6s ease" }} />
      </div>
      <div style={{ fontSize: 10, color: "#94a3b8", marginTop: 2, textAlign: "right" }}>{value}/{total}</div>
    </div>
  );
}

const FILTER_TABS: { key: KhoaFilter; label: string; color: string; activeBg: string; count: (l: KhoaItem[]) => number }[] = [
  { key: "all",     label: "Tất cả",   color: "#6366f1", activeBg: "#6366f1", count: l => l.length },
  { key: "daNop",   label: "Đã nộp",   color: "#059669", activeBg: "#059669", count: l => l.filter(k => k.daNop).length },
  { key: "chuaNop", label: "Chưa nộp", color: "#ef4444", activeBg: "#ef4444", count: l => l.filter(k => !k.daNop).length },
];

export function KhoaList() {
  const navigate = useNavigate();
  const [filter, setFilter] = useState<KhoaFilter>("all");

  const filtered = KHOA_LIST.filter(k =>
    filter === "all" ? true : filter === "daNop" ? k.daNop : !k.daNop
  );

  return (
    <div style={{
      background: "#fff", borderRadius: 16,
      border: "1px solid #f1f5f9",
      boxShadow: "0 1px 4px rgba(0,0,0,0.05), 0 4px 16px rgba(0,0,0,0.04)",
      overflow: "hidden",
      display: "flex", flexDirection: "column",
    }}>
      {/* Header */}
      <div style={{ padding: "16px 20px 12px", borderBottom: "1px solid #f1f5f9", flexShrink: 0 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ width: 3, height: 18, borderRadius: 99, background: "#6366f1" }} />
            <span style={{ fontSize: 15, fontWeight: 700, color: "#0f172a" }}>Tình trạng nộp báo cáo</span>
          </div>
          <span style={{ fontSize: 11, background: "#eef2ff", color: "#6366f1", padding: "3px 10px", borderRadius: 100, fontWeight: 600 }}>T12/2024</span>
        </div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {FILTER_TABS.map(tab => {
            const isActive = filter === tab.key;
            return (
              <button key={tab.key} onClick={() => setFilter(tab.key)} style={{
                display: "flex", alignItems: "center", gap: 6,
                background: isActive ? tab.activeBg : "#f8fafc",
                border: `1.5px solid ${isActive ? tab.activeBg : "#f1f5f9"}`,
                borderRadius: 10, padding: "4px 12px", cursor: "pointer", transition: "all 0.15s",
              }}>
                <span style={{ fontSize: 14, fontWeight: 800, color: isActive ? "#fff" : tab.color }}>{tab.count(KHOA_LIST)}</span>
                <span style={{ fontSize: 11, color: isActive ? "rgba(255,255,255,0.85)" : "#64748b" }}>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* List */}
      <div style={{ maxHeight: 380, overflowY: "auto", padding: "4px 0" }}>
        {filtered.map((k, i) => (
          <div key={k.ten} onClick={() => navigate(`/admin/bao-cao/${k.viet_tat.toLowerCase()}`)}
            style={{
              display: "flex", alignItems: "center", gap: 12, padding: "9px 20px",
              background: i % 2 === 0 ? "#fff" : "#fafbfc",
              borderBottom: "1px solid #f8fafc", cursor: "pointer", transition: "background 0.12s",
            }}
            onMouseEnter={ev => { (ev.currentTarget as HTMLDivElement).style.background = k.mau + "10"; }}
            onMouseLeave={ev => { (ev.currentTarget as HTMLDivElement).style.background = i % 2 === 0 ? "#fff" : "#fafbfc"; }}
          >
            <div style={{ width: 36, height: 36, borderRadius: 10, background: k.mau + "18", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span style={{ fontSize: 9, fontWeight: 800, color: k.mau }}>{k.viet_tat}</span>
            </div>
            <Text style={{ fontSize: 13, fontWeight: 500, flex: 1, color: "#1e293b", minWidth: 0 }} ellipsis={{ tooltip: k.ten }}>{k.ten}</Text>
            <MiniProgress value={k.soSV} total={k.tongSV} color={k.mau} />
            <div style={{ textAlign: "right", minWidth: 88, flexShrink: 0 }}>
              {k.daNop ? (
                <>
                  <div style={{ display: "inline-flex", alignItems: "center", gap: 4, fontSize: 11, color: "#059669", fontWeight: 700, background: "#f0fdf4", border: "1px solid #bbf7d0", padding: "2px 8px", borderRadius: 100 }}>
                    <span style={{ fontSize: 8 }}>●</span> Đã nộp
                  </div>
                  <div style={{ fontSize: 10, color: "#94a3b8", marginTop: 2 }}>{k.ngayNop}</div>
                </>
              ) : (
                <>
                  <div style={{ display: "inline-flex", alignItems: "center", gap: 4, fontSize: 11, color: "#ef4444", fontWeight: 700, background: "#fef2f2", border: "1px solid #fecaca", padding: "2px 8px", borderRadius: 100 }}>
                    <span style={{ fontSize: 8 }}>○</span> Chưa nộp
                  </div>
                  <div style={{ fontSize: 10, color: "#94a3b8", marginTop: 2 }}>0 / {k.tongSV} SV</div>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}