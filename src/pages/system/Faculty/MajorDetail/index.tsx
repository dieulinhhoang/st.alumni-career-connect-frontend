import { useParams, useNavigate } from "react-router-dom";
import { Card, Row, Col, Button, Tag, Typography } from "antd";
import { ArrowLeftOutlined, UserOutlined, CalendarOutlined } from "@ant-design/icons";
import AdminLayout from "../../../../components/layout/AdminLayout";
import { useMajorDetail, useFacultyDetail } from "../../../../feature/faculty/hooks/useFaculties";

const { Title, Text, Paragraph } = Typography;

export default function MajorDetailPage() {
  const { facultySlug = "", majorSlug = "" } = useParams<{
    facultySlug: string;
    majorSlug: string;
  }>();
  const navigate = useNavigate();

  const { faculty } = useFacultyDetail(facultySlug);
  const { major, loading } = useMajorDetail(majorSlug);

  const color = faculty?.color ?? "#7c3aed";

  if (loading) return (
    <AdminLayout>
      <div style={{ textAlign: "center", padding: 60, color: "#9ca3af" }}>Đang tải...</div>
    </AdminLayout>
  );

  if (!major) return (
    <AdminLayout>
      <div style={{ textAlign: "center", padding: 60 }}>
        <div style={{ fontSize: 48, marginBottom: 12 }}>📚</div>
        <div>Không tìm thấy ngành</div>
        <Button style={{ marginTop: 16 }} onClick={() => navigate(`/admin/faculties/${facultySlug}`)}>Quay lại</Button>
      </div>
    </AdminLayout>
  );

  return (
    <AdminLayout>
      <div>
        {/* Back */}
        <Button icon={<ArrowLeftOutlined />} type="text"
          style={{ marginBottom: 16, padding: "0 4px", color: "#6b7280" }}
          onClick={() => navigate(`/admin/faculties/${facultySlug}`)}
        >
          {faculty?.name}
        </Button>

       
        <div style={{
          borderRadius: 16,
          border: `1px solid ${color}25`,
          overflow: "hidden",
          marginBottom: 20,
          background: "white",
        }}>
          {/* Gradient banner */}
          <div style={{
            height: 90,
            background: `linear-gradient(135deg, ${color}35 0%, ${color}60 100%)`,
          }} />

          {/* Avatar + Info */}
          <div style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            padding: "0 24px 20px",
          }}>
            <div style={{
              width: 64,
              height: 64,
              borderRadius: 14,
              background: "white",
              border: `2px solid ${color}30`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
              marginTop: -32,
              boxShadow: "0 4px 16px rgba(0,0,0,0.10)",
            }}>
              <span style={{ fontWeight: 900, fontSize: 12, color }}>{major.code}</span>
            </div>

            <div style={{ paddingTop: 12 }}>
              {/* flexWrap so Tag doesn't overflow on narrow screens */}
              <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                <Title level={4} style={{ margin: 0, color: "#1e1b4b" }}>{major.name}</Title>
                <Tag color="purple" style={{ fontSize: 12 }}>{major.code}</Tag>
              </div>
              <Text type="secondary" style={{ fontSize: 13 }}>{faculty?.name}</Text>
            </div>
          </div>
        </div>

        {/* Stats */}
        <Row gutter={[16, 16]} style={{ marginBottom: 20 }}>
          {[
            { label: "Sinh viên",     value: major.students,    color,           bg: color + "12" },
            { label: "Khóa đào tạo",  value: major.khoa.length, color: "#0ea5e9", bg: "#e0f2fe"   },
          ].map(s => (
            <Col key={s.label} xs={12}>
              <Card variant="borderless" style={{ borderRadius: 12, background: s.bg, border: "none", textAlign: "center" }}>
                <div style={{ fontSize: 28, fontWeight: 800, color: s.color }}>{s.value}</div>
                <div style={{ fontSize: 13, color: s.color, opacity: 0.85, marginTop: 4 }}>{s.label}</div>
              </Card>
            </Col>
          ))}
        </Row>

        {/* Description */}
        {major.description && (
          <Card style={{ borderRadius: 14, border: "1px solid #f0f0f0", marginBottom: 16 }}>
            <Text style={{ fontSize: 12, fontWeight: 600, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.05em" }}>
              Giới thiệu ngành
            </Text>
            <Paragraph style={{ marginTop: 10, marginBottom: 0, color: "#374151", fontSize: 14, lineHeight: 1.75 }}>
              {major.description}
            </Paragraph>
          </Card>
        )}

        {/* Khoa tags */}
        <Card style={{ borderRadius: 14, border: "1px solid #f0f0f0" }}>
          <Text style={{ fontSize: 12, fontWeight: 600, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.05em" }}>
            Các khóa đang đào tạo
          </Text>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 12 }}>
            {major.khoa.map(k => (
              <span key={k} style={{
                padding: "6px 18px", borderRadius: 20, fontSize: 13, fontWeight: 600,
                background: color + "15", color,
                border: `1px solid ${color}30`,
              }}>
                Khóa {k}
              </span>
            ))}
          </div>
        </Card>
      </div>
    </AdminLayout>
  );
}