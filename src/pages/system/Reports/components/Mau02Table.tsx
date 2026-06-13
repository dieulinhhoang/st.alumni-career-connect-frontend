import React from 'react';
import { Table, Tag } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import type { GraduateRow } from '../../../../feature/reports/types';
import { SheetWrapper } from './SheetWrapper';

const columns: ColumnsType<GraduateRow> = [
  { title: 'STT',  render: (_, __, i) => i + 1,  width: 42,  align: 'center', fixed: 'left' },
  { title: 'Mã SV',         dataIndex: 'studentCode', width: 90 },
  { title: 'Họ và tên',     dataIndex: 'fullName',    width: 160 },
  {
    title: 'Nữ', dataIndex: 'gender', width: 40, align: 'center',
    render: (v: string) => (v === 'female' ? 'X' : ''),
  },
  { title: 'Số CCCD',       dataIndex: 'cccd',          width: 120 },
  { title: 'Mã ngành',      dataIndex: 'majorCode',     width: 90 },
  { title: 'Tên ngành',     dataIndex: 'majorName',     width: 160 },
  { title: 'Khoa',          dataIndex: 'facultyName',   width: 140 },
  { title: 'Số điện thoại', dataIndex: 'phone',         width: 110 },
  { title: 'Email',         dataIndex: 'email',         width: 170 },
  { title: 'Hình thức khảo sát', dataIndex: 'surveyMethod', width: 110, render: () => 'Online' },
  {
    title: 'Đã phản hồi',
    dataIndex: 'status',
    width: 100,
    align: 'center',
    render: (v: string) =>
      v === 'submitted' || v === 'approved'
        ? <Tag color="green">Đã phản hồi</Tag>
        : <Tag color="default">Chưa phản hồi</Tag>,
    filters: [
      { text: 'Đã phản hồi', value: 'submitted' },
      { text: 'Chưa phản hồi', value: 'draft' },
    ],
    onFilter: (value, record) =>
      value === 'submitted'
        ? record.status === 'submitted' || record.status === 'approved'
        : record.status !== 'submitted' && record.status !== 'approved',
  },
  { title: 'Ghi chú', dataIndex: 'note', width: 120 },
  { title: 'Đợt TN',  dataIndex: 'cohort', width: 100 },
];

interface Props {
  rows: GraduateRow[];
  orgLine1: string;
  orgLine2: string;
  title: string;
  note?: string;
  signLabel: string;
}

export const Mau02Table: React.FC<Props> = ({ rows, orgLine1, orgLine2, title, note, signLabel }) => {
  const respondedCount = rows.filter(r => r.status === 'submitted' || r.status === 'approved').length;
  const totalCount = rows.length;

  return (
    <SheetWrapper orgLine1={orgLine1} orgLine2={orgLine2} title={title} signLabel={signLabel}
      note={note ?? `Tổng số sinh viên: ${totalCount} | Đã phản hồi: ${respondedCount} | Chưa phản hồi: ${totalCount - respondedCount}`}>
      <Table
        size="small"
        pagination={false}
        bordered
        className="rp-formal-table"
        scroll={{ x: 'max-content' }}
        columns={columns}
        dataSource={rows}
        rowKey="key"
        rowClassName={(record) =>
          record.status === 'submitted' || record.status === 'approved'
            ? ''
            : 'rp-row-no-response'
        }
        summary={() => (
          <Table.Summary.Row className="rp-summary-row">
            <Table.Summary.Cell index={0} colSpan={2} align="center">
              <strong>TỔNG</strong>
            </Table.Summary.Cell>
            <Table.Summary.Cell index={2} colSpan={10}>
              <strong>
                {totalCount} SV tốt nghiệp &nbsp;|&nbsp;
                {respondedCount} đã phản hồi ({totalCount > 0 ? Math.round(respondedCount / totalCount * 100) : 0}%) &nbsp;|&nbsp;
                {totalCount - respondedCount} chưa phản hồi
              </strong>
            </Table.Summary.Cell>
          </Table.Summary.Row>
        )}
      />
    </SheetWrapper>
  );
};