export interface Graduation {
  id: number;
  name: string;
  school_year: string;
  certification: string;
  certification_date: string;
  faculty_id: number;
  student_count: number;
  created_at: string;
  updated_at: string;
}

export interface GraduationStudent {
  id: number;
  code: string;
  full_name: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  dob: string;
  gender: string; // "male" | "female"
  citizen_identification: string;
  training_industry_id: number;
  training_industry_code?: string;
  training_industry_name?: string;
  school_year_end: string;
}

export interface PaginationMeta {
  total: number;
  per_page: number;
  current_page: number;
  last_page: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: PaginationMeta;
}