import React from 'react';
import {
  TeamOutlined,
  SendOutlined,
  TrophyOutlined,
  PieChartOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  AuditOutlined,
} from '@ant-design/icons';
import type { Stats, FacultySubmissionRow } from '../types';
import { KpiItem } from '../../../pages/system/Reports/components/KpiGrid';
 
export function useKpiItems(
  isSchoolView: boolean,
  stats: Stats,
  facultyRows: FacultySubmissionRow[],
): KpiItem[] {
  if (isSchoolView) {
    const totalFaculty = facultyRows.length;
    const submitted    = facultyRows.filter((r) => r.status === 'submitted').length;
    const returned     = facultyRows.filter((r) => r.status === 'returned').length;
    const approved     = facultyRows.filter((r) => r.status === 'approved').length;

    return [
      {
        icon: <CheckCircleOutlined />,
        color: '#1677ff', bg: '#e6f4ff',
        label: 'Tổng số khoa/ngành',
        value: String(totalFaculty),
        sub: 'Khoa/ngành trong trường',
      },
      {
        icon: <SendOutlined />,
        color: '#09d488', bg: '#ccfbf1',
        label: 'Đã nộp báo cáo',
        value: String(submitted),
        sub: 'Khoa đã nộp báo cáo',
      },
      {
        icon: <ExclamationCircleOutlined />,
        color: '#faad14', bg: '#feefe4',
        label: 'Cần bổ sung',
        value: String(returned),
        sub: 'Khoa cần bổ sung',
      },
      {
        icon: <AuditOutlined />,
        color: '#52c41a', bg: '#f6ffed',
        label: 'Đã được duyệt',
        value: String(approved),
        sub: 'Khoa đã được duyệt',
      },
    ];
  }

  return [
    {
      icon: <TeamOutlined />,
      color: '#1677ff', bg: '#e6f4ff',
      label: 'Tổng số sinh viên tốt nghiệp',
      value: stats.totalGraduates.toLocaleString('vi-VN'),
      sub: 'Khóa hiện tại',
    },
    {
      icon: <SendOutlined />,
      color: '#09d488', bg: '#ccfbf1',
      label: 'Tỷ lệ phản hồi',
      value: `${stats.submissionRate}%`,
      sub: `${stats.submitted}/${stats.totalGraduates} sinh viên`,
    },
    {
      icon: <TrophyOutlined />,
      color: '#d9706e', bg: '#fff3cf',
      label: 'Tỷ lệ có việc làm',
      value: `${stats.employmentRate}%`,
      sub: `${stats.employed} sinh viên`,
    },
    {
      icon: <PieChartOutlined />,
      color: '#2563eb', bg: '#dbeafe',
      label: 'Làm đúng/ngành liên quan',
      value: `${stats.relevantJobRate}%`,
      sub: `TB lương: ${stats.avgSalary}`,
    },
  ];
}
