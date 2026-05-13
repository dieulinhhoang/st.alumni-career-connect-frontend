import { api } from '../../libs/api';
import type {
  ApiResponse,
  PaginatedResponse,
  SurveyStats,
  Enterprise,
  JobPosting,
  AlumniProfile,
} from './type';

// ============ API FUNCTIONS ============
export const statsApi = {
  getOverall: () =>
    api.get<ApiResponse<SurveyStats>>('/api/v1/home/stats').then((r) => r.data),

  getByYear: (year: number) =>
    api
      .get<ApiResponse<SurveyStats>>('/api/v1/home/stats', { params: { year } })
      .then((r) => r.data),

  getByMajor: (majorCode: string) =>
    api
      .get<ApiResponse<SurveyStats>>('/api/v1/home/stats', { params: { majorCode } })
      .then((r) => r.data),
};

export const enterpriseApi = {
  list: (page = 1, pageSize = 6) =>
    api
      .get<PaginatedResponse<Enterprise>>('/api/v1/enterprises', {
        params: { page, pageSize },
      })
      .then((r) => r.data),

  getById: (id: string) =>
    api.get<ApiResponse<Enterprise>>(`/api/v1/enterprises/${id}`).then((r) => r.data),

  getJobs: (enterpriseId: string) =>
    api
      .get<ApiResponse<JobPosting[]>>(`/api/v1/enterprises/${enterpriseId}/jobs`)
      .then((r) => r.data),
};

export const jobsApi = {
  list: (params?: { page?: number; pageSize?: number; location?: string; tag?: string }) =>
    api
      .get<PaginatedResponse<JobPosting>>('/api/v1/jobs', { params })
      .then((r) => r.data),

  getById: (id: string) =>
    api.get<ApiResponse<JobPosting>>(`/api/v1/jobs/${id}`).then((r) => r.data),
};

export const alumniApi = {
  getProfile: (studentCode: string) =>
    api
      .get<ApiResponse<AlumniProfile>>(`/api/v1/alumni/profile/${studentCode}`)
      .then((r) => r.data),

  search: (query: string) =>
    api
      .get<ApiResponse<AlumniProfile[]>>('/api/v1/alumni/search', { params: { q: query } })
      .then((r) => r.data),
};
