import { useState, useEffect, useCallback } from "react";
import { fetchFaculties, fetchAllFaculties, fetchFacultyById } from "../api";
import type { Faculty, FacultyListResponse, FacultyQuery } from "../types";

// ─────────────────────────────────────────────────────────────────────────────
// useFacultyList — danh sách có phân trang + tìm kiếm
// Dùng cho trang quản trị, bảng danh sách khoa
// ─────────────────────────────────────────────────────────────────────────────
interface FacultyListState {
  data: FacultyListResponse | null;
  loading: boolean;
  error: string | null;
}

export function useFacultyList(query: FacultyQuery = {}) {
  const [state, setState] = useState<FacultyListState>({
    data: null,
    loading: true,
    error: null,
  });

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const queryKey = JSON.stringify(query);

  const load = useCallback(() => {
    setState((s) => ({ ...s, loading: true, error: null }));
    fetchFaculties(JSON.parse(queryKey) as FacultyQuery)
      .then((data) => setState({ data, loading: false, error: null }))
      .catch(() =>
        setState((s) => ({
          ...s,
          loading: false,
          error: "Không thể tải danh sách khoa.",
        }))
      );
  }, [queryKey]);

  useEffect(() => {
    load();
  }, [load]);

  return { ...state, reload: load };
}

// ─────────────────────────────────────────────────────────────────────────────
// useFaculties — lấy toàn bộ khoa, dùng cho Select / dropdown
// ─────────────────────────────────────────────────────────────────────────────
export function useFaculties() {
  const [faculties, setFaculties] = useState<Faculty[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    fetchAllFaculties()
      .then((data) => {
        if (!cancelled) {
          setFaculties(data);
          setLoading(false);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setError("Không thể tải danh sách khoa.");
          setLoading(false);
        }
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return { faculties, loading, error };
}

// ─────────────────────────────────────────────────────────────────────────────
// useFacultyDetail — chi tiết 1 khoa theo ID
// ─────────────────────────────────────────────────────────────────────────────
export function useFacultyDetail(id: number | null) {
  const [faculty, setFaculty] = useState<Faculty | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    let cancelled = false;
    setLoading(true);
    setError(null);
    fetchFacultyById(id)
      .then((data) => {
        if (!cancelled) {
          setFaculty(data);
          setLoading(false);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setError("Không tìm thấy khoa.");
          setLoading(false);
        }
      });
    return () => {
      cancelled = true;
    };
  }, [id]);

  return { faculty, loading, error };
}
