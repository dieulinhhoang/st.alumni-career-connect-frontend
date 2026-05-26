import { api } from "../../libs/api";
import type { Faculty, FacultyListResponse, FacultyQuery } from "./types";

/**
 * Lấy danh sách khoa có phân trang.
 * Dùng cho trang quản trị / danh sách.
 * @param query - page, size, name (tìm kiếm), status (lọc)
 */
export async function fetchFaculties(
  query: FacultyQuery = {}
): Promise<FacultyListResponse> {
  const res = await api.get("/faculty", { params: query });
  return res.data;
}

/**
 * Lấy toàn bộ khoa (không phân trang) — dùng cho Select / dropdown.
 * Gọi với size lớn để lấy hết.
 */
export async function fetchAllFaculties(): Promise<Faculty[]> {
  const res = await api.get("/faculty", { params: { page: 0, size: 999 } });
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
