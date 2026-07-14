import { useState, useEffect, useCallback } from 'react';
import { getBatches, deleteBatch, updateBatch, getBatchResponses } from '../api';
import { fetchGraduationStudents } from '../../graduation/api';
import { getEffectiveFacultyId } from '../../auth/permission';
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

      // Phạm vi khoa hiệu lực: cán bộ khoa / admin đóng vai khoa → chỉ tính SV khoa đó
      const facultyScope = getEffectiveFacultyId();

      const merged: SurveyBatchWithStats[] = list.map((b, i) => {
        const responses = responsesResults[i].status === 'fulfilled'
          ? (responsesResults[i] as PromiseFulfilledResult<any>).value ?? []
          : [];

        const grad = gradResults[i].status === 'fulfilled'
          ? (gradResults[i] as PromiseFulfilledResult<any>).value
          : null;

        // SV của đợt; nếu đang ở chế độ khoa → chỉ giữ SV thuộc khoa đó
        const gradAll: any[] = grad?.data ?? [];
        const gradStudents = facultyScope
          ? gradAll.filter((s) => String(s.faculty_id) === String(facultyScope))
          : gradAll;

        // Total: chế độ khoa dựa trên SV khoa; toàn trường dựa trên tổng thực tế
        const total = facultyScope
          ? gradStudents.length
          : (grad?.data?.length || grad?.meta?.total || b.totalStudents || 0);

        // Đếm submitted; chế độ khoa chỉ đếm phản hồi của SV thuộc khoa
        const codes = new Set(gradStudents.map((s) => s.code));
        const submittedCount = responses.filter(
          (r: any) => r.status === 'submitted' && (!facultyScope || codes.has(r.studentId)),
        ).length;

        const responseRate = total > 0 ? Math.round((submittedCount / total) * 100) : 0;

        return { ...b, totalStudents: total, submittedCount, responseRate };
      });

      // Chế độ khoa: ẩn đợt khảo sát không có SV thuộc khoa
      const visible = facultyScope
        ? merged.filter((b) => (b.totalStudents ?? 0) > 0)
        : merged;

      setBatches(visible);
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

  const handleActivate = useCallback(async (id: number) => {
    const updated = await updateBatch(id, { status: 'active' });
    setBatches(prev => prev.map(b => (b.id === id ? { ...b, ...updated } : b)));
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

  return { batches, loading, error, reload, deleteBatch: handleDelete, activateBatch: handleActivate };
}