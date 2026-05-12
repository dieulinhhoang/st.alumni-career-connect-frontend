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
import AdminLayout from '../../../../components/layout/AdminLayout';
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
  { icon: <CheckCircleOutlined />, label: 'Total faculties', valueKey: 'totalFaculty', color: '#1677ff', bg: '#e6f4ff' },
  { icon: <SendOutlined />, label: 'Submitted', valueKey: 'submitted', color: '#09d488', bg: '#ccfbf1' },
  { icon: <ExclamationCircleOutlined />, label: 'Needs revision', valueKey: 'returned', color: '#faad14', bg: '#feefe4' },
  { icon: <AuditOutlined />, label: 'Approved', valueKey: 'approved', color: '#52c41a', bg: '#f6ffed' },
];

const SURVEY_OPTIONS = [
  { value: '2026-1', label: 'Survey 2026 - Round 1' },
  { value: '2025-2', label: 'Survey 2025 - Round 2' },
  { value: '2025-1', label: 'Survey 2025 - Round 1' },
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
    currentUser.scope === 'school' ? 'All faculties' : currentUser.scope === 'faculty'
      ? currentUser.facultyName : currentUser.majorName;

  const title = isSchoolView ? 'Faculty Submission Status' : isFacultyLikeView ? 'Employment Report' : 'Career Connect Report';
  const subtitle = isSchoolView ? 'Track faculty submissions' : 'Review employment data';

  const KPI_SUBMISSION = isSchoolView
    ? SUBMISSION_KPI_META.map((m) => ({
        icon: m.icon, color: m.color, bg: m.bg, label: m.label,
        value: String(submissionStats[m.valueKey as keyof typeof submissionStats]),
        sub: m.valueKey === 'totalFaculty' ? 'Faculties in the university'
          : m.valueKey === 'submitted' ? 'Faculties submitted report'
          : m.valueKey === 'returned' ? 'Faculties need revision'
          : 'Faculties approved by university',
      }))
    : [
        { icon: <TeamOutlined />, color: '#1677ff', bg: '#e6f4ff', label: 'Total graduates', value: stats.totalGraduates.toLocaleString('vi-VN'), sub: 'Current cohort' },
        { icon: <SendOutlined />, color: '#09d488', bg: '#ccfbf1', label: 'Submission rate', value: `${stats.submissionRate}%`, sub: `${stats.submitted} / ${stats.totalGraduates} students` },
        { icon: <TrophyOutlined />, color: '#d9706e', bg: '#fff3cf', label: 'Employment rate', value: `${stats.employmentRate}%`, sub: `${stats.employed} students` },
        { icon: <PieChartOutlined />, color: '#7c3aed', bg: '#ede9fe', label: 'Relevant jobs', value: `${stats.relevantJobRate}%`, sub: `Avg salary: ${stats.avgSalary}` },
      ];

  const SUBMISSION_STATUS_LABEL: Record<SubmissionStatus, string> = { draft: 'Draft', submitted: 'Submitted', returned: 'Returned', approved: 'Approved' };
  const DEFAULT_DEADLINE = '2026-02-15';

  const demoSubmissionStatus: Record<string, SubmissionStatus> = { '1': 'submitted', '2': 'returned', '3': 'draft', '4': 'approved' };
  const [facultyStatusMap, setFacultyStatusMap] = useState<Record<string, SubmissionStatus>>({});
  const getFacultyStatus = (row: FacultySubmissionRow): SubmissionStatus => facultyStatusMap[row.key] ?? demoSubmissionStatus[row.key] ?? row.status ?? 'draft';
  const handleUpdateStatus = (key: string, status: SubmissionStatus) => setFacultyStatusMap((prev) => ({ ...prev, [key]: status }));

  // ====== MẪU 01 - TỔNG HỢP THEO NGÀNH (15 cột không tính STT) ======
  const mau01Columns: ColumnsType<MajorSummaryRow> = [
    { title: 'STT', render: (_: any, __: any, i: number) => i + 1, width: 40, align: 'center', fixed: 'left' },
    { title: 'Mã ngành', dataIndex: 'majorCode', width: 90, fixed: 'left' },
    { title: 'Tên ngành đào tạo', dataIndex: 'majorName', width: 200, fixed: 'left' },
    {
      title: 'Sinh viên tốt nghiệp', children: [
        { title: 'Tổng số', dataIndex: 'total', width: 60, align: 'right' },
        { title: 'Nữ', dataIndex: 'totalNu', width: 45, align: 'right' },
      ],
    },
    {
      title: 'Sinh viên phản hồi', children: [
        { title: 'Tổng số', dataIndex: 'submitted', width: 60, align: 'right' },
        { title: 'Nữ', dataIndex: 'submittedNu', width: 45, align: 'right' },
      ],
    },
    { title: 'Có việc làm', dataIndex: 'coViecLam', width: 65, align: 'right' },
    { title: 'Tiếp tục học', dataIndex: 'tiepTucHoc', width: 70, align: 'right' },
    { title: 'Chưa có việc làm', dataIndex: 'chuaCoViecLam', width: 80, align: 'right' },
    { title: 'Tổng số sinh viên phản hồi', dataIndex: 'submitted', width: 85, align: 'right', render: (_: any, row: MajorSummaryRow) => row.submitted || 0 },
    {
      title: 'Tỷ lệ sinh viên có việc làm / Tổng số sinh viên phản hồi',
      dataIndex: 'submitted', width: 75, align: 'right',
      render: (_: any, row: MajorSummaryRow) => row.submitted ? `${Math.round((row.approved / row.submitted) * 100)}%` : '-',
    },
    {
      title: 'Tỷ lệ sinh viên có việc làm / Tổng số sinh viên tốt nghiệp',
      dataIndex: 'total', width: 75, align: 'right',
      render: (_: any, row: MajorSummaryRow) => row.total ? `${Math.round((row.approved / row.total) * 100)}%` : '-',
    },
    { title: 'Khu vực làm việc - Nhà nước', dataIndex: 'kvNhaNuoc', width: 80, align: 'right' },
    { title: 'Khu vực làm việc - Tư nhân', dataIndex: 'kvTuNhan', width: 80, align: 'right' },
    { title: 'Khu vực làm việc - Tự tạo việc làm', dataIndex: 'kvTuTao', width: 90, align: 'right' },
    { title: 'Khu vực làm việc - Có yếu tố nước ngoài', dataIndex: 'kvYNuocNgoai', width: 100, align: 'right' },
    { title: 'Nơi làm việc (Tỉnh/TP)', dataIndex: 'workLocation', width: 130 },
  ];

  // ====== MẪU 02 - DANH SÁCH SINH VIÊN (14 cột không tính STT) ======
  const mau02Columns: ColumnsType<GraduateRow> = [
    { title: 'STT', render: (_: any, __: any, i: number) => i + 1, width: 40, align: 'center', fixed: 'left' },
    { title: 'Mã sinh viên', dataIndex: 'studentCode', width: 90, fixed: 'left' },
    { title: 'Họ và tên', dataIndex: 'fullName', width: 160, fixed: 'left' },
    { title: 'Nữ', dataIndex: 'gender', width: 40, align: 'center', render: (v: string) => v === 'female' ? 'X' : '' },
    { title: 'Số thẻ CCCD', dataIndex: 'cccd', width: 120 },
    { title: 'Mã ngành đào tạo', dataIndex: 'majorCode', width: 90 },
    { title: 'Quyết định tốt nghiệp', dataIndex: 'certification', width: 90 },
    { title: 'Ngày ký quyết định', dataIndex: 'certDate', width: 95 },
    { title: 'Số điện thoại', dataIndex: 'phone', width: 100 },
    { title: 'Email', dataIndex: 'email', width: 170 },
    { title: 'Hình thức khảo sát', dataIndex: 'surveyMethod', width: 95, render: () => 'Online' },
    { title: 'Có phản hồi', dataIndex: 'status', width: 75, align: 'center', render: (v: string) => v === 'submitted' || v === 'approved' ? <Tag color='green'>X</Tag> : '' },
    { title: 'Ghi chú', dataIndex: 'note', width: 100 },
    { title: 'Ngành', dataIndex: 'majorName', width: 140 },
    { title: 'Khoa', dataIndex: 'cohort', width: 80 },
  ];

  // ====== MẪU 03 - PHẢN HỒI SV (Flat layout theo sheet - 40+ cột) ======
  const mau03Columns: ColumnsType<ResponseRow> = [
    { title: 'STT', render: (_: any, __: any, i: number) => i + 1, width: 40, align: 'center', fixed: 'left' },
    { title: 'Mã SV', dataIndex: 'studentCode', width: 80, fixed: 'left' },
    { title: 'Họ và tên', dataIndex: 'fullName', width: 150, fixed: 'left' },
    { title: 'Ngày sinh', dataIndex: 'dob', width: 80 },
    { title: 'Giới tính', dataIndex: 'gender', width: 50, render: (v: string) => v === 'female' ? 'Nữ' : 'Nam' },
    { title: 'Số thẻ CCCD', dataIndex: 'cccd', width: 120 },
    { title: 'Mã ngành', dataIndex: 'majorCode', width: 80 },
    // --- Tình hình việc làm ---
    { title: 'Có việc làm - Đúng ngành đào tạo', dataIndex: 'dungNganh', width: 100, align: 'center', render: (v: boolean) => v ? 'X' : '' },
    { title: 'Có việc làm - Liên quan đến ngành', dataIndex: 'lienQuan', width: 100, align: 'center', render: (v: boolean) => v ? 'X' : '' },
    { title: 'Có việc làm - Không liên quan ngành', dataIndex: 'khongLienQuan', width: 110, align: 'center', render: (v: boolean) => v ? 'X' : '' },
    { title: 'Tiếp tục học', dataIndex: 'tiepTucHoc', width: 70, align: 'center', render: (v: boolean) => v ? 'X' : '' },
    { title: 'Chưa có việc làm', dataIndex: 'chuaCoVl', width: 80, align: 'center', render: (v: boolean) => v ? 'X' : '' },
    // --- Khu vực làm việc ---
    { title: 'Khu vực NN', dataIndex: 'kvNhaNuoc', width: 60, align: 'center', render: (v: boolean) => v ? 'X' : '' },
    { title: 'Khu vực TN', dataIndex: 'kvTuNhan', width: 60, align: 'center', render: (v: boolean) => v ? 'X' : '' },
    { title: 'Tự tạo VL', dataIndex: 'kvTuTao', width: 70, align: 'center', render: (v: boolean) => v ? 'X' : '' },
    { title: 'Có yếu tố nước ngoài', dataIndex: 'kvYNuocNgoai', width: 90, align: 'center', render: (v: boolean) => v ? 'X' : '' },
    // --- Nơi làm việc ---
    { title: 'Nơi làm việc (Tỉnh/TP)', dataIndex: 'workLocation', width: 110 },
    // --- Thời gian tìm việc ---
    { title: 'Thời gian tìm việc - Dưới 3 tháng', dataIndex: 'thoiGianDuoi3Thang', width: 100, align: 'center', render: (v: boolean) => v ? 'X' : '' },
    { title: 'Thời gian tìm việc - Từ 3 đến dưới 6 tháng', dataIndex: 'thoiGian3Den6Thang', width: 110, align: 'center', render: (v: boolean) => v ? 'X' : '' },
    { title: 'Thời gian tìm việc - Từ 6 đến dưới 12 tháng', dataIndex: 'thoiGian6Den12Thang', width: 110, align: 'center', render: (v: boolean) => v ? 'X' : '' },
    { title: 'Thời gian tìm việc - Từ 12 tháng trở lên', dataIndex: 'thoiGian12ThangTroLen', width: 110, align: 'center', render: (v: boolean) => v ? 'X' : '' },
    // --- Học được kiến thức kỹ năng ---
    { title: 'Học được đủ kiến thức kỹ năng', dataIndex: 'hocDu', width: 90, align: 'center', render: (v: boolean) => v ? 'X' : '' },
    { title: 'Chỉ học được 1 phần', dataIndex: 'hocMotPhan', width: 100, align: 'center', render: (v: boolean) => v ? 'X' : '' },
    { title: 'Không học được', dataIndex: 'khôngHocDuoc', width: 90, align: 'center', render: (v: boolean) => v ? 'X' : '' },
    // --- Mức lương ---
    { title: 'Mức lương - Dưới 5 triệu', dataIndex: 'luongDuoi5Tr', width: 90, align: 'center', render: (v: boolean) => v ? 'X' : '' },
    { title: 'Mức lương - Từ 5 đến dưới 10 triệu', dataIndex: 'luong5Den10Tr', width: 100, align: 'center', render: (v: boolean) => v ? 'X' : '' },
    { title: 'Mức lương - Từ 10 đến dưới 15 triệu', dataIndex: 'luong10Den15Tr', width: 100, align: 'center', render: (v: boolean) => v ? 'X' : '' },
    { title: 'Mức lương - Từ 15 triệu trở lên', dataIndex: 'luong15TroLen', width: 100, align: 'center', render: (v: boolean) => v ? 'X' : '' },
    { title: 'Mức lương khởi điểm (triệu)', dataIndex: 'salary', width: 100, align: 'right' },
    { title: 'Thu nhập bình quân (triệu)', dataIndex: 'avgIncome', width: 100, align: 'right' },
    // --- Hình thức tìm việc ---
    { title: 'Hình thức tìm việc', dataIndex: 'searchMethod', width: 110 },
    { title: 'Hình thức tuyển dụng', dataIndex: 'hiringMethod', width: 110 },
    // --- Kỹ năng mềm ---
    { title: 'Kỹ năng giao tiếp', dataIndex: 'knGiaoTiep', width: 100, align: 'center', render: (v: boolean) => v ? 'X' : '' },
    { title: 'Kỹ năng thuyết trình', dataIndex: 'knThuyetTrinh', width: 100, align: 'center', render: (v: boolean) => v ? 'X' : '' },
    { title: 'Kỹ năng làm việc nhóm', dataIndex: 'knLamViecNhom', width: 100, align: 'center', render: (v: boolean) => v ? 'X' : '' },
    { title: 'Kỹ năng viết báo cáo', dataIndex: 'knVietBaoCao', width: 100, align: 'center', render: (v: boolean) => v ? 'X' : '' },
    { title: 'Kỹ năng lãnh đạo', dataIndex: 'knLanhDao', width: 90, align: 'center', render: (v: boolean) => v ? 'X' : '' },
    { title: 'Kỹ năng tiếng Anh', dataIndex: 'knTiengAnh', width: 90, align: 'center', render: (v: boolean) => v ? 'X' : '' },
    { title: 'Kỹ năng tin học', dataIndex: 'knTinHoc', width: 90, align: 'center', render: (v: boolean) => v ? 'X' : '' },
    { title: 'Kỹ năng hội nhập quốc tế', dataIndex: 'knHoiNhap', width: 110, align: 'center', render: (v: boolean) => v ? 'X' : '' },
    { title: 'Kỹ năng khác', dataIndex: 'knKhac', width: 90, align: 'center', render: (v: boolean) => v ? 'X' : '' },
    // --- Khóa học sau TN ---
    { title: 'Khóa học sau TN', dataIndex: 'postGradCourse', width: 130 },
    // --- Giải pháp ---
    { title: 'Giải pháp nâng cao tỷ lệ có VL', dataIndex: 'giaiPhap', width: 140 },
  ];

  // ====== TIẾN ĐỘ NỘP KHOA ======
  const facultySubmissionColumns: ColumnsType<FacultySubmissionRow> = [
    { title: 'STT', render: (_: any, __: any, i: number) => i + 1, width: 40, align: 'center' },
    { title: 'Mã khoa', dataIndex: 'facultyCode', width: 80 },
    { title: 'Tên khoa', dataIndex: 'facultyName' },
    { title: 'Trạng thái', dataIndex: 'status', width: 120, render: (_: any, row: FacultySubmissionRow) => <SubmissionPill status={getFacultyStatus(row)} /> },
    { title: 'Người nộp', dataIndex: 'submittedBy', width: 110, render: (v: string) => v ?? 'Chưa nộp' },
    { title: 'Thời gian nộp', dataIndex: 'submittedAt', width: 120, render: (v: string) => v ?? 'Chưa nộp' },
    { title: 'Hạn nộp', dataIndex: 'deadline', width: 90, render: (v: string) => v ?? DEFAULT_DEADLINE },
    { title: 'Phản hồi', dataIndex: 'feedback', width: 130, render: (v: string) => v ?? 'Chưa có phản hồi' },
    {
      title: 'Thao tác', key: 'actions', width: 220,
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
            {status === 'returned' && <Button size='small' onClick={() => handleUpdateStatus(row.key, 'submitted')}>Đánh dấu đã nộp lại</Button>}
            {status === 'draft' && <span style={{ color: '#999' }}>Chờ nộp</span>}
          </Space>
        );
      },
    },
  ];

  const tableProps = { size: 'small' as const, pagination: { pageSize: 10 }, bordered: true, className: 'rp-formal-table', scroll: { x: 'max-content' as const } };
  const selectedSurveyLabel = SURVEY_OPTIONS.find((o) => o.value === filters.surveyId)?.label ?? filters.surveyId;

  return (
    <AdminLayout>
      <div className='rp-page'>
        {/* ====== HEADER ====== */}
        <div className='rp-doc-header'>
          <div className='rp-doc-header__org'>
            <div className='rp-doc-header__ministry'>VIETNAM NATIONAL UNIVERSITY OF AGRICULTURE</div>
            <div className='rp-doc-header__dept'>TRAINING MANAGEMENT BOARD</div>
          </div>
          <div className='rp-doc-header__center'>
            <div className='rp-doc-header__title'>{title}</div>
            <div className='rp-doc-header__subtitle'>{subtitle}</div>
            <div className='rp-doc-header__survey-name'>{selectedSurveyLabel}</div>
          </div>
          <div className='rp-doc-header__actions'>
            <div className='rp-filter-item'>
              <label className='rp-filter-label'>Role (demo)</label>
              <Select value={userIndex} onChange={setUserIndex} style={{ width: 180 }} size='small'>
                <Option value={0}>Super Admin</Option>
                <Option value={1}>Faculty Officer</Option>
                <Option value={2}>Major Officer</Option>
              </Select>
            </div>
            <div className='rp-filter-item' style={{ marginTop: 8 }}>
              <label className='rp-filter-label'>Survey round</label>
              <Select value={filters.surveyId} onChange={(v) => setFilters((f) => ({ ...f, surveyId: v }))} style={{ width: 220 }} size='small'>
                {SURVEY_OPTIONS.map((o) => <Option key={o.value} value={o.value}>{o.label}</Option>)}
              </Select>
            </div>
          </div>
          <div className='rp-scope-badge' style={{ marginTop: 10 }}>Scope: <strong>{scopeLabel}</strong></div>

          {/* ====== WORKFLOW BAR ====== */}
          {isFacultyLikeView && (
            <div style={{ marginTop: 12, display: 'flex', alignItems: 'center', gap: 10 }}>
              <SubmissionPill status={submissionStatus} />
              {submissionStatus === 'draft' && <Button size='small' type='primary' icon={<SendOutlined />} onClick={handleSubmitToSchool}>Submit to university</Button>}
              {submissionStatus === 'submitted' && <Button size='small' danger onClick={handleWithdrawSubmission}>Withdraw</Button>}
              {submissionStatus === 'returned' && <Button size='small' type='primary' icon={<SendOutlined />} onClick={handleSubmitToSchool}>Resubmit</Button>}
              {submissionStatus === 'approved' && <span style={{ color: '#52c41a', fontSize: 13 }}>University has approved your report</span>}
            </div>
          )}
        </div>

        {/* ====== KPI CARDS ====== */}
        <div className='rp-kpi-grid'>
          {KPI_SUBMISSION.map((kpi, i) => (
            <div className='rp-kpi-card' key={i}>
              <div className='rp-kpi-icon' style={{ background: kpi.bg, color: kpi.color }}>{kpi.icon}</div>
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
                label: (<span><FileTextOutlined /> Mẫu 01 - Tổng hợp theo ngành</span>),
                children: (
                  <>
                    <div className='rp-table-title'>MẪU SỐ 01: BẢNG TỔNG HỢP TÌNH HÌNH VIỆC LÀM THEO NGÀNH</div>
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
                            <Table.Summary.Cell index={0} colSpan={3} align='center'><strong>TỔNG HỢP</strong></Table.Summary.Cell>
                            <Table.Summary.Cell index={3} align='right'><strong>{tot}</strong></Table.Summary.Cell>
                            <Table.Summary.Cell index={4} align='right'>-</Table.Summary.Cell>
                            <Table.Summary.Cell index={5} align='right'><strong>{sub}</strong></Table.Summary.Cell>
                            <Table.Summary.Cell index={6} align='right'>-</Table.Summary.Cell>
                            <Table.Summary.Cell index={7} align='right'><strong>{app}</strong></Table.Summary.Cell>
                            <Table.Summary.Cell index={8} align='right'>-</Table.Summary.Cell>
                            <Table.Summary.Cell index={9} align='right'>-</Table.Summary.Cell>
                            <Table.Summary.Cell index={10} align='right'>-</Table.Summary.Cell>
                            <Table.Summary.Cell index={11} align='right'>-</Table.Summary.Cell>
                            <Table.Summary.Cell index={12} align='right'>-</Table.Summary.Cell>
                            <Table.Summary.Cell index={13} align='right'>-</Table.Summary.Cell>
                            <Table.Summary.Cell index={14} align='right'>-</Table.Summary.Cell>
                            <Table.Summary.Cell index={15} align='right'>-</Table.Summary.Cell>
                          </Table.Summary.Row>
                        );
                      }}
                    />
                  </>
                ),
              },
              {
                key: 'mau02',
                label: (<span><TeamOutlined /> Mẫu 02 - Danh sách sinh viên</span>),
                children: (<><div className='rp-table-title'>MẪU SỐ 02: DANH SÁCH SINH VIÊN TỐT NGHIỆP</div><Table {...tableProps} columns={mau02Columns} dataSource={graduateRows} rowKey='key' /></>),
              },
              {
                key: 'mau03',
                label: (<span><PieChartOutlined /> Mẫu 03 - Phản hồi khảo sát</span>),
                children: (<><div className='rp-table-title'>MẪU SỐ 03: DANH SÁCH SINH VIÊN CÓ PHẢN HỒI KHẢO SÁT</div><Table {...tableProps} columns={mau03Columns as any} dataSource={responseRows} rowKey='key' /></>),
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
                      dataSource={facultyRows.map((row) => ({ ...row, deadline: row.deadline ?? DEFAULT_DEADLINE, submittedAt: row.submittedAt, submittedBy: row.submittedBy ?? 'Chưa nộp', feedback: row.feedback ?? 'Chưa có phản hồi', status: getFacultyStatus(row) }))}
                      rowKey='key'
                      locale={{ emptyText: <Empty description='Chưa có dữ liệu tiến độ' /> }}
                      summary={(rows) => (
                        <Table.Summary.Row className='rp-summary-row'>
                          <Table.Summary.Cell index={0} colSpan={3} align='center'><strong>TỔNG HỢP TIẾN ĐỘ</strong></Table.Summary.Cell>
                          <Table.Summary.Cell index={3} align='right'><strong>{rows.length} khoa</strong></Table.Summary.Cell>
                          {Array.from({ length: 4 }).map((_, i) => <Table.Summary.Cell key={i} index={4 + i} align='right'>-</Table.Summary.Cell>)}
                        </Table.Summary.Row>
                      )}
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
