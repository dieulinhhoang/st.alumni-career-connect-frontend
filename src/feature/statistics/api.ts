import type {
  BatchOption,
  StatisticalQuestion,
  FormStatisticsDetail,
} from './types';
import api from '../../libs/api';

/**
 * Fetch list of ended survey batches (for dropdown selection)
 * GET /statistics/batches
 */
export async function getEndedBatches(): Promise<BatchOption[]> {
  const res = await api.get('/statistics/batches');
  return res.data ?? [];
}

/**
 * Fetch statistical questions (showInChart=1) for a specific batch
 * GET /statistics/questions?batch_id=X
 */
export async function getStatisticalQuestions(batchId: number): Promise<StatisticalQuestion[]> {
  const res = await api.get('/statistics/questions', { params: { batch_id: batchId } });
  return res.data ?? [];
}

/**
 * Fetch detailed statistics for a specific question in a batch
 * GET /statistics?batch_id=X&question_key=Y
 */
export async function getFormStatisticsDetail(
  batchId: number,
  questionKey: string,
): Promise<FormStatisticsDetail | null> {
  const res = await api.get('/statistics', {
    params: { batch_id: batchId, question_key: questionKey },
  });
  return res.data ?? null;
}