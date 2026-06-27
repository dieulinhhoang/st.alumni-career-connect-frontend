import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { Spin, message } from 'antd';
import AdminLayout from '../../../components/layout/AdminLayout';
import type { FilterState } from '../../../feature/reports/types';
import { useReportData } from '../../../feature/reports/hooks/useReportData';
import { useKpiItems } from '../../../feature/reports/hooks/useKpiItems';
import { useSurveyOptions } from '../../../feature/reports/hooks/useSurveyOptions';
import { exportReportExcel } from '../../../feature/reports/api';
import { ORG_NAME } from '../../../feature/reports/constants';
import { getCurrentUser } from '../../../feature/auth/permission';
import { PageHeader } from './components/PageHeader';
import { KpiGrid } from './components/KpiGrid';
import { ReportTabs } from './components/ReportTabs';
import './styles.css';

export default function ReportsPage() {
  const currentAccount = getCurrentUser();

  const [filters, setFilters] = useState<FilterState>({ surveyId: '' });

  const { options: surveyOptions, defaultSurveyId, deadline, loading: surveyLoading } = useSurveyOptions();

  // Tự động chọn đợt khảo sát mới nhất
  useEffect(() => {
    if (defaultSurveyId && !filters.surveyId) {
      setFilters((f) => ({ ...f, surveyId: defaultSurveyId }));
    }
  }, [defaultSurveyId]);

  const { stats, majorRows, graduateRows, responseRows, facultyRows, reportMeta, loading } =
    useReportData(filters);

  const kpiItems = useKpiItems(true, stats, facultyRows);

  const handleSurveyChange = (v: string) => {
    setFilters((f) => ({ ...f, surveyId: v }));
  };

  const handleDownload = async (mau: 'mau01' | 'mau02' | 'mau03' | 'all') => {
    try {
      await exportReportExcel(mau, filters);
    } catch {
      message.error('Xuất báo cáo Excel thất bại.');
    }
  };

  // Lấy deadline của survey đang chọn
  const selectedDeadline = surveyOptions.find((o) => o.value === filters.surveyId)?.deadline ?? deadline;

  // Cán bộ khoa: vào thẳng báo cáo của khoa mình để rà soát & nộp lên trường
  if (currentAccount.facultyId) {
    return <Navigate to={`/admin/reports/faculty/${currentAccount.facultyId}`} replace />;
  }

  return (
    <AdminLayout>
      <Spin spinning={surveyLoading}>
        <div>
          <PageHeader
            title="Tổng hợp báo cáo cấp trường"
            subtitle="Theo dõi các khoa/ngành nộp báo cáo lên trường"
            surveyId={filters.surveyId}
            surveyOptions={surveyOptions}
            deadline={selectedDeadline}
            onSurveyChange={handleSurveyChange}
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
              orgLine2=""
              signLabel="GIÁM ĐỐC"
              onDownload={handleDownload}
              batchId={filters.surveyId}
            />
          </Spin>
        </div>
      </Spin>
    </AdminLayout>
  );
}
