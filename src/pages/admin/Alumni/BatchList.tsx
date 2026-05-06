import { useEffect } from 'react';
import { Table, Tag, Button, Tooltip, Space, Spin } from 'antd';
import { EyeOutlined, PlusOutlined, FileTextOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useBatchList } from '../../../feature/alumni/hooks/useBatchList';
import type { Batch } from '../../../feature/alumni/type';
import type { ColumnsType } from 'antd/es/table';

export default function BatchList() {
  const navigate = useNavigate();
  const { batches, loading, fetchBatches } = useBatchList();

  useEffect(() => { fetchBatches(); }, []);

  const columns: ColumnsType<Batch> = [
    {
      title: 'Tên đợt khảo sát',
      dataIndex: 'name',
      key: 'name',
      render: (name: string) => (
        <span style={{ fontWeight: 600 }}>{name}</span>
      ),
    },
    {
      title: 'Thời gian',
      key: 'time',
      render: (_: any, record: Batch) => (
        <span style={{ color: '#6b7280' }}>
          {record.startDate} → {record.endDate}
        </span>
      ),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={status === 'active' ? 'green' : status === 'closed' ? 'red' : 'orange'}>
          {status === 'active' ? 'Đang mở' : status === 'closed' ? 'Đã đóng' : 'Nháp'}
        </Tag>
      ),
    },
    {
      title: 'Số phản hồi',
      dataIndex: 'responseCount',
      key: 'responseCount',
      render: (count: number) => (
        <span style={{ fontWeight: 600, color: '#7c3aed' }}>{count ?? 0}</span>
      ),
    },
    {
      title: 'Thao tác',
      key: 'action',
      render: (_: any, record: Batch) => (
        <Space>
          <Tooltip title="Xem kết quả">
            <Button
              type="primary" icon={<EyeOutlined />} size="small"
              onClick={() => navigate(`/admin/alumni/batch/${record.id}/results`)}
            >
              Kết quả
            </Button>
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <FileTextOutlined style={{ color: '#7c3aed' }} />
          <span style={{ fontWeight: 700 }}>Danh sách đợt khảo sát</span>
        </div>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => navigate('/admin/alumni/batch/create')}>
          Tạo đợt mới
        </Button>
      </div>
      {loading ? (
        <div style={{ textAlign: 'center', padding: 40 }}><Spin /></div>
      ) : (
        <Table columns={columns} dataSource={batches} rowKey="id" pagination={{ pageSize: 10 }} />
      )}
    </div>
  );
}
