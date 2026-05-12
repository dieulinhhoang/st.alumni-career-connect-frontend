import React, { useState } from 'react';
import { Empty, Select, Skeleton, Space, Spin, Table, Tabs, Tag } from 'antd';
import {
  BarChartOutlined,
  DownloadOutlined,
  FileTextOutlined,
  PieChartOutlined,
  SendOutlined,
  TeamOutlined,
  TrophyOutlined,
  UserOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import AdminLayout from '../../../components/layout/AdminLayout';

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
  { value: '2026-1', label: 'Kh\u1ea3o s\u00e1t 2026 - \u0110\u1ee3t 1' },
  { value: '2025-2', label: 'Kh\u1ea3o s\u00e1t 2025 - \u0110\u1ee3t 2' },
  { value: '2025-1', label: 'Kh\u1ea3o s\u00e1t 2025 - \u0110\u1ee3t 1' },
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
      ? 'To\u00e0n tr\u01b0\u1eddng'
      : currentUser.scope === 'faculty'
      ? currentUser.facultyName
      : currentUser.majorName;

  const kpis = [
    {
      icon: <TeamOutlined />,
      iconClass: 'rp-kpi-icon--blue',
      label: 'T\u1ed5ng sinh vi\u00ean t\u1ed1t nghi\u1ec7p',
      value: stats.totalGraduates.toLocaleString('vi-VN'),
      sub: 'Kh\u00f3a hi\u1ec7n t\u1ea1i',
    },
    {
      icon: <SendOutlined />,
      iconClass: 'rp-kpi-icon--teal',
      label: 'T\u1ef7 l\u1ec7 n\u1ed9p kh\u1ea3o s\u00e1t',
      value: `${stats.submissionRate}%`,
      sub: `${stats.submitted} / ${stats.totalGraduates} sinh vi\u00ean`,
    },
    {
      icon: <TrophyOutlined />,
      iconClass: 'rp-kpi-icon--amber',
      label: 'T\u1ef7 l\u1ec7 c\u00f3 vi\u1ec7c l\u00e0m',
      value: `${stats.employmentRate}%`,
      sub: `${stats.employed} sinh vi\u00ean`,
    },
    {
      icon: <PieChartOutlined />,
      iconClass: 'rp-kpi-icon--purple',
      label: '\u0110\u00fang ng\u00e0nh ngh\u1ec1',
      value: `${stats.relevantJobRate}%`,
      sub: `TB l\u01b0\u01a1ng: ${stats.avgSalary}`,
    },
  ];

  const majorColumns: ColumnsType<MajorSummaryRow> = [
    { title: 'M\u00e3 ng\u00e0nh', dataIndex: 'majorCode', width: 100 },
    { title: 'T\u00ean ng\u00e0nh', dataIndex: 'majorName' },
    { title: 'T\u1ed5ng SV', dataIndex: 'total', align: 'right', width: 90 },
    { title: '\u0110\u00e3 n\u1ed9p', dataIndex: 'submitted', align: 'right', width: 90 },
    { title: '\u0110\u00e3 duy\u1ec7t', dataIndex: 'approved', align: 'right', width: 90 },
    {
      title: 'Ti\u1ebfn \u0111\u1ed9',
      render: (_, row) => <MiniBar value={row.submitted} max={row.total} color="var(--rp-teal)" />,
      width: 180,
    },
  ];

  const graduateColumns: ColumnsType<GraduateRow> = [
    { title: 'MSSV', dataIndex: 'studentCode', width: 100 },
    { title: 'H\u1ecd t\u00ean', dataIndex: 'fullName' },
    { title: 'Ng\u00e0nh', dataIndex: 'majorName' },
    { title: 'Kh\u00f3a', dataIndex: 'cohort', width: 80 },
    { title: 'Tr\u1ea1ng th\u00e1i', dataIndex: 'status', render: (v) => <SubmissionPill status={v} /> },
    { title: 'Ng\u00e0y n\u1ed9p', dataIndex: 'submittedAt', render: (v) => v ?? '\u2014' },
  ];

  const responseColumns: ColumnsType<ResponseRow> = [
    { title: 'MSSV', dataIndex: 'studentCode', width: 100 },
    { title: 'H\u1ecd t\u00ean', dataIndex: 'fullName' },
    { title: 'T\u00ecnh tr\u1ea1ng vi\u1ec7c l\u00e0m', dataIndex: 'employmentStatus' },
    { title: 'Ch\u1ee9c danh', dataIndex: 'jobTitle', render: (v) => v ?? '\u2014' },
    { title: 'C\u00f4ng ty', dataIndex: 'company', render: (v) => v ?? '\u2014' },
    { title: 'M\u1ee9c l\u01b0\u01a1ng', dataIndex: 'salary', render: (v) => v ?? '\u2014' },
    {
      title: '\u0110\u00fang ng\u00e0nh',
      dataIndex: 'relevance',
      render: (v) =>
        v ? <Tag color="green">{v}</Tag> : <Tag color="default">Ch\u01b0a x\u00e1c \u0111\u1ecbnh</Tag>,
    },
  ];

  const facultyColumns: ColumnsType<FacultySubmissionRow> = [
    { title: 'M\u00e3 khoa', dataIndex: 'facultyCode', width: 100 },
    { title: 'T\u00ean khoa', dataIndex: 'facultyName' },
    { title: 'T\u1ed5ng SV', dataIndex: 'total', align: 'right', width: 90 },
    { title: '\u0110\u00e3 n\u1ed9p', dataIndex: 'submitted', align: 'right', width: 90 },
    { title: '\u0110\u00e3 duy\u1ec7t', dataIndex: 'approved', align: 'right', width: 90 },
    {
      title: 'Ti\u1ebfn \u0111\u1ed9',
      render: (_, row) => <MiniBar value={row.submitted} max={row.total} color="var(--rp-teal)" />,
      width: 180,
    },
  ];

  const tableProps = { size: 'small' as const, pagination: { pageSize: 10 } };

  return (
    <AdminLayout>
      <div className="rp-page">
        {/* ---- Header ---- */}
        <div className="rp-header">
          <div className="rp-header__left">
            <div className="rp-header__badge">
              <FileTextOutlined /> B\u00e1o c\u00e1o
            </div>
            <h1 className="rp-header__title">B\u00e1o c\u00e1o kh\u1ea3o s\u00e1t vi\u1ec7c l\u00e0m</h1>
            <p className="rp-header__desc">
              T\u1ed5ng h\u1ee3p k\u1ebft qu\u1ea3 kh\u1ea3o s\u00e1t vi\u1ec7c l\u00e0m sinh vi\u00ean t\u1ed1t nghi\u1ec7p.
            </p>
          </div>
          <div className="rp-header__actions">
            <div className="rp-filter-row">
              <div className="rp-filter-item">
                <label className="rp-filter-label">Vai tr\u00f2 (demo)</label>
                <Select
                  value={userIndex}
                  onChange={setUserIndex}
                  style={{ width: 180 }}
                  size="small"
                >
                  <Option value={0}>Super Admin</Option>
                  <Option value={1}>Faculty Officer</Option>
                  <Option value={2}>Major Officer</Option>
                </Select>
              </div>
              <div className="rp-filter-item">
                <label className="rp-filter-label">\u0110\u1ee3t kh\u1ea3o s\u00e1t</label>
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
            </div>
            <div className="rp-scope-badge">
              Ph\u1ea1m vi: <strong>{scopeLabel}</strong>
            </div>
          </div>
        </div>

        <Space direction="vertical" size={20} style={{ width: '100%' }}>
          {/* ---- KPI Cards ---- */}
          <div className="rp-kpi-grid">
            {kpis.map((kpi, i) => (
              <div className="rp-kpi-card" key={i}>
                <div className={`rp-kpi-icon ${kpi.iconClass}`}>{kpi.icon}</div>
                <div className="rp-kpi-body">
                  <div className="rp-kpi-label">{kpi.label}</div>
                  <div className="rp-kpi-value">{kpi.value}</div>
                  <div className="rp-kpi-sub">{kpi.sub}</div>
                </div>
              </div>
            ))}
          </div>

          {/* ---- Tables ---- */}
          <Spin spinning={loading}>
            <div className="rp-table-card">
              <Tabs
                defaultActiveKey="overview"
                className="rp-tabs"
                items={[
                  {
                    key: 'overview',
                    label: 'T\u1ed5ng quan theo ng\u00e0nh',
                    children: (
                      <Table
                        {...tableProps}
                        columns={majorColumns}
                        dataSource={majorRows}
                        rowKey="key"
                      />
                    ),
                  },
                  {
                    key: 'graduates',
                    label: 'Danh s\u00e1ch sinh vi\u00ean',
                    children: (
                      <Table
                        {...tableProps}
                        columns={graduateColumns}
                        dataSource={graduateRows}
                        rowKey="key"
                      />
                    ),
                  },
                  {
                    key: 'responses',
                    label: 'Ph\u1ea3n h\u1ed3i kh\u1ea3o s\u00e1t',
                    children: (
                      <Table
                        {...tableProps}
                        columns={responseColumns}
                        dataSource={responseRows}
                        rowKey="key"
                      />
                    ),
                  },
                  {
                    key: 'progress',
                    label: 'Ti\u1ebfn \u0111\u1ed9 n\u1ed9p theo khoa',
                    children:
                      currentUser.scope === 'school' ? (
                        <Table
                          {...tableProps}
                          columns={facultyColumns}
                          dataSource={facultyRows}
                          rowKey="key"
                        />
                      ) : (
                        <Empty description="Ch\u1ec9 hi\u1ec3n th\u1ecb v\u1edbi quy\u1ec1n To\u00e0n tr\u01b0\u1eddng" />
                      ),
                  },
                ]}
              />
            </div>
          </Spin>
        </Space>
      </div>
    </AdminLayout>
  );
}
