import React, { useState } from 'react';
import { Button, Modal, Input, Timeline, Tag, Empty, Progress, Tooltip, Badge } from 'antd';
import { useNavigate } from 'react-router-dom';
import {
  EyeOutlined,
  HistoryOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  ClockCircleOutlined,
  SendOutlined,
  CloseCircleOutlined,
} from '@ant-design/icons';
import type { FacultySubmissionRow, FacultySubmissionRowExtended, SubmissionStatus } from '../../../../feature/reports/types';
import { SubmissionPill } from './SubmissionPill';

interface Props {
  rows: FacultySubmissionRowExtended[];
  onViewFaculty?: (facultyCode: string) => void;
}

type HistoryEntry = {
  time: string;
  action: string;
  note?: string;
  color: string;
};

const STATUS_CONFIG: Record<SubmissionStatus, { icon: React.ReactNode; borderColor: string; headerBg: string }> = {
  draft:     { icon: <ClockCircleOutlined />,        borderColor: '#d9d9d9', headerBg: '#fafafa' },
  submitted: { icon: <SendOutlined />,               borderColor: '#91caff', headerBg: '#e6f4ff' },
  returned:  { icon: <ExclamationCircleOutlined />,  borderColor: '#ffd666', headerBg: '#fffbe6' },
  approved:  { icon: <CheckCircleOutlined />,        borderColor: '#b7eb8f', headerBg: '#f6ffed' },
};

// Tính % hoàn thành dựa vào status
const STATUS_PROGRESS: Record<SubmissionStatus, number> = {
  draft: 0,
  submitted: 60,
  returned: 30,
  approved: 100,
};

export const ProgressTable: React.FC<Props> = ({ rows, onViewFaculty }) => {
  const navigate = useNavigate();
  const [statusMap, setStatusMap]   = useState<Record<string, SubmissionStatus>>({});
  const [historyMap, setHistoryMap] = useState<Record<string, HistoryEntry[]>>({});
  const [returnModal, setReturnModal] = useState<{ open: boolean; key: string }>({ open: false, key: '' });
  const [returnNote, setReturnNote]   = useState('');
  const [historyModal, setHistoryModal] = useState<{ open: boolean; key: string; name: string }>({
    open: false, key: '', name: '',
  });

  // Filter state
  const [activeFilter, setActiveFilter] = useState<SubmissionStatus | 'all'>('all');

  const getStatus = (row: FacultySubmissionRow): SubmissionStatus =>
    statusMap[row.key] ?? row.status ?? 'draft';
  const getHistory = (key: string): HistoryEntry[] => historyMap[key] ?? [];
  const addHistory = (key: string, entry: HistoryEntry) =>
    setHistoryMap((prev) => ({ ...prev, [key]: [entry, ...(prev[key] ?? [])] }));
  const now = () => new Date().toLocaleString('vi-VN');

  const handleApprove = (key: string) => {
    setStatusMap((prev) => ({ ...prev, [key]: 'approved' }));
    addHistory(key, { time: now(), action: 'Đã duyệt', color: 'green' });
  };
  const handleOpenReturn = (key: string) => {
    setReturnNote('');
    setReturnModal({ open: true, key });
  };
  const handleConfirmReturn = () => {
    const key = returnModal.key;
    setStatusMap((prev) => ({ ...prev, [key]: 'returned' }));
    addHistory(key, { time: now(), action: 'Trả bổ sung', note: returnNote || undefined, color: 'orange' });
    setReturnModal({ open: false, key: '' });
  };
  const handleResubmit = (key: string) => {
    setStatusMap((prev) => ({ ...prev, [key]: 'submitted' }));
    addHistory(key, { time: now(), action: 'Nộp lại', color: 'blue' });
  };

  // Thống kê tổng hợp
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

  return (
    <>
      {/* ── Thanh tổng quan ── */}
      <div className="pt-overview-bar">
        <div className="pt-overview-stats">
          {filterTabs.map((tab) => (
            <button
              key={tab.key}
              className={`pt-filter-chip${activeFilter === tab.key ? ' pt-filter-chip--active' : ''}`}
              style={{ '--chip-color': tab.color } as React.CSSProperties}
              onClick={() => setActiveFilter(tab.key)}
            >
              <span className="pt-chip-count">{tab.count}</span>
              <span className="pt-chip-label">{tab.label}</span>
            </button>
          ))}
        </div>
        <div className="pt-overview-progress">
          <span className="pt-progress-label">Tỷ lệ duyệt toàn trường</span>
          <Progress
            percent={approvedPct}
            strokeColor={{ '0%': '#52c41a', '100%': '#09d488' }}
            trailColor="#e8eaed"
            size="small"
            style={{ width: 200 }}
          />
        </div>
      </div>

      {/* ── Grid thẻ khoa ── */}
      {filteredRows.length === 0 ? (
        <Empty description="Không có khoa nào phù hợp" style={{ marginTop: 48 }} />
      ) : (
        <div className="pt-faculty-grid">
          {filteredRows.map((row, idx) => {
            const cfg  = STATUS_CONFIG[row.status] ?? STATUS_CONFIG.draft;
            const hist = getHistory(row.key);
            const pct  = STATUS_PROGRESS[row.status];

            return (
              <div
                key={row.key}
                className="pt-faculty-card"
                style={{ borderTop: `3px solid ${cfg.borderColor}` }}
              >
                {/* Header */}
                <div className="pt-card-header" style={{ background: cfg.headerBg }}>
                  <div className="pt-card-header__left">
                    <span className="pt-card-index">{idx + 1}</span>
                    <div>
                      <div className="pt-card-faculty-name">{row.facultyName}</div>
                      <div className="pt-card-faculty-code">{row.facultyCode}</div>
                    </div>
                  </div>
                  <SubmissionPill status={row.status} />
                </div>

                {/* Progress bar */}
                <div style={{ padding: '8px 16px 0' }}>
                  <Progress
                    percent={pct}
                    showInfo={false}
                    strokeColor={cfg.borderColor}
                    trailColor="#f0f0f0"
                    size={[undefined, 4]}
                  />
                </div>

                {/* Thông tin nộp */}
                <div className="pt-card-body">
                  <div className="pt-card-info-row">
                    <span className="pt-card-info-label">Người nộp</span>
                    <span className="pt-card-info-value">{row.submittedBy ?? '—'}</span>
                  </div>
                  <div className="pt-card-info-row">
                    <span className="pt-card-info-label">Thời gian nộp</span>
                    <span className="pt-card-info-value">{row.submittedAt ?? '—'}</span>
                  </div>
                  <div className="pt-card-info-row">
                    <span className="pt-card-info-label">Hạn nộp</span>
                    <span
                      className="pt-card-info-value"
                      style={row.deadline && row.status === 'draft' ? { color: '#ff4d4f', fontWeight: 500 } : {}}
                    >
                      {row.deadline ?? '—'}
                    </span>
                  </div>
                  {/* Stats mini */}
                  {(row.responseCount !== undefined) && (
                    <div className="pt-card-stats-row">
                      <div className="pt-card-stat">
                        <span className="pt-card-stat-value">{row.responseCount}</span>
                        <span className="pt-card-stat-label">Phản hồi</span>
                      </div>
                      <div className="pt-card-stat">
                        <span className="pt-card-stat-value" style={{ color: '#52c41a' }}>
                          {row.responseCount > 0
                            ? Math.round(((row.employedCount ?? 0) / row.responseCount) * 100)
                            : 0}%
                        </span>
                        <span className="pt-card-stat-label">Có việc làm</span>
                      </div>
                    </div>
                  )}
                  {row.feedback && (
                    <div className="pt-card-feedback">
                      <ExclamationCircleOutlined style={{ color: '#faad14', marginRight: 4 }} />
                      {row.feedback}
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="pt-card-actions">
                  <Tooltip title="Xem chi tiết">
                    <Button
                      type="text"
                      size="small"
                      icon={<EyeOutlined />}
                      onClick={() => navigate(`/admin/reports/faculty/${row.key}`)}
                    />
                  </Tooltip>
                  <Tooltip title={hist.length ? `${hist.length} lịch sử` : 'Lịch sử'}>
                    <Badge count={hist.length} size="small" offset={[-2, 2]}>
                      <Button
                        type="text"
                        size="small"
                        icon={<HistoryOutlined style={{ color: hist.length ? '#6366f1' : '#d1d5db' }} />}
                        onClick={() => setHistoryModal({ open: true, key: row.key, name: row.facultyName })}
                      />
                    </Badge>
                  </Tooltip>

                  <div style={{ flex: 1 }} />

                  {row.status === 'submitted' && (
                    <>
                      <Button
                        size="small"
                        type="primary"
                        icon={<CheckCircleOutlined />}
                        onClick={() => handleApprove(row.key)}
                      >
                        Duyệt
                      </Button>
                      <Button
                        size="small"
                        danger
                        icon={<CloseCircleOutlined />}
                        onClick={() => handleOpenReturn(row.key)}
                      >
                        Trả
                      </Button>
                    </>
                  )}
                  {row.status === 'returned' && (
                    <Button
                      size="small"
                      icon={<SendOutlined />}
                      onClick={() => handleResubmit(row.key)}
                    >
                      Nộp lại
                    </Button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

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
                    <span style={{ fontSize: 12, color: '#9ca3af' }}>{h.time}</span>
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