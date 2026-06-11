import React, { useState, useEffect } from 'react';
import { Spin, Select } from 'antd';
import AdminLayout from '../../../components/layout/AdminLayout';
import type { FilterState, SubmissionStatus } from '../../../feature/reports/types';
import { useReportData } from '../../../feature/reports/hooks/useReportData';
import { useKpiItems } from '../../../feature/reports/hooks/useKpiItems';
import { useSurveyOptions } from '../../../feature/reports/hooks/useSurveyOptions';
import { fetchFacultyOptions, fetchMajorOptions } from '../../../feature/reports/api';
import type { FacultyOption, MajorOption } from '../../../feature/reports/types';
import { ORG_NAME } from '../../../feature/reports/constants';
import { PageHeader } from './components/PageHeader';
import { KpiGrid } from './components/KpiGrid';
import { ReportTabs } from './components/ReportTabs';
import './styles.css';

const { Option } = Select;

export default function ReportsPage() {
  const [userIndex, setUserIndex] = useState(0);
  const [filters, setFilters] = useState<FilterState>({ surveyId: '' });
  const [submissionStatus, setSubmissionStatus] = useState<SubmissionStatus>('draft');

  // Dropdown khoa / ngành
  const [facultyOptions, setFacultyOptions] = useState<FacultyOption[]>([]);
  const [majorOptions, setMajorOptions] = useState<MajorOption[]>([]);

  const { options: surveyOptions, defaultSurveyId, deadline, loading: surveyLoading } = useSurveyOptions();

  // Tự động chọn đợt khảo sát mới nhất
  useEffect(() => {
    if (defaultSurveyId && !filters.surveyId) {
      setFilters((f) => ({ ...f, surveyId: defaultSurveyId }));
    }
  }, [defaultSurveyId]);

  // Load danh sách khoa
  useEffect(() => {
    fetchFacultyOptions().then(setFacultyOptions).catch(() => setFacultyOptions([]));
  }, []);

  // Load ngành theo khoa được chọn
  useEffect(() => {
    fetchMajorOptions(filters.facultyId).then(setMajorOptions).catch(() => setMajorOptions([]));
  }, [filters.facultyId]);

  const { currentUser, stats, majorRows, graduateRows, responseRows, facultyRows, reportMeta, loading } =
    useReportData(filters, userIndex);

  const isSchoolView  = currentUser.scope === 'school';
  const isFacultyLike = currentUser.scope === 'faculty' || currentUser.scope === 'major';
  const kpiItems      = useKpiItems(isSchoolView, stats, facultyRows);

  const scopeLabel =
    currentUser.scope === 'school'
      ? 'Toàn trường'
      : currentUser.scope === 'faculty'
      ? (currentUser.facultyName ?? '')
      : (currentUser.majorName ?? '');

  const orgLine2 = !isSchoolView
    ? (currentUser.facultyName ?? currentUser.majorName ?? '').toUpperCase()
    : '';
  const signLabel = isSchoolView ? 'GIÁM ĐỐC' : 'TRƯỞNG KHOA';

  const handleSurveyChange = (v: string) => {
    setFilters((f) => ({ ...f, surveyId: v }));
  };

  const handleFacultyChange = (v: string) => {
    // Reset ngành khi đổi khoa
    setFilters((f) => ({ ...f, facultyId: v || undefined, majorId: undefined }));
  };

  const handleMajorChange = (v: string) => {
    setFilters((f) => ({ ...f, majorId: v || undefined }));
  };

  const handleDownload = (_mau: 'mau01' | 'mau02' | 'mau03') => {
    // console.log('Download', mau, filters);
    // TODO: call real export API
  };

  // Lấy deadline của survey đang chọn
  const selectedDeadline = surveyOptions.find((o) => o.value === filters.surveyId)?.deadline ?? deadline;

  return (
    <AdminLayout>
      <Spin spinning={surveyLoading}>
        <div>
          <PageHeader
            title={isSchoolView ? 'Tổng hợp báo cáo cấp trường' : 'Báo cáo tình hình việc làm sinh viên'}
            subtitle={
              isSchoolView
                ? 'Theo dõi các khoa/ngành nộp báo cáo lên trường'
                : 'Rà soát dữ liệu và nộp báo cáo lên trường'
            }
            scopeLabel={scopeLabel}
            surveyId={filters.surveyId}
            surveyOptions={surveyOptions}
            deadline={selectedDeadline}
            userIndex={userIndex}
            scope={currentUser.scope}
            submissionStatus={submissionStatus}
            onSurveyChange={handleSurveyChange}
            onUserChange={setUserIndex}
            onSubmit={() => setSubmissionStatus('submitted')}
            onWithdraw={() => setSubmissionStatus('draft')}
            // Thêm filter khoa / ngành
            facultyOptions={facultyOptions}
            majorOptions={majorOptions.filter(
              (m) => !filters.facultyId || m.facultyId === filters.facultyId
            )}
            facultyId={filters.facultyId ?? ''}
            majorId={filters.majorId ?? ''}
            onFacultyChange={handleFacultyChange}
            onMajorChange={handleMajorChange}
          />

          <KpiGrid items={kpiItems} />

          <Spin spinning={loading}>
            <ReportTabs
              majorRows={majorRows}
              graduateRows={graduateRows}
              responseRows={responseRows}
              facultyRows={facultyRows}
              reportMeta={reportMeta}
              orgLine1={ORG_NAME}
              orgLine2={orgLine2}
              signLabel={signLabel}
              onDownload={handleDownload}
            />
          </Spin>
        </div>
      </Spin>
    </AdminLayout>
  );
}