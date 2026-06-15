export type QuestionType =
  | 'text'
  | 'multiple-choice'
  | 'checkbox'
  | 'address'
  | 'date'
  | 'select'
  | 'long'
  | 'text'
  | 'radio'
  | 'dropdown'
  | 'email'
  | 'tel';

// Option for question choices
export interface QuestionOption {
  id: string;
  label: string;
}

// Conditional display logic
export interface ConditionalRule {
  questionId: string; // id of the dependent question
  operator: 'equals' | 'includes' | 'not_equals';
  value: string | string[];
}

export interface Question {
  id: string;
  type: QuestionType;
  title: string;               // question content
  placeholder?: string;
  options?: QuestionOption[];  // updated from string[] -> QuestionOption[]
  required: boolean;
  sectionId: string;           // which Section this belongs to
  order: number;               // order within the section
  rowGroup?: string;           // câu hỏi cùng rowGroup render trên 1 hàng (tối đa 3)

  // new fields:
  visibleWhen?: ConditionalRule;      // condition for the question to be shown

  // Thống kê & báo cáo — tự sinh, admin không nhập thủ công
  reportFieldKey?: string;            // key nội bộ tự sinh
  showInChart?: boolean;              // hiển thị trong biểu đồ thống kê
  chartType?: 'pie' | 'column';       // loại biểu đồ
  reportTemplate?: 'mau01' | 'mau03'; // mẫu báo cáo Excel
  excelColumn?: string;               // dataIndex cột trong mẫu (vd: 'kvNhaNuoc')
}

// SURVEY HEADER / FOOTER / SECTION

export interface SurveyHeader {
  logoUrl?: string;
  ministry?: string;
  academy?: string;
  address?: string;
  phone?: string;
  fax?: string;
  showDate?: boolean;
}

export interface SurveyFooter {
  primaryText?: string;
  secondaryText?: string;
}

export interface Section {
  id: string;
  title: string;
  order: number;
}

export interface Survey {
  id: string;
  title: string;
  description: string;
  sections: Section[];
  questions: Question[];
  defaultHeader: SurveyHeader;
  defaultFooter: SurveyFooter;
}

export interface SurveyResponse {
  surveyId: string;
  responses: {
    questionId: string;
    answer: string | string[];
  }[];
}

// SURVEY PERIOD (Đợt khảo sát)
export type SurveyPeriodStatus = 'draft' | 'active' | 'closed' | 'scheduled';

export interface SurveyPeriod {
  id: number;
  title: string;                   // Tên đợt khảo sát
  description?: string;
  formId: number;                  // FK -> Form.id
  formName: string;                // tên biểu mẫu liên kết
  startDate: string;               // ISO date string
  endDate: string;                 // ISO date string
  status: SurveyPeriodStatus;
  targetAudience: string;          // Đối tượng khảo sát (vd: "Sinh viên tốt nghiệp 2023")
  targetYear?: number;             // Năm tốt nghiệp mục tiêu
  totalInvited: number;            // Số lượng mời
  totalResponses: number;          // Số lượng đã trả lời
  createdBy: string;               // Người tạo
  created_at: string;              // ISO date string
  updated_at?: string;
  publicUrl?: string;              // URL công khai phát hành
  requiresVerification: boolean;   // Có cần xác thực danh tính không
}

export interface CreateSurveyPeriodPayload {
  title: string;
  description?: string;
  formId: number;
  startDate: string;
  endDate: string;
  targetAudience: string;
  targetYear?: number;
  totalInvited?: number;
  requiresVerification: boolean;
}

export interface UpdateSurveyPeriodPayload extends Partial<CreateSurveyPeriodPayload> {
  status?: SurveyPeriodStatus;
}

// THEME TYPES
export interface Theme {
  id: string;
  name: string;
  accent: string;
  header: string;
  bg: string;
  font: string;
  radius: string;
}

export interface CustomTheme {
  accent: string;
  font: string;
  radius: string;
  bg: string;
}

// FORM TYPES
export interface Form {
  id: number | null;
  name: string;
  description: string;
  sections: Section[];
  questions: Question[];
  themeId: string;
  created_at?: string;
  updated_at?: string;
  _customTheme?: CustomTheme | null;
  header?: SurveyHeader;
  footer?: SurveyFooter;
  logoUrl?: string;
  status?: 'draft' | 'published';
  isSystem?: boolean;
  usedInBatch?: boolean;
}

// VIEW TYPES
export type ViewType = "list" | "builder" | "ai" | "preview" | "theme";

// Q_TYPES META
export interface QuestionTypeMeta {
  value: QuestionType;
  label: string;
  icon: string;
}

export type QuestionTypeOption = QuestionTypeMeta;

export interface FontOption {
  name: string;
  val: string;
}

export interface RadiusOption {
  name: string;
  val: string;
}

// API PAYLOAD TYPES
export interface CreateFormPayload {
  name: string;
  description: string;
  sections?: Section[];
  questions: Question[];
  themeId?: string;
  header?: SurveyHeader;
  footer?: SurveyFooter;
}

export interface UpdateFormPayload {
  name?: string;
  description?: string;
  sections?: Section[];
  questions?: Question[];
  themeId?: string;
  header?: SurveyHeader;
  footer?: SurveyFooter;
}

export interface GetFormsParams {
  search?: string;
  page?: number;
  pageSize?: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
}

export interface AIFormResult {
  name: string;
  description: string;
  sections?: Section[];
  questions: Question[];
}