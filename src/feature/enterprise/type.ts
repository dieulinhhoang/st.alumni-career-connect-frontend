 export type PartnerStatus = "active" | "inactive";
export type JobStatus     = "active" | "closed";

 
export interface Enterprise {
  id: string;
  name: string;
  abbr: string;
  color: string;
  industry: string;
  website: string;
  email: string;
  phone: string;
  jobs: number;
  verified: boolean;
  joinedDate: string;
  faculties: string[];
  partnerStatus: PartnerStatus;
  size: string;
  address: string;
  description: string;
}

export interface Job {
  id: string;
  title: string;
  location: string;
  salary: string;
  tags: string[];
  deadline: string | null;
  status: JobStatus;
  postedAt: string;
  faculties: string[];
}

 
export type EnterpriseFormValues = Omit<Enterprise, "id" | "color" | "jobs" | "verified" | "joinedDate" | "partnerStatus">;

export type JobFormValues = Omit<Job, "id" | "postedAt">;

 
/** Key dùng trong API / data — KHÔNG đổi */
export const ALL_FACULTIES = [
  "Faculty of IT",
  "Faculty of Economics",
  "Faculty of Agriculture",
  "Faculty of Environment",
  "Faculty of Veterinary Medicine",
  "Faculty of Food Technology",
  "Faculty of Mech. & Elec. Engineering",
] as const;

export type FacultyKey = typeof ALL_FACULTIES[number];

/** Màu theo khoa — đến từ API (facultyApi) */
export const FACULTY_COLOR_MAP: Record<FacultyKey, string> = {
  "Faculty of IT":                        "#7c3aed",
  "Faculty of Economics":                 "#059669",
  "Faculty of Agriculture":               "#d97706",
  "Faculty of Environment":               "#0284c7",
  "Faculty of Veterinary Medicine":       "#db2777",
  "Faculty of Food Technology":           "#ea580c",
  "Faculty of Mech. & Elec. Engineering": "#0891b2",
};

/** Tên hiển thị tiếng Việt */
export const FACULTY_VI_NAME: Record<FacultyKey, string> = {
  "Faculty of IT":                        "Khoa CNTT",
  "Faculty of Economics":                 "Khoa Kinh tế",
  "Faculty of Agriculture":               "Khoa Nông nghiệp",
  "Faculty of Environment":               "Khoa Môi trường",
  "Faculty of Veterinary Medicine":       "Khoa Thú y",
  "Faculty of Food Technology":           "Khoa Công nghệ Thực phẩm",
  "Faculty of Mech. & Elec. Engineering": "Khoa Cơ - Điện",
};

 
export const INDUSTRIES = [
  "Công nghệ thông tin",
  "Ngân hàng & Tài chính",
  "Tập đoàn đa ngành",
  "Công nghiệp & Sản xuất",
  "Nông nghiệp & FMCG",
  "Kiểm toán & Tư vấn",
  "Viễn thông",
] as const;

export const ENTERPRISE_SIZES = [
  "Dưới 100 nhân viên",
  "100–500 nhân viên",
  "500–1.000 nhân viên",
  "1.000–5.000 nhân viên",
  "5.000–10.000 nhân viên",
  "10.000+ nhân viên",
  "20.000+ nhân viên",
  "30.000+ nhân viên",
  "40.000+ nhân viên",
  "50.000+ nhân viên",
  "100.000+ nhân viên",
] as const;

export const JOB_LOCATIONS = [
  "Hà Nội", "TP.HCM", "Đà Nẵng", "Hải Phòng",
  "Cần Thơ", "Nghệ An", "Bình Dương", "Đồng Nai",
  "Toàn quốc", "Làm từ xa",
] as const;