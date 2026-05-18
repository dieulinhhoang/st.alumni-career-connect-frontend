import type { Graduation, GraduationStudent, PaginatedResponse } from "./type";
import api from "../../libs/api";

/**
 * Fetch list of graduation ceremonies with pagination
 * @param page - page number (default: 1)
 * @param perPage - items per page (default: 10)
 */
export async function fetchGraduations(
  page = 1,
  perPage = 10
): Promise<PaginatedResponse<Graduation>> {
  const res = await api.get("/graduations", {
    params: { page, per_page: perPage },
  });
  return {
    data: res.data ?? [],
    meta: {
      total: res.data?.length ?? 0,
      per_page: perPage,
      current_page: page,
      last_page: Math.ceil((res.data?.length ?? 0) / perPage),
    },
  };
}

/**
 * Fetch students for a specific graduation ceremony
 * @param graduationId - graduation ceremony ID
 * @param page - page number (default: 1)
 * @param perPage - items per page (default: 10)
 */
export async function fetchGraduationStudents(
  graduationId: number,
  page = 1,
  perPage = 10
): Promise<PaginatedResponse<GraduationStudent>> {
  const res = await api.get("/grad-students", {
    params: { graduation_id: graduationId, page, per_page: perPage },
  });
  return {
    data: res.data ?? [],
    meta: {
      total: res.data?.length ?? 0,
      per_page: perPage,
      current_page: page,
      last_page: Math.ceil((res.data?.length ?? 0) / perPage),
    },
  };
}
