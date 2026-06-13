import { Col, Row, Typography } from "antd";
import AdminLayout from "../../../components/layout/AdminLayout";
import { FacultyCard } from "../../system/DashBoard/FacultyCard";
import { EnterpriseList } from "../../system/DashBoard/Enterpriselist";
import { COLOR, RADIUS, SHADOW } from "../../system/DashBoard/theme";
import { getCurrentUser } from "../../../feature/auth/permission";
import GreetingCard from "../../../components/common/greetingcard";
const { Title, Text } = Typography;

export function KhoaDashBoard() {
  const currentUser = getCurrentUser();

  return (
    <AdminLayout>
      <div>
        {/* Hero banner */}
        {/* <div
          style={{
            marginBottom: 24,
            background: `linear-gradient(135deg, ${COLOR.primaryTint} 0%, #f1f8f4 40%, #ffffff 100%)`,
            borderRadius: RADIUS.xl,
            padding: "20px 24px",
            position: "relative",
            overflow: "hidden",
            border: `1px solid ${COLOR.borderSoft}`,
            boxShadow: SHADOW.sm,
          }}
        >
          <div
            style={{
              position: "absolute", top: -30, right: -30,
              width: 160, height: 160, borderRadius: "50%",
              background: `${COLOR.primary}08`,
              pointerEvents: "none",
            }}
          />
          <div
            style={{
              position: "absolute", bottom: -20, right: 80,
              width: 80, height: 80, borderRadius: "50%",
              background: `${COLOR.primary}05`,
              pointerEvents: "none",
            }}
          />

          <div style={{ position: "relative" }}>
            <Title level={4} style={{ margin: 0, color: COLOR.textDark, fontWeight: 800, fontSize: 20 }}>
              Tổng quan khoa
            </Title>
            <Text style={{ fontSize: 13, color: COLOR.textMuted }}>
              Xin chào, <strong style={{ color: COLOR.primary }}>{currentUser.name || "cán bộ khoa"}</strong>
            </Text>
          </div>
        </div> */}
          <GreetingCard />
        {/* Faculty report + Enterprise */}
        <br></br>
        <Row gutter={[16, 16]} align="stretch">
          <Col xs={5} lg={10}>
            <FacultyCard />
          </Col>
      
        </Row>
      </div>
    </AdminLayout>
  );
}

export default KhoaDashBoard;
