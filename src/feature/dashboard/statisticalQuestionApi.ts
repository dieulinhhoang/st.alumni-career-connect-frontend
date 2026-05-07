/**
 * MOCK SERVICE — dashboard statistical-question chart.
 * Giá trị trong file này là MOCK / PLACEHOLDER — KHÔNG phải số liệu thật.
 *
 * BE endpoints (tên TBD):
 *   GET /api/dashboard/statistical-questions
 *   GET /api/dashboard/statistical-questions/{questionId}/chart
 *
 * Khi BE xong, thay body mỗi function bằng axios call tương ứng.
 */

import type { ChartResult, StatisticalQuestion } from "./statisticalQuestion";

const MOCK_QUESTIONS: StatisticalQuestion[] = [
  {
    questionId: "q_employment_status",
    label: "Tình trạng việc làm",
    title: "Tình trạng việc làm hiện tại",
    questionType: "single_choice",
    chartType: "pie",
    options: ["Có việc làm", "Chưa có việc"],
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
    questionId: "q_work_area",
    label: "Khu vực làm việc",
    title: "Khu vực Anh/Chị đang làm việc",
    questionType: "single_choice",
    chartType: "pie",
    options: ["Tư nhân", "Nhà nước", "Tự tạo việc", "Nước ngoài"],
  },
  {
    questionId: "q_average_income",
    label: "Phổ thu nhập (triệu đồng)",
    title: "Mức thu nhập bình quân hàng tháng (triệu đồng)",
    questionType: "single_choice",
    chartType: "column",
    options: ["< 5", "5 – 10", "10 – 15", "15 – 20", "> 20"],
  },
  {
    questionId: "q_soft_skills",
    label: "Kỹ năng mềm cần bổ sung",
    title: "Kỹ năng mềm cần bổ sung thêm",
    questionType: "multiple_choice",
    chartType: "column",
    options: ["Giao tiếp", "Làm việc nhóm", "Giải quyết vấn đề", "Tin học", "Ngoại ngữ"],
  },
];

const MOCK_CHART_DATA: Record<string, ChartResult> = {
  q_employment_status: {
    questionId: "q_employment_status",
    title: "Tình trạng việc làm hiện tại",
    chartType: "pie",
    totalResponses: 1010,
    // MOCK: đợt mới nhất — cho biểu đồ tròn
    data: [
      { name: "Có việc làm", value: 912 },
      { name: "Chưa có việc", value: 98 },
    ],
    // MOCK: 3 đợt gần nhất — cho biểu đồ cột
    dotData: {
      "2022-1": [{ name: "Có việc làm", value: 720 }, { name: "Chưa có việc", value: 130 }],
      "2023-1": [{ name: "Có việc làm", value: 810 }, { name: "Chưa có việc", value: 115 }],
      "2024-1": [{ name: "Có việc làm", value: 912 }, { name: "Chưa có việc", value: 98  }],
    },
  },
  q_trained_field: {
    questionId: "q_trained_field",
    title: "Việc làm hiện tại có phù hợp với ngành đào tạo?",
    chartType: "pie",
    totalResponses: 967,
    data: [
      { name: "Đúng ngành",    value: 655 },
      { name: "Liên quan",     value: 140 },
      { name: "Trái ngành",    value: 117 },
      { name: "Tiếp tục học", value: 55  },
    ],
    dotData: {
      "2022-1": [{ name: "Đúng ngành", value: 510 }, { name: "Liên quan", value: 120 }, { name: "Trái ngành", value: 140 }, { name: "Tiếp tục học", value: 60 }],
      "2023-1": [{ name: "Đúng ngành", value: 580 }, { name: "Liên quan", value: 130 }, { name: "Trái ngành", value: 130 }, { name: "Tiếp tục học", value: 57 }],
      "2024-1": [{ name: "Đúng ngành", value: 655 }, { name: "Liên quan", value: 140 }, { name: "Trái ngành", value: 117 }, { name: "Tiếp tục học", value: 55 }],
    },
  },
  q_work_area: {
    questionId: "q_work_area",
    title: "Khu vực Anh/Chị đang làm việc",
    chartType: "pie",
    totalResponses: 898,
    data: [
      { name: "Tư nhân",      value: 680 },
      { name: "Nhà nước",     value: 50  },
      { name: "Tự tạo việc", value: 140 },
      { name: "Nước ngoài",  value: 28  },
    ],
    dotData: {
      "2022-1": [{ name: "Tư nhân", value: 520 }, { name: "Nhà nước", value: 60 }, { name: "Tự tạo việc", value: 100 }, { name: "Nước ngoài", value: 20 }],
      "2023-1": [{ name: "Tư nhân", value: 610 }, { name: "Nhà nước", value: 55 }, { name: "Tự tạo việc", value: 120 }, { name: "Nước ngoài", value: 24 }],
      "2024-1": [{ name: "Tư nhân", value: 680 }, { name: "Nhà nước", value: 50 }, { name: "Tự tạo việc", value: 140 }, { name: "Nước ngoài", value: 28 }],
    },
  },
  q_average_income: {
    questionId: "q_average_income",
    title: "Mức thu nhập bình quân hàng tháng (triệu đồng)",
    chartType: "column",
    totalResponses: 912,
    data: [
      { name: "< 5",     value: 88  },
      { name: "5 – 10",  value: 312 },
      { name: "10 – 15", value: 295 },
      { name: "15 – 20", value: 142 },
      { name: "> 20",    value: 75  },
    ],
    dotData: {
      "2022-1": [{ name: "< 5", value: 120 }, { name: "5 – 10", value: 280 }, { name: "10 – 15", value: 200 }, { name: "15 – 20", value: 90  }, { name: "> 20", value: 40 }],
      "2023-1": [{ name: "< 5", value: 100 }, { name: "5 – 10", value: 300 }, { name: "10 – 15", value: 250 }, { name: "15 – 20", value: 115 }, { name: "> 20", value: 60 }],
      "2024-1": [{ name: "< 5", value: 88  }, { name: "5 – 10", value: 312 }, { name: "10 – 15", value: 295 }, { name: "15 – 20", value: 142 }, { name: "> 20", value: 75 }],
    },
  },
  q_soft_skills: {
    questionId: "q_soft_skills",
    title: "Kỹ năng mềm cần bổ sung thêm",
    chartType: "column",
    totalResponses: 1010,
    data: [
      { name: "Giao tiếp",           value: 410 },
      { name: "Làm việc nhóm",       value: 360 },
      { name: "Giải quyết vấn đề",  value: 480 },
      { name: "Tin học",             value: 220 },
      { name: "Ngoại ngữ",          value: 540 },
    ],
    dotData: {
      "2022-1": [{ name: "Giao tiếp", value: 320 }, { name: "Làm việc nhóm", value: 290 }, { name: "Giải quyết vấn đề", value: 380 }, { name: "Tin học", value: 200 }, { name: "Ngoại ngữ", value: 430 }],
      "2023-1": [{ name: "Giao tiếp", value: 370 }, { name: "Làm việc nhóm", value: 325 }, { name: "Giải quyết vấn đề", value: 430 }, { name: "Tin học", value: 210 }, { name: "Ngoại ngữ", value: 490 }],
      "2024-1": [{ name: "Giao tiếp", value: 410 }, { name: "Làm việc nhóm", value: 360 }, { name: "Giải quyết vấn đề", value: 480 }, { name: "Tin học", value: 220 }, { name: "Ngoại ngữ", value: 540 }],
    },
  },
};

const MOCK_DELAY_MS = 80;

/** MOCK — replace with: GET /api/dashboard/statistical-questions */
export function getStatisticalQuestions(): Promise<StatisticalQuestion[]> {
  return new Promise(resolve => setTimeout(() => resolve(MOCK_QUESTIONS), MOCK_DELAY_MS));
}

/** MOCK — replace with: GET /api/dashboard/statistical-questions/{questionId}/chart */
export function getChartByQuestionId(questionId: string): Promise<ChartResult | null> {
  return new Promise(resolve => {
    setTimeout(() => resolve(MOCK_CHART_DATA[questionId] ?? null), MOCK_DELAY_MS);
  });
}