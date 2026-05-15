import React, { useState } from 'react';
import { Spin } from 'antd';
import AdminLayout from '../../../components/layout/AdminLayout';
import type { FilterState, SubmissionStatus, UserScope } from '../../../feature/reports/types';
import { useReportData } from '../../../feature/reports/hooks/useReportData';
import { useKpiItems } from '../../../feat
import { PageHeader } from './components/PageHeader';
import { KpiGrid } from './components/KpiGrid';
import { ReportTabs } from './components/ReportTabs';
import './styles.css';


  const [userIndex, setUserIndex] = useState(0);
  const [filters, setFilters] = useState<FilterState>({ surveyId: '2026-1' });
  const [submissionStatus, setSubmissionStatus] = useState<SubmissionStatus>('draft');

  const {
    currentUser,
    stats,
    majorRows,
    graduateRows,
    responseRows,
    facultyRows,
    reportMeta,
    loading,
  } = useReportData(filters, userIndex);

  const isSchoolView = currentUser.scope === 'school';
  const isFacultyLike = currentUser.scope === 'faculty' || currentUser.scope === 'major';
  const kpiItems = useKpiItems(isSchoolView, stats, facultyRows);

  const scopeLabel =
    currentUser.scope === 'school'
      ? 'Toàn trường'
      : currentUser.scope === 'faculty'
        ? currentUser.facultyName ?? ''
        : currentUser.majorName ?? '';

  const orgLine1 = ORG_NAME;
  const orgLine2 = !isSchoolView
    ? (currentUser.facultyName ?? currentUser.majorName ?? '').toUpperCase()
    : '';
  const signLabel = isSchoolView ? 'GIÁM ĐỐC' : 'TRƯỞNG KHOA';

  const scope: UserScope = currentUser.scope;
  const scopes = ['school', 'faculty', 'major'] as const;

  const handleDownload = (mau: 'mau01' | 'mau02' | 'mau03') => {
    console.log('Download', mau, filters.surveyId, scope);
  };

  return (
    <AdminLayout>
      {loading ? (
        <div className='flex justify-center items-center min-h-[400px]'>
          <Spin size='large' />
        </div>
      ) : (
        <div className='rp-page'>
          <PageHeader
            scope={scope}
            scopes={scopes}
            onScopeChange={(value) => setUserIndex(scopes.indexOf(value))}
            submissionStatus={submissionStatus}
            onSubmit={() => setSubmissionStatus('submitted')}
            onWithdraw={() => setSubmissionStatus('draft')}
            onSurveyChange={(v) => setFilters((f) => ({ ...f, surveyId: v }))}
            onUserChange={setUserIndex}
          />

          <KpiGrid kpiItems={kpiItems} />

          <ReportTabs
            stats={stats}
            majorRows={majorRows}
            graduateRows={graduateRows}
            responseRows={responseRows}
            facultyRows={facultyRows}
            reportMeta={reportMeta}
            submissionStatus={submissionStatus}
            scopeLabel={scopeLabel}
            orgLine1={orgLine1}
            orgLine2={orgLine2}
            signLabel={signLabel}
            onDownload={handleDownload}
          />
        </div>
      )}
    </AdminLayout>
  );
}
