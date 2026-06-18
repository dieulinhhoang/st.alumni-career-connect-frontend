import { useState } from "react";
import { Button, Col, Row, message } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import AdminLayout from "../../../components/layout/AdminLayout";
import { FacultyCard } from "../../system/DashBoard/FacultyCard";
import { EnterpriseList } from "../../system/DashBoard/Enterpriselist";
import { EnterpriseFormModal } from "../../system/EnterpriseDetail/EditEnterpriseModal";
import { getCurrentUser } from "../../../feature/auth/permission";
import GreetingCard from "../../../components/common/greetingcard";
import api from "../../../libs/api";
import type { EnterpriseFormValues } from "../../../feature/enterprise/type";

export function KhoaDashBoard() {
  const currentUser = getCurrentUser();
  const [modalOpen, setModalOpen] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);

  const handleAddEnterprise = async (values: EnterpriseFormValues) => {
    await api.post("/enterprises/by-faculty", values);
    message.success("Đã thêm doanh nghiệp liên kết");
    setModalOpen(false);
    setReloadKey((k) => k + 1);
  };

  return (
    <AdminLayout>
      <div>
        <GreetingCard />
        <br />
        <Row gutter={[16, 16]} align="stretch">
          <Col xs={24} lg={12}>
            <FacultyCard />
          </Col>
          <Col xs={24} lg={12}>
            <EnterpriseList
              key={reloadKey}
              facultyId={currentUser.facultyId}
              extra={
                <Button
                  size="small"
                  type="primary"
                  icon={<PlusOutlined />}
                  onClick={() => setModalOpen(true)}
                  style={{ background: "#1D9E75", border: "none" }}
                >
                  Thêm doanh nghiệp
                </Button>
              }
            />
          </Col>
        </Row>
      </div>

      <EnterpriseFormModal
        open={modalOpen}
        enterprise={null}
        faculties={[]}
        onClose={() => setModalOpen(false)}
        onSave={handleAddEnterprise}
      />
    </AdminLayout>
  );
}

export default KhoaDashBoard;
