//  QUESTION TYPES 
export type QuestionType = "short" | "long" | "radio" | "checkbox" | "email" | "date" | "tel" |
"address" | "dropdown" ;

export interface QuestionOption {
  id: string;
  label: string;
}

export interface Question {
  id: string;
  type: QuestionType;
  title: string;
  required: boolean;
  options: QuestionOption[];
}

//  THEME TYPES 
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

//  FORM TYPES 
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

//  VIEW TYPES 
export type ViewType = "list" | "builder" | "ai" | "preview" | "theme";

//  Q_TYPES META 
export interface QuestionTypeMeta {
  value: QuestionType;
  label: string;
  icon: string;
}

//  ALIASES used by constants.ts 
export type QuestionTypeOption = QuestionTypeMeta;

export interface FontOption {
  name: string;
  val: string;
}

export interface RadiusOption {
  name: string;
  val: string;
}

//  API PAYLOAD TYPES 
export interface CreateFormPayload {
  name: string;
  description: string;
  questions: Question[];
  themeId?: string;
}

export interface UpdateFormPayload {
  name?: string;
  description?: string;
  questions?: Question[];
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
  questions: Question[];
}