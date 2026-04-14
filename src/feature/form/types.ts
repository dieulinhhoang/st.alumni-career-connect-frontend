export type QuestionType = 'text' | 'multiple-choice' | 'checkbox' | 'address' | 'date' | 'select' | 'long' | 'short' | 'radio'| 'dropdown' | 'email' | 'tel';

export interface Question {
  id: string;
  type: QuestionType;
  title: string;               // nội dung câu hỏi
  placeholder?: string;        // cho type text
  options?: string[];          // cho multiple-choice, checkbox, select
  required: boolean;
  sectionId: string;           // thuộc về Section nào
  order: number;               // thứ tự trong section
}

 //  SURVEY HEADER / FOOTER / SECTION
 
export interface SurveyHeader {
  logoUrl?: string;      // URL ảnh logo
  ministry?: string;     // "BỘ NÔNG NGHIỆP VÀ MÔI TRƯỜNG"
  academy?: string;      // "HỌC VIỆN NÔNG NGHIỆP VIỆT NAM"
  address?: string;      // "Xã Gia Lâm, Thành phố Hà Nội"
  phone?: string;        // "024.62617586"
  fax?: string;          // "024.62617586"
  showDate?: boolean;    // hiện ngày tự động
}

export interface SurveyFooter {
  primaryText?: string;   // dòng bold — "Xin trân trọng cảm ơn..."
  secondaryText?: string; // dòng italic — "Kính chúc Anh/Chị..."
}

export interface Section {
  id: string;
  title: string;
  order: number;
}

export interface Survey {
  id: string;
  title: string;
  description: string;        // mô tả chung (có thể tách đoạn bằng \n\n)
  sections: Section[];
  questions: Question[];
  defaultHeader: SurveyHeader;
  defaultFooter: SurveyFooter;
}

export interface SurveyResponse {
  surveyId: string;
  responses: {
    questionId: string;
    answer: string | string[]; // string cho text, date, address; string[] cho multiple-choice, checkbox, select
  }[];
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
  questions: Question[];         
  themeId: string;
  created_at?: string;
  updated_at?: string;
  _customTheme?: CustomTheme | null;
}

// VIEW TYPES 
export type ViewType = "list" | "builder" | "ai" | "preview" | "theme";

// Q_TYPES META (có thể cập nhật thêm type mới nếu cần)
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
  questions: Question[];        // dùng Question mới
  themeId?: string;
}

export interface UpdateFormPayload {
  name?: string;
  description?: string;
  questions?: Question[];       // dùng Question mới
  themeId?: string;
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
  questions: Question[];        // dùng Question mới
}