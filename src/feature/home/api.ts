import type {
  ApiResponse,
  PaginatedResponse,
  SurveyStats,
  Enterprise,
  JobPosting,
  AlumniProfile,
} from "./type";
import api from "../../libs/api";

// ============ Stats ============
export const statsApi = {
  getOverall: async (): Promise<ApiResponse<SurveyStats>> => {
    const res = await api.get("/home/stats");
    return { success: true, message: "OK", data: res.data };
  },
  getByYear: async (year: number): Promise<ApiResponse<SurveyStats>> => {
    const res = await api.get("/home/stats", { params: { year } });
    return { success: true, message: "OK", data: res.data };
  },
  getByMajor: async (majorCode: string): Promise<ApiResponse<SurveyStats>> => {
    const res = await api.get("/home/stats", { params: { major: majorCode } });
    return { success: true, message: "OK", data: res.data };
  },
};

// ============ Enterprises ============
export const enterpriseApi = {
  list: async (
    page = 1,
    pageSize = 6
  ): Promise<PaginatedResponse<Enterprise>> => {
    const res = await api.get("/enterprises", { params: { page, page_size: pageSize } });
    const items = res.data ?? [];
    return {
      success: true,
      message: "OK",
      data: items,
      total: items.length,
      page,
      pageSize,
    };
  },
  getById: async (id: string): Promise<ApiResponse<Enterprise>> => {
    const res = await api.get("/enterprises", { params: { id } });
    const found = (res.data ?? []).find((e: Enterprise) => e.id === id);
    return { success: true, message: "OK", data: found! };
  },
  getJobs: async (enterpriseId: string): Promise<ApiResponse<JobPosting[]>> => {
    const res = await api.get("/jobs", { params: { enterprise_id: enterpriseId } });
    return { success: true, message: "OK", data: res.data ?? [] };
  },
};

// ============ Jobs ============
export const jobsApi = {
  list: async (params?: {
    page?: number;
    pageSize?: number;
    location?: string;
    tag?: string;
  }): Promise<PaginatedResponse<JobPosting>> => {
    const res = await api.get("/jobs", {
      params: { page: params?.page ?? 1, page_size: params?.pageSize ?? 9, location: params?.location, tag: params?.tag },
    });
    const items = res.data ?? [];
    return {
      success: true,
      message: "OK",
      data: items,
      total: items.length,
      page: params?.page ?? 1,
      pageSize: params?.pageSize ?? 9,
    };
  },
  getById: async (id: string): Promise<ApiResponse<JobPosting>> => {
    const res = await api.get("/jobs", { params: { id } });
    const found = (res.data ?? []).find((j: JobPosting) => j.id === id);
    return { success: true, message: "OK", data: found! };
  },
};

// ============ Alumni ============
export const alumniApi = {
  getProfile: async (studentCode: string): Promise<ApiResponse<AlumniProfile>> => {
    const res = await api.get("/alumni/profiles", { params: { student_code: studentCode } });
    const found = (res.data ?? []).find((a: AlumniProfile) => a.studentCode === studentCode);
    return { success: true, message: "OK", data: found! };
  },
  search: async (query: string): Promise<ApiResponse<AlumniProfile[]>> => {
    const res = await api.get("/alumni/profiles", { params: { q: query } });
    return { success: true, message: "OK", data: res.data ?? [] };
  },
  updateProfile: async (
    studentCode: string,
    data: Partial<AlumniProfile>
  ): Promise<ApiResponse<AlumniProfile>> => {
    const res = await api.put("/alumni/profiles", {
      studentCode,
      ...data,
    });
    return { success: true, message: "OK", data: res.data };
  },
};
