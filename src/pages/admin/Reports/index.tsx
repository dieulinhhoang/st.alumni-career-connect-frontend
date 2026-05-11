import React, { useState } from 'react';
import { Select, Skeleton, Spin, Table, Tag, Tabs, Empty } from 'antd';
import {
  DownloadOutlined,
  FileTextOutlined,
  SendOutlined,
  TeamOutlined,
  TrophyOutlined,
  PieChartOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import AdminLayout from '../../../../components/layout/AdminLayout';
import type {
  FilterState,
  GraduateRow,
  MajorSummaryRow,
  FacultySubmissionRow,
  ResponseRow,
} from './types';
import { useReportData } from './useReportData';
import { SubmissionPill, MiniBar } from './components/SubmissionPill';
import './styles.css';

const { Option } = Select;

const SURVEY_OPTIONS = [
  { value: '2026-1', label: 'Khảo sát 2026 - Đợt 1' },
  { value: '2025-2', label: 'Khảo sát 2025 - Đợt 2' },
  { value: '2025-1', label: 'Khảo sát 2025 - Đợt 1' },
];

export default function ReportsPage() {
  const [userIndex, setUserIndex] = useState(0);
  const [filters, setFilters] = useState<FilterState>({ surveyId: '2026-1' });

  const {
    currentUser,
    stats,
    majorRows,
    graduateRows,
    responseRows,
    facultyRows,
    loading,
  } = useReportData(filters, userIndex);

  const scopeLabel =
    currentUser.scope === 'school'
      ? 'Toàn trường'
      : currentUser.scope === 'faculty'
      ? currentUser.facultyName
      : currentUser.majorName;

  const kpis = [
    {
      icon: <TeamOutlined />,
      color: '#1677ff',
      bg: '#e6f4ff',
      label: 'Tổng sinh viên tốt nghiệp',
      value: stats.totalGraduates.toLocaleString('vi-VN'),
      sub: 'Khóa hiện tại',
    },
    {
      icon: <SendOutlined />,
      color: '#0d9488',
      bg: '#ccfbf1',
      label: 'Tỷ lệ nộp khảo sát',
      value: `${stats.submissionRate}%`,
      sub: `${stats.submitted} / ${stats.totalGraduates} sinh viên`,
    },
    {
      icon: <TrophyOutlined />,
      color: '#d97706',
      bg: '#fef3c7',
      label: 'Tỷ lệ có việc làm',
      value: `${stats.employmentRate}%`,
      sub: `${stats.employed} sinh viên`,
    },
    {
      icon: <PieChartOutlined />,
      color: '#7c3aed',
      bg: '#ede9fe',
      label: 'Đúng ngành nghề',
      value: `${stats.relevantJobRate}%`,
      sub: `TB lương: ${stats.avgSalary}`,
    },
  ];

  // ---- Mẫu 01: Bảng tổng hợp theo ngành ----
  const mau01Columns: ColumnsType<MajorSummaryRow> = [
    { title: 'TT', render: (_: any, __: any, i: number) => i + 1, width: 48, align: 'center' },
    { title: 'Mã ngành', dataIndex: 'majorCode', width: 90, align: 'center' },
    { title: 'Tên ngành đào tạo', dataIndex: 'majorName', width: 180 },
    {
      title: 'Số SV tốt nghiệp',
      children: [
        { title: 'Tổng số', dataIndex: 'total', width: 70, align: 'right' },
        { title: 'Nữ', dataIndex: 'totalNu', width: 55, align: 'right' },
      ],
    },
    {
      title: 'Số SV phản hồi',
      children: [
        { title: 'Tổng số', dataIndex: 'submitted', width: 70, align: 'right' },
        { title: 'Nữ', dataIndex: 'submittedNu', width: 55, align: 'right' },
      ],
    },
    {
      title: 'Tình hình việc làm (SV có PH)',
      children: [
        { title: 'Có VL', dataIndex: 'coViecLam', width: 60, align: 'right' },
        { title: 'TT học', dataIndex: 'tiepTucHoc', width: 60, align: 'right' },
        { title: 'Chưa có VL', dataIndex: 'chuaCoViecLam', width: 80, align: 'right' },
      ],
    },
    {
      title: 'Tỷ lệ có VL / PH',
      dataIndex: 'submitted',
      width: 80,
      align: 'right',
      render: (_: any, row: MajorSummaryRow) =>
        row.submitted ? `${Math.round((row.approved / row.submitted) * 100)}%` : '—',
    },
    {
      title: 'Tỷ lệ có VL / TN',
      dataIndex: 'total',
      width: 80,
      align: 'right',
      render: (_: any, row: MajorSummaryRow) =>
        row.total ? `${Math.round((row.approved / row.total) * 100)}%` : '—',
    },
  ];

  // ---- Mẫu 02: Danh sách sinh viên ----
  const mau02Columns: ColumnsType<GraduateRow> = [
    { title: 'TT', render: (_: any, __: any, i: number) => i + 1, width: 48, align: 'center' },
    { title: 'Mã SV', dataIndex: 'studentCode', width: 100 },
    { title: 'Họ và tên', dataIndex: 'fullName', width: 150 },
    { title: 'Nữ', dataIndex: 'gender', width: 50, align: 'center', render: (v: string) => v === 'female' ? 'X' : '' },
    { title: 'Mã ngành', dataIndex: 'majorCode', width: 90 },
    { title: 'Số QĐ TN', dataIndex: 'certification', width: 100 },
    { title: 'Ngày ký QĐ', dataIndex: 'certDate', width: 100 },
    { title: 'Số điện thoại', dataIndex: 'phone', width: 110 },
    { title: 'Email', dataIndex: 'email', width: 160 },
    { title: 'Hình thức KS', dataIndex: 'surveyMethod', width: 90, render: () => 'Online' },
    {
      title: 'Có phản hồi',
      dataIndex: 'status',
      width: 80,
      align: 'center',
      render: (v: string) => v === 'submitted' || v === 'approved' ? 'X' : '',
    },
    { title: 'Ghi chú', dataIndex: 'note', width: 120, render: (v: string) => v ?? '' },
    { title: 'Ngành', dataIndex: 'majorName', width: 140 },
    { title: 'Khoa', dataIndex: 'cohort', width: 80 },
  ];

  // ---- Mẫu 03: Phản hồi chi tiết ----
  const mau03Columns: ColumnsType<ResponseRow> = [
    { title: 'TT', render: (_: any, __: any, i: number) => i + 1, width: 48, align: 'center' },
    { title: 'Mã SV', dataIndex: 'studentCode', width: 90 },
    { title: 'Họ và tên', dataIndex: 'fullName', width: 150 },
    {
      title: 'Tình hình việc làm',
      children: [
        {
          title: 'Có VL',
          children: [
            { title: 'Đúng ngành', dataIndex: 'dungNganh', width: 60, align: 'center', render: (v: boolean) => v ? 'x' : '' },
            { title: 'Liên quan', dataIndex: 'lienQuan', width: 65, align: 'center', render: (v: boolean) => v ? 'x' : '' },
            { title: 'Không LQ', dataIndex: 'khongLienQuan', width: 65, align: 'center', render: (v: boolean) => v ? 'x' : '' },
          ],
        },
        { title: 'TT học', dataIndex: 'tiepTucHoc', width: 55, align: 'center', render: (v: boolean) => v ? 'x' : '' },
        { title: 'Chưa có VL', dataIndex: 'chuaCoVl', width: 70, align: 'center', render: (v: boolean) => v ? 'x' : '' },
      ],
    },
    {
      title: 'Khu vực làm việc',
      children: [
        { title: 'NN', dataIndex: 'kvNhaNuoc', width: 50, align: 'center', render: (v: boolean) => v ? 'x' : '' },
        { title: 'TN', dataIndex: 'kvTuNhan', width: 50, align: 'center', render: (v: boolean) => v ? 'x' : '' },
        { title: 'TT VL', dataIndex: 'kvTuTao', width: 55, align: 'center', render: (v: boolean) => v ? 'x' : '' },
      ],
    },
    { title: 'Nơi làm việc (Tỉnh/TP)', dataIndex: 'workLocation', width: 130, render: (v: string) => v ?? '—' },
    { title: 'Mức lương KĐ (triệu)', dataIndex: 'salary', width: 100, align: 'right', render: (v: string) => v ?? '—' },
    {
      title: 'Đúng ngành',
      dataIndex: 'relevance',
      width: 90,
      render: (v: string) =>
        v ? <Tag color="green">{v}</Tag> : <Tag color="default">Chưa xác định</Tag>,
    },
  ];

  const tableProps = {
    size: 'small' as const,
    pagination: { pageSize: 10 },
    bordered: true,
    className: 'rp-formal-table',
    scroll: { x: 'max-content' as const },
  };

  const selectedSurveyLabel =
    SURVEY_OPTIONS.find((o) => o.value === filters.surveyId)?.label ?? filters.surveyId;

  return (
    <AdminLayout>
      <div className="rp-page">
        {/* ======= PAGE HEADER ======= */}
        <div className="rp-doc-header">
          <div className="rp-doc-header__org">
            <div className="rp-doc-header__ministry">HỌC VIỆN NÔNG NGHIỆP VIỆT NAM</div>
            <div className="rp-doc-header__dept">BAN QUẢN LÝ ĐÀO TẠO</div>
          </div>
          <div className="rp-doc-header__center">
            <div className="rp-doc-header__title">BÁO CÁO TỔNG HỢP</div>
            <div className="rp-doc-header__subtitle">Khảo sát việc làm sinh viên tốt nghiệp</div>
            <div className="rp-doc-header__survey-name">{selectedSurveyLabel}</div>
          </div>
          <div className="rp-doc-header__actions">
            <div className="rp-filter-item">
              <label className="rp-filter-label">Vai trò (demo)</label>
              <Select value={userIndex} onChange={setUserIndex} style={{ width: 180 }} size="small">
                <Option value={0}>Super Admin</Option>
                <Option value={1}>Faculty Officer</Option>
                <Option value={2}>Major Officer</Option>
              </Select>
            </div>
            <div className="rp-filter-item" style={{ marginTop: 8 }}>
              <label className="rp-filter-label">Đợt khảo sát</label>
              <Select
                value={filters.surveyId}
                onChange={(v) => setFilters((f) => ({ ...f, surveyId: v }))}
                style={{ width: 220 }}
                size="small"
              >
                {SURVEY_OPTIONS.map((o) => (
                  <Option key={o.value} value={o.value}>{o.label}</Option>
                ))}
              </Select>
            </div>
            <div className="rp-scope-badge" style={{ marginTop: 10 }}>
              Phạm vi: <strong>{scopeLabel}</strong>
            </div>
          </div>
        </div>

        {/* ======= KPI CARDS ======= */}
        <div className="rp-kpi-grid">
          {kpis.map((kpi, i) => (
            <div className="rp-kpi-card" key={i}>
              <div className="rp-kpi-icon" style={{ background: kpi.bg, color: kpi.color }}>
                {kpi.icon}
              </div>
              <div className="rp-kpi-body">
                <div className="rp-kpi-label">{kpi.label}</div>
                <div className="rp-kpi-value" style={{ color: kpi.color }}>{kpi.value}</div>
                <div className="rp-kpi-sub">{kpi.sub}</div>
              </div>
            </div>
          ))}
        </div>

        {/* ======= TABLES ======= */}
        <Spin spinning={loading}>
          <div className="rp-table-card">
            <Tabs
              defaultActiveKey="mau01"
              className="rp-tabs"
              items={[
                {
                  key: 'mau01',
                  label: (
                    <span>
                      <FileTextOutlined /> Mẫu số 01 – Tổng hợp theo ngành
                    </span>
                  ),
                  children: (
                    <>
                      <div className="rp-table-title">MẪU SỐ 01: BẢNG TỔNG HỢP TÌNH HÌNH VIỆC LÀM SINH VIÊN TỐT NGHIỆP THEO NGÀNH ĐÀO TẠO</div>
                      <Table
                        {...tableProps}
                        columns={mau01Columns as any}
                        dataSource={majorRows}
                        rowKey="key"
                        summary={(rows) => {
                          const tot = rows.reduce((a, r) => a + (r.total || 0), 0);
                          const sub = rows.reduce((a, r) => a + (r.submitted || 0), 0);
                          const app = rows.reduce((a, r) => a + (r.approved || 0), 0);
                          return (
                            <Table.Summary.Row className="rp-summary-row">
                              <Table.Summary.Cell index={0} colSpan={3} align="center">
                                <strong>TỔNG HỢP</strong>
                              </Table.Summary.Cell>
                              <Table.Summary.Cell index={3} align="right"><strong>{tot}</strong></Table.Summary.Cell>
                              <Table.Summary.Cell index={4} align="right">—</Table.Summary.Cell>
                              <Table.Summary.Cell index={5} align="right"><strong>{sub}</strong></Table.Summary.Cell>
                              <Table.Summary.Cell index={6} align="right">—</Table.Summary.Cell>
                              <Table.Summary.Cell index={7} align="right"><strong>{app}</strong></Table.Summary.Cell>
                              <Table.Summary.Cell index={8} align="right">—</Table.Summary.Cell>
                              <Table.Summary.Cell index={9} align="right">—</Table.Summary.Cell>
                              <Table.Summary.Cell index={10} align="right">
                                <strong>{sub ? `${Math.round((app / sub) * 100)}%` : '—'}</strong>
                              </Table.Summary.Cell>
                              <Table.Summary.Cell index={11} align="right">
                                <strong>{tot ? `${Math.round((app / tot) * 100)}%` : '—'}</strong>
                              </Table.Summary.Cell>
                            </Table.Summary.Row>
                          );
                        }}
                      />
                    </>
                  ),
                },
                {
                  key: 'mau02',
                  label: (
                    <span>
                      <TeamOutlined /> Mẫu số 02 – Danh sách sinh viên
                    </span>
                  ),
                  children: (
                    <>
                      <div className="rp-table-title">MẪU SỐ 02: DANH SÁCH SINH VIÊN TỐT NGHIỆP</div>
                      <Table
                        {...tableProps}
                        columns={mau02Columns}
                        dataSource={graduateRows}
                        rowKey="key"
                      />
                    </>
                  ),
                },
                {
                  key: 'mau03',
                  label: (
                    <span>
                      <PieChartOutlined /> Mẫu số 03 – Phản hồi khảo sát
                    </span>
                  ),
                  children: (
                    <>
                      <div className="rp-table-title">MẪU SỐ 03: DANH SÁCH SINH VIÊN CÓ PHẢN HỒI KHẢO SÁT VIỆC LÀM</div>
                      <Table
                        {...tableProps}
                        columns={mau03Columns as any}
                        dataSource={responseRows}
                        rowKey="key"
                      />
                    </>
                  ),
                },
                {
                  key: 'progress',
                  label: (
                    <span>
                      <SendOutlined /> Tiến độ theo khoa
                    </span>
                  ),
                  children:
                    currentUser.scope === 'school' ? (
                      <>
                        <div className="rp-table-title">TIẾN ĐỘ NỘP KHẢO SÁT THEO KHOA</div>
                        <Table
                          {...tableProps}
                          columns={[
                            { title: 'TT', render: (_: any, __: any, i: number) => i + 1, width: 48, align: 'center' },
                            { title: 'Mã khoa', dataIndex: 'facultyCode', width: 100 },
                            { title: 'Tên khoa', dataIndex: 'facultyName' },
                            { title: 'Tổng SV', dataIndex: 'total', align: 'right', width: 90 },
                            { title: 'Đã nộp', dataIndex: 'submitted', align: 'right', width: 90 },
                            { title: 'Đã duyệt', dataIndex: 'approved', align: 'right', width: 90 },
                            {
                              title: 'Tiến độ',
                              render: (_: any, row: FacultySubmissionRow) => (
                                <MiniBar value={row.submitted} max={row.total} color="var(--rp-teal)" />
                              ),
                              width: 180,
                            },
                          ]}
                          dataSource={facultyRows}
                          rowKey="key"
                        />
                      </>
                    ) : (
                      <Empty description="Chỉ hiển thị với quyền Toàn trường" />
                    ),
                },
              ]}
            />
          </div>
        </Spin>
      </div>
    </AdminLayout>
  );
}
