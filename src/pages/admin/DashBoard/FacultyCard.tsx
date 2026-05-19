import { useState } from "react";
import { Select } from "antd";
import { useNavigate } from "react-router-dom";
import {
  KHOA_LIST,
  getLatestDot,
  getSoSVPhanhoi,
} from "../../../feature/dashboard/api";
import type { KhoaFilter } from "../../../feature/dashboard/type";

function ProgressBar({
  value,
  total,
  color,
}: {
  value: number;
  total: number;
  color: string;
}) {
  const pct = total > 0 ? Math.round((value / total) * 100) : 0;

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <div
        style={{
          flex: 1,
          height: 4,
          borderRadius: 999,
          background: "#e5edf8",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            height: "100%",
            width: `${pct}%`,
            background: color,
            borderRadius: 999,
            transition: "width 0.3s ease",
          }}
        />
      </div>
      <span
        style={{
          fontSize: 12,
          color: "#64748b",
          whiteSpace: "nowrap",
        }}
      >
        {value}/{total}
      </span>
    </div>
  );
}

export function FacultyCard() {
  const navigate = useNavigate();
  const [filter, setFilter] = useState<KhoaFilter>("all");
  const [hovered, setHovered] = useState<number | null>(null);
  const latestDot = getLatestDot();

  const filtered = KHOA_LIST.filter((k) =>
    filter === "all" ? true : filter === "daNop" ? k.daNop : !k.daNop
  );

  return (
    <div
      style={{
        background: "#ffffff",
        borderRadius: 18,
        border: "1px solid #e5e7eb",
        boxShadow:
          "0 20px 45px rgba(15, 23, 42, 0.12), 0 2px 6px rgba(15, 23, 42, 0.04)",
        overflow: "hidden",
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: "14px 20px",
          borderBottom: "1px solid #e2e8f0",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 10,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div
            style={{
              width: 6,
              height: 22,
              borderRadius: 999,
              background: "#15803d",
            }}
          />
          <div>
            <div
              style={{
                fontSize: 15,
                fontWeight: 700,
                color: "#0f172a",
              }}
            >
              Tình trạng nộp báo cáo
            </div>
            {/* <div
              style={{
                fontSize: 12,
                color: "#64748b",
                marginTop: 2,
              }}
            >
              Theo từng khoa, cập nhật theo {latestDot}
            </div> */}
          </div>
        </div>

        <Select
          value={filter}
          onChange={(v) => setFilter(v as KhoaFilter)}
          size="small"
          style={{ width: 170 }}
        >
          <Select.Option value="all">
            Tất cả ({KHOA_LIST.length})
          </Select.Option>
          <Select.Option value="daNop">
            Đã nộp ({KHOA_LIST.filter((k) => k.daNop).length})
          </Select.Option>
          <Select.Option value="chuaNop">
            Chưa nộp ({KHOA_LIST.filter((k) => !k.daNop).length})
          </Select.Option>
        </Select>
      </div>

      {/* Legend */}
      <div
        style={{
          padding: "8px 20px 6px",
          display: "flex",
          alignItems: "center",
          gap: 16,
          borderBottom: "1px solid #f1f5f9",
          fontSize: 11,
          color: "#94a3b8",
        }}
      >
        <span style={{ width: 32 }}>STT</span>
        <span style={{ flex: 1 }}>Khoa</span>
        <span style={{ width: 200 }}>SV phản hồi / tổng</span>
        <span style={{ width: 80, textAlign: "right" as const }}>
          Trạng thái
        </span>
      </div>

      {/* List */}
      <div style={{ maxHeight: 360, overflowY: "auto" }}>
        {filtered.map((k, i) => {
          const soSVPhanhoi = getSoSVPhanhoi(k.viet_tat);
          const isHovered = hovered === i;

          return (
            <div
              key={k.ten}
              onClick={() =>
                navigate(`/admin/bao-cao/${k.viet_tat.toLowerCase()}`)
              }
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                padding: "10px 20px",
                background: isHovered
                  ? "#f8fafc"
                  : i % 2 === 0
                  ? "#ffffff"
                  : "#f9fafb",
                borderBottom: "1px solid #f1f5f9",
                cursor: "pointer",
                transition: "background 120ms ease",
              }}
            >
              {/* index */}
              <span
                style={{
                  fontSize: 11,
                  color: "#9ca3af",
                  width: 32,
                  flexShrink: 0,
                  textAlign: "center",
                }}
              >
                {i + 1}
              </span>

              {/* name */}
              <span
                style={{
                  flex: 1,
                  fontSize: 14,
                  color: "#111827",
                  fontWeight: 500,
                  minWidth: 0,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {k.ten}
              </span>

              {/* progress */}
              <div style={{ width: 200, flexShrink: 0 }}>
                <ProgressBar
                  value={soSVPhanhoi}
                  total={k.tongSV}
                  color={k.mau}
                />
              </div>

              {/* status: chỉ chữ, không icon/badge */}
              <span
                style={{
                  fontSize: 12,
                  fontWeight: 500,
                  color: k.daNop ? "#16a34a" : "#dc2626",
                  flexShrink: 0,
                  width: 80,
                  textAlign: "right",
                }}
              >
                {k.daNop ? "Đã nộp" : "Chưa nộp"}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}