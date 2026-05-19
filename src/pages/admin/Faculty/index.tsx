import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  Row,
  Col,
  Input,
  Typography,
} from "antd";
import {
  RightOutlined,
  BookOutlined,
  TeamOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import AdminLayout from "../../../components/layout/AdminLayout";
import { useFaculties } from "../../../feature/faculty/hooks/useFaculties";

const { Title, Text } = Typography;

// Brand colors 
const BRAND_GREEN = "#056f38";   // xanh logo
const BRAND_YELLOW = "#FFC20E";  // vàng logo
const BRAND_ORANGE = "#614525";  // cam logo

// dùng xanh logo làm main cho list khoa
const PRIMARY = BRAND_GREEN;

const CARD_BG = "#f9fafb";
const CARD_BORDER = "#e5e7eb";
const TEXT_MAIN = "#0f172a";
const TEXT_SECONDARY = "#6b7280";

export default function FacultyListPage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const { data: faculties, loading } = useFaculties();

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

  const totalStudents = list.reduce((s, f) => s + (f.students || 0), 0);
  const totalMajors = list.reduce((s, f) => s + (f.majors || 0), 0);

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
        {/* Header */}
        <div
          style={{
            marginBottom: 20,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 16,
          }}
        >
          <div>
            <Title level={4} style={{ margin: 0, color: TEXT_MAIN }}>
              Khoa
            </Title>
            <Text type="secondary" style={{ fontSize: 13 }}>
              Quản lý danh sách khoa và thông tin quy mô đào tạo
            </Text>
          </div>

          <Input
            allowClear
            placeholder="Tìm kiếm "
            prefix={<SearchOutlined style={{ color: "#9ca3af" }} />}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              maxWidth: 340,
              borderRadius: 999,
            }}
          />
        </div>

        {/* Stats – 3 màu logo (xanh, vàng, cam) */}
        <Row gutter={[16, 16]} style={{ marginBottom: 20 }}>
          {[
            { label: "Tổng số khoa", value: list.length, color: BRAND_GREEN },
            { label: "Ngành đào tạo", value: totalMajors, color: BRAND_YELLOW },
            {
              label: "Tổng sinh viên",
              value: totalStudents.toLocaleString(),
              color: BRAND_ORANGE,
            },
          ].map((s) => (
            <Col key={s.label} xs={24} sm={8}>
              <div
                style={{
                  background: CARD_BG,
                  borderRadius: 16,
                  padding: "16px 20px",
                  border: `1px solid ${CARD_BORDER}`,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  height: 70,
                }}
              >
                <div
                  style={{
                    fontSize: 22,
                    fontWeight: 700,
                    color: s.color,
                    lineHeight: 1.1,
                  }}
                >
                  {s.value}
                </div>
                <div
                  style={{
                    fontSize: 13,
                    color: TEXT_SECONDARY,
                    marginTop: 4,
                    fontWeight: 500,
                  }}
                >
                  {s.label}
                </div>
              </div>
            </Col>
          ))}
        </Row>

        {/* List khoa – primary xanh VNUA + nền xám */}
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
                    border: `1px solid ${CARD_BORDER}`,
                  }}
                />
              ))
            : filtered.map((f) => {
                const isHovered = hoveredId === f.id;
                return (
                  <div
                    key={f.id}
                    onClick={() => navigate(`/admin/faculties/${f.slug}`)}
                    onMouseEnter={() => setHoveredId(f.id)}
                    onMouseLeave={() => setHoveredId(null)}
                    style={{
                      background: "#ffffff",
                      borderRadius: 14,
                      border: `1px solid ${
                        isHovered ? CARD_BORDER : "#e5e7eb"
                      }`,
                      padding: "18px 20px",
                      cursor: "pointer",
                      transition: "all 0.18s ease",
                      position: "relative",
                      overflow: "hidden",
                      transform: isHovered ? "translateY(-1px)" : "none",
                      boxShadow: isHovered
                        ? "0 10px 24px rgba(15,23,42,0.08)"
                        : "0 1px 3px rgba(15,23,42,0.03)",
                    }}
                  >
                    {/* thanh dọc primary xanh VNUA */}
                    {/* <div
                      style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        width: 3,
                        height: "100%",
                        borderRadius: "14px 0 0 14px",
                        background: PRIMARY,
                      }}
                    /> */}
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 14,
                        }}
                      >
                        <div
                          style={{
                            width: 44,
                            height: 44,
                            borderRadius: 12,
                            background: "#f0fdf4", // xanh rất nhạt
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            flexShrink: 0,
                          }}
                        >
                          <span
                            style={{
                              fontWeight: 700,
                              fontSize: 13,
                              color: PRIMARY,
                              textTransform: "uppercase",
                            }}
                          >
                            {f.abbr}
                          </span>
                        </div>
                        <div>
                          <div
                            style={{
                              fontWeight: 600,
                              fontSize: 15,
                              color: TEXT_MAIN,
                              marginBottom: 4,
                            }}
                          >
                            {f.name}
                          </div>
                          <div
                            style={{
                              display: "flex",
                              gap: 12,
                              fontSize: 12,
                              color: TEXT_SECONDARY,
                            }}
                          >
                            <span
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: 4,
                              }}
                            >
                              <BookOutlined style={{ fontSize: 11 }} />
                              {f.majors} ngành
                            </span>
                            <span
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: 4,
                              }}
                            >
                              <TeamOutlined style={{ fontSize: 11 }} />
                              {f.students.toLocaleString()} sinh viên
                            </span>
                          </div>
                        </div>
                      </div>
                      <RightOutlined
                        style={{
                          fontSize: 12,
                          color: "#9ca3af",
                        }}
                      />
                    </div>
                  </div>
                );
              })}

          {isNoFaculties && (
            <div
              style={{
                textAlign: "center",
                padding: "40px 0",
                color: TEXT_SECONDARY,
                borderRadius: 12,
                border: `1px dashed ${CARD_BORDER}`,
                background: "#f9fafb",
              }}
            >
              <div>Chưa có khoa nào trong hệ thống</div>
            </div>
          )}

          {isNoResults && (
            <div
              style={{
                textAlign: "center",
                padding: "40px 0",
                color: TEXT_SECONDARY,
              }}
            >
              <div>
                Không tìm thấy khoa nào phù hợp với{" "}
                <span style={{ fontWeight: 600, color: PRIMARY }}>
                  "{search}"
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}