import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Row, Col, Input, Typography } from "antd";
import { RightOutlined, BookOutlined, TeamOutlined, AppstoreOutlined, BookFilled, TeamOutlined as TeamIcon } from "@ant-design/icons";
import AdminLayout from "../../../components/layout/AdminLayout";
import { useFaculties } from "../../../feature/faculty/hooks/useFaculties";

const { Title } = Typography;

const STAT_COLORS = [
  { accent: "#7c3aed", iconBg: "#f5f3ff" },
  { accent: "#0ea5e9", iconBg: "#f0f9ff" },
  { accent: "#f59e0b", iconBg: "#fffbeb" },
];

export default function FacultyListPage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const { data: faculties, loading } = useFaculties();

  const filtered = faculties.filter(f =>
    f.name.toLowerCase().includes(search.toLowerCase()) ||
    f.abbr.toLowerCase().includes(search.toLowerCase())
  );

  const totalStudents = faculties.reduce((s, f) => s + f.students, 0);
  const totalMajors   = faculties.reduce((s, f) => s + f.majors, 0);

  const isEmpty = !loading && filtered.length === 0;
  const isNoFaculties = isEmpty && faculties.length === 0 && search === "";
  const isNoResults   = isEmpty && !isNoFaculties;

  const statCards = [
    {
      label: "Total Faculties",
      value: faculties.length,
      sub: "registered faculties",
      icon: <AppstoreOutlined />,
      ...STAT_COLORS[0],
    },
    {
      label: "Training Majors",
      value: totalMajors,
      sub: "active programs",
      icon: <BookFilled />,
      ...STAT_COLORS[1],
    },
    {
      label: "Total Students",
      value: totalStudents.toLocaleString(),
      sub: "enrolled students",
      icon: <TeamIcon />,
      ...STAT_COLORS[2],
    },
  ];

  return (
    <AdminLayout>
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>

      <div>
        <div style={{ marginBottom: 24 }}>
          <Title level={4} style={{ margin: 0 }}>Khoa</Title>
        </div>

        {/* Stat cards — Statistics KPI style */}
        <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
          {statCards.map(s => (
            <Col key={s.label} xs={24} sm={8} md={8}>
              <div
                style={{
                  background: "#ffffff",
                  borderRadius: 12,
                  border: "1px solid rgba(30,41,59,0.10)",
                  boxShadow: "0 1px 3px rgba(30,41,59,0.07), 0 1px 2px rgba(30,41,59,0.04)",
                  padding: "20px 22px",
                  display: "flex",
                  alignItems: "flex-start",
                  gap: 16,
                  transition: "box-shadow 160ms cubic-bezier(0.16,1,0.3,1), transform 160ms cubic-bezier(0.16,1,0.3,1)",
                }}
                onMouseEnter={e => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.boxShadow = "0 4px 16px rgba(30,41,59,0.09), 0 1px 4px rgba(30,41,59,0.05)";
                  el.style.transform = "translateY(-1px)";
                }}
                onMouseLeave={e => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.boxShadow = "0 1px 3px rgba(30,41,59,0.07), 0 1px 2px rgba(30,41,59,0.04)";
                  el.style.transform = "translateY(0)";
                }}
              >
                {/* Icon box */}
                <div style={{
                  width: 44,
                  height: 44,
                  borderRadius: 10,
                  background: s.iconBg,
                  color: s.accent,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 18,
                  flexShrink: 0,
                }}>
                  {s.icon}
                </div>
                {/* Body */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 12, color: "#94a3b8", fontWeight: 500, letterSpacing: "0.02em", marginBottom: 4, lineHeight: 1 }}>
                    {s.label}
                  </div>
                  <div style={{ fontSize: 28, fontWeight: 700, color: "#1e293b", lineHeight: 1.1, letterSpacing: "-0.02em", fontVariantNumeric: "tabular-nums", marginBottom: 4 }}>
                    {s.value}
                  </div>
                  <div style={{ fontSize: 12, color: "#94a3b8" }}>{s.sub}</div>
                </div>
              </div>
            </Col>
          ))}
        </Row>

        <div style={{ marginBottom: 16 }}>
          <Input
            placeholder="Tìm kiếm ..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ maxWidth: 380, borderRadius: 10 }}
          />
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {loading
            ? Array.from({ length: 5 }).map((_, i) => (
                <div key={i} style={{ height: 72, borderRadius: 16, background: "#f3f4f6", animation: "pulse 1.5s infinite" }} />
              ))
            : filtered.map(f => (
                <div
                  key={f.id}
                  onClick={() => navigate(`/admin/faculties/${f.slug}`)}
                  onMouseEnter={() => setHoveredId(f.id)}
                  onMouseLeave={() => setHoveredId(null)}
                  style={{
                    background: "white",
                    borderRadius: 16,
                    border: `1px solid ${hoveredId === f.id ? f.color + "40" : "#f0f0f0"}`,
                    padding: "20px 24px",
                    cursor: "pointer",
                    transition: "all 0.2s",
                    position: "relative",
                    overflow: "hidden",
                    transform: hoveredId === f.id ? "translateY(-2px)" : "translateY(0)",
                    boxShadow: hoveredId === f.id ? `0 8px 24px ${f.color}20` : "none",
                  }}
                >
                  <div style={{
                    position: "absolute", top: 0, left: 0, width: 4, height: "100%",
                    borderRadius: "16px 0 0 16px",
                    background: f.color,
                  }} />
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                      <div style={{ width: 48, height: 48, borderRadius: 12, background: f.color + "15", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                        <span style={{ fontWeight: 800, fontSize: 13, color: f.color }}>{f.abbr}</span>
                      </div>
                      <div>
                        <div style={{ fontWeight: 700, fontSize: 15, color: "#1e1b4b", marginBottom: 4 }}>{f.name}</div>
                        <div style={{ display: "flex", gap: 12, fontSize: 12, color: "#6b7280" }}>
                          <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
                            <BookOutlined style={{ fontSize: 11 }} />{f.majors} ngành
                          </span>
                          <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
                            <TeamOutlined style={{ fontSize: 11 }} />{f.students.toLocaleString()} sinh viên
                          </span>
                        </div>
                      </div>
                    </div>
                    <RightOutlined style={{ fontSize: 12, color: "#9ca3af" }} />
                  </div>
                </div>
              ))
          }

           {isNoFaculties && (
            <div style={{ textAlign: "center", padding: "48px 0", color: "#9ca3af" }}>
              <div>Chưa có khoa nào trong hệ thống</div>
            </div>
          )}
          {isNoResults && (
            <div style={{ textAlign: "center", padding: "48px 0", color: "#9ca3af" }}>
              <div>Không tìm thấy khoa nào phù hợp với "<strong>{search}</strong>"</div>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
