import { api } from '../../libs/api';
import type {
  SurveyBatch,
  CreateBatchPayload,
  UpdateBatchPayload,
  BatchStats,
} from './types';

interface SurveyBatchListResponse {
  data: SurveyBatch[];
  page: {
    total_pages: number;
    has_next: boolean;
    has_previous: boolean;
    current_page: number;
    total_elements: number;
  };
}

export const getBatches = async (): Promise<SurveyBatch[]> => {
  const { data } = await api.get('/api/v1/alumni');
  return (data as SurveyBatchListResponse).data;
};

export const getBatchById = async (id: number): Promise<SurveyBatch> => {
  const { data } = await api.get(`/api/v1/alumni/${id}`);
  return data;
};

export const createBatch = async (payload: CreateBatchPayload): Promise<SurveyBatch> => {
  const { data } = await api.post('/api/v1/alumni', payload);
  return data;
};

export const updateBatch = async (id: number, updates: UpdateBatchPayload): Promise<SurveyBatch> => {
  const { data } = await api.put(`/api/v1/alumni/${id}`, updates);
  return data;
};

export const deleteBatch = async (id: number): Promise<void> => {
  await api.delete(`/api/v1/alumni/${id}`);
};

export const getBatchStats = async (batchId: number): Promise<BatchStats> => {
  const { data } = await api.get(`/api/v1/alumni/${batchId}/stats`);
  return data;
};
