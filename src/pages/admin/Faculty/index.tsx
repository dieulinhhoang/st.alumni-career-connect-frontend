import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, Row, Col, Input, Typography, Badge } from "antd";
import { SearchOutlined, RightOutlined, BookOutlined, TeamOutlined } from "@ant-design/icons";
import AdminLayout from "../../../components/layout/AdminLayout";
import { useFaculties } from "../../../feature/faculty/hooks/useFaculties";

const { Title, Text } = Typography;

export default function FacultyListPage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const { data: faculties, loading } = useFaculties();

  const filtered = faculties.filter(f =>
    f.name.toLowerCase().includes(search.toLowerCase()) ||
    f.abbr.toLowerCase().includes(search.toLowerCase())
  );

  const totalStudents = faculties.reduce((s, f) => s + f.students, 0);
  const totalMajors   = faculties.reduce((s, f) => s + f.majors, 0);

  return (
    <AdminLayout>
      <div>
        <div style={{ marginBottom: 24 }}>
          <Title level={4} style={{ margin: 0 }}>Khoa</Title>
          <Text type="secondary" style={{ fontSize: 13 }}>{filtered.length} / {faculties.length} khoa</Text>
        </div>

        <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
          {[
            { label: "Tổng số khoa",   value: faculties.length,               color: "#7c3aed", bg: "linear-gradient(135deg,#ede9fe,#ddd6fe)" },
            { label: "Ngành đào tạo",  value: totalMajors,                    color: "#0ea5e9", bg: "linear-gradient(135deg,#e0f2fe,#bae6fd)" },
            { label: "Tổng sinh viên", value: totalStudents.toLocaleString(),  color: "#f59e0b", bg: "linear-gradient(135deg,#fef9c3,#fde68a)" },
          ].map(s => (
            <Col key={s.label} xs={12} md={8}>
              <Card variant="borderless" style={{ borderRadius: 12, background: s.bg, border: "none" }}>
                <div style={{ fontSize: 26, fontWeight: 800, color: s.color }}>{s.value}</div>
                <div style={{ fontSize: 12, color: s.color, opacity: 0.8, marginTop: 4 }}>{s.label}</div>
              </Card>
            </Col>
          ))}
        </Row>

        <div style={{ marginBottom: 16 }}>
          <Input
            // prefix={<SearchOutlined style={{ color: "#9ca3af" }} />}
            placeholder="Tìm kiếm ..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ maxWidth: 380, borderRadius: 10 }}
            // allowClear
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
                  style={{
                    background: "white", borderRadius: 16, border: "1px solid #f0f0f0",
                    padding: "20px 24px", cursor: "pointer", transition: "all 0.2s",
                    position: "relative", overflow: "hidden",
                  }}
                  onMouseEnter={e => {
                    const el = e.currentTarget as HTMLElement;
                    el.style.transform = "translateY(-2px)";
                    el.style.boxShadow = `0 8px 24px ${f.color}20`;
                    el.style.borderColor = f.color + "40";
                  }}
                  onMouseLeave={e => {
                    const el = e.currentTarget as HTMLElement;
                    el.style.transform = "translateY(0)";
                    el.style.boxShadow = "none";
                    el.style.borderColor = "#f0f0f0";
                  }}
                >
                  <div style={{ position: "absolute", top: 0, left: 0, width: 4, height: "100%",borderRadius: "16px 0 0 16px" }} />
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
          {!loading && filtered.length === 0 && (
            <div style={{ textAlign: "center", padding: "48px 0", color: "#9ca3af" }}>
              <div style={{ fontSize: 32, marginBottom: 8 }}>🏫</div>
              <div>Không tìm thấy khoa nào</div>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}