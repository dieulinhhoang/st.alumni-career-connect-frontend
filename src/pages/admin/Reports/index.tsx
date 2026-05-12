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

  const scopeLabel = currentUser.scope === 'school' ? 'Toàn trường' : currentUser.scope === 'faculty'
    ? currentUser.facultyName : currentUser.majorName;

  const title = isSchoolView ? 'Tổng hợp báo cáo cấp trường' : isFacultyLikeView
    ? 'Báo cáo việc làm đơn vị' : 'Báo cáo';
  const subtitle = isSchoolView ? 'Theo dõi các khoa nộp báo cáo lên trường'
    : 'Rà soát dữ liệu và nộp báo cáo lên trường';

  const KPI_SUBMISSION = isSchoolView
    ? SUBMISSION_KPI_META.map((m) => ({
        icon: m.icon, color: m.color, bg: m.bg, label: m.label,
        value: String(submissionStats[m.valueKey as keyof typeof submissionStats]),
        sub: m.valueKey === 'totalFaculty' ? 'Khoa/ngành trong trường'
          : m.valueKey === 'submitted' ? 'Khoa đã nộp báo cáo'
          : m.valueKey === 'returned' ? 'Khoa cần bổ sung'
          : 'Khoa đã được duyệt',
      }))
    : [
        { icon: <TeamOutlined />, color: '#1677ff', bg: '#e6f4ff', label: 'Tổng SV tốt nghiệp', value: stats.totalGraduates.toLocaleString('vi-VN'), sub: 'Khóa hiện tại' },
        { icon: <SendOutlined />, color: '#09d488', bg: '#ccfbf1', label: 'Tỷ lệ nộp', value: `${stats.submissionRate}%`, sub: `${stats.submitted}/${stats.totalGraduates} SV` },
        { icon: <TrophyOutlined />, color: '#d9706e', bg: '#fff3cf', label: 'Tỷ lệ có việc làm', value: `${stats.employmentRate}%`, sub: `${stats.employed} SV` },
        { icon: <PieChartOutlined />, color: '#7c3aed', bg: '#ede9fe', label: 'Đúng ngành nghề', value: `${stats.relevantJobRate}%`, sub: `TB lương: ${stats.avgSalary}` },
      ];

  const SUBMISSION_STATUS_LABEL: Record<SubmissionStatus, string> = { draft: 'Chưa nộp', submitted: 'Đã nộp', returned: 'Trả về', approved: 'Đã duyệt' };
  const DEFAULT_DEADLINE = '2026-02-15';
  const demoSubmissionStatus: Record<string, SubmissionStatus> = { '1': 'submitted', '2': 'returned', '3': 'draft', '4': 'approved' };
  const [facultyStatusMap, setFacultyStatusMap] = useState<Record<string, SubmissionStatus>>({});
  const getFacultyStatus = (row: FacultySubmissionRow): SubmissionStatus => facultyStatusMap[row.key] ?? demoSubmissionStatus[row.key] ?? row.status ?? 'draft';
  const handleUpdateStatus = (key: string, status: SubmissionStatus) => setFacultyStatusMap((prev) => ({ ...prev, [key]: status }));

  // ====== MẪU 01 - TỔNG HỢP THEO NGÀNH (19 cột theo Excel) ======
  const mau01Columns: ColumnsType<MajorSummaryRow> = [
    { title: 'STT', render: (_: any, __: any, i: number) => i + 1, width: 42, align: 'center', fixed: 'left' },
    { title: 'Mã ngành', dataIndex: 'majorCode', width: 90 },
    { title: 'Tên ngành đào tạo', dataIndex: 'majorName', width: 200 },
    { title: 'SV tốt nghiệp', children: [
        { title: 'Tổng số', dataIndex: 'total', width: 65, align: 'right' },
        { title: 'Nữ', dataIndex: 'totalNu', width: 50, align: 'right' },
      ],
    },
    { title: 'SV phản hồi', children: [
        { title: 'Tổng số', dataIndex: 'submitted', width: 65, align: 'right' },
        { title: 'Nữ', dataIndex: 'submittedNu', width: 50, align: 'right' },
      ],
    },
    { title: 'Có việc làm', dataIndex: 'coViecLam', width: 65, align: 'right' },
    { title: 'Tiếp tục học', dataIndex: 'tiepTucHoc', width: 70, align: 'right' },
    { title: 'Chưa có việc làm', dataIndex: 'chuaCoViecLam', width: 80, align: 'right' },
    { title: 'Tổng số SV phản hồi', dataIndex: 'submitted', width: 85, align: 'right', render: (_: any, row: MajorSummaryRow) => row.submitted || 0 },
    { title: 'Tỷ lệ có VL / Tổng SV phản hồi', dataIndex: 'submitted', width: 75, align: 'right', render: (_: any, row: MajorSummaryRow) => row.submitted ? `${Math.round((row.approved / row.submitted) * 100)}%` : '-' },
    { title: 'Tỷ lệ có VL / Tổng SV tốt nghiệp', dataIndex: 'total', width: 75, align: 'right', render: (_: any, row: MajorSummaryRow) => row.total ? `${Math.round((row.approved / row.total) * 100)}%` : '-' },
    { title: 'Khu vực - Nhà nước', dataIndex: 'kvNhaNuoc', width: 80, align: 'right' },
    { title: 'Khu vực - Tư nhân', dataIndex: 'kvTuNhan', width: 70, align: 'right' },
    { title: 'Khu vực - Tự tạo VL', dataIndex: 'kvTuTao', width: 80, align: 'right' },
    { title: 'Khu vực - Có YN', dataIndex: 'kvYNuocNgoai', width: 85, align: 'right' },
    { title: 'Nơi làm việc (Tỉnh/TP)', dataIndex: 'workLocation', width: 130 },
  ];

  // ====== MẪU 02 - DANH SÁCH SV (14 cột theo Excel) ======
  const mau02Columns: ColumnsType<GraduateRow> = [
    { title: 'STT', render: (_: any, __: any, i: number) => i + 1, width: 42, align: 'center', fixed: 'left' },
    { title: 'Mã SV', dataIndex: 'studentCode', width: 90 },
    { title: 'Họ và tên', dataIndex: 'fullName', width: 160 },
    { title: 'Nữ', dataIndex: 'gender', width: 40, align: 'center', render: (v: string) => v === 'female' ? 'X' : '' },
    { title: 'Số QP TN', dataIndex: 'certification', width: 90 },
    { title: 'Số CCCD', dataIndex: 'cccd', width: 120 },
    { title: 'Mã ngành', dataIndex: 'majorCode', width: 90 },
    { title: 'Quyết định TN', dataIndex: 'decision', width: 95 },
    { title: 'Ngày ký QP', dataIndex: 'certDate', width: 90 },
    { title: 'Số điện thoại', dataIndex: 'phone', width: 100 },
    { title: 'Email', dataIndex: 'email', width: 170 },
    { title: 'Hình thức KS', dataIndex: 'surveyMethod', width: 90, render: () => 'Online' },
    { title: 'Có PH', dataIndex: 'status', width: 50, align: 'center', render: (v: string) => v === 'submitted' || v === 'approved' ? <Tag color='green'>X</Tag> : '' },
    { title: 'Ghi chú', dataIndex: 'note', width: 100 },
    { title: 'Ngành', dataIndex: 'majorName', width: 140 },
    { title: 'Khoa', dataIndex: 'cohort', width: 80 },
  ];

  // ====== MẪU 03 - PHẢN HỒI SV (Flat layout theo Excel - 41+ cột) ======
  const mau03Columns: ColumnsType<ResponseRow> = [
    { title: 'STT', render: (_: any, __: any, i: number) => i + 1, width: 42, align: 'center', fixed: 'left' },
    { title: 'Mã SV', dataIndex: 'studentCode', width: 80 },
    { title: 'Họ và tên', dataIndex: 'fullName', width: 150 },
    { title: 'Ngày sinh', dataIndex: 'dob', width: 80 },
    { title: 'Giới tính', dataIndex: 'gender', width: 50, render: (v: string) => v === 'female' ? 'Nữ' : 'Nam' },
    { title: 'Số CCCD', dataIndex: 'cccd', width: 110 },
    { title: 'Mã ngành', dataIndex: 'majorCode', width: 80 },
    { title: 'Có VL - Đúng ngành', dataIndex: 'dungNganh', width: 80, align: 'center', render: (v: boolean) => v ? 'X' : '' },
    { title: 'Có VL - Liên quan', dataIndex: 'lienQuan', width: 75, align: 'center', render: (v: boolean) => v ? 'X' : '' },
    { title: 'Có VL - Không LQ', dataIndex: 'khongLienQuan', width: 80, align: 'center', render: (v: boolean) => v ? 'X' : '' },
    { title: 'TT học', dataIndex: 'tiepTucHoc', width: 50, align: 'center', render: (v: boolean) => v ? 'X' : '' },
    { title: 'Chưa có VL', dataIndex: 'chuaCoVl', width: 65, align: 'center', render: (v: boolean) => v ? 'X' : '' },
    { title: 'Khu vực NN', dataIndex: 'kvNhaNuoc', width: 60, align: 'center', render: (v: boolean) => v ? 'X' : '' },
    { title: 'Khu vực TN', dataIndex: 'kvTuNhan', width: 60, align: 'center', render: (v: boolean) => v ? 'X' : '' },
    { title: 'Tự tạo VL', dataIndex: 'kvTuTao', width: 65, align: 'center', render: (v: boolean) => v ? 'X' : '' },
    { title: 'Có yếu tố nước ngoài', dataIndex: 'kvYNuocNgoai', width: 90, align: 'center', render: (v: boolean) => v ? 'X' : '' },
    { title: 'Nơi làm việc (Tỉnh/TP)', dataIndex: 'workLocation', width: 110 },
    { title: 'Thời gian - Dưới 3 tháng', dataIndex: 'thoiGianDuoi3Thang', width: 90, align: 'center', render: (v: boolean) => v ? 'X' : '' },
    { title: 'Thời gian - Từ 3 đến dưới 6 tháng', dataIndex: 'thoiGian3Den6Thang', width: 100, align: 'center', render: (v: boolean) => v ? 'X' : '' },
    { title: 'Thời gian - Từ 6 đến dưới 12 tháng', dataIndex: 'thoiGian6Den12Thang', width: 100, align: 'center', render: (v: boolean) => v ? 'X' : '' },
    { title: 'Thời gian - Từ 12 tháng trở lên', dataIndex: 'thoiGian12ThangTroLen', width: 100, align: 'center', render: (v: boolean) => v ? 'X' : '' },
    { title: 'Học được đủ kiến thức kỹ năng', dataIndex: 'hocDu', width: 100, align: 'center', render: (v: boolean) => v ? 'X' : '' },
    { title: 'Chỉ học được 1 phần', dataIndex: 'hocMotPhan', width: 100, align: 'center', render: (v: boolean) => v ? 'X' : '' },
    { title: 'Không học được', dataIndex: 'khôngHocDuoc', width: 90, align: 'center', render: (v: boolean) => v ? 'X' : '' },
    { title: 'Mức lương khởi điểm (triệu)', dataIndex: 'salary', width: 100, align: 'right' },
    { title: 'Thu nhập bình quân (triệu)', dataIndex: 'avgIncome', width: 100, align: 'right' },
    { title: 'Hình thức tìm việc', dataIndex: 'searchMethod', width: 100 },
    { title: 'Hình thức tuyển dụng', dataIndex: 'hiringMethod', width: 100 },
    { title: 'Kỹ năng giao tiếp', dataIndex: 'knGiaoTiep', width: 90, align: 'center', render: (v: boolean) => v ? 'X' : '' },
    { title: 'Kỹ năng thuyết trình', dataIndex: 'knThuyetTrinh', width: 95, align: 'center', render: (v: boolean) => v ? 'X' : '' },
    { title: 'Kỹ năng làm việc nhóm', dataIndex: 'knLamViecNhom', width: 95, align: 'center', render: (v: boolean) => v ? 'X' : '' },
    { title: 'Kỹ năng viết báo cáo', dataIndex: 'knVietBaoCao', width: 95, align: 'center', render: (v: boolean) => v ? 'X' : '' },
    { title: 'Kỹ năng lãnh đạo', dataIndex: 'knLanhDao', width: 90, align: 'center', render: (v: boolean) => v ? 'X' : '' },
    { title: 'Kỹ năng tiếng Anh', dataIndex: 'knTiengAnh', width: 90, align: 'center', render: (v: boolean) => v ? 'X' : '' },
    { title: 'Kỹ năng tin học', dataIndex: 'knTinHoc', width: 90, align: 'center', render: (v: boolean) => v ? 'X' : '' },
    { title: 'Kỹ năng hội nhập quốc tế', dataIndex: 'knHoiNhap', width: 100, align: 'center', render: (v: boolean) => v ? 'X' : '' },
    { title: 'Kỹ năng khác', dataIndex: 'knKhac', width: 80, align: 'center', render: (v: boolean) => v ? 'X' : '' },
    { title: 'Khóa học sau TN', dataIndex: 'postGradCourse', width: 130 },
    { title: 'Giải pháp', dataIndex: 'giaiPhap', width: 140 },
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
    { title: 'Phản hồi', dataIndex: 'feedback', width: 120, render: (v: string) => v ?? 'Chưa có' },
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
              <Select value={filters.surveyId} onChange={(v) => setFilters((f) => ({ ...f, surveyId: v }))} style={{ width: 220 }} size='small'>
                {SURVEY_OPTIONS.map((o) => <Option key={o.value} value={o.value}>{o.label}</Option>)}
              </Select>
            </div>
          </div>
          <div className='rp-scope-badge' style={{ marginTop: 10 }}>Phạm vi: <strong>{scopeLabel}</strong></div>

          {/* ====== WORKFLOW BAR ====== */}
          {isFacultyLikeView && (
            <div style={{ marginTop: 12, display: 'flex', alignItems: 'center', gap: 10 }}>
              <SubmissionPill status={submissionStatus} />
              {submissionStatus === 'draft' && <Button size='small' type='primary' icon={<SendOutlined />} onClick={handleSubmitToSchool}>Nộp báo cáo lên trường</Button>}
              {submissionStatus === 'submitted' && <Button size='small' danger onClick={handleWithdrawSubmission}>Thu hồi</Button>}
              {submissionStatus === 'returned' && <Button size='small' type='primary' icon={<SendOutlined />} onClick={handleSubmitToSchool}>Nộp lại lên trường</Button>}
              {submissionStatus === 'approved' && <span style={{ color: '#52c41a', fontSize: 13 }}>Trường đã duyệt báo cáo</span>}
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
                  <div className='rp-sheet'>
                    <div className='rp-sheet-header'>
                      <div className='rp-sheet-header__org'>HỌC VIỆN NÔNG NGHIỆP VIỆT NAM — KHOA CÔNG NGHỆ THÔNG TIN</div>
                      <div className='rp-sheet-header__title'>BÁO CÁO TÌNH HÌNH VIỆC LÀM CỦA SINH VIÊN TỐT NGHIỆP NĂM 2026</div>
                    </div>
                    <div className='rp-sheet-note'>Ghi chú: Ghi theo mã ngành tuyển sinh theo thông tư số 24/2017/TT-BGDT. Khoa lấy thông tin mã ngành tại mẫu số 02.</div>
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
                          </Table.Summary.Row>
                        );
                      }}
                    />
                    <div className='rp-sheet-footer'>
                      <div className='rp-sheet-footer__date'>Hà Nội, ngày ... tháng ... năm 2026</div>
                      <div className='rp-sheet-footer__sign'>TRƯỞNG KHOA</div>
                      <div className='rp-sheet-footer__title'>TITLE Mẫu báo cáo 1</div>
                    </div>
                  </div>
                ),
              },
              {
                key: 'mau02',
                label: (<span><TeamOutlined /> Mẫu 02 - Danh sách sinh viên</span>),
                children: (
                  <div className='rp-sheet'>
                    <div className='rp-sheet-header'>
                      <div className='rp-sheet-header__org'>HỌC VIỆN NÔNG NGHIỆP VIỆT NAM — KHOA CÔNG NGHỆ THÔNG TIN</div>
                      <div className='rp-sheet-header__title'>DANH SÁCH SINH VIÊN TỐT NGHIỆP NĂM 2026</div>
                    </div>
                    <div className='rp-sheet-note'>Ghi chú: Do Ban QLT, CTCTCTSV cung cấp. Khoa bổ sung thông tin CCCD đối với sinh viên chưa có CCCD. Trường hợp CCCD của sinh viên bị sai, Khoa chỉnh sửa thông tin vào cột ghi chú.</div>
                    <div className='rp-table-title'>MẪU SỐ 02: DANH SÁCH SINH VIÊN TỐT NGHIỆP</div>
                    <Table {...tableProps} columns={mau02Columns} dataSource={graduateRows} rowKey='key' />
                    <div className='rp-sheet-footer'>
                      <div className='rp-sheet-footer__date'>Hà Nội, ngày ... tháng ... năm 2026</div>
                      <div className='rp-sheet-footer__sign'>TRƯỞNG KHOA</div>
                      <div className='rp-sheet-footer__title'>TITLE Mẫu báo cáo 2</div>
                    </div>
                  </div>
                ),
              },
              {
                key: 'mau03',
                label: (<span><PieChartOutlined /> Mẫu 03 - Phản hồi khảo sát</span>),
                children: (
                  <div className='rp-sheet'>
                    <div className='rp-sheet-header'>
                      <div className='rp-sheet-header__org'>HỌC VIỆN NÔNG NGHIỆP VIỆT NAM — KHOA CÔNG NGHỆ THÔNG TIN</div>
                      <div className='rp-sheet-header__title'>DANH SÁCH SINH VIÊN TỐT NGHIỆP NĂM 2026 PHẢN HỒI VỀ TÌNH HÌNH VIỆC LÀM</div>
                    </div>
                    <div className='rp-sheet-note'>Ghi chú: Ghi bằng số theo mã ngành tuyển sinh theo thông tư số 24/2017/TT-BGDT. Không in thông tin email của sinh viên do HVNN cấp.</div>
                    <div className='rp-table-title'>MẪU SỐ 03: DANH SÁCH SINH VIÊN CÓ PHẢN HỒI KHẢO SÁT</div>
                    <Table {...tableProps} columns={mau03Columns as any} dataSource={responseRows} rowKey='key' />
                    <div className='rp-sheet-footer'>
                      <div className='rp-sheet-footer__date'>Hà Nội, ngày ... tháng ... năm 2026</div>
                      <div className='rp-sheet-footer__sign'>TRƯỞNG KHOA</div>
                      <div className='rp-sheet-footer__title'>TITLE Mẫu báo cáo 3</div>
                    </div>
                  </div>
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
                      dataSource={facultyRows.map((row) => ({ ...row, deadline: row.deadline ?? DEFAULT_DEADLINE, submittedAt: row.submittedAt, submittedBy: row.submittedBy ?? 'Chưa nộp', feedback: row.feedback ?? 'Chưa có', status: getFacultyStatus(row) }))}
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
