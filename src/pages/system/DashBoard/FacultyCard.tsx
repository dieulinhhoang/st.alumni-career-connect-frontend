import { useEffect, useMemo, useState } from "react";
import { Alert, Select, Spin } from "antd";
import { ArrowRightOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { fetchKhoaList } from "../../../feature/dashboard/api";
import type { KhoaFilter, KhoaItem } from "../../../feature/dashboard/type";
import { getCurrentUser } from "../../../feature/auth/permission";
import { COLOR, RADIUS, SHADOW } from "./theme";

type FacultyApiItem = KhoaItem & {
  facultyId?: string | number;
  facultyName?: string;
  facultyCode?: string;
  responded?: number;
  total?: number;
  status?: string;
  color?: string;
};

type NormalizedFaculty = {
  key: string;
  name: string;
  code: string;
  responded: number;
  total: number;
  color: string;
  submitted: boolean;
};

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
          minWidth: 60,
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
      <span style={{ fontSize: 12, color: COLOR.textMuted, whiteSpace: "nowrap", minWidth: 44 }}>
        {value}/{total}
      </span>
    </div>
  );
}

// FIX: Thống nhất pill badge style
function StatusBadge({ submitted }: { submitted: boolean }) {
  return (
    <span
      style={{
        display: "inline-block",
        padding: "3px 10px",
        borderRadius: 99,
        fontSize: 12,
        fontWeight: 600,
        color: submitted ? COLOR.success : COLOR.danger,
        background: submitted ? "#f0fdf4" : "#fff1f2",
        whiteSpace: "nowrap",
      }}
    >
      {submitted ? "Đã nộp" : "Chưa nộp"}
    </span>
  );
}

// Khối tóm tắt cho cán bộ khoa — chỉ 1 khoa của chính họ, không cần bảng/filter
function OwnFacultySummary({ item, onClick }: { item?: NormalizedFaculty; onClick: () => void }) {
  if (!item) {
    return (
      <div style={{ padding: "32px 20px", textAlign: "center", color: COLOR.textFaint, fontSize: 13 }}>
        Không có dữ liệu khoa
      </div>
    );
  }

  return (
    <div
      onClick={onClick}
      style={{ padding: 20, display: "flex", flexDirection: "column", gap: 16, cursor: "pointer" }}
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
        <div style={{ fontSize: 17, fontWeight: 700, color: COLOR.textDark }}>{item.name}</div>
        <StatusBadge submitted={item.submitted} />
      </div>

      <div>
        <div
          style={{
            fontSize: 11, fontWeight: 600, color: COLOR.textFaint,
            textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 8,
          }}
        >
          Sinh viên phản hồi khảo sát
        </div>
        <ProgressBar value={item.responded} total={item.total} color={item.color} />
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, fontWeight: 600, color: COLOR.primary }}>
        Xem báo cáo khoa <ArrowRightOutlined style={{ fontSize: 12 }} />
      </div>
    </div>
  );
}

export function FacultyCard() {
  const navigate = useNavigate();
  const currentUser = useMemo(() => getCurrentUser(), []);
  const isOwnFacultyView = !currentUser.isAdmin && !!currentUser.facultyId;

  const [filter, setFilter] = useState<KhoaFilter>("all");
  const [hovered, setHovered] = useState<number | null>(null);
  const [items, setItems] = useState<FacultyApiItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    const run = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await fetchKhoaList();
        if (!cancelled) setItems((res as FacultyApiItem[]) ?? []);
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

  const normalizedItems = useMemo(() => {
    // Cán bộ khoa: chỉ xem tình trạng của khoa mình, không xem được khoa khác
    const visibleItems = isOwnFacultyView
      ? items.filter((item) => String(item.facultyId ?? "") === currentUser.facultyId)
      : items;

    return visibleItems.map((item): NormalizedFaculty => {
      const name = item.facultyName ?? item.ten ?? "—";
      const code = item.facultyCode ?? item.viet_tat ?? "";
      const responded = Number(item.responded ?? item.soSV ?? 0);
      const total = Number(item.total ?? item.tongSV ?? 0);
      const color = item.color ?? item.mau ?? COLOR.primaryLight;
      const submitted =
        typeof item.daNop === "boolean"
          ? item.daNop
          : item.status === "submitted" || item.status === "done";
      return {
        key: String(item.facultyId ?? code ?? name),
        name, code, responded, total, color, submitted,
      };
    });
  }, [items, isOwnFacultyView, currentUser.facultyId]);

  const filtered = useMemo(() => {
    return normalizedItems.filter((k) =>
      filter === "all" ? true : filter === "daNop" ? k.submitted : !k.submitted
    );
  }, [normalizedItems, filter]);

  const totalAll = normalizedItems.length;
  const totalDaNop = normalizedItems.filter((k) => k.submitted).length;
  const totalChuaNop = normalizedItems.filter((k) => !k.submitted).length;

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
          <div style={{ width: 4, height: 20, borderRadius: RADIUS.pill, background: COLOR.primary }} />
          <div style={{ fontSize: 15, fontWeight: 700, color: COLOR.textDark }}>
            {isOwnFacultyView ? "Báo cáo khoa " : "Tình trạng nộp báo cáo"}
          </div>
        </div>
        {!isOwnFacultyView && (
          <Select
            value={filter}
            onChange={(v) => setFilter(v as KhoaFilter)}
            size="small"
            style={{ width: 175 }}
            options={[
              { value: "all", label: `Tất cả (${totalAll})` },
              { value: "daNop", label: `Đã nộp (${totalDaNop})` },
              { value: "chuaNop", label: `Chưa nộp (${totalChuaNop})` },
            ]}
          />
        )}
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
      ) : isOwnFacultyView ? (
        <OwnFacultySummary
          item={normalizedItems[0]}
          onClick={() => navigate(`/admin/reports/faculty/${currentUser.facultyId}`)}
        />
      ) : (
        <>
          {/* FIX: Column header responsive — ẩn progress column trên màn hình nhỏ */}
          <style>{`
            @media (max-width: 640px) {
              .faculty-col-progress { display: none !important; }
            }
          `}</style>
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
            <span className="faculty-col-progress" style={{ width: 180 }}>SV phản hồi / tổng</span>
            <span style={{ width: 90, textAlign: "right" }}>Trạng thái</span>
          </div>

          <div style={{ maxHeight: 360, overflowY: "auto" }}>
            {filtered.map((k, i) => {
              const isHovered = hovered === i;
              return (
                <div
                  key={k.key}
                  onClick={() => navigate(`/admin/reports/faculty/${k.key}`)}
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
                  <span style={{ fontSize: 11, color: COLOR.textFaint, width: 28, flexShrink: 0, textAlign: "center" }}>
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
                    title={k.name}
                  >
                    {k.name}
                  </span>

                  <div className="faculty-col-progress" style={{ width: 180, flexShrink: 0 }}>
                    <ProgressBar value={k.responded} total={k.total} color={k.color} />
                  </div>

                  <div style={{ width: 90, flexShrink: 0, textAlign: "right" }}>
                    <StatusBadge submitted={k.submitted} />
                  </div>
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
