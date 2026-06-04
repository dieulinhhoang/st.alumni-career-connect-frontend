import { useState, useEffect, useCallback } from 'react';
import { getBatches, deleteBatch, getBatchResponses } from '../api';
import { fetchGraduationStudents } from '../../graduation/api';
import type { SurveyBatch } from '../types';

export interface SurveyBatchWithStats extends SurveyBatch {
  submittedCount: number;
  responseRate: number;
}

export function useBatches() {
  const [batches, setBatches] = useState<SurveyBatchWithStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState<string | null>(null);

  const fetchBatches = useCallback(async (cancelled: { v: boolean }) => {
    setLoading(true);
    setError(null);

    try {
      const list = await getBatches();
      if (cancelled.v) return;

      const [responsesResults, gradResults] = await Promise.all([
        // Gọi getBatchResponses y hệt BatchResults
        Promise.allSettled(list.map(b => getBatchResponses(b.id))),
        Promise.allSettled(
          list.map(b =>
            b.graduationId
              ? fetchGraduationStudents(Number(b.graduationId), 1, 9999)
              : Promise.resolve(null),
          ),
        ),
      ]);

      if (cancelled.v) return;

      const merged: SurveyBatchWithStats[] = list.map((b, i) => {
        const responses = responsesResults[i].status === 'fulfilled'
          ? (responsesResults[i] as PromiseFulfilledResult<any>).value ?? []
          : [];

        const grad = gradResults[i].status === 'fulfilled'
          ? (gradResults[i] as PromiseFulfilledResult<any>).value
          : null;

        // Đếm submitted y hệt BatchResults
        const submittedCount = responses.filter((r: any) => r.status === 'submitted').length;

        // Total từ gradStudents thực tế y hệt BatchResults
        const total = grad?.data?.length || grad?.meta?.total || b.totalStudents || 0;

        const responseRate = total > 0 ? Math.round((submittedCount / total) * 100) : 0;

        return { ...b, totalStudents: total, submittedCount, responseRate };
      });

      setBatches(merged);
    } catch (err) {
      if (!cancelled.v) setError(err instanceof Error ? err.message : 'Failed to load batches');
    } finally {
      if (!cancelled.v) setLoading(false);
    }
  }, []);

  const handleDelete = useCallback(async (id: number) => {
    try {
      await deleteBatch(id);
      setBatches(prev => prev.filter(b => b.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Delete failed');
      throw err;
    }
  }, []);

  useEffect(() => {
    const cancelled = { v: false };
    fetchBatches(cancelled);
    return () => { cancelled.v = true; };
  }, [fetchBatches]);

  const reload = useCallback(() => {
    const cancelled = { v: false };
    fetchBatches(cancelled);
  }, [fetchBatches]);

  return { batches, loading, error, reload, deleteBatch: handleDelete };
}