import api from '../../libs/api';
import type {
  FilterState,
  CurrentUser,
  Stats,
  MajorSummaryRow,
  GraduateRow,
  ResponseRow,
  FacultySubmissionRow,
  ReportMeta,
  FacultyOption,
  MajorOption,
} from './types';

export type ReportApiResponse = {
  currentUser: CurrentUser;
  stats: Stats;
  majorRows: MajorSummaryRow[];
  graduateRows: GraduateRow[];
  responseRows: ResponseRow[];
  facultyRows: FacultySubmissionRow[];
  reportMeta: ReportMeta;
};

export type SurveyOption = {
  value: string;
  label: string;
  deadline?: string | null;
};

/**
 * POST /reports
 * Gửi filters (surveyId, facultyId?, majorId?) + userIndex
 * Nhận về dữ liệu báo cáo đầy đủ
 */
export async function fetchReportData(
  filters: FilterState,
  userIndex: number
): Promise<ReportApiResponse> {
  const res = await api.post('/reports', { filters, userIndex });
  return res.data;
}

/**
 * GET /reports/options
 * Danh sách đợt khảo sát (ended + active) để hiển thị dropdown
 */
export async function fetchSurveyOptions(): Promise<SurveyOption[]> {
  try {
    const res = await api.get('/reports/options');
    const list: Array<{ value: string; label: string; deadline?: string | null }> =
      res.data ?? [];
    return list;
  } catch {
    // Fallback về /statistics/batches nếu endpoint mới chưa deploy
    const res = await api.get('/statistics/batches');
    const batches: Array<{ id: number; title: string; year?: number; graduationPeriod?: string; endDate?: string }> =
      res.data ?? [];
    return batches.map((b) => ({
      value: String(b.id),
      label: b.graduationPeriod
        ? `${b.title} (${b.graduationPeriod})`
        : b.year
        ? `${b.title} (${b.year})`
        : b.title,
      deadline: b.endDate ?? null,
    }));
  }
}

/**
 * GET /statistics/batches
 * Dùng riêng để lấy deadline của batch được chọn
 */
export async function fetchSurveyConfig(): Promise<{ options: SurveyOption[]; deadline: string }> {
  const options = await fetchSurveyOptions();
  const deadline = options[0]?.deadline ?? '';
  return { options, deadline };
}

/**
 * GET /faculty
 * Danh sách khoa để hiển thị filter
 */
export async function fetchFacultyOptions(): Promise<FacultyOption[]> {
  try {
    const res = await api.get('/faculty');
    const list: Array<{ id: number | string; name: string }> = res.data ?? [];
    return list.map((f) => ({ value: String(f.id), label: f.name }));
  } catch {
    return [];
  }
}

/**
 * GET /major
 * Danh sách ngành để hiển thị filter (lọc theo khoa khi cần)
 */
export async function fetchMajorOptions(facultyId?: string): Promise<MajorOption[]> {
  try {
    const params: Record<string, string> = {};
    if (facultyId) params.facultyId = facultyId;
    const res = await api.get('/major', { params });
    const list: Array<{ id: number | string; name: string; facultyId?: number | string }> =
      res.data ?? [];
    return list.map((m) => ({
      value: String(m.id),
      label: m.name,
      facultyId: String(m.facultyId ?? ''),
    }));
  } catch {
    return [];
  }
}