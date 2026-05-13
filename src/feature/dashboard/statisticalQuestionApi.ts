/**
 * REFAC: Dashboard statistical-question chart API layer.
 * 
 * Data & mock logic đã được chuyển sang src/libs/api.ts.
 * File này giờ chỉ là thin wrapper gọi qua shared api.
 * 
 * BE endpoints (tên TBD, contract:
 * GET /api/dashboard/statistical-questions
 * GET /api/dashboard/statistical-questions/{questionId}/chart
 * 
 * Khi BE xong, chỉ cần flip USE_MOCK = false trong libs/api.ts
 * là không cần sửa file này.
 */

import { api } from '../../libs/api';
import type { ChartResult, StatisticalQuestion } from './statisticalQuestion';

/**
 * Danh sách các câu hỏi thống kê.
 * Contract: GET /api/dashboard/statistical-questions
 */
export async function getStatisticalQuestions(): Promise<StatisticalQuestion[]> {
  const { data } = await api.get<StatisticalQuestion[]>('/dashboard/statistical-questions');
  return data;
}

/**
 * Dữ liệu biểu đồ của 1 câu hỏi.
 * Contract: GET /api/dashboard/statistical-questions/{questionId}/chart
 */
export async function getChartByQuestionId(questionId: string): Promise<ChartResult | null> {
  const { data } = await api.get<ChartResult>(`/dashboard/statistical-questions/${questionId}/chart`);
  return data;
}
