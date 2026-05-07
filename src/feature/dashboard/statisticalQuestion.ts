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
  /** Latest dot — dùng cho biểu đồ tròn */
  data: ChartDatum[];
  /**
   * Multi-dot breakdown — dùng cho biểu đồ cột (so sánh qua các đợt).
   * Key = tên đợt, value = mảng {name, value} cho đợt đó.
   * MOCK: khi BE sẵn sàng, replace bằng response từ API.
   */
  dotData?: Record<string, ChartDatum[]>;
}