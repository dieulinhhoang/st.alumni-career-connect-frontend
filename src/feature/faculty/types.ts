// Khớp với Faculty entity từ BE (src/database/entities/faculty.entity.ts)
export interface Faculty {
  id: number;
  name: string;
  abbr: string | null;
  slug: string | null;
  color: string | null;
  status: number; // 1 = đang hoạt động, 0 = không hoạt động
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

// Response từ GET /faculty (có phân trang)
export interface FacultyListResponse {
  items: Faculty[];
  page: number;
  size: number;
  total: number;
  totalPages: number;
}

// Query params cho GET /faculty
export interface FacultyQuery {
  page?: number;
  size?: number;
  name?: string;    // tìm kiếm theo tên (LIKE %name%)
  status?: number;  // lọc theo status (0 hoặc 1)
}
export interface Major {
  id: string;
  slug: string;
  facultySlug: string;
  name: string;
  code: string;
  khoa: number[];
  classes: number;
  students: number;
}
export interface ClassItem {
  id: string;
  name: string;
  khoa: number;
  students: number;
  advisor: string;
}