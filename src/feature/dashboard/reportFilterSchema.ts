import type { FilterFieldSchema, FilterOption } from "./filterSchema";

/**
 * Chart attribute selector options for the Report/Statistics page.
 *
 * Mirrors the Blade <select name="select"> contract used by the existing
 * server-rendered statistics screen. These keys are the contract with BE:
 * each value should resolve to a backend statistic endpoint / dataset.
 *
 * NOTE: Currently hard-coded on the frontend. When BE exposes a schema
 * endpoint, swap CHART_ATTRIBUTE_OPTIONS for the API result and keep the
 * `value` strings stable so callers don't need to change.
 */
export const CHART_ATTRIBUTE_OPTIONS: FilterOption[] = [
  { value: "employment_status",                 label: "Thống kê tình trạng việc làm" },
  { value: "work_area",                         label: "Cơ cấu khu vực làm việc" },
  { value: "employed_since",                    label: "Thời điểm có việc làm sau tốt nghiệp" },
  { value: "trained_field",                     label: "Mức độ phù hợp của việc làm với ngành đào tạo" },
  { value: "professional_qualification_field",  label: "Mức độ công việc phù hợp trình độ chuyên môn" },
  { value: "level_knowledge_acquired",          label: "Mức độ áp dụng kiến thức/kỹ năng đã học" },
  { value: "average_income",                    label: "Phổ thu nhập bình quân (triệu đồng)" },
  { value: "recruitment_type",                  label: "Các phương thức tìm kiếm việc làm" },
  { value: "job_search_method",                 label: "Thống kê các hình thức tuyển dụng" },
  { value: "soft_skills_required",              label: "Mức độ đáp ứng của CTĐT về kỹ năng mềm" },
  { value: "must_attended_courses",             label: "Nhu cầu học tập, bồi dưỡng nâng cao" },
  { value: "solutions_get_job",                 label: "Đề xuất giải pháp tăng tỷ lệ việc làm đúng ngành" },
];

export type ChartAttribute = (typeof CHART_ATTRIBUTE_OPTIONS)[number]["value"];

export type ReportFilterState = {
  attribute: ChartAttribute;
};

export const REPORT_CHART_FILTER_SCHEMA: FilterFieldSchema[] = [
  {
    key: "attribute",
    width: 360,
    size: "middle",
    defaultValue: CHART_ATTRIBUTE_OPTIONS[0].value,
    align: "left",
    getOptions: () => CHART_ATTRIBUTE_OPTIONS,
  },
];

export const REPORT_FILTER_DEFAULTS: ReportFilterState = {
  attribute: CHART_ATTRIBUTE_OPTIONS[0].value,
};
