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
  { title: 'Số QP TN',      dataIndex: 'certification', width: 90 },
  { title: 'Số CCCD',       dataIndex: 'cccd',          width: 120 },
  { title: 'Mã ngành',      dataIndex: 'majorCode',     width: 90 },
  { title: 'Quyết định TN', dataIndex: 'decision',      width: 95 },
  { title: 'Ngày ký QP',    dataIndex: 'certDate',      width: 90 },
  { title: 'Số điện thoại', dataIndex: 'phone',         width: 110 },
  { title: 'Email',         dataIndex: 'email',         width: 170 },
  { title: 'Hình thức khảo sát', dataIndex: 'surveyMethod', width: 110, render: () => 'Online' },
  {
    title: 'Có phản hồi', dataIndex: 'status', width: 90, align: 'center',
    render: (v: string) =>
      v === 'submitted' || v === 'approved' ? <Tag color="green">X</Tag> : '',
  },
  { title: 'Ghi chú', dataIndex: 'note',      width: 120 },
  { title: 'Ngành',   dataIndex: 'majorName', width: 140 },
  { title: 'Khoa',    dataIndex: 'cohort',    width: 100 },
];

interface Props {
  rows: GraduateRow[];
  orgLine1: string;
  orgLine2: string;
  title: string;
  note?: string;
  signLabel: string;
}

export const Mau02Table: React.FC<Props> = ({ rows, orgLine1, orgLine2, title, note, signLabel }) => (
  <SheetWrapper orgLine1={orgLine1} orgLine2={orgLine2} title={title} signLabel={signLabel} note={note}>
    <Table
      size="small"
      pagination={false}
      bordered
      className="rp-formal-table"
      scroll={{ x: 'max-content' }}
      columns={columns}
      dataSource={rows}
      rowKey="key"
    />
  </SheetWrapper>
);
