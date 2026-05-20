import React, { useState } from 'react';
import { Spin } from 'antd';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '../../../components/layout/AdminLayout';
import type { FilterState, SubmissionStatus } from '../../../feature/reports/types';
import { useReportData } from '../../../feature/reports/hooks/useReportData';
import { useKpiItems } from '../../../feature/reports/hooks/useKpiItems';
import { ORG_NAME } from '../../../feature/reports/constants';
import { PageHeader } from './components/PageHeader';
import { KpiGrid } from './components/KpiGrid';
import { ReportTabs } from './components/ReportTabs';
import './styles.css';

export default function ReportsPage() {
  const navigate = useNavigate();
  const [userIndex, setUserIndex] = useState(0);
  const [filters, setFilters] = useState<FilterState>({ surveyId: '2026-1' });
  const [submissionStatus, setSubmissionStatus] = useState<SubmissionStatus>('draft');

  const { currentUser, stats, majorRows, graduateRows, responseRows, facultyRows, reportMeta, loading } =
    useReportData(filters, userIndex);

  const isSchoolView  = currentUser.scope === 'school';
  const kpiItems      = useKpiItems(isSchoolView, stats, facultyRows);

  const scopeLabel =
    currentUser.scope === 'school'
      ? 'Toàn trường'
      : currentUser.scope === 'faculty'
      ? (currentUser.facultyName ?? '')
      : (currentUser.majorName ?? '');

  const orgLine1 = ORG_NAME;
  const orgLine2 = !isSchoolView
    ? (currentUser.facultyName ?? currentUser.majorName ?? '').toUpperCase()
    : '';
  const signLabel = isSchoolView ? 'GIÁM ĐỐC' : 'TRƯỞNG KHOA';

  const handleDownload = (mau: 'mau01' | 'mau02' | 'mau03') => {
    console.log('Download', mau, filters.surveyId, currentUser.scope);
    // TODO: call real API
  };

  /**
   * When admin clicks "Xem" on a faculty row, navigate to the faculty-scoped
   * reports view.  We pass facultyCode via search params so the page can
   * pre-select the right user/scope.
   */
  const handleViewFaculty = (facultyCode: string) => {
    navigate(`/admin/reports?scope=faculty&facultyCode=${encodeURIComponent(facultyCode)}`);
  };

  return (
    <AdminLayout>
      <div className="rp-page">
        <PageHeader
          title={isSchoolView ? 'Tổng hợp báo cáo cấp trường' : 'Báo cáo tình hình việc làm sinh viên'}
          subtitle={
            isSchoolView
              ? 'Theo dõi các khoa/ngành nộp báo cáo lên trường'
              : 'Rà soát dữ liệu và nộp báo cáo lên trường'
          }
          scopeLabel={scopeLabel}
          surveyId={filters.surveyId}
          userIndex={userIndex}
          scope={currentUser.scope}
          submissionStatus={submissionStatus}
          onSurveyChange={(v) => setFilters((f) => ({ ...f, surveyId: v }))}
          onUserChange={setUserIndex}
          onSubmit={() => setSubmissionStatus('submitted')}
          onWithdraw={() => setSubmissionStatus('draft')}
        />

        <KpiGrid items={kpiItems} />

        <Spin spinning={loading}>
          <ReportTabs
            majorRows={majorRows}
            graduateRows={graduateRows}
            responseRows={responseRows}
            facultyRows={facultyRows}
            reportMeta={reportMeta}
            orgLine1={orgLine1}
            orgLine2={orgLine2}
            signLabel={signLabel}
            onDownload={handleDownload}
            onViewFaculty={handleViewFaculty}
          />
        </Spin>
      </div>
    </AdminLayout>
  );
}
