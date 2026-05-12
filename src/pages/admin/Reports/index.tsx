import React, { useState } from 'react';
import { Select, Spin, Table, Tag, Tabs, Empty, Space, Button } from 'antd';
import {
  FileTextOutlined,
  SendOutlined,
  TeamOutlined,
  TrophyOutlined,
  PieChartOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  AuditOutlined,
  DownloadOutlined,
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
} from '../../../feature/reports/types';
import { useReportData } from '../../../feature/reports/hooks/useReportData';
import { SubmissionPill } from './components/SubmissionPill';
import './styles.css';

const { Option } = Select;

const SUBMISSION_KPI_META = [
  {
    icon: <CheckCircleOutlined />,
    label: 'Tổng số khoa/ngành',
    valueKey: 'totalFaculty',
    color: '#1677ff',
    bg: '#e6f4ff',
  },
  {
    icon: <SendOutlined />,
    label: 'Đã nộp báo cáo',
    valueKey: 'submitted',
    color: '#09d488',
    bg: '#ccfbf1',
  },
  {
    icon: <ExclamationCircleOutlined />,
    label: 'Cần bổ sung',
    valueKey: 'returned',
    color: '#faad14',
    bg: '#feefe4',
  },
  {
    icon: <AuditOutlined />,
    label: 'Đã được duyệt',
    valueKey: 'approved',
    color: '#52c41a',
    bg: '#f6ffed',
  },
];

const SURVEY_OPTIONS = [
  { value: '2026-1', label: 'Đợt khảo sát 2026 - Lần 1' },
  { value: '2025-2', label: 'Đợt khảo sát 2025 - Lần 2' },
  { value: '2025-1', label: 'Đợt khảo sát 2025 - Lần 1' },
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
  const handleSubmitToSchool = () => setSubmissionStatus('submitted');
  const handleWithdrawSubmission = () => setSubmissionStatus('draft');

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

  const title = isSchoolView
    ? 'Tổng hợp báo cáo cấp trường'
    : isFacultyLikeView
    ? 'Báo cáo tình hình việc làm sinh viên'
    : 'Báo cáo';

  const subtitle = isSchoolView
    ? 'Theo dõi các khoa/ngành nộp báo cáo lên trường'
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
            ? 'Khoa cần bổ sung'
            : 'Khoa đã được duyệt',
      }))
    : [
        {
          icon: <TeamOutlined />,
          color: '#1677ff',
          bg: '#e6f4ff',
          label: 'Tổng số sinh viên tốt nghiệp',
          value: stats.totalGraduates.toLocaleString('vi-VN'),
          sub: 'Khóa hiện tại',
        },
        {
          icon: <SendOutlined />,
          color: '#09d488',
          bg: '#ccfbf1',
          label: 'Tỷ lệ phản hồi',
          value: `${stats.submissionRate}%`,
          sub: `${stats.submitted}/${stats.totalGraduates} sinh viên`,
        },
        {
          icon: <TrophyOutlined />,
          color: '#d9706e',
          bg: '#fff3cf',
          label: 'Tỷ lệ có việc làm',
          value: `${stats.employmentRate}%`,
          sub: `${stats.employed} sinh viên`,
        },
        {
          icon: <PieChartOutlined />,
          color: '#7c3aed',
          bg: '#ede9fe',
          label: 'Làm đúng/ngành liên quan',
          value: `${stats.relevantJobRate}%`,
          sub: `TB lương: ${stats.avgSalary}`,
        },
      ];

  const DEFAULT_DEADLINE = '2026-02-15';
  const demoSubmissionStatus: Record<string, SubmissionStatus> = {
    '1': 'submitted',
    '2': 'returned',
    '3': 'draft',
    '4': 'approved',
  };
  const [facultyStatusMap, setFacultyStatusMap] = useState<Record<string, SubmissionStatus>>({});
  const getFacultyStatus = (row: FacultySubmissionRow): SubmissionStatus =>
    facultyStatusMap[row.key] ?? demoSubmissionStatus[row.key] ?? row.status ?? 'draft';
  const handleUpdateStatus = (key: string, status: SubmissionStatus) =>
    setFacultyStatusMap((prev) => ({ ...prev, [key]: status }));

  // ====== LABEL ĐỘNG CHO TRƯỜNG / KHOA ======
  const orgLine1 = 'HỌC VIỆN NÔNG NGHIỆP VIỆT NAM';
  const orgLine2 = !isSchoolView
    ? (currentUser.facultyName ?? currentUser.majorName ?? '').toUpperCase()
    : '';

  const signLabel = isSchoolView ? 'GIÁM ĐỐC' : 'TRƯỞNG KHOA';

  // title form cho từng tab
  const mau01Title =
    'BÁO CÁO TÌNH HÌNH VIỆC LÀM CỦA SINH VIÊN TỐT NGHIỆP NĂM 2026';

  const mau02Title =
    'DANH SÁCH SINH VIÊN TỐT NGHIỆP NĂM 2026';

  const mau03Title =
    'DANH SÁCH SINH VIÊN TỐT NGHIỆP NĂM 2026 PHẢN HỒI VỀ TÌNH HÌNH VIỆC LÀM';

  // ── Download báo cáo tổng hợp ───────────────────────────────────────────
  const handleDownload = (mau: 'mau01' | 'mau02' | 'mau03') => {
    // TODO: gọi API thực tế, tạm thời log
    console.log('Download tổng hợp', mau, filters.surveyId, currentUser.scope);
  };

  // ── Mẫu 01 (tổng hợp ngành) ─────────────────────────────────────────────
  const mau01Columns: ColumnsType<MajorSummaryRow> = [
    { title: 'STT', render: (_: any, __: any, i: number) => i + 1, width: 42, align: 'center', fixed: 'left' },
    { title: 'Mã ngành', dataIndex: 'majorCode', width: 90 },
    { title: 'Tên ngành đào tạo', dataIndex: 'majorName', width: 200 },
    {
      title: 'SV tốt nghiệp',
      children: [
        { title: 'Tổng số', dataIndex: 'total', width: 65, align: 'right' },
        { title: 'Nữ', dataIndex: 'totalNu', width: 50, align: 'right' },
      ],
    },
    {
      title: 'SV phản hồi',
      children: [
        { title: 'Tổng số', dataIndex: 'submitted', width: 65, align: 'right' },
        { title: 'Nữ', dataIndex: 'submittedNu', width: 50, align: 'right' },
      ],
    },
    { title: 'Có việc làm', dataIndex: 'coViecLam', width: 80, align: 'right' },
    { title: 'Tiếp tục học', dataIndex: 'tiepTucHoc', width: 90, align: 'right' },
    { title: 'Chưa có việc làm', dataIndex: 'chuaCoViecLam', width: 110, align: 'right' },
    {
      title: 'Tỷ lệ VL / Phản hồi',
      dataIndex: 'submitted',
      width: 100,
      align: 'right',
      render: (_: any, row: MajorSummaryRow) =>
        row.submitted ? `${Math.round((row.approved / row.submitted) * 100)}%` : '-',
    },
    {
      title: 'Tỷ lệ VL / Tốt nghiệp',
      dataIndex: 'total',
      width: 100,
      align: 'right',
      render: (_: any, row: MajorSummaryRow) =>
        row.total ? `${Math.round((row.approved / row.total) * 100)}%` : '-',
    },
    { title: 'Nhà nước', dataIndex: 'kvNhaNuoc', width: 80, align: 'right' },
    { title: 'Tư nhân', dataIndex: 'kvTuNhan', width: 70, align: 'right' },
    { title: 'Tự tạo VL', dataIndex: 'kvTuTao', width: 80, align: 'right' },
    { title: 'Có YNN', dataIndex: 'kvYNuocNgoai', width: 85, align: 'right' },
    { title: 'Nơi làm việc (Tỉnh/TP)', dataIndex: 'workLocation', width: 130 },
  ];

  // ── Mẫu 02 (DS tốt nghiệp) ──────────────────────────────────────────────
  const mau02Columns: ColumnsType<GraduateRow> = [
    { title: 'STT', render: (_: any, __: any, i: number) => i + 1, width: 42, align: 'center', fixed: 'left' },
    { title: 'Mã SV', dataIndex: 'studentCode', width: 90 },
    { title: 'Họ và tên', dataIndex: 'fullName', width: 160 },
    { title: 'Nữ', dataIndex: 'gender', width: 40, align: 'center', render: (v: string) => (v === 'female' ? 'X' : '') },
    { title: 'Số QP TN', dataIndex: 'certification', width: 90 },
    { title: 'Số CCCD', dataIndex: 'cccd', width: 120 },
    { title: 'Mã ngành', dataIndex: 'majorCode', width: 90 },
    { title: 'Quyết định TN', dataIndex: 'decision', width: 95 },
    { title: 'Ngày ký QP', dataIndex: 'certDate', width: 90 },
    { title: 'Số điện thoại', dataIndex: 'phone', width: 110 },
    { title: 'Email', dataIndex: 'email', width: 170 },
    { title: 'Hình thức khảo sát', dataIndex: 'surveyMethod', width: 110, render: () => 'Online' },
    {
      title: 'Có phản hồi',
      dataIndex: 'status',
      width: 90,
      align: 'center',
      render: (v: string) =>
        v === 'submitted' || v === 'approved' ? <Tag color="green">X</Tag> : '',
    },
    { title: 'Ghi chú', dataIndex: 'note', width: 120 },
    { title: 'Ngành', dataIndex: 'majorName', width: 140 },
    { title: 'Khoa', dataIndex: 'cohort', width: 100 },
  ];

  // ── Mẫu 03 (DS phản hồi) ────────────────────────────────────────────────
  const mau03Columns: ColumnsType<ResponseRow> = [
    { title: 'STT', render: (_: any, __: any, i: number) => i + 1, width: 42, align: 'center', fixed: 'left' },
    { title: 'Mã SV', dataIndex: 'studentCode', width: 80 },
    { title: 'Họ và tên', dataIndex: 'fullName', width: 150 },
    { title: 'Ngày sinh', dataIndex: 'dob', width: 90 },
    { title: 'Giới tính', dataIndex: 'gender', width: 70, render: (v: string) => (v === 'female' ? 'Nữ' : 'Nam') },
    { title: 'Số CCCD', dataIndex: 'cccd', width: 110 },
    { title: 'Mã ngành', dataIndex: 'majorCode', width: 80 },
    { title: 'Có VL - Đúng ngành', dataIndex: 'dungNganh', width: 110, align: 'center', render: (v: boolean) => (v ? 'X' : '') },
    { title: 'Có VL - Liên quan', dataIndex: 'lienQuan', width: 110, align: 'center', render: (v: boolean) => (v ? 'X' : '') },
    { title: 'Có VL - Không liên quan', dataIndex: 'khongLienQuan', width: 140, align: 'center', render: (v: boolean) => (v ? 'X' : '') },
    { title: 'Tiếp tục học', dataIndex: 'tiepTucHoc', width: 100, align: 'center', render: (v: boolean) => (v ? 'X' : '') },
    { title: 'Chưa có VL', dataIndex: 'chuaCoVl', width: 90, align: 'center', render: (v: boolean) => (v ? 'X' : '') },
    { title: 'Khu vực nhà nước', dataIndex: 'kvNhaNuoc', width: 120, align: 'center', render: (v: boolean) => (v ? 'X' : '') },
    { title: 'Khu vực tư nhân', dataIndex: 'kvTuNhan', width: 120, align: 'center', render: (v: boolean) => (v ? 'X' : '') },
    { title: 'Tự tạo việc làm', dataIndex: 'kvTuTao', width: 120, align: 'center', render: (v: boolean) => (v ? 'X' : '') },
    { title: 'Có yếu tố nước ngoài', dataIndex: 'kvYNuocNgoai', width: 150, align: 'center', render: (v: boolean) => (v ? 'X' : '') },
    { title: 'Nơi làm việc (Tỉnh/TP)', dataIndex: 'workLocation', width: 140 },
    { title: 'Dưới 3 tháng', dataIndex: 'thoiGianDuoi3Thang', width: 100, align: 'center', render: (v: boolean) => (v ? 'X' : '') },
    { title: 'Từ 3–6 tháng', dataIndex: 'thoiGian3Den6Thang', width: 110, align: 'center', render: (v: boolean) => (v ? 'X' : '') },
    { title: 'Từ 6–12 tháng', dataIndex: 'thoiGian6Den12Thang', width: 120, align: 'center', render: (v: boolean) => (v ? 'X' : '') },
    { title: 'Từ 12 tháng trở lên', dataIndex: 'thoiGian12ThangTroLen', width: 150, align: 'center', render: (v: boolean) => (v ? 'X' : '') },
    { title: 'Học được đủ kỹ năng', dataIndex: 'hocDu', width: 140, align: 'center', render: (v: boolean) => (v ? 'X' : '') },
    { title: 'Chỉ học được một phần', dataIndex: 'hocMotPhan', width: 160, align: 'center', render: (v: boolean) => (v ? 'X' : '') },
    { title: 'Không học được', dataIndex: 'khôngHocDuoc', width: 120, align: 'center', render: (v: boolean) => (v ? 'X' : '') },
    { title: 'Lương khởi điểm (triệu)', dataIndex: 'salary', width: 140, align: 'right' },
    { title: 'Thu nhập bình quân (triệu)', dataIndex: 'avgIncome', width: 160, align: 'right' },
    { title: 'Hình thức tìm việc', dataIndex: 'searchMethod', width: 130 },
    { title: 'Hình thức tuyển dụng', dataIndex: 'hiringMethod', width: 140 },
    { title: 'KN giao tiếp', dataIndex: 'knGiaoTiep', width: 110, align: 'center', render: (v: boolean) => (v ? 'X' : '') },
    { title: 'KN thuyết trình', dataIndex: 'knThuyetTrinh', width: 120, align: 'center', render: (v: boolean) => (v ? 'X' : '') },
    { title: 'KN làm việc nhóm', dataIndex: 'knLamViecNhom', width: 130, align: 'center', render: (v: boolean) => (v ? 'X' : '') },
    { title: 'KN viết báo cáo', dataIndex: 'knVietBaoCao', width: 130, align: 'center', render: (v: boolean) => (v ? 'X' : '') },
    { title: 'KN lãnh đạo', dataIndex: 'knLanhDao', width: 110, align: 'center', render: (v: boolean) => (v ? 'X' : '') },
    { title: 'KN tiếng Anh', dataIndex: 'knTiengAnh', width: 110, align: 'center', render: (v: boolean) => (v ? 'X' : '') },
    { title: 'KN tin học', dataIndex: 'knTinHoc', width: 110, align: 'center', render: (v: boolean) => (v ? 'X' : '') },
    { title: 'KN hội nhập quốc tế', dataIndex: 'knHoiNhap', width: 150, align: 'center', render: (v: boolean) => (v ? 'X' : '') },
    { title: 'Kỹ năng khác', dataIndex: 'knKhac', width: 110, align: 'center', render: (v: boolean) => (v ? 'X' : '') },
    { title: 'Khóa học sau tốt nghiệp', dataIndex: 'postGradCourse', width: 160 },
    { title: 'Đề xuất/giải pháp', dataIndex: 'giaiPhap', width: 160 },
  ];

  // ── Tiến độ nộp khoa ─────────────────────────────────────────────────────
  const facultySubmissionColumns: ColumnsType<FacultySubmissionRow> = [
    { title: 'STT', render: (_: any, __: any, i: number) => i + 1, width: 40, align: 'center' },
    { title: 'Mã khoa', dataIndex: 'facultyCode', width: 90 },
    { title: 'Tên khoa', dataIndex: 'facultyName' },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      width: 130,
      render: (_: any, row: FacultySubmissionRow) => <SubmissionPill status={getFacultyStatus(row)} />,
    },
    { title: 'Người nộp', dataIndex: 'submittedBy', width: 130, render: (v: string) => v ?? 'Chưa nộp' },
    { title: 'Thời gian nộp', dataIndex: 'submittedAt', width: 140, render: (v: string) => v ?? 'Chưa nộp' },
    { title: 'Hạn nộp', dataIndex: 'deadline', width: 120, render: (v: string) => v ?? DEFAULT_DEADLINE },
    { title: 'Phản hồi từ trường', dataIndex: 'feedback', width: 160, render: (v: string) => v ?? 'Chưa có' },
    {
      title: 'Thao tác',
      key: 'actions',
      width: 260,
      render: (_: any, row: FacultySubmissionRow) => {
        const status = getFacultyStatus(row);
        return (
          <Space size="small">
            <Button type="link" size="small">Xem</Button>
            {status === 'submitted' && (
              <>
                <Button size="small" type="primary" onClick={() => handleUpdateStatus(row.key, 'approved')}>Duyệt</Button>
                <Button size="small" danger onClick={() => handleUpdateStatus(row.key, 'returned')}>Trả bổ sung</Button>
              </>
            )}
            {status === 'returned' && (
              <Button size="small" onClick={() => handleUpdateStatus(row.key, 'submitted')}>Đã nộp lại</Button>
            )}
            {status === 'draft' && <span style={{ color: '#999' }}>Chờ nộp</span>}
          </Space>
        );
      },
    },
  ];

  const tableProps = {
    size: 'small' as const,
    pagination: false as const,
    bordered: true,
    className: 'rp-formal-table',
    scroll: { x: 'max-content' as const },
  };

  return (
    <AdminLayout>
      <div className="rp-page">
        {/* ── Page header ── */}
        <div className="rp-page-header">
          <div className="rp-page-header__left">
            <h1 className="rp-page-header__title">{title}</h1>
            <span className="rp-page-header__subtitle">{subtitle}</span>
            {isFacultyLikeView && (
              <div style={{ marginTop: 8, display: 'flex', alignItems: 'center', gap: 10 }}>
                <SubmissionPill status={submissionStatus} />
                {submissionStatus === 'draft' && (
                  <Button size="small" type="primary" icon={<SendOutlined />} onClick={handleSubmitToSchool}>
                    Nộp báo cáo lên trường
                  </Button>
                )}
                {submissionStatus === 'submitted' && (
                  <Button size="small" danger onClick={handleWithdrawSubmission}>Thu hồi</Button>
                )}
                {submissionStatus === 'returned' && (
                  <Button size="small" type="primary" icon={<SendOutlined />} onClick={handleSubmitToSchool}>
                    Nộp lại lên trường
                  </Button>
                )}
                {submissionStatus === 'approved' && (
                  <span style={{ color: '#52c41a', fontSize: 13 }}>Trường đã duyệt báo cáo</span>
                )}
              </div>
            )}
          </div>

          <div className="rp-page-header__right">
            <div className="rp-filter-row">
              <div className="rp-filter-item">
                <span className="rp-filter-label rp-filter-label--large">Vai trò</span>
                <Select value={userIndex} onChange={setUserIndex} style={{ width: 220 }} size="middle">
                  <Option value={0}>Quản trị hệ thống</Option>
                  <Option value={1}>Cán bộ khoa</Option>
                  <Option value={2}>Cán bộ ngành</Option>
                </Select>
              </div>
              <div className="rp-filter-item">
                <span className="rp-filter-label rp-filter-label--large">Đợt khảo sát</span>
                <Select
                  value={filters.surveyId}
                  onChange={(v) => setFilters((f) => ({ ...f, surveyId: v }))}
                  style={{ width: 260 }}
                  size="middle"
                >
                  {SURVEY_OPTIONS.map((o) => (
                    <Option key={o.value} value={o.value}>{o.label}</Option>
                  ))}
                </Select>
              </div>
              <div className="rp-filter-item">
                <span className="rp-filter-label rp-filter-label--large">Phạm vi</span>
                <div className="rp-scope-badge rp-scope-badge--large">
                  {scopeLabel}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── KPI cards ── */}
        <div className="rp-kpi-grid">
          {KPI_SUBMISSION.map((kpi, i) => (
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

        {/* ── Tables + toolbar tải báo cáo ── */}
        <Spin spinning={loading}>
          <div className="rp-table-card">
            <div className="rp-table-toolbar">
              <span className="rp-table-toolbar__label">Tải báo cáo tổng hợp:</span>
              <Space size="small">
                <Button
                  size="small"
                  icon={<DownloadOutlined />}
                  onClick={() => handleDownload('mau01')}
                >
                  Mẫu 1
                </Button>
                <Button
                  size="small"
                  icon={<DownloadOutlined />}
                  onClick={() => handleDownload('mau02')}
                >
                  Mẫu 2
                </Button>
                <Button
                  size="small"
                  icon={<DownloadOutlined />}
                  onClick={() => handleDownload('mau03')}
                >
                  Mẫu 3
                </Button>
              </Space>
            </div>

            <Tabs
              defaultActiveKey="mau01"
              className="rp-tabs"
              items={[
                {
                  key: 'mau01',
                  label: <span><FileTextOutlined /> Tổng hợp theo ngành</span>,
                  children: (
                    <div className="rp-sheet">
                      <div className="rp-sheet-header">
                        <div className="rp-sheet-header__org-block">
                          <div className="rp-sheet-header__org-line">
                            {orgLine1}
                          </div>
                          {orgLine2 && (
                            <div className="rp-sheet-header__org-line rp-sheet-header__org-line--bold">
                              {orgLine2}
                            </div>
                          )}
                        </div>
                        <div className="rp-sheet-header__title">
                          {mau01Title}
                        </div>
                      </div>
                      <div className="rp-sheet-note">
                        Ghi chú: Ghi theo mã ngành tuyển sinh theo Thông tư số 24/2017/TT-BGDĐT.
                        Khoa lấy thông tin mã ngành tại danh sách sinh viên tốt nghiệp.
                      </div>
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
                              <Table.Summary.Cell index={4} align="right">-</Table.Summary.Cell>
                              <Table.Summary.Cell index={5} align="right"><strong>{sub}</strong></Table.Summary.Cell>
                              <Table.Summary.Cell index={6} align="right">-</Table.Summary.Cell>
                              <Table.Summary.Cell index={7} align="right"><strong>{app}</strong></Table.Summary.Cell>
                              {Array.from({ length: 7 }).map((_, i) => (
                                <Table.Summary.Cell key={i} index={8 + i} align="right">-</Table.Summary.Cell>
                              ))}
                            </Table.Summary.Row>
                          );
                        }}
                      />
                      <div className="rp-sheet-footer">
                        <div />
                        <div className="rp-sheet-footer__sign-block">
                          <div className="rp-sheet-footer__date">
                            Hà Nội, ngày &nbsp;&nbsp; tháng &nbsp;&nbsp; năm 2026
                          </div>
                          <div className="rp-sheet-footer__sign">
                            {signLabel}
                          </div>
                        </div>
                      </div>
                    </div>
                  ),
                },
                {
                  key: 'mau02',
                  label: <span><TeamOutlined /> Danh sách sinh viên tốt nghiệp</span>,
                  children: (
                    <div className="rp-sheet">
                      <div className="rp-sheet-header">
                        <div className="rp-sheet-header__org-block">
                          <div className="rp-sheet-header__org-line">
                            {orgLine1}
                          </div>
                          {orgLine2 && (
                            <div className="rp-sheet-header__org-line rp-sheet-header__org-line--bold">
                              {orgLine2}
                            </div>
                          )}
                        </div>
                        <div className="rp-sheet-header__title">
                          {mau02Title}
                        </div>
                      </div>
                      <div className="rp-sheet-note">
                        Ghi chú: Do Ban QLT, CTCTCTSV cung cấp. Khoa bổ sung thông tin CCCD đối với
                        sinh viên chưa có CCCD. Trường hợp CCCD của sinh viên bị sai, Khoa chỉnh sửa
                        thông tin vào cột ghi chú.
                      </div>
                      <Table
                        {...tableProps}
                        columns={mau02Columns}
                        dataSource={graduateRows}
                        rowKey="key"
                      />
                      <div className="rp-sheet-footer">
                        <div />
                        <div className="rp-sheet-footer__sign-block">
                          <div className="rp-sheet-footer__date">
                            Hà Nội, ngày &nbsp;&nbsp; tháng &nbsp;&nbsp; năm 2026
                          </div>
                          <div className="rp-sheet-footer__sign">
                            {signLabel}
                          </div>
                        </div>
                      </div>
                    </div>
                  ),
                },
                {
                  key: 'mau03',
                  label: <span><PieChartOutlined /> Danh sách sinh viên phản hồi</span>,
                  children: (
                    <div className="rp-sheet">
                      <div className="rp-sheet-header">
                        <div className="rp-sheet-header__org-block">
                          <div className="rp-sheet-header__org-line">
                            {orgLine1}
                          </div>
                          {orgLine2 && (
                            <div className="rp-sheet-header__org-line rp-sheet-header__org-line--bold">
                              {orgLine2}
                            </div>
                          )}
                        </div>
                        <div className="rp-sheet-header__title">
                          {mau03Title}
                        </div>
                      </div>
                      <div className="rp-sheet-note">
                        Ghi chú: Ghi bằng số theo mã ngành tuyển sinh theo Thông tư số 24/2017/TT-BGDĐT.
                        Không in thông tin email của sinh viên do Học viện cấp.
                      </div>
                      <Table
                        {...tableProps}
                        columns={mau03Columns as any}
                        dataSource={responseRows}
                        rowKey="key"
                      />
                      <div className="rp-sheet-footer">
                        <div />
                        <div className="rp-sheet-footer__sign-block">
                          <div className="rp-sheet-footer__date">
                            Hà Nội, ngày &nbsp;&nbsp; tháng &nbsp;&nbsp; năm 2026
                          </div>
                          <div className="rp-sheet-footer__sign">
                            {signLabel}
                          </div>
                        </div>
                      </div>
                    </div>
                  ),
                },
                {
                  key: 'progress',
                  label: <span><SendOutlined /> Tiến độ nộp báo cáo</span>,
                  children: (
                    <>
                      <div className="rp-table-title">Tiến độ nộp báo cáo theo khoa</div>
                      <Table
                        {...tableProps}
                        columns={facultySubmissionColumns}
                        dataSource={facultyRows.map((row) => ({
                          ...row,
                          deadline: row.deadline ?? DEFAULT_DEADLINE,
                          submittedAt: row.submittedAt,
                          submittedBy: row.submittedBy ?? 'Chưa nộp',
                          feedback: row.feedback ?? 'Chưa có',
                          status: getFacultyStatus(row),
                        }))}
                        rowKey="key"
                        locale={{ emptyText: <Empty description="Chưa có dữ liệu tiến độ" /> }}
                        summary={(rows) => (
                          <Table.Summary.Row className="rp-summary-row">
                            <Table.Summary.Cell index={0} colSpan={3} align="center">
                              <strong>TỔNG HỢP TIẾN ĐỘ</strong>
                            </Table.Summary.Cell>
                            <Table.Summary.Cell index={3} align="right">
                              <strong>{rows.length} khoa</strong>
                            </Table.Summary.Cell>
                            {Array.from({ length: 4 }).map((_, i) => (
                              <Table.Summary.Cell key={i} index={4 + i} align="right">-</Table.Summary.Cell>
                            ))}
                          </Table.Summary.Row>
                        )}
                      />
                    </>
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