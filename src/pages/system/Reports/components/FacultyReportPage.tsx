import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Spin, Button, Select, Breadcrumb, message } from 'antd';
import { ArrowLeftOutlined, HomeOutlined } from '@ant-design/icons';
import AdminLayout from '../../../../components/layout/AdminLayout';
import type { FilterState } from '../../../../feature/reports/types';
import { useReportData } from '../../../../feature/reports/hooks/useReportData';
import { useKpiItems } from '../../../../feature/reports/hooks/useKpiItems';
import { useSurveyOptions } from '../../../../feature/reports/hooks/useSurveyOptions';
import { useSubmissionStatus } from '../../../../feature/reports/hooks/useSubmissionStatus';
import { fetchFacultyOptions, exportReportExcel } from '../../../../feature/reports/api';
import type { FacultyOption } from '../../../../feature/reports/types';
import { ORG_NAME } from '../../../../feature/reports/constants';
import { getCurrentUser, getEffectiveFacultyId, isFacultyMode } from '../../../../feature/auth/permission';
import { KpiGrid } from '../components/KpiGrid';
import { ReportTabs } from '../components/ReportTabs';
import { SubmissionPill } from '../components/SubmissionPill';
import '../styles.css';

const { Option } = Select;

function formatDeadline(raw: string | null | undefined): string {
  if (!raw) return '';
  const d = new Date(raw);
  if (isNaN(d.getTime())) return raw;
  return `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`;
}

export default function FacultyReportPage() {
  const { facultyId: urlFacultyId } = useParams<{ facultyId: string }>();
  const navigate = useNavigate();
  const currentAccount = getCurrentUser();
  // Chế độ khoa: cán bộ khoa, hoặc admin đóng vai khoa → ẩn điều hướng "toàn trường"
  const facultyMode = isFacultyMode();
  const effId = getEffectiveFacultyId();
  // Chế độ khoa: LUÔN khóa theo khoa hiệu lực (bỏ qua id trên URL nếu lệch) để không
  // xem nhầm báo cáo khoa khác. Admin toàn trường: theo id URL (xem báo cáo từng khoa).
  const facultyId = facultyMode ? (effId ?? urlFacultyId) : urlFacultyId;
  // "Khoa của mình" theo phạm vi hiệu lực (officer = khoa mình; admin đóng vai = khoa đang chọn)
  const isOwnFaculty = !!facultyId && String(effId) === String(facultyId);

  const [filters, setFilters] = useState<FilterState>({
    surveyId: '',
    facultyId: facultyId,
  });
  const [facultyOptions, setFacultyOptions] = useState<FacultyOption[]>([]);

  const { options: surveyOptions, defaultSurveyId, deadline, loading: surveyLoading } = useSurveyOptions();

  // Auto-chọn đợt khảo sát mới nhất
  useEffect(() => {
    if (defaultSurveyId && !filters.surveyId) {
      setFilters((f) => ({ ...f, surveyId: defaultSurveyId }));
    }
  }, [defaultSurveyId]);

  // Load danh sách khoa (để lấy tên khoa hiển thị)
  useEffect(() => {
    fetchFacultyOptions().then(setFacultyOptions).catch(() => setFacultyOptions([]));
  }, []);

  // Sync facultyId từ URL vào filters khi URL thay đổi
  useEffect(() => {
    setFilters((f) => ({ ...f, facultyId }));
  }, [facultyId]);

  const { currentUser, stats, majorRows, graduateRows, responseRows, facultyRows, reportMeta, loading } =
    useReportData(filters);

  const kpiItems = useKpiItems(false, stats, facultyRows);

  const { status: submissionStatus, submit: submitOwnReport, withdraw: withdrawOwnReport } =
    useSubmissionStatus(filters.surveyId, facultyId);

  const facultyName =
    facultyOptions.find((f) => String(f.value) === String(facultyId))?.label ??
    // Chỉ dùng tên khoa của user khi đúng là khoa mình — tránh hiện nhầm khoa khi xem khoa khác
    (isOwnFaculty ? currentUser.facultyName : undefined) ??
    `Khoa ${facultyId}`;

  const selectedDeadline = surveyOptions.find((o) => o.value === filters.surveyId)?.deadline ?? deadline;

  const handleDownload = async (mau: 'mau01' | 'mau02' | 'mau03' | 'all') => {
    try {
      await exportReportExcel(mau, filters);
    } catch {
      message.error('Xuất báo cáo Excel thất bại.');
    }
  };

  return (
    <AdminLayout>
      <Spin spinning={surveyLoading}>
        <div style={{ padding: '0 0 32px' }}>

          {/* ── Breadcrumb (chỉ admin toàn trường; ẩn khi đang ở vai trò khoa) ── */}
          {currentAccount.isAdmin && !facultyMode && (
            <Breadcrumb
              style={{ marginBottom: 16, fontSize: 13 }}
              items={[
                {
                  href: '/admin/reports',
                  title: <><HomeOutlined style={{ marginRight: 4 }} />Báo cáo toàn trường</>,
                },
                {
                  title: facultyName,
                },
              ]}
            />
          )}

          {/* ── Header ── */}
          <div className="rp-page-header">
            <div className="rp-page-header__left">
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
                {currentAccount.isAdmin && !facultyMode && (
                  <Button
                    type="text"
                    icon={<ArrowLeftOutlined />}
                    size="small"
                    onClick={() => navigate('/admin/reports')}
                    style={{ padding: '0 4px' }}
                  />
                )}
                <h1 className="rp-page-header__title" style={{ margin: 0 }}>
                  Báo cáo tình hình việc làm
                </h1>
              </div>
              <span className="rp-page-header__subtitle">
                {facultyName}
              </span>

              {/* Trạng thái nộp */}
              <div style={{ marginTop: 8, display: 'flex', alignItems: 'center', gap: 10 }}>
                <SubmissionPill status={submissionStatus} />
                {isOwnFaculty && submissionStatus === 'draft' && (
                  <Button size="small" type="primary" onClick={submitOwnReport}>
                    Nộp báo cáo lên trường
                  </Button>
                )}
                {isOwnFaculty && submissionStatus === 'submitted' && (
                  <Button size="small" danger onClick={withdrawOwnReport}>
                    Thu hồi
                  </Button>
                )}
                {isOwnFaculty && submissionStatus === 'returned' && (
                  <Button size="small" type="primary" onClick={submitOwnReport}>
                    Nộp lại lên trường
                  </Button>
                )}
                {submissionStatus === 'approved' && (
                  <span style={{ color: '#52c41a', fontSize: 13 }}>Trường đã duyệt báo cáo</span>
                )}
              </div>
            </div>

            {/* Filter bên phải */}
            <div className="rp-page-header__right">
              {selectedDeadline && (
                <div className="rp-deadline-notice">
                  Hạn nộp: <strong>{formatDeadline(selectedDeadline)}</strong>
                </div>
              )}
              <div className="rp-filter-row">
                <div className="rp-filter-item">
                  <span className="rp-filter-label rp-filter-label--large">Đợt khảo sát</span>
                  <Select
                    value={filters.surveyId || undefined}
                    onChange={(v) => setFilters((f) => ({ ...f, surveyId: v }))}
                    style={{ width: 260 }}
                    size="middle"
                    placeholder="Chọn đợt khảo sát"
                    allowClear
                  >
                    {surveyOptions.map((o) => (
                      <Option key={o.value} value={o.value}>{o.label}</Option>
                    ))}
                  </Select>
                </div>
              </div>
            </div>
          </div>

          {/* ── KPI ── */}
          <KpiGrid items={kpiItems} />

          {/* ── Tables ── */}
          <Spin spinning={loading}>
            <ReportTabs
              majorRows={majorRows}
              graduateRows={graduateRows}
              responseRows={responseRows}
              facultyRows={facultyRows}
              reportMeta={reportMeta}
              orgLine1={ORG_NAME}
              orgLine2={facultyName.toUpperCase()}
              signLabel="TRƯỞNG KHOA"
              onDownload={handleDownload}
              batchId={filters.surveyId}
              showProgress={currentAccount.isAdmin && !facultyMode}
            />
          </Spin>

        </div>
      </Spin>
    </AdminLayout>
  );
}