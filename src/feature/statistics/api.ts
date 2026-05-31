import type {
  FormOption,
  StatisticalQuestion,
  FormStatisticsDetail,
} from './types';
import api from '../../libs/api';

/**
 * Fetch list of survey forms
 */
export async function getForms(): Promise<FormOption[]> {
  const res = await api.get('/forms');
  return res.data ?? [];
}

/**
 * Fetch statistical questions for a specific form
 * @param formId - form ID
 */
export async function getStatisticalQuestions(formId: number): Promise<StatisticalQuestion[]> {
  const res = await api.get('/form-questions', { params: { form_id: formId } });
  return res.data ?? [];
}

/**
 * Fetch detailed statistics for a specific question in a form
 * @param formId - form ID
 * @param questionId - question ID
 */
export async function getFormStatisticsDetail(
  formId: number,
  questionId: string,
): Promise<FormStatisticsDetail | null> {
  const res = await api.get('/statistics', {
    params: { form_id: formId, question_id: questionId },
  });
  return res.data ?? null;
}
