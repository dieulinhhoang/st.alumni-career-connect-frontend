import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Spin, Button, Select, Breadcrumb } from 'antd';
import { ArrowLeftOutlined, HomeOutlined } from '@ant-design/icons';
import AdminLayout from '../../../../components/layout/AdminLayout';
import type { FilterState, SubmissionStatus } from '../../../../feature/reports/types';
import { useReportData } from '../../../../feature/reports/hooks/useReportData';
import { useKpiItems } from '../../../../feature/reports/hooks/useKpiItems';
import { useSurveyOptions } from '../../../../feature/reports/hooks/useSurveyOptions';
import { fetchFacultyOptions } from '../../../../feature/reports/api';
import type { FacultyOption } from '../../../../feature/reports/types';
import { ORG_NAME } from '../../../../feature/reports/constants';
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
  const { facultyId } = useParams<{ facultyId: string }>();
  const navigate = useNavigate();

  const [filters, setFilters] = useState<FilterState>({
    surveyId: '',
    facultyId: facultyId,
  });
  const [submissionStatus, setSubmissionStatus] = useState<SubmissionStatus>('draft');
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
    useReportData(filters, 0);

  const kpiItems = useKpiItems(false, stats, facultyRows);

  const facultyName =
    facultyOptions.find((f) => f.value === facultyId)?.label ??
    currentUser.facultyName ??
    `Khoa ${facultyId}`;

  const selectedDeadline = surveyOptions.find((o) => o.value === filters.surveyId)?.deadline ?? deadline;

  const handleDownload = (mau: 'mau01' | 'mau02' | 'mau03') => {
    console.log('Download', mau, filters);
    // TODO: call export API
  };

  return (
    <AdminLayout>
      <Spin spinning={surveyLoading}>
        <div style={{ padding: '0 0 32px' }}>

          {/* ── Breadcrumb ── */}
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

          {/* ── Header ── */}
          <div className="rp-page-header">
            <div className="rp-page-header__left">
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
                <Button
                  type="text"
                  icon={<ArrowLeftOutlined />}
                  size="small"
                  onClick={() => navigate('/admin/reports')}
                  style={{ padding: '0 4px' }}
                />
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
                {submissionStatus === 'draft' && (
                  <Button
                    size="small"
                    type="primary"
                    onClick={() => setSubmissionStatus('submitted')}
                  >
                    Nộp báo cáo lên trường
                  </Button>
                )}
                {submissionStatus === 'submitted' && (
                  <Button size="small" danger onClick={() => setSubmissionStatus('draft')}>
                    Thu hồi
                  </Button>
                )}
                {submissionStatus === 'returned' && (
                  <Button size="small" type="primary" onClick={() => setSubmissionStatus('submitted')}>
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
            />
          </Spin>

        </div>
      </Spin>
    </AdminLayout>
  );
}