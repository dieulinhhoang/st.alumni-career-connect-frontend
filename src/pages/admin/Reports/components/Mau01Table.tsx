import React from 'react';
import { Table } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import type { MajorSummaryRow } from '../../../../feature/reports/types';
import { SheetWrapper } from './SheetWrapper';

const columns: ColumnsType<MajorSummaryRow> = [
  { title: 'STT', render: (_, __, i) => i + 1, width: 42, align: 'center', fixed: 'left' },
  { title: 'Mã ngành',          dataIndex: 'majorCode', width: 90 },
  { title: 'Tên ngành đào tạo', dataIndex: 'majorName', width: 200 },
  {
    title: 'SV tốt nghiệp',
    children: [
      { title: 'Tổng số', dataIndex: 'total',   width: 65, align: 'right' },
      { title: 'Nữ',      dataIndex: 'totalNu', width: 50, align: 'right' },
    ],
  },
  {
    title: 'SV phản hồi',
    children: [
      { title: 'Tổng số', dataIndex: 'submitted',   width: 65, align: 'right' },
      { title: 'Nữ',      dataIndex: 'submittedNu', width: 50, align: 'right' },
    ],
  },
  { title: 'Có việc làm',       dataIndex: 'coViecLam',     width: 80,  align: 'right' },
  { title: 'Tiếp tục học',      dataIndex: 'tiepTucHoc',    width: 90,  align: 'right' },
  { title: 'Chưa có việc làm',  dataIndex: 'chuaCoViecLam', width: 110, align: 'right' },
  {
    title: 'Tỷ lệ VL / Phản hồi',
    width: 100,
    align: 'right',
    render: (_, row) =>
      row.submitted ? `${Math.round((row.approved / row.submitted) * 100)}%` : '-',
  },
  {
    title: 'Tỷ lệ VL / Tốt nghiệp',
    width: 110,
    align: 'right',
    render: (_, row) =>
      row.total ? `${Math.round((row.approved / row.total) * 100)}%` : '-',
  },
  { title: 'Nhà nước',          dataIndex: 'kvNhaNuoc',    width: 80,  align: 'right' },
  { title: 'Tư nhân',           dataIndex: 'kvTuNhan',     width: 70,  align: 'right' },
  { title: 'Tự tạo VL',         dataIndex: 'kvTuTao',      width: 80,  align: 'right' },
  { title: 'Có YNN',            dataIndex: 'kvYNuocNgoai', width: 85,  align: 'right' },
  { title: 'Nơi làm việc (Tỉnh/TP)', dataIndex: 'workLocation', width: 130 },
];

interface Props {
  rows: MajorSummaryRow[];
  orgLine1: string;
  orgLine2: string;
  title: string;
  note?: string;
  signLabel: string;
}

export const Mau01Table: React.FC<Props> = ({ rows, orgLine1, orgLine2, title, note, signLabel }) => (
  <SheetWrapper orgLine1={orgLine1} orgLine2={orgLine2} title={title} signLabel={signLabel} note={note}>
    <Table
      size="small"
      pagination={false}
      bordered
      className="rp-formal-table"
      scroll={{ x: 'max-content' }}
      columns={columns as any}
      dataSource={rows}
      rowKey="key"
      summary={(pageRows) => {
        const tot = pageRows.reduce((a, r) => a + (r.total || 0), 0);
        const totNu = pageRows.reduce((a, r) => a + (r.totalNu || 0), 0);
        const sub = pageRows.reduce((a, r) => a + (r.submitted || 0), 0);
        const subNu = pageRows.reduce((a, r) => a + (r.submittedNu || 0), 0);
        const app = pageRows.reduce((a, r) => a + (r.approved || 0), 0);
        const tiep = pageRows.reduce((a, r) => a + (r.tiepTucHoc || 0), 0);
        const chua = pageRows.reduce((a, r) => a + (r.chuaCoViecLam || 0), 0);
        return (
          <Table.Summary.Row className="rp-summary-row">
            <Table.Summary.Cell index={0} colSpan={3} align="center"><strong>TỔNG HỢP</strong></Table.Summary.Cell>
            <Table.Summary.Cell index={3} align="right"><strong>{tot}</strong></Table.Summary.Cell>
            <Table.Summary.Cell index={4} align="right"><strong>{totNu}</strong></Table.Summary.Cell>
            <Table.Summary.Cell index={5} align="right"><strong>{sub}</strong></Table.Summary.Cell>
            <Table.Summary.Cell index={6} align="right"><strong>{subNu}</strong></Table.Summary.Cell>
            <Table.Summary.Cell index={7} align="right"><strong>{app}</strong></Table.Summary.Cell>
            <Table.Summary.Cell index={8} align="right"><strong>{tiep}</strong></Table.Summary.Cell>
            <Table.Summary.Cell index={9} align="right"><strong>{chua}</strong></Table.Summary.Cell>
            <Table.Summary.Cell index={10} align="right">
              <strong>{tot > 0 ? `${Math.round(app / tot * 100)}%` : '-'}</strong>
            </Table.Summary.Cell>
            {Array.from({ length: 6 }).map((_, i) => (
              <Table.Summary.Cell key={i} index={11 + i} align="right">-</Table.Summary.Cell>
            ))}
          </Table.Summary.Row>
        );
      }}
    />
  </SheetWrapper>
);