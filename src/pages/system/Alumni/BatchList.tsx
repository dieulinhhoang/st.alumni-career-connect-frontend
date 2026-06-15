import React, { useState } from 'react';
import {
  Button, Input, Select, Space, Typography,
  Dropdown, message,
} from 'antd';
import type { MenuProps } from 'antd';
import {
  PlusOutlined, LinkOutlined, BarChartOutlined,
  DeleteOutlined, EditOutlined, MoreOutlined, MailOutlined,
  FilePdfOutlined, FileTextOutlined,
  EyeOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';
import { useNavigate } from 'react-router-dom';
import { useBatches, type SurveyBatchWithStats } from '../../../feature/alumni/hooks/useBatches';
import { STATUS_CFG } from '../../../feature/alumni/constants';
import { PctBadge } from './components/PctBadge';
import { SurveyLinkModal } from './components/SurveyLinkModal';
import AdminLayout from '../../../components/layout/AdminLayout';
import CustomTable from '../../../components/common/customTable';
import { SendEmailModal } from './SendEmailModal';
import { havePermission } from '../../../feature/auth/permission';
import { PermissionEnum } from '../../../feature/auth/type';

const { Text } = Typography;

const useMenuItems = (
  navigate: ReturnType<typeof useNavigate>,
  deleteBatch: (id: number) => void,
  setEmailBatch: (batch: SurveyBatchWithStats) => void, 
  // showForm:(r)=>void,
) =>
  (r: SurveyBatchWithStats): MenuProps['items'] => [
    {
      key: 'email', icon: <MailOutlined />, label: 'Gửi email khảo sát',
      onClick: () => setEmailBatch(r),
    },
    {
      key: 'view', icon: <EyeOutlined />, label: 'Xem form khảo sát',
      onClick: () => navigate(`/admin/forms/${r.formId}/preview`),
    },
    // {
    //   key: 'pdf-zip', icon: <FilePdfOutlined style={{ color: '#2563eb' }} />,
    //   label: 'Tải toàn bộ file PDF (ZIP)',
    //   onClick: () => message.info('Tính năng đang phát triển'),
    // },
    { type: 'divider' },
    // { key: 'report1', icon: <FileTextOutlined />, label: 'Tải mẫu báo cáo 1', onClick: () => message.info('Tính năng đang phát triển') },
    // { key: 'report2', icon: <FileTextOutlined />, label: 'Tải mẫu báo cáo 2', onClick: () => message.info('Tính năng đang phát triển') },
    // { key: 'report3', icon: <FileTextOutlined />, label: 'Tải mẫu báo cáo 3', onClick: () => message.info('Tính năng đang phát triển') },
    { type: 'divider' },
    ...(r.status === 'draft' && havePermission(PermissionEnum.SURVEYS_UPDATE)
      ? [{
        key: 'edit', icon: <EditOutlined style={{ color: '#1D9E75' }} />, label: 'Chỉnh sửa',
        onClick: () => navigate(`/admin/alumni/batches/${r.id}/edit-form`),
      }]
      : []),
    ...(havePermission(PermissionEnum.SURVEYS_DELETE)
      ? [{
        key: 'delete',
        icon: <DeleteOutlined style={{ color: '#ef4444' }} />,
        label: <span style={{ color: '#ef4444' }}>Xóa khảo sát</span>,
        onClick: () => {
          if (window.confirm(`Xóa đợt khảo sát "${r.title}"?`)) deleteBatch(r.id);
        },
      }]
      : []),
  ];

export const BatchList: React.FC = () => {
  const [emailBatch, setEmailBatch] = useState<SurveyBatchWithStats | null>(null);
  const { batches, loading, deleteBatch } = useBatches();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('all');
  const [linkBatch, setLinkBatch] = useState<SurveyBatchWithStats | null>(null);
  const [showForm,setshowForm]= useState();

  const getMenuItems = useMenuItems(navigate, deleteBatch, setEmailBatch );
  const safeBatches = Array.isArray(batches) ? batches : [];

  const filtered = safeBatches.filter(b => {
    const q = search.toLowerCase();
    return (
      b.title.toLowerCase().includes(q) &&
      (status === 'all' || b.status === status)
    );
  });
  const columns: ColumnsType<SurveyBatchWithStats> = [
    {
      title: 'Tiêu đề khảo sát', key: 'title',
      render: (_, r) => <Text style={{ fontWeight: 500 }}>{r.title}</Text>,
    },
    {
      title: 'Trạng thái', key: 'status', width: 120,
      render: (_, r) => {
        const cfg = STATUS_CFG[r.status] ?? STATUS_CFG.ended;
        // FIX: borderRadius 99 (pill) thay vì 4 — nhất quán toàn app
        return (
          <span
            style={{
              display: 'inline-block',
              background: cfg.bg,
              color: cfg.color,
              padding: '3px 10px',
              borderRadius: 99,
              fontSize: 14,
              fontWeight: 600,
              whiteSpace: 'nowrap',
            }}
          >
            {cfg.label}
          </span>
        );
      },
    },
    {
      title: 'Số lượng', key: 'totalStudents', width: 120,
      render: (_, r) => (
        <Text type="secondary">{r.submittedCount} / {r.totalStudents}</Text>
      ),
    },
    {
      title: 'Bắt đầu', key: 'startDate', width: 130,
      render: (_, r) => <Text type="secondary" style={{ fontSize: 13 }}>{r.startDate ? dayjs(r.startDate).format('DD/MM/YYYY') : '--'}</Text>,
    },
    {
      title: 'Kết thúc', key: 'endDate', width: 130,
      render: (_, r) => <Text type="secondary" style={{ fontSize: 13 }}>{r.endDate ? dayjs(r.endDate).format('DD/MM/YYYY') : '--'}</Text>,
    },
    {
      title: 'Phản hồi', key: 'rate', width: 90,
      render: (_, r) => <PctBadge pct={r.responseRate} />,
    },
    {
      title: 'Hành động', key: 'actions', width: 120,
      render: (_, r) => (
        <Space size={4}>
          <Button
            size="small"
            icon={<LinkOutlined style={{ color: '#1D9E75' }} />}
            style={{ borderRadius: 8 }}
            title="Sao chép link khảo sát"
            onClick={() => setLinkBatch(r)}
          />
          <Button
            size="small"
            icon={<BarChartOutlined style={{ color: '#1D9E75' }} />}
            style={{ borderRadius: 8 }}
            onClick={() => navigate(`/admin/alumni/batches/${r.id}/responses`)}
          />
          <Dropdown menu={{ items: getMenuItems(r) }} trigger={['click']} placement="bottomRight">
            <Button size="small" icon={<MoreOutlined />}
              style={{ borderRadius: 8, color: '#1D9E75' }} />
          </Dropdown>
        </Space>
      ),
    },
  ];

  return (
    <AdminLayout>
      <div>
        <div style={{ marginBottom: 20 }}>
          <h2 style={{ margin: '0 0 4px', fontSize: 20, fontWeight: 700, color: '#0f172a' }}>
            Khảo sát việc làm
          </h2>
          <p style={{ margin: 0, fontSize: 13, color: '#64748b' }}>
            Quản lý các đợt khảo sát và theo dõi phản hồi của cựu sinh viên
          </p>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, flexWrap: 'wrap', gap: 12 }}>
          <Space wrap>
            <Input
              placeholder="Tìm kiếm theo tiêu đề..."
              allowClear
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{ width: 260, borderRadius: 8 }}
            />
            <Select
              value={status}
              onChange={setStatus}
              style={{ width: 160 }}
              options={[
                { value: 'all', label: 'Tất cả trạng thái' },
                { value: 'active', label: 'Hoạt động' },
                { value: 'ended', label: 'Đã kết thúc' },
                { value: 'draft', label: 'Nháp' },
              ]}
            />
          </Space>
          {havePermission(PermissionEnum.SURVEYS_CREATE) && (
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => navigate('/admin/alumni/batches/create')}
              style={{ borderRadius: 8, fontWeight: 500 }}
            >
              Tạo đợt mới
            </Button>
          )}
        </div>

        <CustomTable
          columns={columns}
          data={filtered}
          loading={loading}
          rowKey="id"
        />

        <SurveyLinkModal
          batchId={linkBatch?.id}
          batchTitle={linkBatch?.title ?? ''}
          batchYear={linkBatch?.year}
          batchGraduationPeriod={linkBatch?.graduationPeriod}
          batchStatus={linkBatch?.status}
          open={!!linkBatch}
          onClose={() => setLinkBatch(null)}
        />
      </div>
      {emailBatch && (
        <SendEmailModal
          batchId={emailBatch.id}
          batchTitle={emailBatch.title}
          open={!!emailBatch}
          onClose={() => setEmailBatch(null)}
        />
      )}
    </AdminLayout>
  );
};


