import { useState, useEffect } from "react";
import { fetchGraduations, fetchGraduationStudents } from "../api";
import type { Graduation, GraduationStudent, PaginationMeta } from "../type";

// useGraduations
interface GraduationsState {
  data: Graduation[];
  meta: PaginationMeta;
  loading: boolean;
  error: string | null;
}

export function useGraduations(page = 1) {
  const [state, setState] = useState<GraduationsState>({
    data: [],
    meta: { total: 0, per_page: 10, current_page: 1, last_page: 1 },
    loading: true,
    error: null,
  });

  useEffect(() => {
    let cancelled = false;
    setState(s => ({ ...s, loading: true, error: null }));

    fetchGraduations(page)
      .then(res => {
        if (!cancelled) setState({ data: res.data, meta: res.meta, loading: false, error: null });
      })
      .catch((err: Error) => {
        if (!cancelled) setState(s => ({ ...s, loading: false, error: err.message }));
      });

    return () => { cancelled = true; };
  }, [page]);

  return state;
}

//  useGraduationStudents 
interface GraduationStudentsState {
  data: GraduationStudent[];
  meta: PaginationMeta;
  loading: boolean;
  error: string | null;
}

export function useGraduationStudents(graduationId: number, page = 1) {
  const [state, setState] = useState<GraduationStudentsState>({
    data: [],
    meta: { total: 0, per_page: 10, current_page: 1, last_page: 1 },
    loading: true,
    error: null,
  });

  useEffect(() => {
    if (!graduationId) return;
    let cancelled = false;
    setState(s => ({ ...s, loading: true, error: null }));

    fetchGraduationStudents(graduationId, page)
      .then(res => {
        if (!cancelled) setState({ data: res.data, meta: res.meta, loading: false, error: null });
      })
      .catch((err: Error) => {
        if (!cancelled) setState(s => ({ ...s, loading: false, error: err.message }));
      });

    return () => { cancelled = true; };
  }, [graduationId, page]);

  return state;
}