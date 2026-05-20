import React, { useState } from 'react';
import { Table, Button, Space, Empty, Tooltip, Modal, Input, Timeline, Tag } from 'antd';
import { EyeOutlined, HistoryOutlined, SendOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import type { FacultySubmissionRow, SubmissionStatus } from '../../../../feature/reports/types';
import { SubmissionPill } from './SubmissionPill';
import { DEFAULT_DEADLINE } from '../../../../feature/reports/constants';

interface Props {
  rows: FacultySubmissionRow[];
  onViewFaculty?: (facultyCode: string) => void;
}

type HistoryEntry = {
  time: string;
  action: string;
  note?: string;
  color: string;
};

type RowExtra = {
  history: HistoryEntry[];
  status: SubmissionStatus;
};

export const ProgressTable: React.FC<Props> = ({ rows, onViewFaculty }) => {
  const [statusMap, setStatusMap] = useState<Record<string, SubmissionStatus>>({});
  const [historyMap, setHistoryMap] = useState<Record<string, HistoryEntry[]>>({});

  // Modal trả bổ sung
  const [returnModal, setReturnModal] = useState<{ open: boolean; key: string }>({ open: false, key: '' });
  const [returnNote, setReturnNote] = useState('');

  // Modal lịch sử
  const [historyModal, setHistoryModal] = useState<{ open: boolean; key: string; name: string }>({
    open: false, key: '', name: '',
  });

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
    addHistory(key, {
      time: now(),
      action: 'Trả bổ sung',
      note: returnNote || undefined,
      color: 'orange',
    });
    setReturnModal({ open: false, key: '' });
  };

  const handleResubmit = (key: string) => {
    setStatusMap((prev) => ({ ...prev, [key]: 'submitted' }));
    addHistory(key, { time: now(), action: 'Nộp lại', color: 'blue' });
  };
 const columns: ColumnsType<FacultySubmissionRow & RowExtra> = [
  { title: 'STT', render: (_, __, i) => i + 1, width: 40, align: 'center' },
  { title: 'Tên khoa', dataIndex: 'facultyName' },
  {
    title: 'Trạng thái', dataIndex: 'status', width: 130,
    render: (_, row) => <SubmissionPill status={row.status} />,
  },
  {
    title: 'Người nộp', dataIndex: 'submittedBy', width: 130,
    render: (v: string | null) => v ?? '—',
  },
  {
    title: 'Thời gian nộp', dataIndex: 'submittedAt', width: 140,
    render: (v: string | null) => v ?? '—',
  },
  {
    title: 'Hạn nộp', dataIndex: 'deadline', width: 110,
    render: (v: string | null) => v ?? DEFAULT_DEADLINE,
  },
  {
    title: 'Thao tác', key: 'actions', width: 180,
    render: (_, row) => {
      const status = row.status;
      const hist = getHistory(row.key);
      return (
        <Space size={4} style={{ width: '100%', justifyContent: 'center' }}>
          <Button type="link" size="small" style={{ padding: '0 4px' }}
            onClick={() => onViewFaculty?.(row.facultyCode)}>
             <EyeOutlined />
          </Button>

          <Tooltip title="Lịch sử phản hồi">
            <Button
              type="text"
              size="small"
              style={{ padding: '0 4px' }}
              icon={<HistoryOutlined style={{ color: hist.length ? '#6366f1' : '#d1d5db' }} />}
              onClick={() => setHistoryModal({ open: true, key: row.key, name: row.facultyName })}
            />
          </Tooltip>

          {status === 'submitted' && (
            <>
              <Button size="small" type="primary"
                onClick={() => handleApprove(row.key)}>
                Duyệt
              </Button>
              <Button size="small" danger
                onClick={() => handleOpenReturn(row.key)}>
                Trả
              </Button>
            </>
          )}
          {status === 'returned' && (
            <Button size="small" icon={<SendOutlined />}
              onClick={() => handleResubmit(row.key)}>
              Nộp lại
            </Button>
          )}
        </Space>
      );
    },
  },
];

  const dataSource = rows.map((row) => ({
    ...row,
    deadline: row.deadline ?? DEFAULT_DEADLINE,
    submittedBy: row.submittedBy ?? null,
    status: getStatus(row),
    history: getHistory(row.key),
  }));

  // Lấy nhận xét gần nhất cho modal lịch sử
  const latestNote = historyMap[historyModal.key]?.find((h) => h.note)?.note;

  return (
    <>
      <div className="rp-table-title">Tiến độ nộp báo cáo theo khoa</div>

      <Table
        size="small"
        pagination={false}
        bordered={false}
        className="rp-formal-table"
        scroll={{ x: 'max-content' }}
        columns={columns}
        dataSource={dataSource}
        rowKey="key"
        locale={{ emptyText: <Empty description="Chưa có dữ liệu tiến độ" /> }}
        summary={(pageRows) => (
          <Table.Summary.Row className="rp-summary-row">
            <Table.Summary.Cell index={0} colSpan={3} align="center">
              <strong>TỔNG HỢP TIẾN ĐỘ</strong>
            </Table.Summary.Cell>
            <Table.Summary.Cell index={3} align="right">
              <strong>{pageRows.length} khoa</strong>
            </Table.Summary.Cell>
            {Array.from({ length: 4 }).map((_, i) => (
              <Table.Summary.Cell key={i} index={4 + i} align="right">-</Table.Summary.Cell>
            ))}
          </Table.Summary.Row>
        )}
      />

      {/*  Modal: Trả bổ sung  */}
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

      {/*  Modal: Lịch sử phản hồi  */}
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