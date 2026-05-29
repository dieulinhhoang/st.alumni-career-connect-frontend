 import api from "../../libs/api";
import type { Faculty, FacultyListResponse, FacultyQuery, Major } from "./types";

 

/**
 * Lấy danh sách khoa có phân trang.
 * Dùng cho trang quản trị / danh sách.
 * @param query - page, size, name (tìm kiếm), status (lọc)
 */
export async function fetchFaculties(
  query: FacultyQuery = {}
): Promise<FacultyListResponse> {
  console.log("API Request - fetchFaculties with query:", query); // Debug log to check the query parameters
  const res = await api.get("/faculty", { params: query });
  return res.data;
}

/**
 * Lấy toàn bộ khoa (không phân trang) — dùng cho Select / dropdown.
  */
export async function fetchAllFaculties(): Promise<Faculty[]> {
 
  const res = await api.get("/faculty", { params: { page: 0, size: 999 } });
  // console.log("API Request - fetchAllFaculties, received data:", res.data); // Debug log to check the response data
  return res.data?.items ?? [];
}

/**
 * Lấy 1 khoa theo ID (số).
 * BE: GET /faculty/:id
 * @param id - Faculty ID (number)
 */
export async function fetchFacultyById(id: number): Promise<Faculty> {
  const res = await api.get(`/faculty/${id}`);
  return res.data;
}
export async function fetchFacultyBySlug(slug: string): Promise<Faculty> {
  const res = await api.get(`/faculties/${slug}`);
  return res.data;
}

export async function fetchMajorBySlug(slug: string): Promise<Major> {
  const res = await api.get(`/majors/${slug}`);
  return res.data;
}