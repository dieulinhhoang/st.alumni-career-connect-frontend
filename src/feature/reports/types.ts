export type SubmissionStatus = 'draft' | 'submitted' | 'returned' | 'approved';

export type FilterState = {
  surveyId: string;
  facultyId?: string;   // ID khoa (optional)
  majorId?: string;     // ID ngành (optional)
};

export type UserScope = 'school' | 'faculty' | 'major';

export type CurrentUser = {
  id: string;
  name: string;
  scope: UserScope;
  facultyName?: string | null;
  majorName?: string | null;
};

export type Stats = {
  totalGraduates: number;
  submitted: number;
  submissionRate: number;
  employed: number;
  employmentRate: number;
  relevantJobRate: number;
  avgSalary: string;
};

export type MajorSummaryRow = {
  key: string;
  majorCode: string;
  majorName: string;
  facultyName?: string;
  total: number;
  totalNu: number;
  submitted: number;
  submittedNu: number;
  coViecLam: number;
  tiepTucHoc: number;
  chuaCoViecLam: number;
  approved: number;
  kvNhaNuoc: number;
  kvTuNhan: number;
  kvTuTao: number;
  kvYNuocNgoai: number;
  workLocation: string;
};

export type GraduateRow = {
  key: string;
  studentCode: string;
  fullName: string;
  gender: 'male' | 'female';
  certification: string;
  cccd: string;
  majorCode: string;
  majorName: string;
  facultyName: string;
  decision: string;
  certDate: string;
  phone: string;
  email: string;
  surveyMethod: string;
  status: SubmissionStatus;
  note: string;
  cohort: string;
};

export type ResponseRow = {
  key: string;
  studentCode: string;
  fullName: string;
  dob: string;
  gender: 'male' | 'female';
  cccd: string;
  majorCode: string;
  majorName?: string;
  facultyName?: string;
  dungNganh: boolean;
  lienQuan: boolean;
  khongLienQuan: boolean;
  tiepTucHoc: boolean;
  chuaCoVl: boolean;
  kvNhaNuoc: boolean;
  kvTuNhan: boolean;
  kvTuTao: boolean;
  kvYNuocNgoai: boolean;
  workLocation: string;
  thoiGianDuoi3Thang: boolean;
  thoiGian3Den6Thang: boolean;
  thoiGian6Den12Thang: boolean;
  thoiGian12ThangTroLen: boolean;
  hocDu: boolean;
  hocMotPhan: boolean;
  khôngHocDuoc: boolean;
  salary: number;
  avgIncome: number;
  searchMethod: string;
  hiringMethod: string;
  knGiaoTiep: boolean;
  knThuyetTrinh: boolean;
  knLamViecNhom: boolean;
  knVietBaoCao: boolean;
  knLanhDao: boolean;
  knTiengAnh: boolean;
  knTinHoc: boolean;
  knHoiNhap: boolean;
  knKhac: boolean;
  postGradCourse: string;
  giaiPhap: string;
};

export type FacultySubmissionRow = {
  key: string;
  facultyCode: string;
  facultyName: string;
  status: SubmissionStatus;
  submittedBy: string | null;
  submittedAt: string | null;
  deadline: string | null;
  feedback: string | null;
};

export type ReportMeta = {
  mau01Title: string;
  mau02Title: string;
  mau03Title: string;
  mau01Note: string;
  mau02Note: string;
  mau03Note: string;
};

// Option cho dropdown khoa/ngành
export type FacultyOption = { value: string; label: string };
export type MajorOption  = { value: string; label: string; facultyId: string };