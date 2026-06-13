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
  /** Backend trả về khi khoa chưa nộp */
  notSubmitted?: boolean;
  submissionStatus?: string;
};

export type SurveyOption = {
  value: string;
  label: string;
  deadline?: string | null;
};

export type SubmissionStatusResponse = {
  status: 'draft' | 'submitted' | 'returned' | 'approved';
  submittedBy: string | null;
  submittedAt: string | null;
  feedback: string | null;
  reviewedBy: string | null;
  reviewedAt: string | null;
};

// ─── Report data ───────────────────────────────────────────────

export async function fetchReportData(
  filters: FilterState,
): Promise<ReportApiResponse> {
  const res = await api.post('/reports', { filters });
  return res.data;
}

// ─── Export Excel ──────────────────────────────────────────────

/** Tải báo cáo Excel theo mẫu (mau01/mau02/mau03/all) từ backend rồi trigger download */
export async function exportReportExcel(
  mau: 'mau01' | 'mau02' | 'mau03' | 'all',
  filters: FilterState,
): Promise<void> {
  const res = await api.get('/reports/export', {
    params: {
      mau,
      surveyId: filters.surveyId || undefined,
      facultyId: filters.facultyId || undefined,
      majorId: filters.majorId || undefined,
    },
    responseType: 'blob',
  });

  // Lấy tên file từ Content-Disposition, fallback tự đặt
  const disposition: string = res.headers?.['content-disposition'] ?? '';
  const match = disposition.match(/filename="?([^";]+)"?/);
  const fileName = match?.[1] ?? `${mau}-${Date.now()}.xlsx`;

  const url = URL.createObjectURL(new Blob([res.data]));
  const a = document.createElement('a');
  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

// ─── Submission status ─────────────────────────────────────────

export async function fetchSubmissionStatus(
  batchId: string,
  facultyId: string,
): Promise<SubmissionStatusResponse> {
  const res = await api.get('/reports/submission-status', {
    params: { batchId, facultyId },
  });
  return res.data;
}

// ─── Khoa: nộp / thu hồi ──────────────────────────────────────

export async function submitReport(batchId: string, facultyId: string) {
  const res = await api.post('/reports/submit', {
    batchId: Number(batchId),
    facultyId: Number(facultyId),
  });
  return res.data;
}

export async function withdrawReport(batchId: string, facultyId: string) {
  const res = await api.post('/reports/withdraw', {
    batchId: Number(batchId),
    facultyId: Number(facultyId),
  });
  return res.data;
}

// ─── Trường: duyệt / trả ──────────────────────────────────────

export async function approveReport(batchId: string, facultyId: string) {
  const res = await api.post('/reports/approve', {
    batchId: Number(batchId),
    facultyId: Number(facultyId),
  });
  return res.data;
}

export async function returnReport(
  batchId: string,
  facultyId: string,
  feedback: string,
) {
  const res = await api.post('/reports/return', {
    batchId: Number(batchId),
    facultyId: Number(facultyId),
    feedback,
  });
  return res.data;
}

// ─── Batch / Faculty / Major options ──────────────────────────

export async function fetchSurveyOptions(): Promise<SurveyOption[]> {
  try {
    const res = await api.get('/reports/options');
    return res.data ?? [];
  } catch {
    const res = await api.get('/statistics/batches');
    const batches: Array<{
      id: number; title: string; year?: number;
      graduationPeriod?: string; endDate?: string;
    }> = res.data ?? [];
    return batches.map((b) => ({
      value: String(b.id),
      label: b.graduationPeriod
        ? `${b.title} (${b.graduationPeriod})`
        : b.year ? `${b.title} (${b.year})` : b.title,
      deadline: b.endDate ?? null,
    }));
  }
}

export async function fetchSurveyConfig(): Promise<{
  options: SurveyOption[];
  deadline: string;
}> {
  const options = await fetchSurveyOptions();
  return { options, deadline: options[0]?.deadline ?? '' };
}

export async function fetchFacultyOptions(): Promise<FacultyOption[]> {
  try {
    const res = await api.get('/faculty', { params: { size: 200, page: 0 } });
    const list: Array<{ id: number | string; name: string }> = Array.isArray(res.data)
      ? res.data
      : res.data?.items ?? [];
    return list.map((f) => ({ value: String(f.id), label: f.name }));
  } catch {
    return [];
  }
}

export async function fetchMajorOptions(facultyId?: string): Promise<MajorOption[]> {
  try {
    const params: Record<string, string> = {};
    if (facultyId) params.facultyId = facultyId;
    const res = await api.get('/major', { params });
    const list: Array<{
      id: number | string; name: string; facultyId?: number | string;
    }> = res.data ?? [];
    return list.map((m) => ({
      value: String(m.id),
      label: m.name,
      facultyId: String(m.facultyId ?? ''),
    }));
  } catch {
    return [];
  }
}