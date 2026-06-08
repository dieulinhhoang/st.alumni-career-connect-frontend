import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Row, Col, Input, Typography } from "antd";
import {
  RightOutlined,
  BookOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import AdminLayout from "../../../components/layout/AdminLayout";
import { useFaculties } from "../../../feature/faculty/hooks/useFaculties";

const { Title, Text } = Typography;

const COLOR = {
  primary: "#16a34a",
  yellow: "#f59e0b",
  text: "#0f172a",
  sub: "#64748b",
  border: "#e5e7eb",
  cardBg: "#f9fafb",
};

export default function FacultyListPage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const { faculties, loading, error } = useFaculties();

  const list = Array.isArray(faculties) ? faculties : [];

  const filtered = useMemo(
    () =>
      list.filter((f) => {
        const keyword = search.trim().toLowerCase();
        if (!keyword) return true;
        return (
          f?.name?.toLowerCase().includes(keyword) ||
          f?.abbr?.toLowerCase().includes(keyword)
        );
      }),
    [list, search]
  );

  const getMajorCount = (faculty: any) => Number(faculty?.majorCount ?? 0);
  const isEmpty = !loading && filtered.length === 0;
  const isNoFaculties = isEmpty && list.length === 0 && search === "";
  const isNoResults = isEmpty && !isNoFaculties;

  return (
    <AdminLayout>
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>

      <div style={{ padding: 4 }}>
        <div
          style={{
            marginBottom: 20,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 16,
            flexWrap: "wrap",
          }}
        >
          <div>
            <Title level={4} style={{ margin: 0, color: COLOR.text }}>Khoa</Title>
            <Text type="secondary" style={{ fontSize: 13 }}>
              Quản lý danh sách khoa và thông tin quy mô đào tạo
            </Text>
          </div>

          <Input
            allowClear
            placeholder="Tìm kiếm khoa..."
            prefix={<SearchOutlined style={{ color: "#9ca3af" }} />}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ maxWidth: 280, borderRadius: 999 }}
          />
        </div>

        {error && (
          <div
            style={{
              marginBottom: 16,
              padding: "12px 16px",
              borderRadius: 10,
              background: "#fff1f2",
              border: "1px solid #fecdd3",
              color: "#be123c",
              fontSize: 13,
            }}
          >
            {error}
          </div>
        )}

        {/* FIX: minHeight thay vì height cố định — tránh bị cắt khi text dài */}
        <Row gutter={[14, 14]} style={{ marginBottom: 20 }}>
          {[
            { label: "Tổng số khoa", value: list.length, color: COLOR.primary },
            { label: "Ngành đào tạo", value: list.reduce((sum, f) => sum + getMajorCount(f), 0), color: COLOR.yellow },
          ].map((s) => (
            <Col key={s.label} xs={24} sm={8}>
              <div
                style={{
                  background: COLOR.cardBg,
                  borderRadius: 14,
                  padding: "16px 20px",
                  border: `1px solid ${COLOR.border}`,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  minHeight: 70,          // FIX: minHeight, không phải height
                }}
              >
                <div style={{ fontSize: 24, fontWeight: 700, color: s.color, lineHeight: 1.1 }}>
                  {s.value}
                </div>
                <div style={{ fontSize: 13, color: COLOR.sub, marginTop: 4, fontWeight: 500 }}>
                  {s.label}
                </div>
              </div>
            </Col>
          ))}
        </Row>

        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {loading
            ? Array.from({ length: 5 }).map((_, i) => (
                <div
                  key={i}
                  style={{
                    height: 72,
                    borderRadius: 14,
                    background: "#f3f4f6",
                    animation: "pulse 1.5s infinite",
                    border: `1px solid ${COLOR.border}`,
                  }}
                />
              ))
            : filtered.map((f) => {
                const isHovered = hoveredId === String(f.id);
                return (
                  <div
                    key={f.id}
                    onClick={() => navigate(`/admin/faculties/${f.slug}`)}
                    onMouseEnter={() => setHoveredId(String(f.id))}
                    onMouseLeave={() => setHoveredId(null)}
                    style={{
                      background: "#ffffff",
                      borderRadius: 14,
                      border: `1px solid ${isHovered ? "#d1fae5" : COLOR.border}`,
                      padding: "16px 20px",
                      cursor: "pointer",
                      transition: "all 0.18s ease",
                      transform: isHovered ? "translateY(-1px)" : "none",
                      boxShadow: isHovered
                        ? "0 8px 24px rgba(15,23,42,0.08)"
                        : "0 1px 3px rgba(15,23,42,0.03)",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                        <div
                          style={{
                            width: 44,
                            height: 44,
                            borderRadius: 12,
                            background: "#f0fdf4",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            flexShrink: 0,
                          }}
                        >
                          <span style={{ fontWeight: 700, fontSize: 12, color: COLOR.primary, textTransform: "uppercase" }}>
                            {f.abbr}
                          </span>
                        </div>

                        <div>
                          <div style={{ fontWeight: 600, fontSize: 15, color: COLOR.text, marginBottom: 4 }}>
                            {f.name}
                          </div>
                          <div style={{ display: "flex", gap: 12, fontSize: 12, color: COLOR.sub }}>
                            <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
                              <BookOutlined style={{ fontSize: 11 }} />
                              {getMajorCount(f)} ngành
                            </span>
                          </div>
                        </div>
                      </div>

                      <RightOutlined style={{ fontSize: 12, color: "#9ca3af" }} />
                    </div>
                  </div>
                );
              })}

          {isNoFaculties && (
            <div
              style={{
                textAlign: "center",
                padding: "40px 0",
                color: COLOR.sub,
                borderRadius: 12,
                border: `1px dashed ${COLOR.border}`,
                background: COLOR.cardBg,
              }}
            >
              Chưa có khoa nào trong hệ thống
            </div>
          )}

          {isNoResults && (
            <div style={{ textAlign: "center", padding: "40px 0", color: COLOR.sub }}>
              Không tìm thấy khoa nào phù hợp với{" "}
              <span style={{ fontWeight: 600, color: COLOR.primary }}>"{search}"</span>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}