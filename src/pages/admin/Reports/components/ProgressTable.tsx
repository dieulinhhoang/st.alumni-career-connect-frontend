import React, { useState } from 'react';
import { Table, Button, Space, Empty, Tooltip } from 'antd';
import { ClockCircleOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import type { FacultySubmissionRow, SubmissionStatus } from '../../../../feature/reports/types';
import { SubmissionPill } from './SubmissionPill';
import { DEFAULT_DEADLINE } from '../../../../feature/reports/constants';

interface Props {
  rows: FacultySubmissionRow[];
  /** Called when admin clicks "Xem" on a faculty row */
  onViewFaculty?: (facultyCode: string) => void;
}

export const ProgressTable: React.FC<Props> = ({ rows, onViewFaculty }) => {
  const [statusMap, setStatusMap] = useState<Record<string, SubmissionStatus>>({});
  const [feedbackMap, setFeedbackMap] = useState<Record<string, string>>({});

  const getStatus = (row: FacultySubmissionRow): SubmissionStatus =>
    statusMap[row.key] ?? row.status ?? 'draft';

  const updateStatus = (key: string, status: SubmissionStatus) =>
    setStatusMap((prev) => ({ ...prev, [key]: status }));

  const columns: ColumnsType<FacultySubmissionRow> = [
    { title: 'STT',    render: (_, __, i) => i + 1, width: 40, align: 'center' },
    { title: 'Mã khoa', dataIndex: 'facultyCode',  width: 90 },
    { title: 'Tên khoa', dataIndex: 'facultyName' },
    {
      title: 'Trạng thái', dataIndex: 'status', width: 130,
      render: (_, row) => <SubmissionPill status={getStatus(row)} />,
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
      title: 'Hạn nộp', dataIndex: 'deadline', width: 120,
      render: (v: string | null) => v ?? DEFAULT_DEADLINE,
    },
    {
      title: 'Phản hồi từ trường',
      dataIndex: 'feedback',
      width: 200,
      render: (v: string | null, row) => (
        <input
          className="rp-feedback-input"
          defaultValue={v ?? ''}
          placeholder="Nhập phản hồi…"
          onChange={(e) =>
            setFeedbackMap((prev) => ({ ...prev, [row.key]: e.target.value }))
          }
          title={feedbackMap[row.key] ?? v ?? ''}
        />
      ),
    },
    {
      title: 'Thao tác', key: 'actions', width: 240,
      render: (_, row) => {
        const status = getStatus(row);
        return (
          <Space size="small">
            <Button
              type="link"
              size="small"
              onClick={() => onViewFaculty?.(row.facultyCode)}
            >
              Xem
            </Button>
            {status === 'submitted' && (
              <>
                <Button size="small" type="primary" onClick={() => updateStatus(row.key, 'approved')}>Duyệt</Button>
                <Button size="small" danger onClick={() => updateStatus(row.key, 'returned')}>Trả bổ sung</Button>
              </>
            )}
            {status === 'returned' && (
              <Button size="small" onClick={() => updateStatus(row.key, 'submitted')}>Đã nộp lại</Button>
            )}
            {status === 'draft' && (
              <Tooltip title="Chờ khoa nộp">
                <ClockCircleOutlined style={{ color: '#9ca3af', fontSize: 15 }} />
              </Tooltip>
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
    feedback: row.feedback ?? null,
    status: getStatus(row),
  }));

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
            {Array.from({ length: 5 }).map((_, i) => (
              <Table.Summary.Cell key={i} index={4 + i} align="right">-</Table.Summary.Cell>
            ))}
          </Table.Summary.Row>
        )}
      />
    </>
  );
};
