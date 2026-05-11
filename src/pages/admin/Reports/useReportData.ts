// src/pages/admin/Reports/useReportData.ts
import { useEffect, useMemo, useState } from 'react';
import type {
  FilterState,
  GraduateRow,
  MajorSummaryRow,
  FacultySubmissionRow,
  ResponseRow,
  UserProfile,
} from './types';

export interface ReportStats {
  totalGraduates: number;
  submitted: number;
  approved: number;
  submissionRate: number;
  employed: number;
  employmentRate: number;
  relevantJobRate: number;
  avgSalary: string;
}

export interface ReportData {
  stats: ReportStats;
  majorRows: MajorSummaryRow[];
  graduateRows: GraduateRow[];
  responseRows: ResponseRow[];
  facultyRows: FacultySubmissionRow[];
  loading: boolean;
  error: string | null;
}

const MOCK_USERS: UserProfile[] = [
  { role: 'SUPER_ADMIN', scope: 'school' },
  { role: 'FACULTY_OFFICER', scope: 'faculty', facultyId: 'F01', facultyName: 'Công nghệ thông tin' },
  { role: 'MAJOR_OFFICER', scope: 'major', facultyId: 'F01', majorId: 'M01', majorName: 'Kỹ thuật phần mềm' },
];

export function useReportData(filters: FilterState, userIndex = 0): ReportData & { currentUser: UserProfile } {
  const [loading, setLoading] = useState(false);
  const [error] = useState<string | null>(null);

  const currentUser = MOCK_USERS[userIndex] ?? MOCK_USERS[0];

  const effectiveFilters = useMemo(() => {
    if (currentUser.scope === 'faculty') {
      return { ...filters, facultyId: currentUser.facultyId };
    }
    if (currentUser.scope === 'major') {
      return { ...filters, facultyId: currentUser.facultyId, majorId: currentUser.majorId };
    }
    return filters;
  }, [currentUser, filters]);

  useEffect(() => {
    setLoading(true);
    const t = setTimeout(() => setLoading(false), 400);
    return () => clearTimeout(t);
  }, [effectiveFilters]);

  const stats: ReportStats = useMemo(() => ({
    totalGraduates: 1200,
    submitted: 980,
    approved: 870,
    submissionRate: 81.7,
    employed: 720,
    employmentRate: 82.8,
    relevantJobRate: 74.3,
    avgSalary: '12.4 triệu',
  }), [effectiveFilters]);

  const majorRows: MajorSummaryRow[] = useMemo(() => [
    { key: '1', majorCode: 'KTPM', majorName: 'Kỹ thuật phần mềm', total: 300, submitted: 260, approved: 240, rate: 86.7 },
    { key: '2', majorCode: 'HTTT', majorName: 'Hệ thống thông tin', total: 250, submitted: 200, approved: 180, rate: 80.0 },
    { key: '3', majorCode: 'KHMT', majorName: 'Khoa học máy tính', total: 280, submitted: 240, approved: 210, rate: 85.7 },
    { key: '4', majorCode: 'MMTT', majorName: 'Mạng máy tính & Truyền thông', total: 200, submitted: 150, approved: 130, rate: 75.0 },
    { key: '5', majorCode: 'KTMT', majorName: 'Kỹ thuật máy tính', total: 170, submitted: 130, approved: 110, rate: 76.5 },
  ], [effectiveFilters]);

  const graduateRows: GraduateRow[] = useMemo(() => [
    { key: '1', studentCode: 'SV001', fullName: 'Nguyễn Văn An', majorName: 'KTPM', facultyName: 'CNTT', cohort: '2020', status: 'approved', submittedAt: '2024-03-10' },
    { key: '2', studentCode: 'SV002', fullName: 'Trần Thị Bình', majorName: 'HTTT', facultyName: 'CNTT', cohort: '2020', status: 'submitted', submittedAt: '2024-03-12' },
    { key: '3', studentCode: 'SV003', fullName: 'Lê Văn Cường', majorName: 'KHMT', facultyName: 'CNTT', cohort: '2020', status: 'draft' },
    { key: '4', studentCode: 'SV004', fullName: 'Phạm Thị Dung', majorName: 'MMTT', facultyName: 'CNTT', cohort: '2020', status: 'returned', submittedAt: '2024-03-08' },
    { key: '5', studentCode: 'SV005', fullName: 'Hoàng Văn Em', majorName: 'KTMT', facultyName: 'CNTT', cohort: '2020', status: 'approved', submittedAt: '2024-03-05' },
  ], [effectiveFilters]);

  const responseRows: ResponseRow[] = useMemo(() => [
    { key: '1', studentCode: 'SV001', fullName: 'Nguyễn Văn An', employmentStatus: 'Đang làm việc', jobTitle: 'Frontend Developer', company: 'FPT Software', salary: '15 triệu', workLocation: 'Hà Nội', relevance: 'Đúng ngành' },
    { key: '2', studentCode: 'SV002', fullName: 'Trần Thị Bình', employmentStatus: 'Đang làm việc', jobTitle: 'Backend Developer', company: 'VNG', salary: '18 triệu', workLocation: 'TP HCM', relevance: 'Đúng ngành' },
    { key: '3', studentCode: 'SV005', fullName: 'Hoàng Văn Em', employmentStatus: 'Học tiếp', jobTitle: undefined, company: undefined, salary: undefined, workLocation: 'Hà Nội', relevance: undefined },
  ], [effectiveFilters]);

  const facultyRows: FacultySubmissionRow[] = useMemo(() => [
    { key: '1', facultyCode: 'CNTT', facultyName: 'Công nghệ thông tin', total: 600, submitted: 510, approved: 460, rate: 85.0 },
    { key: '2', facultyCode: 'DTVT', facultyName: 'Điện tử viễn thông', total: 350, submitted: 280, approved: 240, rate: 80.0 },
    { key: '3', facultyCode: 'QTKD', facultyName: 'Quản trị kinh doanh', total: 250, submitted: 190, approved: 170, rate: 76.0 },
  ], [effectiveFilters]);

  return {
    currentUser,
    stats,
    majorRows,
    graduateRows,
    responseRows,
    facultyRows,
    loading,
    error,
  };
}
