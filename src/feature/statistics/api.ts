import { api } from '../../../libs/api';
import type { FormOption, StatisticalQuestion, FormStatisticsDetail } from './types';

export const getForms = async (): Promise<FormOption[]> => {
  const { data } = await api.get('/v1.0/statistics/forms');
  return data;
};

export const getStatisticalQuestions = async (formId: number): Promise<StatisticalQuestion[]> => {
  const { data } = await api.get(`/v1.0/statistics/questions/${formId}`);
  return data;
};

export const getFormStatisticsDetail = async (
  formId: number,
  questionId: string,
): Promise<FormStatisticsDetail | null> => {
  const { data } = await api.get(`/v1.0/statistics/detail/${formId}/${questionId}`);
  return data;
};
