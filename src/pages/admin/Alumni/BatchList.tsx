import React, { useState } from 'react';
import {
  Button, Input, Select, Space, Typography,
  Dropdown, message,
} from 'antd';
import type { MenuProps } from 'antd';
import {
  PlusOutlined, EyeOutlined, LinkOutlined, BarChartOutlined,
  DeleteOutlined, EditOutlined, MoreOutlined, MailOutlined,
  FilePdfOutlined, FileTextOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { useNavigate } from 'react-router-dom';
import { useBatches } from '../../../feature/alumni/hooks/useBatches';
import type { SurveyBatch } from '../../../feature/alumni/types';
import { STATUS_CFG } from '../../../feature/alumni/constants';
 import { PctBadge } from './components/PctBadge';
import { SurveyLinkModal } from './components/SurveyLinkModal';
import AdminLayout from '../../../components/layout/AdminLayout';
import CustomTable from '../../../components/common/customTable';
 
const { Text } = Typography;

const useMenuItems = (
  navigate: ReturnType<typeof useNavigate>,
  deleteBatch: (id: number) => void,
) =>
  (r: SurveyBatch): MenuProps['items'] => [
    {
      key: 'email', icon: <MailOutlined />, label: 'Gửi email khảo sát',
      onClick: () => message.info('Tính năng đang phát triển'),
    },
    {
      key: 'pdf-zip', icon: <FilePdfOutlined style={{ color: '#2563eb' }} />,
      label: 'Tải toàn bộ file PDF (ZIP)',
      onClick: () => message.info('Tính năng đang phát triển'),
    },
    { type: 'divider' },
    { key: 'report1', icon: <FileTextOutlined />, label: 'Tải mẫu báo cáo 1', onClick: () => message.info('Tính năng đang phát triển') },
    { key: 'report2', icon: <FileTextOutlined />, label: 'Tải mẫu báo cáo 2', onClick: () => message.info('Tính năng đang phát triển') },
    { key: 'report3', icon: <FileTextOutlined />, label: 'Tải mẫu báo cáo 3', onClick: () => message.info('Tính năng đang phát triển') },
    { type: 'divider' },
    ...(r.status === 'draft'
      ? [{
          key: 'edit', icon: <EditOutlined style={{ color: '#1D9E75' }} />, label: 'Chỉnh sửa',
          onClick: () => navigate(`/admin/alumni/batches/${r.id}/edit-form`),
        }]
      : []),
    {
      key: 'delete',
      icon: <DeleteOutlined style={{ color: '#ef4444' }} />,
      label: <span style={{ color: '#ef4444' }}>Xóa khảo sát</span>,
      onClick: () => {
        if (window.confirm(`Xóa đợt khảo sát "${r.title}"?`)) deleteBatch(r.id);
      },
    },
  ];

export const BatchList: React.FC = () => {
  const { batches, loading, deleteBatch } = useBatches();
  const navigate = useNavigate();
  const [search,    setSearch]    = useState('');
  const [status,    setStatus]    = useState('all');
  const [linkBatch, setLinkBatch] = useState<SurveyBatch | null>(null);

  const getMenuItems = useMenuItems(navigate, deleteBatch);

  const filtered = batches.filter(b => {
    const q = search.toLowerCase();
    return (
      b.title.toLowerCase().includes(q) &&
      (status === 'all' || b.status === status)
    );
  });

  const columns: ColumnsType<SurveyBatch> = [
    {
      title: 'Tiêu đề khảo sát', key: 'title',
      render: (_, r) => <Text style={{ fontWeight: 500 }}>{r.title}</Text>,
    },
    {
      title: 'Trạng thái', key: 'status', width: 110,
      render: (_, r) => {
        const cfg = STATUS_CFG[r.status] ?? STATUS_CFG.ended;
        return (
          <span style={{
            background: cfg.bg, color: cfg.color,
            padding: '3px 12px', borderRadius: 4, fontSize: 12, fontWeight: 500,
          }}>
            {cfg.label}
          </span>
        );
      },
    },
    {
      title: 'Số lượng', key: 'totalStudents', width: 120,
      render: (_, r) => <Text type="secondary">{r.totalStudents} sinh viên</Text>,
    },
    {
      title: 'Bắt đầu', key: 'startDate', width: 140,
      render: (_, r) => <Text type="secondary" style={{ fontSize: 12.5 }}>{(r.startDate)}</Text>,
    },
    {
      title: 'Kết thúc', key: 'endDate', width: 140,
      render: (_, r) => <Text type="secondary" style={{ fontSize: 12.5 }}>{(r.endDate)}</Text>,
    },
    {
      title: 'Phản hồi', key: 'rate', width: 90,
      render: (_, r) => {
        const sub = r.responses.filter(x => x.status === 'submitted').length;
        const pct = r.totalStudents ? Math.round((sub / r.totalStudents) * 1000) / 10 : 0;
        return <PctBadge pct={pct} />;
      },
    },
    {
      title: 'Hành động', key: 'actions', width: 140,
      render: (_, r) => (
        <Space size={4}>
          <Button size="small" icon={<EyeOutlined />} style={{ borderRadius: 6 }}
            onClick={() => navigate(`/admin/alumni/batches/${r.id}/responses`)} />
          <Button size="small" icon={<LinkOutlined style={{ color: '#1D9E75' }} />} style={{ borderRadius: 6 }}
            onClick={() => setLinkBatch(r)} />
          <Button size="small" icon={<BarChartOutlined style={{ color: '#1D9E75' }} />} style={{ borderRadius: 6 }}
            onClick={() => navigate(`/admin/alumni/batches/${r.id}/responses`)} />
          <Dropdown menu={{ items: getMenuItems(r) }} trigger={['click']} placement="bottomRight">
            <Button size="small" icon={<MoreOutlined />}
              style={{ borderRadius: 6, background: '#1D9E75', color: '#fff', borderColor: '#1D9E75' }} />
          </Dropdown>
        </Space>
      ),
    },
  ];

  return (
    <AdminLayout>
      <div style={{ padding: 24 }}>
        {/* Toolbar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <Space>
            <Input
              placeholder="Tìm kiếm theo tiêu đề..." allowClear
              value={search} onChange={e => setSearch(e.target.value)}
              style={{ width: 260, borderRadius: 6 }}
            />
            <Select value={status} onChange={setStatus} style={{ width: 160 }}>
              <Select.Option value="all">Tất cả trạng thái</Select.Option>
              <Select.Option value="active">Hoạt động</Select.Option>
              <Select.Option value="ended">Đã kết thúc</Select.Option>
              <Select.Option value="draft">Nháp</Select.Option>
            </Select>
          </Space>
          <Button
            type="primary" icon={<PlusOutlined />}
            onClick={() => navigate('/admin/alumni/batches/create')}
            style={{ background: '#1D9E75', borderColor: '#1D9E75', borderRadius: 6, fontWeight: 500 }}
          >
            Tạo đợt mới
          </Button>
        </div>

        <CustomTable
          columns={columns}
          data={{ data: filtered, page: { total_elements: filtered.length, size: 10, page: 0 } }}
          loading={loading}
          rowKey="id"
        />
      </div>

      <SurveyLinkModal
        batchId={linkBatch?.id}
        batchTitle={linkBatch?.title ?? ''}
        batchYear={linkBatch?.year}
        batchGraduationPeriod={linkBatch?.graduationPeriod}
        batchStatus={linkBatch?.status}
        open={!!linkBatch}
        onClose={() => setLinkBatch(null)}
      />
    </AdminLayout>
  );
};