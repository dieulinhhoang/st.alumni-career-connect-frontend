import { useState, useEffect } from 'react';
import {
  Table, Tag, Button, Input, Select, Space, Spin,
  Row, Col, Card, Statistic, Typography, Tooltip, Modal, Progress
} from 'antd';
import {
  ArrowLeftOutlined, SearchOutlined, EyeOutlined,
  UserOutlined, CheckCircleOutlined, ClockCircleOutlined,
  DownloadOutlined, BarChartOutlined
} from '@ant-design/icons';
import { useNavigate, useParams } from 'react-router-dom';
import { useBatchResults } from '../../../feature/alumni/hooks/useBatchResults';
import { exportBatchResults } from '../../../feature/alumni/api';
import type { AlumniResponse } from '../../../feature/alumni/type';
import type { ColumnsType } from 'antd/es/table';

const { Title, Text } = Typography;

export default function BatchResults() {
  const { batchId } = useParams<{ batchId: string }>();
  const navigate = useNavigate();
  const { batch, responses, stats, loading, fetchResults } = useBatchResults(batchId);

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [exportLoading, setExportLoading] = useState(false);

  useEffect(() => { if (batchId) fetchResults(); }, [batchId]);

  const filtered = responses.filter(r => {
    const matchSearch = !search ||
      r.studentName?.toLowerCase().includes(search.toLowerCase()) ||
      r.studentCode?.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'all' || r.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const handleExport = async () => {
    if (!batchId) return;
    setExportLoading(true);
    try {
      await exportBatchResults(batchId);
    } finally {
      setExportLoading(false);
    }
  };

  const columns: ColumnsType<AlumniResponse> = [
    {
      title: 'Họ tên',
      key: 'name',
      render: (_: any, r: AlumniResponse) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{
            width: 32, height: 32, borderRadius: '50%', flexShrink: 0,
            background: '#ede9fe', display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontWeight: 700, color: '#7c3aed',
          }}>
            {r.studentName?.[0]?.toUpperCase() ?? 'A'}
          </div>
          <div>
            <div style={{ fontWeight: 600 }}>{r.studentName}</div>
            <div style={{ color: '#9ca3af' }}>{r.studentCode}</div>
          </div>
        </div>
      ),
    },
    {
      title: 'Khoa',
      dataIndex: 'faculty',
      key: 'faculty',
      render: (faculty: string) => <Tag color="purple">{faculty}</Tag>,
    },
    {
      title: 'Trạng thái việc làm',
      dataIndex: 'employmentStatus',
      key: 'employmentStatus',
      render: (status: string) => {
        const map: Record<string, { color: string; label: string }> = {
          employed: { color: 'green', label: 'Đang làm việc' },
          unemployed: { color: 'red', label: 'Chưa có việc' },
          studying: { color: 'blue', label: 'Đang học' },
          other: { color: 'default', label: 'Khác' },
        };
        const info = map[status] ?? { color: 'default', label: status };
        return <Tag color={info.color}>{info.label}</Tag>;
      },
    },
    {
      title: 'Thời gian nộp',
      dataIndex: 'submittedAt',
      key: 'submittedAt',
      render: (date: string) => <span style={{ color: '#6b7280' }}>{date}</span>,
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={status === 'completed' ? 'green' : 'orange'}>
          {status === 'completed' ? 'Hoàn thành' : 'Chưa hoàn thành'}
        </Tag>
      ),
    },
    {
      title: 'Thao tác',
      key: 'action',
      render: (_: any, r: AlumniResponse) => (
        <Button
          type="link" icon={<EyeOutlined />}
          onClick={() => navigate(`/admin/alumni/response/${r.id}`)}
        >
          Xem
        </Button>
      ),
    },
  ];

  if (loading) return (
    <div style={{ textAlign: 'center', padding: 80 }}><Spin size="large" /></div>
  );

  return (
    <div style={{ padding: '0 0 32px' }}>
      <Button
        icon={<ArrowLeftOutlined />} type="text"
        style={{ marginBottom: 16, color: '#6b7280', padding: '0 4px' }}
        onClick={() => navigate('/admin/alumni')}
      >
        Quay lại danh sách
      </Button>

      {batch && (
        <div style={{ marginBottom: 24 }}>
          <Title level={4} style={{ margin: 0 }}>{batch.name}</Title>
          <Text type="secondary">{batch.startDate} – {batch.endDate}</Text>
        </div>
      )}

      {/* Stats */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        {[
          { title: 'Tổng sinh viên', value: stats.total, icon: <UserOutlined />, color: '#7c3aed', bg: '#ede9fe' },
          { title: 'Đã phản hồi', value: stats.completed, icon: <CheckCircleOutlined />, color: '#059669', bg: '#d1fae5' },
          { title: 'Chưa phản hồi', value: stats.pending, icon: <ClockCircleOutlined />, color: '#d97706', bg: '#fef3c7' },
          { title: 'Tỷ lệ hoàn thành', value: `${stats.completionRate ?? 0}%`, icon: <BarChartOutlined />, color: '#2563eb', bg: '#dbeafe' },
        ].map(s => (
          <Col key={s.title} xs={12} sm={6}>
            <Card style={{ borderRadius: 12, border: 'none', background: s.bg }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ color: s.color, opacity: 0.8 }}>{s.icon}</div>
                <div>
                  <div style={{ color: s.color, fontWeight: 800 }}>{s.value}</div>
                  <div style={{ color: s.color, opacity: 0.7 }}>{s.title}</div>
                </div>
              </div>
            </Card>
          </Col>
        ))}
      </Row>

      {stats.completionRate !== undefined && (
        <Card style={{ borderRadius: 12, marginBottom: 20, border: '1px solid #ede9fe' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ fontWeight: 600, color: '#374151' }}>Tiến độ hoàn thành</span>
            <Progress percent={stats.completionRate} strokeColor="#7c3aed" style={{ flex: 1 }} />
          </div>
        </Card>
      )}

      {/* Filter */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 16, flexWrap: 'wrap' }}>
        <Input
          prefix={<SearchOutlined style={{ color: '#9ca3af' }} />}
          placeholder="Tìm theo tên, mã sinh viên"
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ maxWidth: 280 }}
          allowClear
        />
        <Select
          value={statusFilter}
          onChange={setStatusFilter}
          style={{ width: 160 }}
          options={[
            { value: 'all', label: 'Tất cả' },
            { value: 'completed', label: 'Hoàn thành' },
            { value: 'pending', label: 'Chưa hoàn thành' },
          ]}
        />
        <Button
          icon={<DownloadOutlined />}
          loading={exportLoading}
          onClick={handleExport}
        >
          Xuất Excel
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={filtered}
        rowKey="id"
        pagination={{ pageSize: 15, showTotal: (t) => `Tổng ${t} phản hồi` }}
        style={{ background: 'white', borderRadius: 12, overflow: 'hidden' }}
      />
    </div>
  );
}
