import { api } from '../../libs/api';
import type {
  Enterprise,
  Job,
  EnterpriseFormValues,
  JobFormValues,
  FacultyKey,
  PartnerStatus,
} from './type';
import { FACULTY_COLOR_MAP } from './type';

// ============ API FUNCTIONS ============
export const listEnterprises = async () => {
  const { data } = await api.get('/enterprises');
  return data;
};

export const getEnterpriseById = async (id: string) => {
  const { data } = await api.get(`/enterprises/${id}`);
  return data;
};

export const listJobs = async (enterpriseId?: string) => {
  const url = enterpriseId ? `/enterprises/${enterpriseId}/jobs` : '/jobs';
  const { data } = await api.get(url);
  return data;
};

export const getJobById = async (id: string) => {
  const { data } = await api.get(`/jobs/${id}`);
  return data;
};

export const searchEnterprises = async (term: string) => {
  const { data } = await api.get('/enterprises', { params: { q: term } });
  return data;
};

export const createEnterprise = async (payload: EnterpriseFormValues): Promise<Enterprise> => {
  const { data } = await api.post('/api/v1/enterprises', payload);
  return data;
};

export const updateEnterprise = async (id: string, payload: EnterpriseFormValues): Promise<Enterprise> => {
  const { data } = await api.put(`/api/v1/enterprises/${id}`, payload);
  return data;
};

export const deleteEnterprise = async (id: string): Promise<void> => {
  await api.delete(`/api/v1/enterprises/${id}`);
};

export const updateEnterpriseVerified = async (id: string, verified: boolean): Promise<Enterprise> => {
  const { data } = await api.patch(`/api/v1/enterprises/${id}/verified`, { verified });
  return data;
};

export const setEnterprisePartnerStatus = async (id: string, status: PartnerStatus): Promise<Enterprise> => {
  const { data } = await api.patch(`/api/v1/enterprises/${id}/partner-status`, { status });
  return data;
};

export const createJob = async (enterpriseId: string, payload: JobFormValues): Promise<Job> => {
  const { data } = await api.post(`/api/v1/enterprises/${enterpriseId}/jobs`, payload);
  return data;
};

export const updateJob = async (id: string, payload: JobFormValues): Promise<Job> => {
  const { data } = await api.put(`/api/v1/jobs/${id}`, payload);
  return data;
};

export const deleteJob = async (id: string): Promise<void> => {
  await api.delete(`/api/v1/jobs/${id}`);
};
