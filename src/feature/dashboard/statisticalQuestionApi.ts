/**
 * Statistical-question chart API.
 *
 * BE endpoints:
 *   GET /api/dashboard/statistical-questions
 *   GET /api/dashboard/statistical-questions/{questionId}/chart?khoa=...&nganh=...
 *
 * Khi VITE_API_URL được set và BE đã sẵn sàng, tất cả đều gọi thật.
 * Nếu BE chưa có (dev mode hoặc lỗi network), tự động fallback về MOCK.
 */

import axios from "axios";
import type { ChartResult, StatisticalQuestion } from "./statisticalQuestion";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

// ---------------------------------------------------------------------------
// MOCK — chỉ dùng làm fallback khi BE chưa sẵn sàng
// ---------------------------------------------------------------------------

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
    data: [
      { name: "Có việc làm", value: 912 },
      { name: "Chưa có việc", value: 98 },
    ],
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
      { name: "Đúng ngành",   value: 655 },
      { name: "Liên quan",    value: 140 },
      { name: "Trái ngành",   value: 117 },
      { name: "Tiếp tục học",value: 55  },
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
      { name: "Tư nhân",     value: 680 },
      { name: "Nhà nước",    value: 50  },
      { name: "Tự tạo việc",value: 140 },
      { name: "Nước ngoài", value: 28  },
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
      { name: "< 5",    value: 88  },
      { name: "5 – 10", value: 312 },
      { name: "10 – 15",value: 295 },
      { name: "15 – 20",value: 142 },
      { name: "> 20",   value: 75  },
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
      { name: "Giao tiếp",          value: 410 },
      { name: "Làm việc nhóm",      value: 360 },
      { name: "Giải quyết vấn đề", value: 480 },
      { name: "Tin học",            value: 220 },
      { name: "Ngoại ngữ",         value: 540 },
    ],
    dotData: {
      "2022-1": [{ name: "Giao tiếp", value: 320 }, { name: "Làm việc nhóm", value: 290 }, { name: "Giải quyết vấn đề", value: 380 }, { name: "Tin học", value: 200 }, { name: "Ngoại ngữ", value: 430 }],
      "2023-1": [{ name: "Giao tiếp", value: 370 }, { name: "Làm việc nhóm", value: 325 }, { name: "Giải quyết vấn đề", value: 430 }, { name: "Tin học", value: 210 }, { name: "Ngoại ngữ", value: 490 }],
      "2024-1": [{ name: "Giao tiếp", value: 410 }, { name: "Làm việc nhóm", value: 360 }, { name: "Giải quyết vấn đề", value: 480 }, { name: "Tin học", value: 220 }, { name: "Ngoại ngữ", value: 540 }],
    },
  },
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const isDev = import.meta.env.DEV;

/**
 * Trả về true nếu BE URL được cấu hình (VITE_API_URL không rỗng).
 * Dùng để quyết định có gọi thật hay không.
 */
function hasApiUrl(): boolean {
  return Boolean(import.meta.env.VITE_API_URL);
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

export interface GetChartParams {
  khoa?: string;
  nganh?: string;
}

/**
 * Lấy danh sách câu hỏi thống kê từ BE.
 * Fallback về MOCK nếu BE chưa có hoặc gặp lỗi.
 *
 * BE: GET /dashboard/statistical-questions
 */
export async function getStatisticalQuestions(): Promise<StatisticalQuestion[]> {
  if (!hasApiUrl()) {
    if (isDev) console.info("[dashboard] No VITE_API_URL — using mock questions");
    return MOCK_QUESTIONS;
  }

  try {
    const res = await api.get<StatisticalQuestion[]>("/dashboard/statistical-questions");
    return res.data;
  } catch (err) {
    if (isDev) console.warn("[dashboard] getStatisticalQuestions failed, fallback to mock", err);
    return MOCK_QUESTIONS;
  }
}

/**
 * Lấy dữ liệu chart theo câu hỏi + filter khoa/nganh.
 * Fallback về MOCK nếu BE chưa có hoặc gặp lỗi.
 *
 * BE: GET /dashboard/statistical-questions/{questionId}/chart?khoa=...&nganh=...
 */
export async function getChartByQuestionId(
  questionId: string,
  params?: GetChartParams,
): Promise<ChartResult | null> {
  if (!questionId) return null;

  if (!hasApiUrl()) {
    if (isDev) console.info(`[dashboard] No VITE_API_URL — using mock chart for ${questionId}`);
    return MOCK_CHART_DATA[questionId] ?? null;
  }

  try {
    const res = await api.get<ChartResult>(
      `/dashboard/statistical-questions/${questionId}/chart`,
      {
        params: {
          khoa:  params?.khoa  && params.khoa  !== "all" ? params.khoa  : undefined,
          nganh: params?.nganh && params.nganh !== "all" ? params.nganh : undefined,
        },
      },
    );
    return res.data;
  } catch (err) {
    if (isDev) console.warn(`[dashboard] getChartByQuestionId(${questionId}) failed, fallback to mock`, err);
    return MOCK_CHART_DATA[questionId] ?? null;
  }
}
