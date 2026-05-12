import { api } from '../../../libs/api';
import type { Faculty, Major, ClassItem } from './types';

// ============ MOCK DATA ============
const FACULTIES: Faculty[] = [
  { id: '1', slug: 'cong-nghe-thong-tin', name: 'Cong nghe thong tin', abbr: 'CNTT', color: '#7c3aed', majors: 5, classes: 24, students: 892 },
  { id: '2', slug: 'kinh-te', name: 'Kinh te', abbr: 'KT', color: '#0ea5e9', majors: 4, classes: 18, students: 564 },
  { id: '3', slug: 'nong-nghiep', name: 'Nong nghiep', abbr: 'NN', color: '#16a34a', majors: 6, classes: 30, students: 1240 },
  { id: '4', slug: 'cong-nghe-sinh-hoc', name: 'Cong nghe sinh hoc', abbr: 'CNSH', color: '#f59e0b', majors: 3, classes: 14, students: 456 },
  { id: '5', slug: 'quan-ly-dat-dai', name: 'Quan ly dat dai', abbr: 'QLDD', color: '#ec4899', majors: 2, classes: 10, students: 320 },
  { id: '6', slug: 'thuy', name: 'Thuy', abbr: 'TY', color: '#8b5cf6', majors: 3, classes: 12, students: 408 },
  { id: '7', slug: 'cong-nghe-thuc-pham', name: 'Cong nghe thuc pham', abbr: 'CNTP', color: '#ec4899', majors: 4, classes: 16, students: 560 },
  { id: '8', slug: 'moi-truong', name: 'Moi truong', abbr: 'MT', color: '#14b8a6', majors: 3, classes: 11, students: 374 },
];

const MAJORS: Major[] = [
  { id: '1', slug: 'ky-thuat-phan-mem', facultySlug: 'cong-nghe-thong-tin', name: 'Ky thuat phan mem', code: 'KTPM', khoa: [2021, 2022, 2023, 2024] },
  { id: '2', slug: 'he-thong-thong-tin', facultySlug: 'cong-nghe-thong-tin', name: 'He thong thong tin', code: 'HTTT', khoa: [2021, 2022, 2023, 2024] },
  { id: '3', slug: 'an-toan-thong-tin', facultySlug: 'cong-nghe-thong-tin', name: 'An toan thong tin', code: 'ATTT', khoa: [2022, 2023, 2024] },
  { id: '4', slug: 'khoa-hoc-may-tinh', facultySlug: 'cong-nghe-thong-tin', name: 'Khoa hoc may tinh', code: 'KHMT', khoa: [2021, 2022, 2023] },
  { id: '5', slug: 'tri-tue-nhan-tao', facultySlug: 'cong-nghe-thong-tin', name: 'Tri tue nhan tao', code: 'TTNT', khoa: [2023, 2024] },
];

const CLASSES: ClassItem[] = [
  { id: '1', name: 'KTPM66A', khoa: 2021, students: 42, advisor: 'TS. Nguyen Van A' },
  { id: '2', name: 'KTPM66B', khoa: 2021, students: 38, advisor: 'TS. Tran Thi B' },
  { id: '3', name: 'KTPM67A', khoa: 2022, students: 45, advisor: 'PGS. Le Van C' },
  { id: '4', name: 'KTPM68A', khoa: 2023, students: 40, advisor: 'TS. Vu Thi D' },
  { id: '5', name: 'KTPM68B', khoa: 2023, students: 36, advisor: 'TS. Hoang Van E' },
  { id: '6', name: 'KTPM69A', khoa: 2024, students: 47, advisor: 'TS. Ngo My F' },
  { id: '7', name: 'KTPM69B', khoa: 2024, students: 41, advisor: 'TS. Dao Minh G' },
  { id: '8', name: 'KTPM69B', khoa: 2024, students: 48, advisor: 'TS. Bui Thi H' },
];

// ============ API FUNCTIONS (sau nay thay bang api.get khi co backend) ============
// Sau nay se thay: api.get('/v1.0/faculties'), api.get('/v1.0/majors'), api.get('/v1.0/classes')

export const delay = (ms = 300) => new Promise((res) => setTimeout(res, ms));

export async function fetchFaculties(): Promise<Faculty[]> {
  const { data } = await api.get('/v1.0/faculties');
  return data;
}

export async function fetchFacultyBySlug(slug: string): Promise<Faculty | undefined> {
  const { data } = await api.get(`/v1.0/faculties/${slug}`);
  return data;
}

export async function fetchMajorsByFacultySlug(facultySlug: string): Promise<Major[]> {
  const { data } = await api.get(`/v1.0/majors`, { params: { facultySlug } });
  return data;
}

export async function fetchMajorBySlug(majorSlug: string): Promise<Major | undefined> {
  const { data } = await api.get(`/v1.0/majors/${majorSlug}`);
  return data;
}

export async function fetchClassesByMajorSlug(majorSlug: string): Promise<ClassItem[]> {
  const { data } = await api.get(`/v1.0/classes`, { params: { majorSlug } });
  return data;
}

export async function fetchClassesByYear(year: number): Promise<ClassItem[]> {
  const { data } = await api.get(`/v1.0/classes`, { params: { year } });
  return data;
}
