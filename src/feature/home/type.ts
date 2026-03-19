// ─── Employment / Stats ───────────────────────────────────────────────────────

export type EmploymentStatus =
  | "employed_relevant"
  | "employed_irrelevant"
  | "seeking"
  | "postgrad"
  | "self_employed"
  | "other";

export interface EmploymentRate {
  major: string;
  majorCode: string;
  employmentRate: number;       // 0–100
  avgSalaryMillionVND: number;
  respondents: number;
}

export interface SurveyStats {
  totalRespondents: number;
  overallEmploymentRate: number;
  avgSalaryMillionVND: number;
  byMajor: EmploymentRate[];
  byYear: { year: number; employmentRate: number }[];
  statusDistribution: Record<EmploymentStatus, number>;
}

// ─── Enterprise / Partner ────────────────────────────────────────────────────

export interface Enterprise {
  id: string;
  name: string;
  logo: string;
  industry: string;
  website?: string;
  openPositions: number;
  verified: boolean;
}

export interface JobPosting {
  id: string;
  enterpriseId: string;
  enterpriseName: string;
  title: string;
  location: string;
  salaryRange?: string;
  tags: string[];
  postedAt: string;
  deadline?: string;
}

// ─── Alumni / User ───────────────────────────────────────────────────────────

export interface AlumniProfile {
  id: string;
  studentCode: string;
  fullName: string;
  major: string;
  graduationYear: number;
  currentPosition?: string;
  currentCompany?: string;
  email?: string;
  linkedin?: string;
}

// ─── API Generics ─────────────────────────────────────────────────────────────

export interface ApiResponse<T> {
  data: T;
  message: string;
  success: boolean;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  total: number;
  page: number;
  pageSize: number;
}

export type ApiStatus = "idle" | "loading" | "success" | "error";

export interface UseQueryState<T> {
  data: T | null;
  status: ApiStatus;
  error: string | null;
}