/**
 * TEMPORARY MOCK SERVICE — dashboard statistical-question chart.
 *
 * Backend endpoints for "list statistical questions" and "chart for question id"
 * are NOT YET available. This file exposes two functions with the shape we
 * expect from BE so the UI can be wired up now:
 *
 *   - getStatisticalQuestions()           → StatisticalQuestion[]
 *   - getChartByQuestionId(questionId)    → ChartResult
 *
 * When BE is ready, replace the function bodies with axios calls (e.g.
 * `GET /api/dashboard/statistical-questions` and
 * `GET /api/dashboard/statistical-questions/{id}/chart`). The function
 * signatures and return types are the contract — keep them stable.
 *
 * Do not treat the data here as real metrics. The numbers exist only so
 * the chart renders something while BE is being built.
 */

import type {
  ChartResult,
  StatisticalQuestion,
} from "./statisticalQuestion";

/** MOCK — list of survey questions BE would mark `is_statistical = true`. */
const MOCK_STATISTICAL_QUESTIONS: StatisticalQuestion[] = [
  {
    questionId: "q_employment_status",
    label: "Tình trạng việc làm",
    title: "Tình trạng việc làm hiện tại của Anh/Chị?",
    questionType: "single_choice",
    chartType: "pie",
    options: ["Có việc làm", "Chưa có việc"],
  },
  {
    questionId: "q_work_area",
    label: "Khu vực làm việc",
    title: "Khu vực Anh/Chị đang làm việc?",
    questionType: "single_choice",
    chartType: "pie",
    options: ["Tư nhân", "Nhà nước", "Tự tạo việc", "Nước ngoài"],
  },
  {
    questionId: "q_trained_field",
    label: "Mức độ phù hợp ngành đào tạo",
    title: "Việc làm hiện tại có phù hợp với ngành đào tạo?",
    questionType: "single_choice",
    chartType: "pie",
    options: ["Đúng ngành", "Liên quan", "Trái ngành", "Tiếp tục học"],
  },
  {
    questionId: "q_average_income",
    label: "Phổ thu nhập (triệu đồng)",
    title: "Mức thu nhập bình quân hàng tháng (triệu đồng)?",
    questionType: "single_choice",
    chartType: "column",
    options: ["< 5", "5 – 10", "10 – 15", "15 – 20", "> 20"],
  },
  {
    questionId: "q_soft_skills",
    label: "Kỹ năng mềm cần bổ sung",
    title: "Kỹ năng mềm Anh/Chị cần bổ sung thêm?",
    questionType: "multiple_choice",
    chartType: "column",
    options: [
      "Giao tiếp",
      "Làm việc nhóm",
      "Giải quyết vấn đề",
      "Tin học",
      "Ngoại ngữ",
    ],
  },
  {
    questionId: "q_recruitment_type",
    label: "Phương thức tìm việc",
    title: "Anh/Chị tìm được việc qua phương thức nào?",
    questionType: "single_choice",
    chartType: "column",
    options: [
      "Người thân giới thiệu",
      "Tự ứng tuyển",
      "Trang tuyển dụng",
      "Hội chợ việc làm",
      "Khác",
    ],
  },
];

/** MOCK — placeholder chart data per question id. Numbers are illustrative. */
const MOCK_CHART_DATA: Record<string, ChartResult> = {
  q_employment_status: {
    questionId: "q_employment_status",
    title: "Tình trạng việc làm hiện tại của Anh/Chị?",
    chartType: "pie",
    totalResponses: 1010,
    data: [
      { name: "Có việc làm", value: 912 },
      { name: "Chưa có việc", value: 98 },
    ],
  },
  q_work_area: {
    questionId: "q_work_area",
    title: "Khu vực Anh/Chị đang làm việc?",
    chartType: "pie",
    totalResponses: 898,
    data: [
      { name: "Tư nhân", value: 680 },
      { name: "Nhà nước", value: 50 },
      { name: "Tự tạo việc", value: 140 },
      { name: "Nước ngoài", value: 28 },
    ],
  },
  q_trained_field: {
    questionId: "q_trained_field",
    title: "Việc làm hiện tại có phù hợp với ngành đào tạo?",
    chartType: "pie",
    totalResponses: 967,
    data: [
      { name: "Đúng ngành", value: 655 },
      { name: "Liên quan", value: 140 },
      { name: "Trái ngành", value: 117 },
      { name: "Tiếp tục học", value: 55 },
    ],
  },
  q_average_income: {
    questionId: "q_average_income",
    title: "Mức thu nhập bình quân hàng tháng (triệu đồng)?",
    chartType: "column",
    totalResponses: 912,
    data: [
      { name: "< 5", value: 88 },
      { name: "5 – 10", value: 312 },
      { name: "10 – 15", value: 295 },
      { name: "15 – 20", value: 142 },
      { name: "> 20", value: 75 },
    ],
  },
  q_soft_skills: {
    questionId: "q_soft_skills",
    title: "Kỹ năng mềm Anh/Chị cần bổ sung thêm?",
    chartType: "column",
    totalResponses: 1010,
    data: [
      { name: "Giao tiếp", value: 410 },
      { name: "Làm việc nhóm", value: 360 },
      { name: "Giải quyết vấn đề", value: 480 },
      { name: "Tin học", value: 220 },
      { name: "Ngoại ngữ", value: 540 },
    ],
  },
  q_recruitment_type: {
    questionId: "q_recruitment_type",
    title: "Anh/Chị tìm được việc qua phương thức nào?",
    chartType: "column",
    totalResponses: 912,
    data: [
      { name: "Người thân giới thiệu", value: 188 },
      { name: "Tự ứng tuyển", value: 402 },
      { name: "Trang tuyển dụng", value: 245 },
      { name: "Hội chợ việc làm", value: 47 },
      { name: "Khác", value: 30 },
    ],
  },
};

/** Tiny artificial delay so the UI can render a loading state if it wants to. */
const MOCK_DELAY_MS = 120;

/**
 * MOCK — replace with: `GET /api/dashboard/statistical-questions`
 * Returns survey questions BE has flagged as statistical (`is_statistical = true`).
 */
export function getStatisticalQuestions(): Promise<StatisticalQuestion[]> {
  return new Promise(resolve => {
    setTimeout(() => resolve(MOCK_STATISTICAL_QUESTIONS), MOCK_DELAY_MS);
  });
}

/**
 * MOCK — replace with:
 *   `GET /api/dashboard/statistical-questions/{questionId}/chart`
 * Returns the chart payload for a given question id.
 */
export function getChartByQuestionId(
  questionId: string,
): Promise<ChartResult | null> {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(MOCK_CHART_DATA[questionId] ?? null);
    }, MOCK_DELAY_MS);
  });
}
