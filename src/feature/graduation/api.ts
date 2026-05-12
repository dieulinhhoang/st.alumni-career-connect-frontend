import { api } from '../../../libs/api';
import type { Graduation, GraduationStudent, PaginatedResponse } from './type';

export const fetchGraduations = async (page: number = 0): Promise<PaginatedResponse<Graduation>> => {
  const { data } = await api.get('/api/v1/graduation-ceremonies', { params: { page } });
  return data;
};

export const fetchGraduationStudents = async (
  graduationId: number,
  page: number = 0,
): Promise<PaginatedResponse<GraduationStudent>> => {
  const { data } = await api.get(`/api/v1/graduation-ceremonies/${graduationId}/students`, { params: { page } });
  return data;
};
