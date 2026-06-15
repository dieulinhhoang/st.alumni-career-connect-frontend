import { useState, useEffect, useCallback } from "react";
import { fetchGraduations, fetchGraduationStudents } from "../api";
import type { Graduation, GraduationStudent, PaginationMeta } from "../type";

// useGraduations
interface GraduationsState {
  data: Graduation[];
  meta: PaginationMeta;
  loading: boolean;
  error: string | null;
}

export function useGraduations(page = 1, pageSize = 10) {
  const [state, setState] = useState<GraduationsState>({
    data: [],
    meta: { total: 0, per_page: pageSize, current_page: 1, last_page: 1 },
    loading: true,
    error: null,
  });

  const load = useCallback(() => {
    let cancelled = false;
    setState(s => ({ ...s, loading: true, error: null }));

    fetchGraduations(page, pageSize)
      .then(res => {
        if (!cancelled) setState({ data: res.data, meta: res.meta, loading: false, error: null });
      })
      .catch((err: Error) => {
        if (!cancelled) setState(s => ({ ...s, loading: false, error: err.message }));
      });

    return () => { cancelled = true; };
  }, [page, pageSize]);

  useEffect(() => {
    const cancel = load();
    return cancel;
  }, [load]);

  return { ...state, reload: load };
}

//  useGraduationStudents
interface GraduationStudentsState {
  data: GraduationStudent[];
  meta: PaginationMeta;
  loading: boolean;
  error: string | null;
}

interface GraduationStudentsFilters {
  faculty_id?: string;
  major_id?: string;
}

/**
 * Nhận đủ 3 params: graduationId, page, pageSize
 * Thêm filters (faculty_id, major_id) để lọc server-side.
 */
export function useGraduationStudents(
  graduationId: number,
  page = 1,
  pageSize = 10,
  filters?: GraduationStudentsFilters,
) {
  const [state, setState] = useState<GraduationStudentsState>({
    data: [],
    meta: { total: 0, per_page: pageSize, current_page: 1, last_page: 1 },
    loading: true,
    error: null,
  });

  useEffect(() => {
    if (!graduationId) return;
    let cancelled = false;
    setState(s => ({ ...s, loading: true, error: null }));

    fetchGraduationStudents(graduationId, page, pageSize, filters)
      .then(res => {
        if (!cancelled) setState({ data: res.data, meta: res.meta, loading: false, error: null });
      })
      .catch((err: Error) => {
        if (!cancelled) setState(s => ({ ...s, loading: false, error: err.message }));
      });

    return () => { cancelled = true; };
  }, [graduationId, page, pageSize, filters?.faculty_id, filters?.major_id]);

  return state;
}