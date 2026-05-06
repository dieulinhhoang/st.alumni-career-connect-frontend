import { Card, Row, Col, Statistic, Typography } from 'antd';
import {
  UserOutlined, BankOutlined, FileTextOutlined, CheckCircleOutlined
} from '@ant-design/icons';
import AdminLayout from '../../../components/layout/AdminLayout';

const { Title, Text } = Typography;

const stats = [
  { title: 'Tổng sinh viên', value: 1280, icon: <UserOutlined />, color: '#7c3aed', bg: '#ede9fe' },
  { title: 'Doanh nghiệp đối tác', value: 42, icon: <BankOutlined />, color: '#0891b2', bg: '#e0f2fe' },
  { title: 'Khảo sát đang mở', value: 5, icon: <FileTextOutlined />, color: '#059669', bg: '#d1fae5' },
  { title: 'Phản hồi hôm nay', value: 38, icon: <CheckCircleOutlined />, color: '#d97706', bg: '#fef3c7' },
];

export default function DashBoard() {
  return (
    <AdminLayout>
      <div style={{ padding: '0 0 32px' }}>
        <div style={{ marginBottom: 24 }}>
          <Title level={3} style={{ margin: 0 }}>Bảng điều khiển</Title>
          <Text type="secondary">Tổng quan hệ thống quản lý cựu sinh viên</Text>
        </div>
        <Row gutter={[16, 16]}>
          {stats.map(s => (
            <Col key={s.title} xs={24} sm={12} lg={6}>
              <Card style={{ borderRadius: 14, border: 'none', background: s.bg }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                  <div style={{
                    width: 44, height: 44, borderRadius: 10,
                    background: s.color + '20',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: s.color,
                  }}>
                    {s.icon}
                  </div>
                  <Statistic title={s.title} value={s.value} valueStyle={{ color: s.color, fontWeight: 800 }} />
                </div>
              </Card>
            </Col>
          ))}
        </Row>
      </div>
    </AdminLayout>
  );
}
