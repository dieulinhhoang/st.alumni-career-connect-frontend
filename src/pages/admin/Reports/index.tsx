// src/pages/admin/Reports/index.tsx
import React, { useState } from 'react';
import {
  Badge,
  Button,
  Col,
  DatePicker,
  Dropdown,
  Empty,
  Row,
  Select,
  Spin,
  Table,
  Tabs,
  Tag,
  Typography,
  message,
} from 'antd';
import {
  BarChartOutlined,
  DownloadOutlined,
  FilterOutlined,
  PieChartOutlined,
  ReloadOutlined,
  SendOutlined,
  TeamOutlined,
  UserOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';

import type { FilterState, GraduateRow, MajorSummaryRow, FacultySubmissionRow, ResponseRow } from './types';
import { useReportData } from './useReportData';
import { StatCardGrid } from './components/StatCard';
import { KpiRingGroup } from './components/KpiRing';
import { SubmissionPill, MiniBar } from './components/SubmissionPill';

const { Title, Text } = Typography;
const { Option } = Select;

const SURVEY_OPTIONS = [
  { value: '2026-1', label: 'Khảo sát 2026 - Đợt 1' },
  { value: '2025-2', label: 'Khảo sát 2025 - Đợt 2' },
  { value: '2025-1', label: 'Khảo sát 2025 - Đợt 1' },
];

export default function ReportsPage() {
  const [messageApi, contextHolder] = message.useMessage();
  const [userIndex, setUserIndex] = useState(0);
  const [filters, setFilters] = useState<FilterState>({ surveyId: '2026-1' });
  const [activeView, setActiveView] = useState('overview');

  const { currentUser, stats, majorRows, graduateRows, responseRows, facultyRows, loading } =
    useReportData(filters, userIndex);

  const scopeLabel =
    currentUser.scope === 'school'
      ? 'Toàn trường'
      : currentUser.scope === 'faculty'
      ? currentUser.facultyName
      : currentUser.majorName;

  const statCards = [
    {
      label: 'Tổng sinh viên tốt nghiệp',
      value: stats.totalGraduates.toLocaleString(),
      icon: <TeamOutlined />,
      accent: '#1677ff',
      sub: 'Khóa hiện tại',
    },
    {
      label: 'Tỉ lệ nộp khảo sát',
      value: `${stats.submissionRate}%`,
      icon: <SendOutlined />,
      accent: '#52c41a',
      trend: 3.2,
    },
    {
      label: 'Tỉ lệ có việc làm',
      value: `${stats.employmentRate}%`,
      icon: <UserOutlined />,
      accent: '#faad14',
      trend: 1.8,
    },
    {
      label: 'Đúng ngành nghề',
      value: `${stats.relevantJobRate}%`,
      icon: <BarChartOutlined />,
      accent: '#722ed1',
      sub: `TB lương: ${stats.avgSalary}`,
    },
  ];

  const kpiRings = [
    { label: 'Tỉ lệ nộp', value: stats.submissionRate, color: '#1677ff', desc: `${stats.submitted}/${stats.totalGraduates}` },
    { label: 'Đã duyệt', value: Math.round((stats.approved / stats.totalGraduates) * 100), color: '#52c41a', desc: `${stats.approved} sinh viên` },
    { label: 'Có việc làm', value: stats.employmentRate, color: '#faad14', desc: `${stats.employed} sinh viên` },
    { label: 'Đúng ngành', value: stats.relevantJobRate, color: '#722ed1' },
  ];

  const majorColumns: ColumnsType<MajorSummaryRow> = [
    { title: 'Mã ngành', dataIndex: 'majorCode', width: 100 },
    { title: 'Tên ngành', dataIndex: 'majorName' },
    { title: 'Tổng SV', dataIndex: 'total', align: 'right' },
    { title: 'Đã nộp', dataIndex: 'submitted', align: 'right' },
    { title: 'Đã duyệt', dataIndex: 'approved', align: 'right' },
    {
      title: 'Tỉ lệ nộp',
      dataIndex: 'rate',
      render: (v, row) => <MiniBar value={row.submitted} max={row.total} color="#1677ff" />,
      width: 160,
    },
  ];

  const graduateColumns: ColumnsType<GraduateRow> = [
    { title: 'MSSV', dataIndex: 'studentCode', width: 100 },
    { title: 'Họ tên', dataIndex: 'fullName' },
    { title: 'Ngành', dataIndex: 'majorName' },
    { title: 'Khóa', dataIndex: 'cohort', width: 80 },
    { title: 'Trạng thái', dataIndex: 'status', render: (v) => <SubmissionPill status={v} /> },
    { title: 'Ngày nộp', dataIndex: 'submittedAt', render: (v) => v ?? '—' },
  ];

  const responseColumns: ColumnsType<ResponseRow> = [
    { title: 'MSSV', dataIndex: 'studentCode', width: 100 },
    { title: 'Họ tên', dataIndex: 'fullName' },
    { title: 'Tình trạng việc làm', dataIndex: 'employmentStatus' },
    { title: 'Chức danh', dataIndex: 'jobTitle', render: (v) => v ?? '—' },
    { title: 'Công ty', dataIndex: 'company', render: (v) => v ?? '—' },
    { title: 'Mức lương', dataIndex: 'salary', render: (v) => v ?? '—' },
    { title: 'Đúng ngành', dataIndex: 'relevance', render: (v) => v ? <Tag color="green">{v}</Tag> : <Tag>Không xác định</Tag> },
  ];

  const facultyColumns: ColumnsType<FacultySubmissionRow> = [
    { title: 'Mã khoa', dataIndex: 'facultyCode', width: 100 },
    { title: 'Tên khoa', dataIndex: 'facultyName' },
    { title: 'Tổng SV', dataIndex: 'total', align: 'right' },
    { title: 'Đã nộp', dataIndex: 'submitted', align: 'right' },
    { title: 'Đã duyệt', dataIndex: 'approved', align: 'right' },
    {
      title: 'Tiến độ',
      render: (_, row) => <MiniBar value={row.submitted} max={row.total} color="#52c41a" />,
      width: 160,
    },
  ];

  const tableProps = {
    size: 'small' as const,
    pagination: { pageSize: 10 },
    style: { background: '#0d0d1a' },
  };

  return (
    <div style={{ background: '#0d0d1a', minHeight: '100vh', padding: '24px', color: '#fff' }}>
      {contextHolder}

      {/* Header */}
      <Row justify="space-between" align="middle" style={{ marginBottom: 20 }}>
        <Col>
          <Title level={3} style={{ color: '#fff', margin: 0 }}>
            <PieChartOutlined style={{ marginRight: 8, color: '#1677ff' }} />
            Báo cáo khảo sát việc làm
          </Title>
          <Text style={{ color: '#666' }}>
            Phạm vi: <Tag color="blue">{scopeLabel}</Tag>
            <Tag color="purple">
              {currentUser.role.replace(/_/g, ' ')}
            </Tag>
          </Text>
        </Col>
        <Col>
          <Row gutter={8}>
            {/* Demo: switch user role */}
            <Col>
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
            </Col>
            <Col>
              <Select
                value={filters.surveyId}
                onChange={(v) => setFilters((f) => ({ ...f, surveyId: v }))}
                style={{ width: 200 }}
                size="small"
              >
                {SURVEY_OPTIONS.map((o) => (
                  <Option key={o.value} value={o.value}>{o.label}</Option>
                ))}
              </Select>
            </Col>
            <Col>
              <Button
                icon={<DownloadOutlined />}
                size="small"
                onClick={() => messageApi.info('Đang xuất báo cáo...')}
              >
                Xuất Excel
              </Button>
            </Col>
          </Row>
        </Col>
      </Row>

      {/* KPI Cards */}
      <StatCardGrid cards={statCards} />

      {/* KPI Rings */}
      <KpiRingGroup rings={kpiRings} />

      {/* Tabs */}
      <Spin spinning={loading}>
        <Tabs
          activeKey={activeView}
          onChange={setActiveView}
          style={{ color: '#fff' }}
          items={[
            {
              key: 'overview',
              label: 'Tổng quan theo ngành',
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
              label: 'Danh sách sinh viên',
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
              label: 'Phản hồi khảo sát',
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
              key: 'submission-progress',
              label: 'Tiến độ nộp theo khoa',
              children: currentUser.scope === 'school' ? (
                <Table
                  {...tableProps}
                  columns={facultyColumns}
                  dataSource={facultyRows}
                  rowKey="key"
                />
              ) : (
                <Empty description="Chỉ hiển thị với quyền Toàn trường" />
              ),
            },
          ]}
        />
      </Spin>
    </div>
  );
}
