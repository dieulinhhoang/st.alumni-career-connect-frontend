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
import { KpiItem } from '../../../pages/admin/Reports/components/KpiGrid';

// ── Pastel graduation-style palette ──────────────────────────────────────────
// Each card: softly tinted background + matching accent text
const SCHOOL_PALETTE = [
  { color: '#1d6cc6', bg: '#deeeff' },   // sky-blue  – tổng khoa
  { color: '#0e7f5a', bg: '#d4f5e4' },   // sage-green – đã nộp
  { color: '#b45309', bg: '#fef3c7' },   // amber     – cần bổ sung
  { color: '#6d3ea8', bg: '#ede9fe' },   // lavender  – đã duyệt
];

const FACULTY_PALETTE = [
  { color: '#1d6cc6', bg: '#deeeff' },   // sky-blue  – tổng SV
  { color: '#0e7f5a', bg: '#d4f5e4' },   // sage-green – tỷ lệ phản hồi
  { color: '#be4b60', bg: '#fde8ec' },   // rose      – tỷ lệ việc làm
  { color: '#6d3ea8', bg: '#ede9fe' },   // lavender  – đúng ngành
];
// ─────────────────────────────────────────────────────────────────────────────

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
    const p = SCHOOL_PALETTE;

    return [
      {
        icon: <CheckCircleOutlined />,
        ...p[0],
        label: 'Tổng số khoa/ngành',
        value: String(totalFaculty),
        sub: 'Khoa/ngành trong trường',
      },
      {
        icon: <SendOutlined />,
        ...p[1],
        label: 'Đã nộp báo cáo',
        value: String(submitted),
        sub: 'Khoa đã nộp báo cáo',
      },
      {
        icon: <ExclamationCircleOutlined />,
        ...p[2],
        label: 'Cần bổ sung',
        value: String(returned),
        sub: 'Khoa cần bổ sung',
      },
      {
        icon: <AuditOutlined />,
        ...p[3],
        label: 'Đã được duyệt',
        value: String(approved),
        sub: 'Khoa đã được duyệt',
      },
    ];
  }

  const p = FACULTY_PALETTE;
  return [
    {
      icon: <TeamOutlined />,
      ...p[0],
      label: 'Tổng số sinh viên tốt nghiệp',
      value: stats.totalGraduates.toLocaleString('vi-VN'),
      sub: 'Khóa hiện tại',
    },
    {
      icon: <SendOutlined />,
      ...p[1],
      label: 'Tỷ lệ phản hồi',
      value: `${stats.submissionRate}%`,
      sub: `${stats.submitted}/${stats.totalGraduates} sinh viên`,
    },
    {
      icon: <TrophyOutlined />,
      ...p[2],
      label: 'Tỷ lệ có việc làm',
      value: `${stats.employmentRate}%`,
      sub: `${stats.employed} sinh viên`,
    },
    {
      icon: <PieChartOutlined />,
      ...p[3],
      label: 'Làm đúng/ngành liên quan',
      value: `${stats.relevantJobRate}%`,
      sub: `TB lương: ${stats.avgSalary}`,
    },
  ];
}
