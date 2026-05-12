import React, { useState } from 'react';
import { Select, Skeleton, Spin, Table, Tag, Tabs, Empty, Space, Button } from 'antd';
import {
  DownloadOutlined,
  FileTextOutlined,
  SendOutlined,
  TeamOutlined,
  TrophyOutlined,
  PieChartOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  ExclamationCircleOutlined,
  AuditOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import AdminLayout from '../../../components/layout/AdminLayout';


import type {
  FilterState,
  GraduateRow,
  MajorSummaryRow,
  FacultySubmissionRow,
  ResponseRow,
  SubmissionStatus,
} from './types';
import { useReportData } from './useReportData';
import { SubmissionPill, MiniBar } from './components/SubmissionPill';
import './styles.css';

const { Option } = Select;

const SUBMISSION_KPI_META = [
  { icon: <CheckCircleOutlined />, label: 'Tổng số khoa', valueKey: 'totalFaculty', color: '#1677ff', bg: '#e6f4ff' },
  { icon: <SendOutlined />, label: 'Đã nộp', valueKey: 'submitted', color: '#09d488', bg: '#ccfbf1' },
  { icon: <ExclamationCircleOutlined />, label: 'Cần bổ sung', valueKey: 'returned', color: '#faad14', bg: '#feefe4' },
  { icon: <AuditOutlined />, label: 'Đã duyệt', valueKey: 'approved', color: '#52c41a', bg: '#f6ffed' },
];

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

  const isSchoolView = currentUser.scope === 'school';
  const isFacultyLikeView = currentUser.scope === 'faculty' || currentUser.scope === 'major';

  const [submissionStatus, setSubmissionStatus] = useState<SubmissionStatus>('draft');

  const handleSubmitToSchool = () => {
    setSubmissionStatus('submitted');
    Message.success('Báo cáo đã được nộp lên trường');
  };

  const handleWithdrawSubmission = () => {
    setSubmissionStatus('draft');
    Message.warning('Báo cáo đã được thu hồi');
  };

  const updateFacultyStatus = (key: string, status: SubmissionStatus) => {
    Message.success(`Đã cập nhật trạng thái thành: ${SUBMISSION_STATUS_LABEL[status]}`);
  };

  const submissionStats = {
    totalFaculty: facultyRows.length,
    submitted: facultyRows.filter((r) => r.status === 'submitted').length,
    returned: facultyRows.filter((r) => r.status === 'returned').length,
    approved: facultyRows.filter((r) => r.status === 'approved').length,
  };

  const scopeLabel =
    currentUser.scope === 'school'
      ? 'Toàn trường'
      : currentUser.scope === 'faculty'
      ? currentUser.facultyName
      : currentUser.majorName;

  const title = isSchoolView ? 'Tổng hợp báo cáo cấp trường' : 'Báo cáo việc làm đơn vị';
  const subtitle = isSchoolView
    ? 'Theo dõi các khoa nộp báo cáo lên trường'
    : 'Rà soát dữ liệu và nộp báo cáo lên trường';

  const KPI_SUBMISSION = isSchoolView
    ? SUBMISSION_KPI_META.map((m) => ({
        icon: m.icon,
        color: m.color,
        bg: m.bg,
        label: m.label,
        value: String(submissionStats[m.valueKey as keyof typeof submissionStats]),
        sub:
          m.valueKey === 'totalFaculty'
            ? 'Khoa/ngành trong trường'
            : m.valueKey === 'submitted'
            ? 'Khoa đã nộp báo cáo'
            : m.valueKey === 'returned'
            ? 'Khoa cần bổ sung dữ liệu'
            : 'Khoa đã được trường duyệt',
      }))
    : [
        { icon: <TeamOutlined />, color: '#1677ff', bg: '#e6f4ff', label: 'Tổng sinh viên tốt nghiệp', value: stats.totalGraduates.toLocaleString('vi-VN'), sub: 'Khóa hiện tại' },
        { icon: <SendOutlined />, color: '#09d488', bg: '#ccfbf1', label: 'Tỷ lệ nộp khảo sát', value: `${stats.submissionRate}%`, sub: `${stats.submitted} / ${stats.totalGraduates} sinh viên` },
        { icon: <TrophyOutlined />, color: '#d9706e', bg: '#fff3cf', label: 'Tỷ lệ có việc làm', value: `${stats.employmentRate}%`, sub: `${stats.employed} sinh viên` },
        { icon: <PieChartOutlined />, color: '#7c3aed', bg: '#ede9fe', label: 'Đúng ngành nghề', value: `${stats.relevantJobRate}%`, sub: `TB lương: ${stats.avgSalary}` },
      ];

  const SUBMISSION_STATUS_LABEL: Record<SubmissionStatus, string> = {
    draft: 'Chưa nộp',
    submitted: 'Đã nộp',
    returned: 'Trả về',
    approved: 'Đã duyệt',
  };

  const DEFAULT_DEADLINE = `2026-${String(currentUser.scope === 'faculty' ? '02' : '01').padStart(2, '0')}-15`;

  const demoSubmissionStatus: Record<string, SubmissionStatus> = {
    '1': 'submitted',
    '2': 'returned',
    '3': 'draft',
    '4': 'approved',
  };

  const [facultyStatusMap, setFacultyStatusMap] = useState<Record<string, SubmissionStatus>>({});
  const getFacultyStatus = (row: FacultySubmissionRow): SubmissionStatus =>
    facultyStatusMap[row.key] ?? demoSubmissionStatus[row.key] ?? row.status ?? 'draft';

  const handleUpdateStatus = (key: string, status: SubmissionStatus) => {
    setFacultyStatusMap((prev) => ({ ...prev, [key]: status }));
    Message.success(`Đã cập nhật: ${SUBMISSION_STATUS_LABEL[status]}`);
  };

  const mau01Columns: ColumnsType<MajorSummaryRow> = [
    { title: 'STT', render: (_: any, __: any, i: number) => i + 1, width: 48, align: 'center' },
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
    { title: 'Tỷ lệ có VL / PH', dataIndex: 'submitted', width: 80, align: 'right', render: (_: any, row: MajorSummaryRow) => row.submitted ? `${Math.round((row.approved / row.submitted) * 100)}%` : '-' },
    { title: 'Tỷ lệ có VL / TN', dataIndex: 'total', width: 80, align: 'right', render: (_: any, row: MajorSummaryRow) => row.total ? `${Math.round((row.approved / row.total) * 100)}%` : '-' },
  ];

  const mau02Columns: ColumnsType<GraduateRow> = [
    { title: 'STT', render: (_: any, __: any, i: number) => i + 1, width: 48, align: 'center' },
    { title: 'Mã SV', dataIndex: 'studentCode', width: 100 },
    { title: 'Họ và tên', dataIndex: 'fullName', width: 150 },
    { title: 'Nữ', dataIndex: 'gender', width: 50, align: 'center', render: (v: string) => v === 'female' ? 'X' : '' },
    { title: 'Mã ngành', dataIndex: 'majorCode', width: 90 },
    { title: 'Số QP TN', dataIndex: 'certification', width: 100 },
    { title: 'Ngày ký QP', dataIndex: 'certDate', width: 100 },
    { title: 'Số điện thoại', dataIndex: 'phone', width: 110 },
    { title: 'Email', dataIndex: 'email', width: 160 },
    { title: 'Hình thức KS', dataIndex: 'surveyMethod', width: 90, render: () => 'Online' },
    {
      title: 'Có phản hồi', dataIndex: 'status', width: 80, align: 'center', render: (v: string) => v === 'submitted' || v === 'approved' ? 'X' : '',
    },
    { title: 'Ghi chú', dataIndex: 'note', width: 120, render: (v: string) => v ?? '' },
    { title: 'Ngành', dataIndex: 'majorName', width: 140 },
    { title: 'Khoa', dataIndex: 'cohort', width: 80 },
  ];

  const mau03Columns: ColumnsType<ResponseRow> = [
    { title: 'STT', render: (_: any, __: any, i: number) => i + 1, width: 48, align: 'center' },
    { title: 'Mã SV', dataIndex: 'studentCode', width: 90 },
    { title: 'Họ và tên', dataIndex: 'fullName', width: 150 },
    {
      title: 'Tình hình việc làm',
      children: [
        {
          title: 'Có VL',
          children: [
            { title: 'Đúng ngành', dataIndex: 'dungNganh', width: 60, align: 'center', render: (v: boolean) => v ? 'X' : '' },
            { title: 'Liên quan', dataIndex: 'lienQuan', width: 65, align: 'center', render: (v: boolean) => v ? 'X' : '' },
            { title: 'Không LQ', dataIndex: 'khongLienQuan', width: 65, align: 'center', render: (v: boolean) => v ? 'X' : '' },
          ],
        },
        { title: 'TT học', dataIndex: 'tiepTucHoc', width: 55, align: 'center', render: (v: boolean) => v ? 'X' : '' },
        { title: 'Chưa có VL', dataIndex: 'chuaCoVl', width: 70, align: 'center', render: (v: boolean) => v ? 'X' : '' },
      ],
    },
    {
      title: 'Khu vực làm việc',
      children: [
        { title: 'NN', dataIndex: 'kvNhaNuoc', width: 50, align: 'center', render: (v: boolean) => v ? 'X' : '' },
        { title: 'TN', dataIndex: 'kvTuNhan', width: 50, align: 'center', render: (v: boolean) => v ? 'X' : '' },
        { title: 'TT VL', dataIndex: 'kvTuTao', width: 55, align: 'center', render: (v: boolean) => v ? 'X' : '' },
      ],
    },
    { title: 'Nơi làm việc (Tỉnh/TP)', dataIndex: 'workLocation', width: 130, render: (v: string) => v ?? '' },
    { title: 'Mức lương KD (triệu)', dataIndex: 'salary', width: 100, align: 'right', render: (v: string) => v ?? '-' },
    {
      title: 'Đúng ngành', dataIndex: 'relevance', width: 90, render: (v: string) => v ? <Tag color='green'>{v}</Tag> : <Tag color='default'>Chưa xác định</Tag>,
    },
  ];

  const facultySubmissionColumns: ColumnsType<FacultySubmissionRow> = [
    { title: 'STT', render: (_: any, __: any, i: number) => i + 1, width: 48, align: 'center' },
    { title: 'Mã khoa', dataIndex: 'facultyCode', width: 90 },
    { title: 'Tên khoa', dataIndex: 'facultyName' },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      width: 130,
      render: (_: any, row: FacultySubmissionRow) => (
        <SubmissionPill status={getFacultyStatus(row)} />
      ),
    },
    { title: 'Người nộp', dataIndex: 'submittedBy', width: 120, render: (v: string) => v ?? 'Chưa nộp' },
    { title: 'Thời gian nộp', dataIndex: 'submittedAt', width: 130, render: (v: string) => v ?? 'Chưa nộp' },
    { title: 'Hạn nộp', dataIndex: 'deadline', width: 100, render: (v: string) => v ?? DEFAULT_DEADLINE },
    { title: 'Phản hồi', dataIndex: 'feedback', width: 140, render: (v: string) => v ?? 'Chưa có phản hồi' },
    {
      title: 'Thao tác',
      key: 'actions',
      width: 240,
      render: (_: any, row: FacultySubmissionRow) => {
        const status = getFacultyStatus(row);
        return (
          <Space size='small'>
            <Button type='link' size='small'>Xem</Button>
            {status === 'submitted' && (
              <>
                <Button size='small' type='primary' onClick={() => handleUpdateStatus(row.key, 'approved')}>Duyệt</Button>
                <Button size='small' danger onClick={() => handleUpdateStatus(row.key, 'returned')}>Trả bổ sung</Button>
              </>
            )}
            {status === 'returned' && (
              <Button size='small' onClick={() => handleUpdateStatus(row.key, 'submitted')}>Đánh dấu đã nộp lại</Button>
            )}
            {status === 'draft' && <span style={{ color: '#999' }}>Chờ nộp</span>}
          </Space>
        );
      },
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

  const selectedSurvey =
    SURVEY_OPTIONS.find((o) => o.value === filters.surveyId)?.label ?? filters.surveyId;

  return (
    <AdminLayout>
      <div className='rp-page'>
        {/* ====== PAGE HEADER ====== */}
        <div className='rp-doc-header'>
          <div className='rp-doc-header__org'>
            <div className='rp-doc-header__ministry'>HỌC VIỆN NÔNG NGHIỆP VIỆT NAM</div>
            <div className='rp-doc-header__dept'>BAN QUẢN LÝ ĐÀO TẠO</div>
          </div>
          <div className='rp-doc-header__center'>
            <div className='rp-doc-header__title'>{title}</div>
            <div className='rp-doc-header__subtitle'>{subtitle}</div>
            <div className='rp-doc-header__survey-name'>{selectedSurveyLabel}</div>
          </div>
          <div className='rp-doc-header__actions'>
            <div className='rp-filter-item'>
              <label className='rp-filter-label'>Vai trò (demo)</label>
              <Select value={userIndex} onChange={setUserIndex} style={{ width: 180 }} size='small'>
                <Option value={0}>Super Admin</Option>
                <Option value={1}>Faculty Officer</Option>
                <Option value={2}>Major Officer</Option>
              </Select>
            </div>
            <div className='rp-filter-item' style={{ marginTop: 8 }}>
              <label className='rp-filter-label'>Đợt khảo sát</label>
              <Select
                value={filters.surveyId}
                onChange={(v) => setFilters((f) => ({ ...f, surveyId: v }))}
                style={{ width: 220 }}
                size='small'
              >
                {SURVEY_OPTIONS.map((o) => (
                  <Option key={o.value} value={o.value}>{o.label}</Option>
                ))}
              </Select>
            </div>
          </div>          <div className='rp-scope-badge' style={{ marginTop: 10 }}>
            Phạm vi: <strong>{scopeLabel}</strong>
          </div>

          {/* ====== WORKFLOW BAR (khoa/ng्ảnh only) ====== */}
          {isFacultyLikeView && (
            <div style={{ marginTop: 12, display: 'flex', alignItems: 'center', gap: 10 }}>
              <SubmissionPill status={submissionStatus} />
              {submissionStatus === 'draft' && (
                <Button size='small' type='primary' icon={<SendOutlined />} onClick={handleSubmitToSchool}>
                  Nộp báo cáo lên trường
                </Button>
              )}
              {submissionStatus === 'submitted' && (
                <Button size='small' danger onClick={handleWithdrawSubmission}>Thu hồi</Button>
              )}
              {submissionStatus === 'returned' && (
                <Button size='small' type='primary' icon={<SendOutlined />} onClick={handleSubmitToSchool}>
                  Nộp lại lên trường
                </Button>
              )}
              {submissionStatus === 'approved' && (
                <span style={{ color: '#52c41a', fontSize: 13 }}>Trường đã duyệt báo cáo</span>
              )}
            </div>
          )}
        </div>

        {/* ====== KPI CARDS ====== */}
        <div className='rp-kpi-grid'>
          {KPI_SUBMISSION.map((kpi, i) => (
            <div className='rp-kpi-card' key={i}>
              <div className='rp-kpi-icon' style={{ background: kpi.bg, color: kpi.color }}>
                {kpi.icon}
              </div>
              <div className='rp-kpi-body'>
                <div className='rp-kpi-label'>{kpi.label}</div>
                <div className='rp-kpi-value' style={{ color: kpi.color }}>{kpi.value}</div>
                <div className='rp-kpi-sub'>{kpi.sub}</div>
              </div>
            </div>
          ))}
        </div>

        {/* ====== TABLES ====== */}
        <Spin spinning={loading}>
          <div className='rp-table-card'>
            <Tabs defaultActiveKey='mau01' className='rp-tabs' items={[
              {
                key: 'mau01',
                label: (<span><FileTextOutlined /> Mẫu số 01 - Tổng hợp theo ngành</span>),
                children: (
                  <>
                    <div className='rp-table-title'>MẪU SỐ 01: BẢNG TỔNG HỢP TÌNH HÌNH VIỆC LÀM SINH VIÊN TỐT NGHIỆP THEO NGÀNH</div>
                    <Table
                      {...tableProps}
                      columns={mau01Columns as any}
                      dataSource={majorRows}
                      rowKey='key'
                      summary={(rows) => {
                        const tot = rows.reduce((a, r) => a + (r.total || 0), 0);
                        const sub = rows.reduce((a, r) => a + (r.submitted || 0), 0);
                        const app = rows.reduce((a, r) => a + (r.approved || 0), 0);
                        return (
                          <Table.Summary.Row className='rp-summary-row'>
                            <Table.Summary.Cell index={0} colSpan={3} align='center'>
                              <strong>TỔNG HỢP</strong>
                            </Table.Summary.Cell>
                            <Table.Summary.Cell index={3} align='right'><strong>{tot}</strong></Table.Summary.Cell>
                            <Table.Summary.Cell index={4} align='right'>-</Table.Summary.Cell>
                            <Table.Summary.Cell index={5} align='right'><strong>{sub}</strong></Table.Summary.Cell>
                            <Table.Summary.Cell index={6} align='right'>-</Table.Summary.Cell>
                            <Table.Summary.Cell index={7} align='right'><strong>{app}</strong></Table.Summary.Cell>
                            <Table.Summary.Cell index={8} align='right'>-</Table.Summary.Cell>
                            <Table.Summary.Cell index={9} align='right'>
                              <strong>{sub ? `${Math.round((app / sub) * 100)}%` : '-'}</strong>
                            </Table.Summary.Cell>
                            <Table.Summary.Cell index={10} align='right'>
                              <strong>{tot ? `${Math.round((app / tot) * 100)}%` : '-'}</strong>
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
                label: (<span><TeamOutlined /> Mẫu số 02 - Danh sách sinh viên</span>),
                children: (
                  <>
                    <div className='rp-table-title'>MẪU SỐ 02: DANH SÁCH SINH VIÊN TỐT NGHIỆP</div>
                    <Table
                      {...tableProps}
                      columns={mau02Columns}
                      dataSource={graduateRows}
                      rowKey='key'
                    />
                  </>
                ),
              },
              {
                key: 'mau03',
                label: (<span><PieChartOutlined /> Mẫu số 03 - Phản hồi khảo sát</span>),
                children: (
                  <>
                    <div className='rp-table-title'>MẪU SỐ 03: DANH SÁCH SINH VIÊN CÓ PHẢN HỒI KHẢO SÁT VIỆC LÀM</div>
                    <Table
                      {...tableProps}
                      columns={mau03Columns as any}
                      dataSource={responseRows}
                      rowKey='key'
                    />
                  </>
                ),
              },
              {
                key: 'progress',
                label: (<span><SendOutlined /> Tiến độ nộp khoa</span>),
                children: (
                  <>
                    <div className='rp-table-title'>TIẾN ĐỘ NỘP BÁO CÁO THEO KHOA</div>
                    <Table
                      {...tableProps}
                      columns={facultySubmissionColumns}
                      dataSource={facultyRows.map((row) => ({
                        ...row,
                        deadline: row.deadline ?? DEFAULT_DEADLINE,
                        submittedAt: row.submittedAt,
                        submittedBy: row.submittedBy ?? 'Chưa nộp',
                        feedback: row.feedback ?? 'Chưa có phản hồi',
                        status: getFacultyStatus(row),
                      }))}
                      rowKey='key'
                      locale={{ emptyText: <Empty description='Chưa có dữ liệu tiến độ' /> }}
                      summary={(rows) => {
                        const tot = rows.length;
                        const sub = rows.filter((r) => getFacultyStatus(r) === 'submitted').length;
                        const app = rows.filter((r) => getFacultyStatus(r) === 'approved').length;
                        return (
                          <Table.Summary.Row className='rp-summary-row'>
                            <Table.Summary.Cell index={0} colSpan={3} align='center'>
                              <strong>TỔNG HỢP TIẾN ĐỘ</strong>
                            </Table.Summary.Cell>
                            <Table.Summary.Cell index={3} align='right'>
                              <strong>{tot} khoa</strong>
                            </Table.Summary.Cell>
                            <Table.Summary.Cell index={4} align='right'>-</Table.Summary.Cell>
                            <Table.Summary.Cell index={5} align='right'>-</Table.Summary.Cell>
                            <Table.Summary.Cell index={6} align='right'>-</Table.Summary.Cell>
                            <Table.Summary.Cell index={7} align='right'>-</Table.Summary.Cell>
                            <Table.Summary.Cell index={8} align='right'>-</Table.Summary.Cell>
                          </Table.Summary.Row>
                        );
                      }}
                    />
                  </>
                ),
              },
            ]} />
          </div>
        </Spin>
      </div>
    </AdminLayout>
  );
}
