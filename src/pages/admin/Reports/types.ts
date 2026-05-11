// src/pages/admin/Reports/types.ts

export type RoleScope = 'school' | 'faculty' | 'major';

export type ViewMode =
  | 'overview'
  | 'graduates'
  | 'responses'
  | 'charts'
  | 'submission-progress';

export type SubmissionStatus = 'draft' | 'submitted' | 'returned' | 'approved';

export interface UserProfile {
  role: 'SUPER_ADMIN' | 'SCHOOL_ADMIN' | 'FACULTY_OFFICER' | 'MAJOR_OFFICER';
  scope: RoleScope;
  facultyId?: string;
  facultyName?: string;
  majorId?: string;
  majorName?: string;
}

export interface Option {
  value: string;
  label: string;
}

export interface FilterState {
  surveyId?: string;
  facultyId?: string;
  majorId?: string;
  cohort?: string;
  status?: SubmissionStatus;
}

export interface MajorSummaryRow {
  key: string;
  majorCode: string;
  majorName: string;
  total: number;
  submitted: number;
  approved: number;
  rate: number;
}

export interface GraduateRow {
  key: string;
  studentCode: string;
  fullName: string;
  majorName: string;
  facultyName: string;
  cohort: string;
  status: SubmissionStatus;
  submittedAt?: string;
}

export interface ResponseRow {
  key: string;
  studentCode: string;
  fullName: string;
  employmentStatus: string;
  jobTitle?: string;
  company?: string;
  salary?: string;
  workLocation?: string;
  relevance?: string;
}

export interface FacultySubmissionRow {
  key: string;
  facultyCode: string;
  facultyName: string;
  total: number;
  submitted: number;
  approved: number;
  rate: number;
}

export interface StatCardProps {
  label: string;
  value: string | number;
  sub?: string;
  icon: React.ReactNode;
  accent: string;
  trend?: number;
}

export interface KpiRingProps {
  label: string;
  value: number;
  color: string;
  desc?: string;
}

export interface MiniBarProps {
  value: number;
  max: number;
  color: string;
}
