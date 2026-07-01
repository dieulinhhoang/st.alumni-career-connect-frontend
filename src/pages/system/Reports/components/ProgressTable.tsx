import React, { useState } from 'react';
import { Button, Modal, Input, Timeline, Tag, Empty, Progress, Tooltip, Space, Badge, message, Dropdown } from 'antd';
import { useNavigate } from 'react-router-dom';
import {
  EyeOutlined,
  HistoryOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  ClockCircleOutlined,
  SendOutlined,
  CloseCircleOutlined,
  FilterOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import type { FacultySubmissionRow, FacultySubmissionRowExtended, SubmissionStatus } from '../../../../feature/reports/types';
import { approveReport, returnReport, submitReport } from '../../../../feature/reports/api';
import { SubmissionPill } from './SubmissionPill';
import CustomTable from '../../../../components/common/customTable';

interface Props {
  rows: FacultySubmissionRowExtended[];
  batchId: string;
  onViewFaculty?: (facultyCode: string) => void;
}

type HistoryEntry = {
  time: string;
  action: string;
  note?: string;
  color: string;
};

export const ProgressTable: React.FC<Props> = ({ rows, batchId, onViewFaculty }) => {
  const navigate = useNavigate();
  const [statusMap, setStatusMap]   = useState<Record<string, SubmissionStatus>>({});
  const [actingKey, setActingKey]   = useState<string | null>(null);
  const [historyMap, setHistoryMap] = useState<Record<string, HistoryEntry[]>>({});
  const [returnModal, setReturnModal] = useState<{ open: boolean; key: string }>({ open: false, key: '' });
  const [returnNote, setReturnNote]   = useState('');
  const [historyModal, setHistoryModal] = useState<{ open: boolean; key: string; name: string }>({
    open: false, key: '', name: '',
  });

  const [activeFilter, setActiveFilter] = useState<SubmissionStatus | 'all'>('all');

  const getStatus = (row: FacultySubmissionRow): SubmissionStatus =>
    statusMap[row.key] ?? row.status ?? 'draft';
  const getHistory = (key: string): HistoryEntry[] => historyMap[key] ?? [];
  const addHistory = (key: string, entry: HistoryEntry) =>
    setHistoryMap((prev) => ({ ...prev, [key]: [entry, ...(prev[key] ?? [])] }));
  const now = () => new Date().toLocaleString('vi-VN');

  const handleApprove = async (key: string) => {
    setActingKey(key);
    try {
      await approveReport(batchId, key);
      setStatusMap((prev) => ({ ...prev, [key]: 'approved' }));
      addHistory(key, { time: now(), action: 'Đã duyệt', color: 'green' });
      message.success('Đã duyệt báo cáo.');
    } catch (err: any) {
      message.error(err?.response?.data?.message ?? 'Duyệt báo cáo thất bại.');
    } finally {
      setActingKey(null);
    }
  };
  const handleOpenReturn = (key: string) => {
    setReturnNote('');
    setReturnModal({ open: true, key });
  };
  const handleConfirmReturn = async () => {
    const key = returnModal.key;
    setActingKey(key);
    try {
      await returnReport(batchId, key, returnNote);
      setStatusMap((prev) => ({ ...prev, [key]: 'returned' }));
      addHistory(key, { time: now(), action: 'Trả bổ sung', note: returnNote || undefined, color: 'orange' });
      setReturnModal({ open: false, key: '' });
      message.success('Đã trả báo cáo về cho khoa bổ sung.');
    } catch (err: any) {
      message.error(err?.response?.data?.message ?? 'Trả báo cáo thất bại.');
    } finally {
      setActingKey(null);
    }
  };
  const handleResubmit = async (key: string) => {
    setActingKey(key);
    try {
      await submitReport(batchId, key);
      setStatusMap((prev) => ({ ...prev, [key]: 'submitted' }));
      addHistory(key, { time: now(), action: 'Nộp lại', color: 'blue' });
      message.success('Đã nộp lại báo cáo.');
    } catch (err: any) {
      message.error(err?.response?.data?.message ?? 'Nộp lại báo cáo thất bại.');
    } finally {
      setActingKey(null);
    }
  };

  const allRows = rows.map((r) => ({ ...r, status: getStatus(r) }));
  const countByStatus = {
    draft:     allRows.filter((r) => r.status === 'draft').length,
    submitted: allRows.filter((r) => r.status === 'submitted').length,
    returned:  allRows.filter((r) => r.status === 'returned').length,
    approved:  allRows.filter((r) => r.status === 'approved').length,
  };
  const total = allRows.length;
  const approvedPct = total ? Math.round((countByStatus.approved / total) * 100) : 0;

  const filteredRows = activeFilter === 'all'
    ? allRows
    : allRows.filter((r) => r.status === activeFilter);

  const filterTabs: { key: SubmissionStatus | 'all'; label: string; count: number; color: string }[] = [
    { key: 'all',       label: 'Tất cả',      count: total,                      color: '#1a1a2e' },
    { key: 'approved',  label: 'Đã duyệt',    count: countByStatus.approved,     color: '#52c41a' },
    { key: 'submitted', label: 'Đã nộp',      count: countByStatus.submitted,    color: '#1677ff' },
    { key: 'returned',  label: 'Cần bổ sung', count: countByStatus.returned,     color: '#faad14' },
    { key: 'draft',     label: 'Chưa nộp',    count: countByStatus.draft,        color: '#8c8c8c' },
  ];

  const columns: ColumnsType<FacultySubmissionRowExtended> = [
    {
      title: 'STT', key: 'stt', width: 55, align: 'center',
      render: (_, __, i) => <span style={{ color: '#9ca3af', fontSize: 13 }}>{i + 1}</span>,
    },
    {
      title: 'Khoa', key: 'faculty',
      render: (_, r) => (
        <div>
          <div style={{ fontWeight: 500, fontSize: 14 }}>{r.facultyName}</div>
          <div style={{ fontSize: 12, color: '#9ca3af' }}>{r.facultyCode}</div>
        </div>
      ),
    },
    {
      title: 'Trạng thái', key: 'status', width: 130, align: 'center',
      render: (_, r) => <SubmissionPill status={r.status} />,
    },
    {
      title: 'Người nộp', key: 'submittedBy', width: 150,
      render: (_, r) => (
        <span style={{ color: r.submittedBy ? '#374151' : '#d1d5db', fontSize: 13 }}>
          {r.submittedBy ?? '—'}
        </span>
      ),
    },
    {
      title: 'Thời gian nộp', key: 'submittedAt', width: 140,
      render: (_, r) => (
        <span style={{ color: r.submittedAt ? '#374151' : '#d1d5db', fontSize: 13 }}>
          {r.submittedAt ?? '—'}
        </span>
      ),
    },
    {
      title: 'Hạn nộp', key: 'deadline', width: 120,
      render: (_, r) => (
        <span style={{
          fontSize: 13,
          color: r.deadline && r.status === 'draft' ? '#ef4444' : '#374151',
          fontWeight: r.deadline && r.status === 'draft' ? 500 : 400,
        }}>
          {r.deadline ?? '—'}
        </span>
      ),
    },
    {
      title: 'Phản hồi', key: 'responseCount', width: 90, align: 'center',
      render: (_, r) => (
        <span style={{ fontWeight: 600, fontSize: 14 }}>
          {r.responseCount ?? 0}
        </span>
      ),
    },
    {
      title: 'Có việc làm', key: 'employed', width: 100, align: 'center',
      render: (_, r) => {
        const pct = r.responseCount && r.responseCount > 0
          ? Math.round(((r.employedCount ?? 0) / r.responseCount) * 100)
          : 0;
        return (
          <span style={{ fontWeight: 600, fontSize: 14, color: pct > 0 ? '#22c55e' : '#d1d5db' }}>
            {pct}%
          </span>
        );
      },
    },
    {
      title: 'Thao tác', key: 'actions', width: 200, align: 'center',
      render: (_, r) => {
        const hist = getHistory(r.key);
        return (
          <Space size={4}>
            <Tooltip title="Xem chi tiết">
              <Button
                type="text" size="small"
                icon={<EyeOutlined />}
                onClick={() => navigate(`/admin/reports/faculty/${r.key}`)}
              />
            </Tooltip>
            <Tooltip title={hist.length ? `${hist.length} lịch sử` : 'Lịch sử'}>
              <Badge count={hist.length} size="small" offset={[-2, 2]}>
                <Button
                  type="text" size="small"
                  icon={<HistoryOutlined style={{ color: hist.length ? '#6366f1' : '#d1d5db' }} />}
                  onClick={() => setHistoryModal({ open: true, key: r.key, name: r.facultyName })}
                />
              </Badge>
            </Tooltip>
            {r.status === 'submitted' && (
              <>
                <Button
                  size="small" type="primary"
                  icon={<CheckCircleOutlined />}
                  loading={actingKey === r.key}
                  onClick={() => handleApprove(r.key)}
                >
                  Duyệt
                </Button>
                <Button
                  size="small" danger
                  icon={<CloseCircleOutlined />}
                  disabled={actingKey === r.key}
                  onClick={() => handleOpenReturn(r.key)}
                >
                  Trả
                </Button>
              </>
            )}
            {r.status === 'returned' && (
              <Button
                size="small"
                icon={<SendOutlined />}
                loading={actingKey === r.key}
                onClick={() => handleResubmit(r.key)}
              >
                Nộp lại
              </Button>
            )}
          </Space>
        );
      },
    },
  ];

  return (
    <>
      <div className="pt-overview-bar">
        <div className="pt-overview-stats">
          <Dropdown
            menu={{
              items: filterTabs.map((tab) => ({
                key: tab.key,
                label: (
                  <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{
                      width: 8, height: 8, borderRadius: '50%',
                      background: tab.color, display: 'inline-block', flexShrink: 0,
                    }} />
                    {tab.label} ({tab.count})
                  </span>
                ),
              })),
              selectedKeys: [activeFilter],
              onClick: ({ key }) => setActiveFilter(key as SubmissionStatus | 'all'),
            }}
            trigger={['click']}
          >
            <Button
              icon={<FilterOutlined />}
              style={{
                borderRadius: 8,
                ...(activeFilter !== 'all' ? { borderColor: '#1677ff', color: '#1677ff' } : {}),
              }}
            >
              {filterTabs.find((t) => t.key === activeFilter)?.label ?? 'Bộ lọc'}
              {activeFilter !== 'all' && ` (${filterTabs.find((t) => t.key === activeFilter)?.count})`}
            </Button>
          </Dropdown>
        </div>
        <div className="pt-overview-progress">
          <span className="pt-progress-label">Tỷ lệ duyệt toàn trường</span>
          <Progress
            percent={approvedPct}
            strokeColor="#22c55e"
            trailColor="#f3f4f6"
            size="small"
            style={{ width: 160 }}
          />
        </div>
      </div>

      <CustomTable
        columns={columns}
        data={filteredRows}
        loading={false}
        rowKey="key"
      />

      {/* Modal trả bổ sung */}
      <Modal
        title="Trả bổ sung — nhập nhận xét"
        open={returnModal.open}
        okText="Gửi"
        cancelText="Huỷ"
        okButtonProps={{ danger: true }}
        onOk={handleConfirmReturn}
        onCancel={() => setReturnModal({ open: false, key: '' })}
      >
        <Input.TextArea
          rows={4}
          placeholder="Nhập nhận xét / yêu cầu bổ sung cho khoa…"
          value={returnNote}
          onChange={(e) => setReturnNote(e.target.value)}
          maxLength={500}
          showCount
        />
      </Modal>

      {/* Modal lịch sử */}
      <Modal
        title={`Lịch sử : ${historyModal.name}`}
        open={historyModal.open}
        footer={null}
        onCancel={() => setHistoryModal({ open: false, key: '', name: '' })}
        width={480}
      >
        {getHistory(historyModal.key).length === 0 ? (
          <Empty description="Chưa có lịch sử" />
        ) : (
          <Timeline
            style={{ marginTop: 16 }}
            items={getHistory(historyModal.key).map((h) => ({
              color: h.color,
              children: (
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <Tag color={h.color} style={{ margin: 0 }}>{h.action}</Tag>
                    <span style={{ fontSize: 14, color: '#9ca3af' }}>{h.time}</span>
                  </div>
                  {h.note && (
                    <div style={{
                      marginTop: 6, fontSize: 13, color: '#374151',
                      background: '#fafafa', borderRadius: 6,
                      padding: '6px 10px', borderLeft: '3px solid #d1d5db',
                    }}>
                      {h.note}
                    </div>
                  )}
                </div>
              ),
            }))}
          />
        )}
      </Modal>
    </>
  );
};
