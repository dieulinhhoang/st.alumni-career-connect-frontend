/**
 * MOCK CONTRACT — types for the dashboard's dynamic statistical chart.
 *
 * Concept (agreed with BE direction):
 * - Survey forms are dynamic. The admin marks individual questions as
 *   `is_statistical = true` to opt them in to dashboard charting.
 * - The dashboard fetches the list of statistical questions, lets the user
 *   pick one, and renders a chart for that question id.
 *
 * These types describe the FE/BE contract. Keep field names in sync with BE
 * once the endpoints are available. The accompanying file
 * `statisticalQuestionApi.ts` returns mock values for these types — it is
 * NOT real data.
 */

export type StatisticalQuestionType =
  | "single_choice"
  | "multiple_choice"
  | "rating"
  | "number_range";

export type StatisticalChartType = "pie" | "column";

export interface StatisticalQuestion {
  questionId: string;
  label: string;
  title: string;
  formId?: string | number;
  questionType: StatisticalQuestionType;
  chartType: StatisticalChartType;
  options?: string[];
}

export interface ChartDatum {
  name: string;
  value: number;
}

export interface ChartResult {
  questionId: string;
  title: string;
  chartType: StatisticalChartType;
  totalResponses?: number;
  data: ChartDatum[];
}
