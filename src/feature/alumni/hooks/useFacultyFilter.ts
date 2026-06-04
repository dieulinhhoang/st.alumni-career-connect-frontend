/**
 * useFacultyFilter — Hook lấy danh sách Khoa và Ngành từ API thật.
 *
 * Cách dùng:
 *   const { khoaOptions, nganhOptions, classOptions, loadingKhoa } = useFacultyFilter(selectedKhoa, selectedNganh);
 *
 * Khoa:  GET /faculty?page=0&size=999   → items[]
 * Ngành: lấy từ faculty.majors[] khi GET /faculty/:slug (slug lấy từ Faculty.slug hoặc Faculty.abbr)
 * Lớp:  GET /classes?major_id=X  — nếu BE có endpoint; fallback lấy từ major.classes (nếu là mảng)
 */

import { useState, useEffect } from 'react';
import api from '../../../libs/api';

export interface FilterOption {
  value: string;
  label: string;
}

// Lấy toàn bộ khoa (flat list) — dùng GET /faculty
async function apiFetchFaculties(): Promise<FilterOption[]> {
  const res = await api.get('/faculty', { params: { page: 0, size: 999 } });
  const items: any[] = res.data?.items ?? (Array.isArray(res.data) ? res.data : []);
  return items
    .filter((f: any) => f.status !== 0) // bỏ khoa đã tắt (nếu có)
    .map((f: any) => ({
      value: String(f.id),             // dùng id làm value để chính xác
      label: f.name ?? f.abbr ?? String(f.id),
    }));
}

// Lấy ngành theo facultyId — thử GET /faculty/:id (BE trả về majors[])
async function apiFetchMajorsByFacultyId(facultyId: string): Promise<FilterOption[]> {
  try {
    const res = await api.get(`/faculty/${facultyId}`);
    const majors: any[] = res.data?.majors ?? [];
    if (majors.length > 0) {
      return majors.map((m: any) => ({
        value: String(m.id),
        label: m.name ?? m.code ?? String(m.id),
      }));
    }
  } catch {
    // fallback dưới
  }

  // Fallback: GET /majors?faculty_id=X
  try {
    const res = await api.get('/majors', { params: { faculty_id: facultyId, page: 0, size: 999 } });
    const items: any[] = res.data?.items ?? res.data?.data ?? (Array.isArray(res.data) ? res.data : []);
    return items.map((m: any) => ({
      value: String(m.id),
      label: m.name ?? m.code ?? String(m.id),
    }));
  } catch {
    return [];
  }
}

// Lấy lớp theo majorId — thử GET /classes?major_id=X
async function apiFetchClassesByMajorId(majorId: string): Promise<FilterOption[]> {
  try {
    const res = await api.get('/classes', { params: { major_id: majorId, page: 0, size: 999 } });
    const items: any[] = res.data?.items ?? res.data?.data ?? (Array.isArray(res.data) ? res.data : []);
    if (items.length > 0) {
      return items.map((c: any) => ({
        value: String(c.id ?? c.name),
        label: c.name ?? String(c.id),
      }));
    }
  } catch {
    // BE chưa có endpoint → trả về rỗng, UI sẽ ẩn filter lớp
  }
  return [];
}

// ─── Hook chính ─────────────────────────────────────────────────────────────

interface UseFacultyFilterReturn {
  khoaOptions:   FilterOption[];
  nganhOptions:  FilterOption[];
  classOptions:  FilterOption[];
  loadingKhoa:   boolean;
  loadingNganh:  boolean;
  loadingClass:  boolean;
  /** Tra nhãn khoa từ value (id) */
  getKhoaLabel:  (value: string) => string;
  /** Tra nhãn ngành từ value (id) */
  getNganhLabel: (value: string) => string;
}

export function useFacultyFilter(
  selectedKhoa?: string,
  selectedNganh?: string,
): UseFacultyFilterReturn {
  const [khoaOptions,  setKhoaOptions]  = useState<FilterOption[]>([]);
  const [nganhOptions, setNganhOptions] = useState<FilterOption[]>([]);
  const [classOptions, setClassOptions] = useState<FilterOption[]>([]);
  const [loadingKhoa,  setLoadingKhoa]  = useState(false);
  const [loadingNganh, setLoadingNganh] = useState(false);
  const [loadingClass, setLoadingClass] = useState(false);

  // Load khoa một lần
  useEffect(() => {
    setLoadingKhoa(true);
    apiFetchFaculties()
      .then(setKhoaOptions)
      .catch(() => setKhoaOptions([]))
      .finally(() => setLoadingKhoa(false));
  }, []);

  // Load ngành khi khoa thay đổi
  useEffect(() => {
    if (!selectedKhoa) { setNganhOptions([]); return; }
    setLoadingNganh(true);
    setNganhOptions([]);
    setClassOptions([]);
    apiFetchMajorsByFacultyId(selectedKhoa)
      .then(setNganhOptions)
      .catch(() => setNganhOptions([]))
      .finally(() => setLoadingNganh(false));
  }, [selectedKhoa]);

  // Load lớp khi ngành thay đổi
  useEffect(() => {
    if (!selectedNganh) { setClassOptions([]); return; }
    setLoadingClass(true);
    setClassOptions([]);
    apiFetchClassesByMajorId(selectedNganh)
      .then(setClassOptions)
      .catch(() => setClassOptions([]))
      .finally(() => setLoadingClass(false));
  }, [selectedNganh]);

  const getKhoaLabel  = (v: string) => khoaOptions.find(o => o.value === v)?.label ?? v;
  const getNganhLabel = (v: string) => nganhOptions.find(o => o.value === v)?.label ?? v;

  return {
    khoaOptions,
    nganhOptions,
    classOptions,
    loadingKhoa,
    loadingNganh,
    loadingClass,
    getKhoaLabel,
    getNganhLabel,
  };
}