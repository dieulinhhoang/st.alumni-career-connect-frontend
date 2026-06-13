import { useEffect, useState } from 'react';
import type {
  FilterState,
  GraduateRow,
  MajorSummaryRow,
  FacultySubmissionRow,
  ResponseRow,
  CurrentUser,
  Stats,
  ReportMeta,
} from '../types';
import type { ReportApiResponse } from '../api';
import { fetchReportData } from '../api';

type ReportDataState = {
  currentUser: CurrentUser;
  stats: Stats;
  majorRows: MajorSummaryRow[];
  graduateRows: GraduateRow[];
  responseRows: ResponseRow[];
  facultyRows: FacultySubmissionRow[];
  reportMeta: ReportMeta | null;
  loading: boolean;
};

const DEFAULT_STATE: ReportDataState = {
  currentUser: {
    id: '',
    name: '',
    scope: 'school',
    isAdmin: false,
    facultyId: null,
    facultyName: null,
    majorName: null,
  },
  stats: {
    totalGraduates: 0,
    submitted: 0,
    submissionRate: 0,
    employed: 0,
    employmentRate: 0,
    relevantJobRate: 0,
    avgSalary: '0 triệu',
  },
  majorRows: [],
  graduateRows: [],
  responseRows: [],
  facultyRows: [],
  reportMeta: null,
  loading: false,
};

export function useReportData(
  filters: FilterState,
): ReportDataState {
  const [state, setState] = useState<ReportDataState>(DEFAULT_STATE);

  useEffect(() => {
    // Không gọi API nếu chưa có surveyId
    if (!filters.surveyId) {
      setState({ ...DEFAULT_STATE });
      return;
    }

    let cancelled = false;
    setState((prev) => ({ ...prev, loading: true }));

    fetchReportData(filters)
      .then((res: ReportApiResponse) => {
        if (cancelled) return;
        setState({
          currentUser: res.currentUser,
          stats: res.stats,
          majorRows: res.majorRows,
          graduateRows: res.graduateRows,
          responseRows: res.responseRows,
          facultyRows: res.facultyRows,
          reportMeta: res.reportMeta,
          loading: false,
        });
      })
      .catch((err) => {
        console.error('[useReportData] fetch failed:', err);
        if (cancelled) return;
        setState((prev) => ({ ...prev, loading: false }));
      });

    return () => { cancelled = true; };
  }, [filters.surveyId, filters.facultyId, filters.majorId]);

  return state;
}