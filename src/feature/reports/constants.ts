// Các hằng số tĩnh, không phụ thuộc dữ liệu API
export const ORG_NAME = 'HỌC VIỆN NÔNG NGHIỆP VIỆT NAM';

export const USER_ROLE_OPTIONS = [
  { value: 0, label: 'Quản trị hệ thống' },
  { value: 1, label: 'Cán bộ khoa' },
  { value: 2, label: 'Cán bộ ngành' },
];

// SURVEY_OPTIONS và DEFAULT_DEADLINE đã được chuyển sang fetch từ API
// Sử dụng hook useSurveyOptions() từ src/feature/reports/hooks/useSurveyOptions.ts
