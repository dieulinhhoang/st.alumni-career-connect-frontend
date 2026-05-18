// src/feature/alumni/api.ts
import api from '../../../libs/api';
import type { SurveyBatch, CreateBatchPayload, UpdateBatchPayload, BatchStats } from './types';

export async function getBatches(): Promise<SurveyBatch[]> {
  const res = await api.get('/alumni/batches');
  return res.data;
}

export async function getBatchById(id: number): Promise<SurveyBatch> {
  const res = await api.get(`/alumni/batches/${id}`);
  return res.data;
}

export async function createBatch(payload: CreateBatchPayload): Promise<SurveyBatch> {
  const res = await api.post('/alumni/batches', payload);
  return res.data;
}

export async function updateBatch(id: number, updates: UpdateBatchPayload): Promise<SurveyBatch> {
  const res = await api.put(`/alumni/batches/${id}`, updates);
  return res.data;
}

export async function deleteBatch(id: number): Promise<void> {
  await api.delete(`/alumni/batches/${id}`);
}

export async function getBatchStats(batchId: number): Promise<BatchStats> {
  const res = await api.get(`/alumni/batches/${batchId}/stats`);
  return res.data;
}
