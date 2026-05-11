import { useState, useEffect, useCallback } from 'react';
import type { ReportData, ReportSummary } from './ReportPage';

// ==================== TYPES ====================

export interface UseReportApiOptions {
  initialSurveyId?: number;
  endpoint?: string;
  enabled?: boolean;
}

export interface UseReportApiReturn {
  data: ReportData | null;
  summary: ReportSummary | null;
  isLoading: boolean;
  error: string | null;
  surveyId: number;
  setSurveyId: (id: number) => void;
  refetch: () => void;
}

// ==================== HOOK ====================

export function useReportApi(options: UseReportApiOptions = {}): UseReportApiReturn {
  const {
    initialSurveyId = 1,
    endpoint = '/api/reports',
    enabled = true,
  } = options;

  const [surveyId, setSurveyId] = useState(initialSurveyId);
  const [data, setData] = useState<ReportData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [refetchFlag, setRefetchFlag] = useState(0);

  const summary: ReportSummary | null = data
    ? data.mau_01.tong_hop
    : null;

  const fetchData = useCallback(async () => {
    if (!enabled) return;
    setIsLoading(true);
    setError(null);
    try {
      const url = `${endpoint}?survey_id=${surveyId}`;
      const res = await fetch(url);
      if (!res.ok) {
        throw new Error(`HTTP ${res.status}: ${res.statusText}`);
      }
      const json: ReportData = await res.json();
      setData(json);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Unknown error';
      setError(msg);
      setData(null);
    } finally {
      setIsLoading(false);
    }
  }, [surveyId, endpoint, enabled, refetchFlag]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const refetch = useCallback(() => {
    setRefetchFlag((f) => f + 1);
  }, []);

  return {
    data,
    summary,
    isLoading,
    error,
    surveyId,
    setSurveyId,
    refetch,
  };
}

export default useReportApi;
