import api from "../../libs/api";
import type { Graduation, GraduationStudent, PaginatedResponse } from "./type";

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

export interface ImportGraduationStudentsResult {
  totalRows: number;
  studentsCreated: number;
  studentsLinked: number;
  alreadyLinked: number;
  errors: { row: number; message: string }[];
}

/**
 * Upload file Excel danh sách sinh viên tốt nghiệp cho 1 đợt tốt nghiệp.
 * Path: POST /graduation/import-excel
 */
export async function importGraduationStudents(
  graduationId: number,
  file: File
): Promise<ImportGraduationStudentsResult> {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("graduationId", String(graduationId));
  const res = await api.post("/graduation/import-excel", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
}

export interface CreateGraduationPayload {
  name: string;
  certification?: string;
  certificationDate?: string;
  schoolYear?: number;
  facultyId?: number;
}

/**
 * Tạo mới một đợt tốt nghiệp.
 * Path: POST /graduation
 */
export async function createGraduation(
  payload: CreateGraduationPayload
): Promise<{ id: number }> {
  const res = await api.post("/graduation", payload);
  return res.data;
}

/**
 * Cập nhật một đợt tốt nghiệp.
 * Path: PATCH /graduation/:id
 */
export async function updateGraduation(
  id: number,
  payload: Partial<CreateGraduationPayload>
): Promise<Graduation> {
  const res = await api.patch(`/graduation/${id}`, payload);
  return res.data;
}

/**
 * Xoá một đợt tốt nghiệp.
 * Path: DELETE /graduation/:id
 */
export async function deleteGraduation(id: number): Promise<void> {
  await api.delete(`/graduation/${id}`);
}

/**
 * Fetch list of graduation ceremonies with pagination.
 * Path: GET /graduation
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
 * Hỗ trợ thêm filters tuỳ chọn (faculty_id, major_id, v.v.)
 */
export async function fetchGraduationStudents(
  graduationId: number,
  page = 1,
  perPage = 10,
  filters?: Record<string, string | number | undefined>
): Promise<PaginatedResponse<GraduationStudent>> {
  const res = await api.get("/grad-students", {
    params: {
      graduation_id: graduationId,
      page,
      per_page: perPage,
      // Spread filters nếu có (bỏ qua undefined)
      ...Object.fromEntries(
        Object.entries(filters ?? {}).filter(([, v]) => v !== undefined)
      ),
    },
  });
  return buildPaginated<GraduationStudent>(res.data, page, perPage);
}