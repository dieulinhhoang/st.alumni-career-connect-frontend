export type PartnerStatus = "active" | "inactive";
export type JobStatus = "pending" | "active" | "closed" | "rejected";

export interface Faculty {
  id: string;
  name: string;
  code?: string;
  color?: string | null;
}

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
  // BE findOne trả về faculties[] (từ enterpriseFaculties relation)
  faculties?: Faculty[];
  partnerStatus: PartnerStatus;
  size: string;
  address: string;
  description: string;
}

export interface Job {
  id: string;
  title: string;
  description?: string | null;
  location: string;
  salary: string;
  tags: string[];
  deadline: string | null;
  status: JobStatus;
  postedAt: string;
  faculty?: string | Faculty | null;
  rejectionReason?: string | null;
}

// faculties là mảng id string gửi lên BE
export type EnterpriseFormValues = Omit<
  Enterprise,
  "id" | "color" | "jobs" | "verified" | "joinedDate" | "partnerStatus" | "faculties"
> & {
  faculties?: string[];
};

export type JobFormValues = Omit<Job, "id" | "postedAt">;

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
  "Hà Nội",
  "TP.HCM",
  "Đà Nẵng",
  "Hải Phòng",
  "Cần Thơ",
  "Nghệ An",
  "Bình Dương",
  "Đồng Nai",
  "Toàn quốc",
  "Làm từ xa",
] as const;
