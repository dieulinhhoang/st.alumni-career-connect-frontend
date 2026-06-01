import axios from "axios";
import type { ChartResult, StatisticalQuestion } from "./statisticalQuestion";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

const DEFAULT_FORM_ID = 1;

type FormQuestionApiItem = {
  id: string;
  title: string;
  chartType?: "pie" | "column";
};

type StatisticsApiItem = {
  label: string;
  value: number;
  percent?: number;
};

type StatisticsApiResponse = {
  totalResponses?: number;
  completionRate?: number;
  formName?: string;
  questionTitle?: string;
  chartType?: "pie" | "column";
  data?: StatisticsApiItem[];
};

function inferQuestionType(chartType?: "pie" | "column") {
  return chartType === "column" ? "multiple_choice" : "single_choice";
}

function normalizeQuestions(payload: unknown): FormQuestionApiItem[] {
  if (Array.isArray(payload)) return payload as FormQuestionApiItem[];
  if (payload && typeof payload === "object") {
    const obj = payload as Record<string, unknown>;
    if (Array.isArray(obj.data)) return obj.data as FormQuestionApiItem[];
    if (Array.isArray(obj.items)) return obj.items as FormQuestionApiItem[];
    if (Array.isArray(obj.result)) return obj.result as FormQuestionApiItem[];
  }
  return [];
}

export async function getStatisticalQuestions(
  formId: number = DEFAULT_FORM_ID,
): Promise<StatisticalQuestion[]> {
  const res = await api.get("/form-questions", {
    params: { form_id: formId },
  });

  const questions = normalizeQuestions(res.data);

  return questions.map((item) => ({
    questionId: String(item.id),
    label: item.title,
    title: item.title,
    formId,
    questionType: inferQuestionType(item.chartType),
    chartType: item.chartType ?? "pie",
    options: [],
  }));
}

export async function getChartByQuestionId(
  questionId: string,
  formId: number = DEFAULT_FORM_ID,
): Promise<ChartResult | null> {
  if (!questionId) return null;

  const res = await api.get<StatisticsApiResponse>("/statistics", {
    params: {
      form_id: formId,
      question_id: questionId,
    },
  });

  const payload = res.data;
  if (!payload) return null;

  return {
    questionId,
    title: payload.questionTitle ?? "",
    chartType: payload.chartType ?? "pie",
    totalResponses: payload.totalResponses,
    data: (payload.data ?? []).map((item) => ({
      name: item.label,
      value: Number(item.value ?? 0),
    })),
  };
}
