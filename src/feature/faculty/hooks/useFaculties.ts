import { useState, useEffect } from "react";
import { fetchFaculties } from "../api";
import type { Faculty } from "../types";

interface State {
  data: Faculty[];
  loading: boolean;
  error: string | null;
}

export function useFaculties() {
  const [state, setState] = useState<State>({ data: [], loading: true, error: null });

  useEffect(() => {
    let cancelled = false;
    setState(s => ({ ...s, loading: true, error: null }));

    fetchFaculties()
      .then(data => { if (!cancelled) setState({ data, loading: false, error: null }); })
      .catch(() => { if (!cancelled) setState(s => ({ ...s, loading: false, error: "Không thể tải danh sách khoa." })); });

    return () => { cancelled = true; };
  }, []);

  return state;
}


// ─────────────────────────────────────────────────────────────────
// src/features/faculty/hooks/useFacultyDetail.ts

import { fetchFacultyBySlug, fetchMajorsByFacultySlug } from "../api";
import type { Major } from "../types";

interface FacultyDetailState {
  faculty: Faculty | null;
  majors: Major[];
  loading: boolean;
  error: string | null;
}

export function useFacultyDetail(slug: string) {
  const [state, setState] = useState<FacultyDetailState>({
    faculty: null,
    majors: [],
    loading: true,
    error: null,
  });

  useEffect(() => {
    if (!slug) return;
    let cancelled = false;
    setState(s => ({ ...s, loading: true, error: null }));

    Promise.all([fetchFacultyBySlug(slug), fetchMajorsByFacultySlug(slug)])
      .then(([faculty, majors]) => {
        if (cancelled) return;
        if (!faculty) setState(s => ({ ...s, loading: false, error: "Không tìm thấy khoa." }));
        else setState({ faculty, majors, loading: false, error: null });
      })
      .catch(() => {
        if (!cancelled) setState(s => ({ ...s, loading: false, error: "Không thể tải dữ liệu." }));
      });

    return () => { cancelled = true; };
  }, [slug]);

  return state;
}


// ─────────────────────────────────────────────────────────────────
// src/features/faculty/hooks/useMajorDetail.ts

import { fetchMajorBySlug, fetchClassesByMajorSlug } from "../api";
import type { ClassItem } from "../types";

interface MajorDetailState {
  major: Major | null;
  classes: ClassItem[];
  loading: boolean;
  error: string | null;
}

export function useMajorDetail(majorSlug: string) {
  const [state, setState] = useState<MajorDetailState>({
    major: null,
    classes: [],
    loading: true,
    error: null,
  });

  useEffect(() => {
    if (!majorSlug) return;
    let cancelled = false;
    setState(s => ({ ...s, loading: true, error: null }));

    Promise.all([fetchMajorBySlug(majorSlug), fetchClassesByMajorSlug(majorSlug)])
      .then(([major, classes]) => {
        if (cancelled) return;
        if (!major) setState(s => ({ ...s, loading: false, error: "Không tìm thấy ngành." }));
        else setState({ major, classes, loading: false, error: null });
      })
      .catch(() => {
        if (!cancelled) setState(s => ({ ...s, loading: false, error: "Không thể tải dữ liệu." }));
      });

    return () => { cancelled = true; };
  }, [majorSlug]);

  return state;
}