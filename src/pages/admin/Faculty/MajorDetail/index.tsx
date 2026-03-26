import { useParams, useNavigate } from "react-router-dom";
import { Card, Row, Col, Button, Tag, Typography, Divider } from "antd";
import { ArrowLeftOutlined, UserOutlined, CalendarOutlined } from "@ant-design/icons";
import AdminLayout from "../../../../components/layout/AdminLayout";
import { useMajorDetail } from "../../../../feature/faculty/hooks/useFaculties";
import { useFacultyDetail } from "../../../../feature/faculty/hooks/useFaculties";

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
          Quay lại {faculty?.name}
        </Button>

        {/* Hero */}
        <Card style={{ borderRadius: 16, marginBottom: 20, border: `1px solid ${color}30`, overflow: "hidden" }}>
          <div style={{ height: 80, background: `linear-gradient(135deg, ${color}22, ${color}44)`, margin: "-24px -24px 0", borderBottom: `2px solid ${color}20` }} />
          <div style={{ display: "flex", alignItems: "center", gap: 16, marginTop: -28 }}>
            <div style={{ width: 60, height: 60, borderRadius: 14, background: color + "18", border: "3px solid white", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 4px 12px rgba(0,0,0,0.1)", flexShrink: 0 }}>
              <span style={{ fontWeight: 900, fontSize: 13, color }}>{major.code}</span>
            </div>
            <div style={{ paddingBottom: 4 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <Title level={4} style={{ margin: 0, color: "#1e1b4b" }}>{major.name}</Title>
                <Tag color="purple" style={{ fontSize: 12 }}>{major.code}</Tag>
              </div>
              <Text type="secondary" style={{ fontSize: 13 }}>{faculty?.name}</Text>
            </div>
          </div>
        </Card>

        {/* Stats */}
        <Row gutter={[16, 16]} style={{ marginBottom: 20 }}>
          {[
            { label: "Sinh viên",      value: major.students,      icon: <UserOutlined />,     color,          bg: color + "12"  },
            { label: "Khóa đào tạo",   value: major.khoa.length,   icon: <CalendarOutlined />, color: "#0ea5e9", bg: "#e0f2fe"   },
          ].map(s => (
            <Col key={s.label} xs={12}>
              <Card variant="borderless" style={{ borderRadius: 12, background: s.bg, border: "none", textAlign: "center" }}>
                <div style={{ fontSize: 24, fontWeight: 800, color: s.color }}>{s.value}</div>
                <div style={{ fontSize: 12, color: s.color, opacity: 0.8, marginTop: 2 }}>{s.label}</div>
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
                padding: "5px 16px", borderRadius: 20, fontSize: 13, fontWeight: 600,
                background: color + "15", color,
                border: `1px solid ${color}25`,
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