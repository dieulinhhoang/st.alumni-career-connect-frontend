/**
 * Types for the dashboard's dynamic statistical chart.
 *
 * Concept (agreed with BE direction):
 * - Survey forms are dynamic. The admin marks individual questions as
 *   `is_statistical = true` to opt them in to dashboard charting.
 * - The dashboard fetches the list of statistical questions, lets the user
 *   pick one, and renders a chart for that question id.
 *
 * These types describe the FE/BE contract. Keep field names in sync with BE
 * once the endpoints are available.
 */

/** Survey question types we know how to chart on the dashboard. */
export type StatisticalQuestionType =
  | "single_choice"
  | "multiple_choice"
  | "rating"
  | "number_range";

/** How a question's data should be rendered. */
export type StatisticalChartType = "pie" | "column";

/**
 * A survey question that BE has flagged as statistical
 * (i.e. eligible to appear in the dashboard chart selector).
 */
export interface StatisticalQuestion {
  /** BE-assigned id. The FE always references questions by this id. */
  questionId: string;
  /** Short label shown in the selector. */
  label: string;
  /** Full question title (for chart header / tooltip). */
  title: string;
  /** Form/survey this question belongs to — useful when several forms exist. */
  formId?: string | number;
  /** Question type as captured by the survey builder. */
  questionType: StatisticalQuestionType;
  /** Preferred chart rendering for this question. */
  chartType: StatisticalChartType;
  /**
   * Static list of options (for choice-type questions). Optional — BE may
   * return options directly inside the chart payload as well.
   */
  options?: string[];
}

/** A single bucket in the chart result (e.g. one pie slice / one column). */
export interface ChartDatum {
  /** Option / bucket label. */
  name: string;
  /** Count (or percentage — BE decides; FE renders as-is). */
  value: number;
}

/**
 * Chart payload returned by BE for a given question id.
 *
 * Shape is intentionally minimal so it maps cleanly to whatever endpoint
 * BE exposes (e.g. `GET /api/statistics/questions/{questionId}/chart`).
 */
export interface ChartResult {
  questionId: string;
  /** Echo of the question title / label, for display. */
  title: string;
  chartType: StatisticalChartType;
  /** Total number of respondents (used for tooltip "X SV"). */
  totalResponses?: number;
  /** Buckets to render. */
  data: ChartDatum[];
}
