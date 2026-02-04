import AdminLayout from "../../components/layout/AdminLayout";
import GreetingCard from "../../components/common/greetingcard"
import { Card, Col, Row } from 'antd';
import "../../components/css/card.css"
import Chart from "../../components/common/chart";
import TimeLine from "../../components/common/timeline";
import StudentTable from "../../components/common/table";
import { useState } from "react";


export function DashBoard() {
  const [collapsed, setCollapsed] = useState();

  return (
    <div>

      <AdminLayout onCollapse={setCollapsed}>
        <GreetingCard />
        <br />
        {/* card content */}
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12} md={12} lg={6} xl={6}>
            <Card title="Tổng số sinh viên đánh giá" variant="borderless" className="stat-card">
              <span className="stat-number">1,128</span>
            </Card>
          </Col>
          <Col xs={24} sm={12} md={12} lg={6} xl={6}>
            <Card title="Số sinh viên đạt loại khá" variant="borderless" className="stat-card card-kha">
              <span className="stat-number">500</span>
            </Card>
          </Col>
          <Col xs={24} sm={12} md={12} lg={6} xl={6}>
            <Card title="Số sinh viên đạt loại giỏi" variant="borderless" className="stat-card card-gioi">
              <span className="stat-number">400</span>
            </Card>
          </Col>
          <Col xs={24} sm={12} md={12} lg={6} xl={6}>
            <Card title="Số sinh viên đạt loại xuất sắc" variant="borderless" className="stat-card card-xuatsac">
              <span className="stat-number">228</span>
            </Card>
          </Col>
        </Row>
        <br></br>
        <br></br><br></br>
        <br></br>
        <Chart collapsed={collapsed} apiURL="https://gw.alipayobjects.com/os/antfincdn/PC3daFYjNw/column-data.json" />
        <br></br><br></br><br></br><br></br>  <br></br><br></br>  
        <Row gutter={[16, 16]}>
          {/* Timeline */}
          <Col xs={24} sm={24} md={24} lg={8} xl={8}>
            <Card title="Tiến độ Đánh giá" style={{ height: '100%' }}>
              <TimeLine apiURL="https://api.npoint.io/05c2c7ae872642d62ad7" />
            </Card>
          </Col>

          {/* Cột cho Bảng */}
          <Col xs={24} sm={24} md={24} lg={16} xl={16}>
            <Card title="Danh sách Sinh viên" style={{ height: '100%' }}>
              <StudentTable apiURL="https://api.npoint.io/48c5185626a4cb0dec9e" />
            </Card>
          </Col>
        </Row>

      </AdminLayout>


    </div>
  );

}
export default DashBoard