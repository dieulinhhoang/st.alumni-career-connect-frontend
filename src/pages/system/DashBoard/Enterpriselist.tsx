import { useEffect, useState } from "react";
import React from "react";
import { Alert, Spin } from "antd";
import { useNavigate } from "react-router-dom";
import { fetchEnterpriseList } from "../../../feature/dashboard/api";
import { toSlug } from "../../../components/common/utils";
import type { EnterpriseItem } from "../../../feature/dashboard/type";
import { COLOR, RADIUS, SHADOW } from "./theme";

export function EnterpriseList({ facultyId, extra }: { facultyId?: string | null; extra?: React.ReactNode }) {
  const navigate = useNavigate();
  const [hovered, setHovered] = useState<number | null>(null);
  const [items, setItems] = useState<EnterpriseItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    const run = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await fetchEnterpriseList(facultyId ?? undefined);
        if (!cancelled) setItems(res);
      } catch (e) {
        if (!cancelled) {
          setError(
            e instanceof Error ? e.message : "Không thể tải danh sách doanh nghiệp."
          );
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    run();
    return () => { cancelled = true; };
  }, [facultyId]);

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
              flexShrink: 0,
            }}
          />
          <span style={{ fontSize: 15, fontWeight: 700, color: COLOR.textDark }}>
            Doanh nghiệp đối tác
          </span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          {extra}
          <button
            onClick={() => navigate(facultyId ? `/admin/enterprises?facultyId=${facultyId}` : "/admin/enterprises")}
            style={{
              background: `${COLOR.primary}10`,
              border: `1px solid ${COLOR.primary}30`,
              borderRadius: RADIUS.pill,
              cursor: "pointer",
              fontSize: 12,
              color: COLOR.primary,
              fontWeight: 600,
              padding: "4px 12px",
              transition: "background 150ms ease",
            }}
          >
            Xem tất cả →
          </button>
        </div>
      </div>

      {error && (
        <div style={{ padding: 16 }}>
          <Alert type="error" showIcon message="Không thể tải doanh nghiệp" description={error} />
        </div>
      )}

      {loading ? (
        <div style={{ minHeight: 220, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Spin />
        </div>
      ) : (
        <div style={{ maxHeight: 400, overflowY: "auto" }}>
          {items.map((e, i) => {
            const color = (e as any).color || e.mau || COLOR.primaryLight;
            return (
              <div
                key={e.name}
                onClick={() => navigate(`/admin/enterprises/${toSlug(e.name)}`)}
                onMouseEnter={() => setHovered(i)}
                onMouseLeave={() => setHovered(null)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  padding: "10px 20px",
                  background: hovered === i ? COLOR.bgMuted : i % 2 === 0 ? COLOR.bgCard : COLOR.bgPage,
                  borderBottom: `1px solid ${COLOR.borderSoft}`,
                  cursor: "pointer",
                  transition: "background 120ms ease",
                }}
              >
                {/* Color indicator */}
                <div style={{ width: 8, height: 8, borderRadius: "50%", background: color, flexShrink: 0 }} />

                <div style={{ flex: 1, minWidth: 0 }}>
                  <div
                    style={{
                      fontSize: 14,
                      fontWeight: 600,
                      color: COLOR.textBase,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {e.name}
                  </div>
                  {e.industry && (
                    <div style={{ fontSize: 11, color: COLOR.textFaint, marginTop: 2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {e.industry}
                    </div>
                  )}
                </div>

                <div style={{ textAlign: "right", flexShrink: 0 }}>
                  <div style={{ fontSize: 18, fontWeight: 700, color: COLOR.textDark, lineHeight: 1.1 }}>
                    {e.jobs}
                  </div>
                  <div style={{ fontSize: 11, color: COLOR.textFaint, marginTop: 2 }}>vị trí</div>
                </div>
              </div>
            );
          })}

          {!items.length && !error && (
            <div style={{ padding: "32px 20px", textAlign: "center", color: COLOR.textFaint, fontSize: 13 }}>
              Không có dữ liệu doanh nghiệp
            </div>
          )}
        </div>
      )}
    </div>
  );
}
