import { useEffect, useState } from "react";
import { Alert, Spin } from "antd";
import { useNavigate } from "react-router-dom";
import { fetchEnterpriseList } from "../../../feature/dashboard/api";
import { toSlug } from "../../../components/common/utils";
import type { EnterpriseItem } from "../../../feature/dashboard/type";

export function EnterpriseList() {
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
        const res = await fetchEnterpriseList();
        if (!cancelled) setItems(res);
      } catch (e) {
        if (!cancelled) {
          setError(
            e instanceof Error
              ? e.message
              : "Không thể tải danh sách doanh nghiệp."
          );
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    run();
    return () => {
      cancelled = true;
    };
  }, []);

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
      <div
        style={{
          padding: "8px 20px",
          borderBottom: "1px solid #e2e8f0",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
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
              flexShrink: 0,
            }}
          />
          <span
            style={{
              fontSize: 15,
              fontWeight: 700,
              color: "#0f172a",
            }}
          >
            Doanh nghiệp đối tác
          </span>
        </div>

        <button
          onClick={() => navigate("/admin/enterprises")}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            fontSize: 13,
            color: "#15803d",
            fontWeight: 600,
            padding: 0,
          }}
        >
          Xem tất cả →
        </button>
      </div>

      {error && (
        <div style={{ padding: 16 }}>
          <Alert
            type="error"
            showIcon
            message="Không thể tải doanh nghiệp"
            description={error}
          />
        </div>
      )}

      {loading ? (
        <div
          style={{
            minHeight: 220,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Spin />
        </div>
      ) : (
        <div style={{ maxHeight: 400, overflowY: "auto" }}>
          {items.map((e, i) => (
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
                background:
                  hovered === i
                    ? "#f8fafc"
                    : i % 2 === 0
                    ? "#ffffff"
                    : "#f9fafb",
                borderBottom: "1px solid #f1f5f9",
                cursor: "pointer",
                transition: "background 120ms ease",
              }}
            >
              <div style={{ flex: 1, minWidth: 0 }}>
                <div
                  style={{
                    fontSize: 14,
                    fontWeight: 600,
                    color: "#1e293b",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {e.name}
                </div>
              </div>

              <div
                style={{
                  textAlign: "right" as const,
                  flexShrink: 0,
                  minWidth: 60,
                }}
              >
                <div
                  style={{
                    fontSize: 18,
                    fontWeight: 700,
                    color: "#0f172a",
                    lineHeight: 1.1,
                  }}
                >
                  {e.jobs}
                </div>
                <div
                  style={{
                    fontSize: 12,
                    color: "#94a3b8",
                    marginTop: 2,
                  }}
                >
                  vị trí
                </div>
              </div>
            </div>
          ))}

          {!items.length && !error && (
            <div
              style={{
                padding: "24px 20px",
                textAlign: "center",
                color: "#94a3b8",
                fontSize: 13,
              }}
            >
              Không có dữ liệu doanh nghiệp
            </div>
          )}
        </div>
      )}
    </div>
  );
}