export type QuestionType =
  | 'text'
  | 'multiple-choice'
  | 'checkbox'
  | 'address'
  | 'date'
  | 'select'
  | 'long'
  | 'short'
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
  questionId: string;
  operator: 'equals' | 'includes' | 'not_equals';
  value: string | string[];
}

export interface Question {
  id: string;
  type: QuestionType;
  title: string;
  placeholder?: string;
  options?: QuestionOption[];
  required: boolean;
  sectionId: string;
  order: number;
  visibleWhen?: ConditionalRule;
  reportFieldKey?: string;
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
  responses: { questionId: string; answer: string | string[] }[];
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
}

// VIEW TYPES
export type ViewType = 'list' | 'builder' | 'ai' | 'preview' | 'theme';

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

// ============ FORM CONSTANTS ============
export interface BankQuestion {
  id: number;
  title: string;
  type: QuestionType;
  options?: string[];
}

export const Q_TYPES: QuestionTypeOption[] = [
  { value: 'short', label: 'Tra loi ngan', icon: 'short_text' },
  { value: 'paragraph', label: 'Doan van', icon: 'notes' },
  { value: 'radio', label: 'Mot lua chon', icon: 'radio_button_checked' },
  { value: 'checkbox', label: 'Nhieu lua chon', icon: 'check_box' },
  { value: 'dropdown', label: 'Menu chon', icon: 'arrow_drop_down_circle' },
  { value: 'date', label: 'Ngay', icon: 'calendar_today' },
  { value: 'time', label: 'Gio', icon: 'access_time' },
  { value: 'rating', label: 'Danh gia', icon: 'star' },
  { value: 'scale', label: 'Thang do', icon: 'linear_scale' },
];

export const THEMES: Theme[] = [
  { id: 'blue', name: 'Xanh duong', accent: '#1976d2', header: '#1976d2', bg: '#ffffff', font: 'roboto', radius: '8px' },
  { id: 'green', name: 'Xanh la', accent: '#2e7d32', header: '#2e7d32', bg: '#ffffff', font: 'roboto', radius: '8px' },
  { id: 'purple', name: 'Tim', accent: '#7b1fa2', header: '#7b1fa2', bg: '#ffffff', font: 'roboto', radius: '8px' },
  { id: 'orange', name: 'Cam', accent: '#f57c00', header: '#f57c00', bg: '#ffffff', font: 'roboto', radius: '8px' },
  { id: 'red', name: 'Do', accent: '#c62828', header: '#c62828', bg: '#ffffff', font: 'roboto', radius: '8px' },
  { id: 'slate', name: 'Xam', accent: '#455a64', header: '#455a64', bg: '#ffffff', font: 'roboto', radius: '8px' },
];

export const ACCENT_COLORS: string[] = [
  '#1976d2',
  '#2e7d32',
  '#f57c00',
  '#c62828',
  '#7b1fa2',
  '#455a64',
];

export const FONTS: FontOption[] = [
  { name: 'Roboto', val: 'roboto' },
  { name: 'Open Sans', val: 'open-sans' },
  { name: 'Lato', val: 'lato' },
  { name: 'Poppins', val: 'poppins' },
  { name: 'Montserrat', val: 'montserrat' },
];

export const RADIUS_OPTIONS: RadiusOption[] = [
  { name: 'Goc canh', val: '0px' },
  { name: 'Nho', val: '4px' },
  { name: 'Vua', val: '8px' },
  { name: 'Lon', val: '12px' },
];

export const SUGGESTIONS: string[] = [
  'Khao sat viec lam sau tot nghiep',
  'Danh gia chuong trinh dao tao',
  'Phan hoi ve hoc phan',
  'Khao sat doanh nghiep doi tac',
  'Danh gia giang vien',
  'Khuon yeu cau thuc tap',
  'Khao sat sau su kien',
];

export const QUESTION_BANK: BankQuestion[] = [
  { id: 1, title: 'Ho va ten', type: 'short', options: [] },
  { id: 2, title: 'Ngay sinh', type: 'date', options: [] },
  { id: 3, title: 'Gioi tinh', type: 'radio', options: ['Nam', 'Nu', 'Khac'] },
  { id: 4, title: 'Email', type: 'short', options: [] },
  { id: 5, title: 'So dien thoai', type: 'short', options: [] },
  { id: 6, title: 'Lop', type: 'dropdown', options: ['MHTA', 'KHTB', 'CNTT2020'] },
  { id: 7, title: 'Nganh hoc', type: 'radio', options: ['MMT&TTDL', 'KHDL&TTNT'] },
  { id: 8, title: 'Nam hoc', type: 'dropdown', options: ['Nam 1', 'Nam 2', 'Nam 3', 'Nam 4'] },
  { id: 9, title: 'Tinh trang viec lam', type: 'radio', options: ['Da co viec lam', 'Tiep tuc hoc', 'Chua co viec lam'] },
  { id: 10, title: 'Muc do hai long', type: 'rating', options: [] },
  { id: 11, title: 'Y kien dong gop', type: 'paragraph', options: [] },
];
