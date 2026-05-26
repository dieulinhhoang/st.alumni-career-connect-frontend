import type { Graduation, GraduationStudent, PaginatedResponse } from "./type";
import { api } from "../../libs/api";

/**
 * Normalize a raw BE response into a typed array.
 * Accepts: array trực tiếp | { items } | { data } | { results }
 */
function normalizeList<T>(raw: unknown): T[] {
  if (Array.isArray(raw)) return raw as T[];
  if (raw && typeof raw === "object") {
    const obj = raw as Record<string, unknown>;
    if (Array.isArray(obj.items)) return obj.items as T[];
    if (Array.isArray(obj.data)) return obj.data as T[];
    if (Array.isArray(obj.results)) return obj.results as T[];
  }
  return [];
}

/**
 * Build a PaginatedResponse từ raw response, dùng meta từ BE nếu có,
 * fallback tính từ độ dài mảng.
 */
function buildPaginated<T>(
  raw: unknown,
  page: number,
  perPage: number
): PaginatedResponse<T> {
  const items = normalizeList<T>(raw);

  const beObj = raw && typeof raw === "object" ? (raw as Record<string, unknown>) : null;
  const meta = beObj?.meta ?? beObj?.pagination ?? null;

  if (meta && typeof meta === "object") {
    const m = meta as Record<string, number>;
    return {
      data: items,
      meta: {
        total: m.total ?? items.length,
        per_page: m.per_page ?? m.limit ?? perPage,
        current_page: m.current_page ?? m.page ?? page,
        last_page: m.last_page ?? m.totalPages ?? Math.ceil((m.total ?? items.length) / perPage),
      },
    };
  }

  return {
    data: items,
    meta: {
      total: items.length,
      per_page: perPage,
      current_page: page,
      last_page: Math.ceil(items.length / perPage),
    },
  };
}

/**
 * Fetch list of graduation ceremonies with pagination.
 * Path: GET /graduation (khớp controller BE)
 */
export async function fetchGraduations(
  page = 1,
  perPage = 10
): Promise<PaginatedResponse<Graduation>> {
  const res = await api.get("/graduation", {
    params: { page, per_page: perPage },
  });
  return buildPaginated<Graduation>(res.data, page, perPage);
}

/**
 * Fetch students for a specific graduation ceremony.
 * Path: GET /grad-students
 */
export async function fetchGraduationStudents(
  graduationId: number,
  page = 1,
  perPage = 10
): Promise<PaginatedResponse<GraduationStudent>> {
  const res = await api.get("/grad-students", {
    params: { graduation_id: graduationId, page, per_page: perPage },
  });
  return buildPaginated<GraduationStudent>(res.data, page, perPage);
}
