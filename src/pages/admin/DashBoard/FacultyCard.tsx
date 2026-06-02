import { useEffect, useMemo, useState } from "react";
import { Alert, Select, Spin } from "antd";
import { useNavigate } from "react-router-dom";
import { fetchKhoaList } from "../../../feature/dashboard/api";
import type { KhoaFilter, KhoaItem } from "../../../feature/dashboard/type";
import { COLOR, RADIUS, SHADOW } from "./theme";

function ProgressBar({ value, total, color }: { value: number; total: number; color: string }) {
  const pct = total > 0 ? Math.round((value / total) * 100) : 0;
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <div
        style={{
          flex: 1,
          height: 4,
          borderRadius: RADIUS.pill,
          background: COLOR.borderSoft,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            height: "100%",
            width: `${pct}%`,
            background: color,
            borderRadius: RADIUS.pill,
            transition: "width 0.35s ease",
          }}
        />
      </div>
      <span style={{ fontSize: 12, color: COLOR.textMuted, whiteSpace: "nowrap" }}>
        {value}/{total}
      </span>
    </div>
  );
}

export function FacultyCard() {
  const navigate = useNavigate();
  const [filter, setFilter] = useState<KhoaFilter>("all");
  const [hovered, setHovered] = useState<number | null>(null);
  const [items, setItems] = useState<KhoaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    const run = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await fetchKhoaList();
        if (!cancelled) setItems(res);
      } catch (e) {
        if (!cancelled) {
          setError(e instanceof Error ? e.message : "Không thể tải danh sách khoa.");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    run();
    return () => { cancelled = true; };
  }, []);

  const filtered = useMemo(() => {
    return items.filter((k) =>
      filter === "all" ? true : filter === "daNop" ? k.daNop : !k.daNop
    );
  }, [items, filter]);

  const totalAll   = items.length;
  const totalDaNop  = items.filter((k) => k.daNop).length;
  const totalChuaNop = items.filter((k) => !k.daNop).length;

  return (
    <div
      style={{
        background: COLOR.bgCard,
        borderRadius: RADIUS.xl,
        border: `1px solid ${COLOR.border}`,
        boxShadow: SHADOW.card,
        overflow: "hidden",
        height: "100%",
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: "14px 20px",
          borderBottom: `1px solid ${COLOR.borderSoft}`,
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
              width: 4,
              height: 20,
              borderRadius: RADIUS.pill,
              background: COLOR.primary,
            }}
          />
          <div style={{ fontSize: 15, fontWeight: 700, color: COLOR.textDark }}>
            Tình trạng nộp báo cáo
          </div>
        </div>

        <Select
          value={filter}
          onChange={(v) => setFilter(v as KhoaFilter)}
          size="small"
          style={{ width: 175 }}
        >
          <Select.Option value="all">Tất cả ({totalAll})</Select.Option>
          <Select.Option value="daNop">Đã nộp ({totalDaNop})</Select.Option>
          <Select.Option value="chuaNop">Chưa nộp ({totalChuaNop})</Select.Option>
        </Select>
      </div>

      {error && (
        <div style={{ padding: 16 }}>
          <Alert type="error" showIcon message="Không thể tải danh sách khoa" description={error} />
        </div>
      )}

      {loading ? (
        <div style={{ minHeight: 260, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Spin />
        </div>
      ) : (
        <>
          {/* Column header */}
          <div
            style={{
              padding: "8px 20px",
              display: "flex",
              alignItems: "center",
              gap: 12,
              borderBottom: `1px solid ${COLOR.borderSoft}`,
              fontSize: 11,
              fontWeight: 600,
              color: COLOR.textFaint,
              textTransform: "uppercase",
              letterSpacing: "0.5px",
            }}
          >
            <span style={{ width: 28 }}>STT</span>
            <span style={{ flex: 1 }}>Khoa</span>
            <span style={{ width: 200 }}>SV phản hồi / tổng</span>
            <span style={{ width: 80, textAlign: "right" }}>Trạng thái</span>
          </div>

          <div style={{ maxHeight: 360, overflowY: "auto" }}>
            {filtered.map((k, i) => {
              const soSVPhanhoi = k.soSV ?? 0;
              const isHovered = hovered === i;
              return (
                <div
                  key={k.ten}
                  onClick={() => navigate(`/admin/bao-cao/${k.viet_tat.toLowerCase()}`)}
                  onMouseEnter={() => setHovered(i)}
                  onMouseLeave={() => setHovered(null)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    padding: "10px 20px",
                    background: isHovered ? COLOR.bgMuted : i % 2 === 0 ? COLOR.bgCard : COLOR.bgPage,
                    borderBottom: `1px solid ${COLOR.borderSoft}`,
                    cursor: "pointer",
                    transition: "background 120ms ease",
                  }}
                >
                  <span
                    style={{
                      fontSize: 11,
                      color: COLOR.textFaint,
                      width: 28,
                      flexShrink: 0,
                      textAlign: "center",
                    }}
                  >
                    {i + 1}
                  </span>

                  <span
                    style={{
                      flex: 1,
                      fontSize: 14,
                      color: COLOR.textBase,
                      fontWeight: 500,
                      minWidth: 0,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {k.ten}
                  </span>

                  <div style={{ width: 200, flexShrink: 0 }}>
                    <ProgressBar value={soSVPhanhoi} total={k.tongSV} color={k.mau} />
                  </div>

                  <span
                    style={{
                      fontSize: 12,
                      fontWeight: 600,
                      color: k.daNop ? COLOR.success : COLOR.danger,
                      flexShrink: 0,
                      width: 80,
                      textAlign: "right",
                    }}
                  >
                    {k.daNop ? "✓ Đã nộp" : "✗ Chưa nộp"}
                  </span>
                </div>
              );
            })}

            {!filtered.length && !error && (
              <div style={{ padding: "32px 20px", textAlign: "center", color: COLOR.textFaint, fontSize: 13 }}>
                Không có dữ liệu khoa
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
