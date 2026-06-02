import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("accessToken");
      window.location.href = `${import.meta.env.VITE_API_URL}/auth/sso/redirect`;
    }
    return Promise.reject(error);
  }
);

// src/libs/mock/index.ts
// Centralized mock data & handlers for st.alumni-career-connect-frontend

// ============ TYPES ============
interface MockRole {
  _id: string; code: string; name: string; description: string;
  isDeleted: boolean; createdAt: string; updatedAt: string;
  createdBy: { fullName: string }; updatedBy: { fullName: string };
  permissions: { resource: string; action: string }[];
}
interface MockUser {
  _id: string; userName: string; fullName: string; email: string;
  mobile: string; address: string; age: number; sex: string; bod: string;
  isSupperAdmin: boolean; roles: string[]; isSuspended: boolean; isDeleted: boolean;
  createdAt: string; updatedAt: string;
  createdBy: { fullName: string }; updatedBy: { fullName: string };
}
interface MockResource {
  _id: string; code: string; name: string; actions: string[];
}
interface MockFaculty {
  id: string; slug: string; name: string; abbr: string; color: string;
  majors: number; classes: number; students: number;
}
interface MockMajor {
  id: string; slug: string; facultySlug: string; name: string; code: string;
  khoa: number[]; classes: number; students: number;
}
interface MockClass {
  id: string; name: string; khoa: number; students: number; advisor: string;
}
interface MockEnterprise {
  id: string; name: string; abbr: string; color: string; industry: string;
  website: string; email: string; phone: string; jobs: number; verified: boolean;
  joinedDate: string; faculties: string[]; partnerStatus: string; size: string;
  address: string; description: string;
}
interface MockJob {
  id: string; title: string; location: string; salary: string; tags: string[];
  deadline: string | null; status: string; postedAt: string; faculties: string[];
}
interface MockGraduation {
  id: number; name: string; school_year: string; student_count: number;
  certification: string; certification_date: string; faculty_id: number;
  created_at: string; updated_at: string;
}
interface MockGraduationStudent {
  id: number; code: string; full_name: string; first_name: string;
  last_name: string; email: string; phone: string; dob: string;
  gender: string; citizen_identification: string; training_industry_id: number;
  training_industry_code: string; training_industry_name: string; school_year_end: string;
}
interface MockForm {
  id: number; name: string;
}
interface MockFormQuestion {
  id: string; title: string; chartType: string;
}
interface MockSurveyBatch {
  id: number; title: string; description: string; formId: number;
  formSnapshot: any; status: string; startDate: string; endDate: string;
  year: number; graduationPeriod: string; totalStudents: number;
  responses: MockBatchResponse[]; createdAt: string; updatedAt: string;
}
interface MockBatchResponse {
  id: number; batchId: number; studentId: string; studentName: string;
  studentEmail: string; studentPhone?: string; khoa: string; nganh: string;
  lop: string; answers: Record<string, string>; submittedAt: string; status: string;
}
interface MockJobPosting {
  id: string; enterpriseId: string; enterpriseName: string; title: string;
  location: string; salaryRange: string; tags: string[]; postedAt: string; deadline?: string;
}
interface MockAlumniProfile {
  id: string; studentCode: string; fullName: string; major: string;
  graduationYear: number; currentPosition: string; currentCompany: string; email?: string;
}
interface MockReport {
  id: string; title: string; type: string; status: string; createdBy: string;
  createdAt: string; totalStudents?: number; passedRate?: number;
  employmentRate?: number; totalEnterprises?: number; score?: number;
}

// ============ MOCK DATA ============

// ====== Roles ======
let mockRoles: MockRole[] = [
  {
    _id: '1', code: 'ADMIN', name: 'Quan tri vien', description: 'Toan quyen he thong', isDeleted: false,
    createdAt: '2025-01-01T00:00:00Z', updatedAt: '2025-01-01T00:00:00Z',
    createdBy: { fullName: 'System' }, updatedBy: { fullName: 'System' },
    permissions: [
      { resource: 'users', action: 'create' }, { resource: 'users', action: 'read' },
      { resource: 'users', action: 'update' }, { resource: 'users', action: 'delete' },
      { resource: 'roles', action: 'create' }, { resource: 'roles', action: 'read' },
      { resource: 'roles', action: 'update' }, { resource: 'roles', action: 'delete' },
      { resource: 'resources', action: 'create' }, { resource: 'resources', action: 'read' },
      { resource: 'resources', action: 'update' }, { resource: 'resources', action: 'delete' },
    ]
  },
  {
    _id: '2', code: 'TEACHER', name: 'Giao vien', description: 'Quan ly sinh vien va bai giang', isDeleted: false,
    createdAt: '2025-01-01T00:00:00Z', updatedAt: '2025-01-01T00:00:00Z',
    createdBy: { fullName: 'Admin' }, updatedBy: { fullName: 'Admin' },
    permissions: [
      { resource: 'students', action: 'read' }, { resource: 'students', action: 'update' },
      { resource: 'courses', action: 'read' }, { resource: 'courses', action: 'create' },
    ]
  },
  {
    _id: '3', code: 'STUDENT', name: 'Sinh vien', description: 'Xem thong tin khoa hoc', isDeleted: false,
    createdAt: '2025-01-01T00:00:00Z', updatedAt: '2025-01-01T00:00:00Z',
    createdBy: { fullName: 'Admin' }, updatedBy: { fullName: 'Admin' },
    permissions: [{ resource: 'courses', action: 'read' }]
  }
];

// ====== Users ======
let mockUsers: MockUser[] = [
  {
    _id: '1', userName: 'admin', fullName: 'Administrator', email: 'admin@vnua.edu.vn',
    mobile: '0912345678', address: 'Gia Lam, Ha Noi', age: 30, sex: '0', bod: '1994-01-01',
    isSupperAdmin: true, roles: ['1'], isSuspended: false, isDeleted: false,
    createdAt: '2025-01-01T00:00:00Z', updatedAt: '2025-01-01T00:00:00Z',
    createdBy: { fullName: 'System' }, updatedBy: { fullName: 'System' }
  },
  {
    _id: '2', userName: 'teacher1', fullName: 'Nguyen Van A', email: 'teacher1@vnua.edu.vn',
    mobile: '0987654321', address: 'Ha Noi', age: 35, sex: '0', bod: '1989-05-15',
    isSupperAdmin: false, roles: ['2'], isSuspended: false, isDeleted: false,
    createdAt: '2025-01-01T00:00:00Z', updatedAt: '2025-01-01T00:00:00Z',
    createdBy: { fullName: 'Admin' }, updatedBy: { fullName: 'Admin' }
  },
  {
    _id: '3', userName: 'student1', fullName: 'Tran Thi B', email: 'student1@sv.vnua.edu.vn',
    mobile: '0934567890', address: 'Ha Noi', age: 22, sex: '1', bod: '2002-03-20',
    isSupperAdmin: false, roles: ['3'], isSuspended: false, isDeleted: false,
    createdAt: '2025-01-01T00:00:00Z', updatedAt: '2025-01-01T00:00:00Z',
    createdBy: { fullName: 'Admin' }, updatedBy: { fullName: 'Admin' }
  }
];

// ====== Resources ======
const mockResources: MockResource[] = [
  { _id: '1', code: 'users', name: 'Quan ly nguoi dung', actions: ['create','read','update','delete'] },
  { _id: '2', code: 'roles', name: 'Quan ly vai tro', actions: ['create','read','update','delete'] },
  { _id: '3', code: 'resources', name: 'Quan ly tai nguyen', actions: ['create','read','update','delete'] },
  { _id: '4', code: 'students', name: 'Quan ly sinh vien', actions: ['create','read','update','delete'] },
  { _id: '5', code: 'courses', name: 'Quan ly khoa hoc', actions: ['create','read','update','delete'] }
];

// ====== Faculty ======
const mockFaculties: MockFaculty[] = [
  { id: '1', slug: 'cong-nghe-thong-tin', name: 'Cong nghe thong tin', abbr: 'CNTT', color: '#7c3aed', majors: 4, classes: 20, students: 1050 },
  { id: '2', slug: 'kinh-te', name: 'Kinh te', abbr: 'KT', color: '#0ea5e9', majors: 3, classes: 16, students: 890 },
  { id: '3', slug: 'nong-nghiep', name: 'Nong nghiep', abbr: 'NN', color: '#16a34a', majors: 6, classes: 28, students: 1420 },
  { id: '4', slug: 'cong-nghe-sinh-hoc', name: 'Cong nghe sinh hoc', abbr: 'CNSH', color: '#f59e0b', majors: 3, classes: 12, students: 580 },
  { id: '5', slug: 'quan-ly-dat-dai', name: 'Quan ly dat dai', abbr: 'QLDD', color: '#ef4444', majors: 2, classes: 9, students: 400 },
  { id: '6', slug: 'thu-y', name: 'Thu y', abbr: 'TY', color: '#8b5cf6', majors: 2, classes: 11, students: 490 },
  { id: '7', slug: 'cong-nghe-thuc-pham', name: 'Cong nghe thuc pham', abbr: 'CNTP', color: '#ec4899', majors: 3, classes: 14, students: 660 },
  { id: '8', slug: 'moi-truong', name: 'Moi truong', abbr: 'MT', color: '#14b8a6', majors: 3, classes: 10, students: 450 }
];

const mockMajors: MockMajor[] = [
  { id: '1', slug: 'cong-nghe-thong-tin', facultySlug: 'cong-nghe-thong-tin', name: 'Cong nghe thong tin', code: 'CNTT', khoa: [2021,2022,2023,2024], classes: 8, students: 320 },
  { id: '2', slug: 'he-thong-thong-tin', facultySlug: 'cong-nghe-thong-tin', name: 'He thong thong tin', code: 'HTTT', khoa: [2021,2022,2023], classes: 6, students: 240 },
  { id: '3', slug: 'mang-may-tinh', facultySlug: 'cong-nghe-thong-tin', name: 'Mang may tinh va truyen thong du lieu', code: 'MMT', khoa: [2022,2023,2024], classes: 4, students: 160 },
  { id: '4', slug: 'khoa-hoc-du-lieu', facultySlug: 'cong-nghe-thong-tin', name: 'Khoa hoc du lieu va tri tue nhan tao', code: 'KHDL', khoa: [2023,2024], classes: 2, students: 80 }
];

const mockClasses: MockClass[] = [
  { id: '1', name: 'CNTT66A', khoa: 2021, students: 42, advisor: 'TS. Nguyen Van A' },
  { id: '2', name: 'CNTT66B', khoa: 2021, students: 38, advisor: 'TS. Tran Thi B' },
  { id: '3', name: 'CNTT67A', khoa: 2022, students: 45, advisor: 'PGS. Le Van C' },
  { id: '4', name: 'CNTT67B', khoa: 2022, students: 40, advisor: 'TS. Pham Thi D' },
  { id: '5', name: 'CNTT68A', khoa: 2023, students: 50, advisor: 'TS. Hoang Van E' },
  { id: '6', name: 'CNTT68B', khoa: 2023, students: 47, advisor: 'TS. Vu Thi F' },
  { id: '7', name: 'CNTT69A', khoa: 2024, students: 52, advisor: 'TS. Do Van G' },
  { id: '8', name: 'CNTT69B', khoa: 2024, students: 48, advisor: 'TS. Bui Thi H' }
];

// ====== Enterprise ======
const mockEnterprises: MockEnterprise[] = [
  { id: '1', name: 'FPT Software', abbr: 'FPT', color: '#7c3aed', industry: 'Cong nghe thong tin',
    website: 'fpt.com.vn', email: 'hr@fpt.com.vn', phone: '024 7300 7300', jobs: 42, verified: true,
    joinedDate: '01/2023', faculties: ['Khoa CNTT','Khoa Kinh te'], partnerStatus: 'active',
    size: '10.000+', address: 'Ha Noi', description: 'FPT Software cong ty CNTT hang dau Viet Nam' },
  { id: '2', name: 'Vingroup', abbr: 'VIC', color: '#db2777', industry: 'Tap doan da nganh',
    website: 'vingroup.net', email: 'hr@vingroup.net', phone: '024 3974 9999', jobs: 28, verified: true,
    joinedDate: '03/2023', faculties: ['Khoa Kinh te','Khoa CNTT'], partnerStatus: 'active',
    size: '50.000+', address: 'Ha Noi', description: 'Vingroup tap doan kinh te tu nhan lon nhat Viet Nam' },
  { id: '3', name: 'Agribank', abbr: 'AGR', color: '#059669', industry: 'Ngan hang & Tai chinh',
    website: 'agribank.com.vn', email: 'hr@agribank.vn', phone: '1900 558 818', jobs: 15, verified: true,
    joinedDate: '06/2023', faculties: ['Khoa Kinh te'], partnerStatus: 'active',
    size: '40.000+', address: 'Ha Noi', description: 'Ngan hang Nong nghiep va Phat trien Nong thon Viet Nam' },
  { id: '4', name: 'Dabaco Group', abbr: 'DBC', color: '#0284c7', industry: 'Nong nghiep & Chan nuoi',
    website: 'dabaco.com.vn', email: 'hr@dabaco.com.vn', phone: '0222 382 2555', jobs: 20, verified: true,
    joinedDate: '01/2024', faculties: ['Khoa Nong nghiep','Khoa Thu y'], partnerStatus: 'active',
    size: '5.000+', address: 'Bac Ninh', description: 'Tap doan Chan nuoi va Thuc pham Dabaco' },
  { id: '5', name: 'Masan Group', abbr: 'MSN', color: '#d97706', industry: 'Nong nghiep & FMCG',
    website: 'masangroup.com', email: 'hr@masangroup.com', phone: '028 6656 6656', jobs: 19, verified: true,
    joinedDate: '02/2024', faculties: ['Khoa Nong nghiep'], partnerStatus: 'active',
    size: '30.000+', address: 'TP.HCM', description: 'Masan Group - tap doan hang tieu dung hang dau' },
  { id: '6', name: 'KPMG Vietnam', abbr: 'KPMG', color: '#ea580c', industry: 'Kiem toan & Tu van',
    website: 'kpmg.com/vn', email: 'hr@kpmg.com.vn', phone: '028 3821 9266', jobs: 11, verified: false,
    joinedDate: '05/2024', faculties: ['Khoa Kinh te'], partnerStatus: 'inactive',
    size: '1.000+', address: 'TP.HCM', description: 'KPMG cong ty kiem toan va tu van quoc te' }
];

const mockJobs: Record<string, MockJob[]> = {
  '1': [
    { id: 'j1', title: 'Lap trinh vien Backend (Java)', location: 'Ha Noi', salary: '15-25 trieu',
      tags: ['Java','Spring Boot'], deadline: '10/04/2025', status: 'active',
      postedAt: '10/03/2025', faculties: ['Khoa CNTT'] },
    { id: 'j2', title: 'Lap trinh vien Frontend (React)', location: 'Ha Noi', salary: '12-22 trieu',
      tags: ['React','TypeScript'], deadline: null, status: 'active',
      postedAt: '11/03/2025', faculties: ['Khoa CNTT'] },
    { id: 'j3', title: 'Ky su DevOps', location: 'Ha Noi', salary: '20-35 trieu',
      tags: ['Docker','Kubernetes'], deadline: '30/04/2025', status: 'active',
      postedAt: '08/03/2025', faculties: ['Khoa CNTT'] }
  ],
  '2': [
    { id: 'j7', title: 'Ky su Du lieu', location: 'Ha Noi', salary: '18-30 trieu',
      tags: ['Python','SQL'], deadline: '05/04/2025', status: 'active',
      postedAt: '08/03/2025', faculties: ['Khoa CNTT','Khoa Kinh te'] },
    { id: 'j8', title: 'Product Manager', location: 'Ha Noi', salary: '25-40 trieu',
      tags: ['Product','Agile'], deadline: null, status: 'active',
      postedAt: '06/03/2025', faculties: ['Khoa Kinh te'] }
  ],
  '4': [
    { id: 'j10', title: 'Ky su Chan nuoi', location: 'Bac Ninh', salary: '12-18 trieu',
      tags: ['Chan nuoi','Thu y'], deadline: null, status: 'active',
      postedAt: '09/03/2025', faculties: ['Khoa Thu y','Khoa Nong nghiep'] }
  ]
};

// ====== Graduation ======
let mockGraduations: MockGraduation[] = [
  { id: 1, name: 'DSSVTN nganh MMT&TTDL va KHDL&TTNT - KSVL cho kiem dinh 2026',
    school_year: '2025', student_count: 13, certification: 'QD-123/HVNN',
    certification_date: '2026-01-15T00:00:00', faculty_id: 1,
    created_at: '2026-01-01T00:00:00', updated_at: '2026-03-18T01:12:00' },
  { id: 2, name: 'Dot tot nghiep thang 6 nam 2025 - Khoa CNTT',
    school_year: '2025', student_count: 248, certification: 'QD-456/CNTT',
    certification_date: '2025-06-01T00:00:00', faculty_id: 2,
    created_at: '2025-05-01T00:00:00', updated_at: '2026-02-10T08:30:00' },
  { id: 3, name: 'Dot tot nghiep thang 12 nam 2024 - Toan hoc vien',
    school_year: '2024', student_count: 512, certification: 'QD-789/HVNN',
    certification_date: '2024-12-05T00:00:00', faculty_id: 1,
    created_at: '2024-11-01T00:00:00', updated_at: '2025-12-20T14:00:00' }
];

const mockGradStudents: MockGraduationStudent[] = [
  { id: 1, code: '650215001', full_name: 'Nguyen Van An', first_name: 'An', last_name: 'Nguyen Van',
    email: 'an.nguyen@sv.vnua.edu.vn', phone: '0901234567', dob: '2002-05-10', gender: 'male',
    citizen_identification: '001202012345', training_industry_id: 1, training_industry_code: '7480201',
    training_industry_name: 'Mang may tinh va truyen thong du lieu', school_year_end: '2025' },
  { id: 2, code: '650215002', full_name: 'Tran Thi Bich', first_name: 'Bich', last_name: 'Tran Thi',
    email: 'bich.tran@sv.vnua.edu.vn', phone: '0912345678', dob: '2002-08-22', gender: 'female',
    citizen_identification: '001202098765', training_industry_id: 1, training_industry_code: '7480201',
    training_industry_name: 'Mang may tinh va truyen thong du lieu', school_year_end: '2025' },
  { id: 3, code: '650215003', full_name: 'Le Hoang Duy', first_name: 'Duy', last_name: 'Le Hoang',
    email: 'duy.le@sv.vnua.edu.vn', phone: '0923456789', dob: '2001-12-03', gender: 'male',
    citizen_identification: '001201056789', training_industry_id: 2, training_industry_code: '7480104',
    training_industry_name: 'He thong thong tin', school_year_end: '2025' }
];

// ====== Home/Stats ======
const mockSurveyStats = {
  totalRespondents: 3840, overallEmploymentRate: 85, avgSalaryMillionVND: 13.5,
  partnerCompanies: 45, stillStudying: 420,
  byMajor: [
    { major: 'Cong nghe thong tin', majorCode: 'CNTT', employmentRate: 89, avgSalaryMillionVND: 17.2, respondents: 580 },
    { major: 'Nong nghiep & Sinh hoc', majorCode: 'NN', employmentRate: 76, avgSalaryMillionVND: 10.8, respondents: 920 },
    { major: 'Kinh te & Quan tri', majorCode: 'KT', employmentRate: 83, avgSalaryMillionVND: 13.5, respondents: 810 },
    { major: 'Moi truong & Tai nguyen', majorCode: 'MT', employmentRate: 70, avgSalaryMillionVND: 10.2, respondents: 490 }
  ],
  byYear: [
    { year: 2020, employmentRate: 78 }, { year: 2021, employmentRate: 80 },
    { year: 2022, employmentRate: 82 }, { year: 2023, employmentRate: 84 }, { year: 2024, employmentRate: 85 }
  ],
  statusDistribution: {
    employed_relevant: 1680, employed_irrelevant: 790, seeking: 290,
    postgrad: 420, self_employed: 480, other: 180
  }
};

const mockHomeEnterprises: MockEnterprise[] = mockEnterprises.map(e => ({
  ...e,
  website: '', email: '', phone: '', joinedDate: '', faculties: [],
  partnerStatus: '', size: '', address: '', description: ''
}));

const mockJobPostings: MockJobPosting[] = [
  { id: 'j1', enterpriseId: '1', enterpriseName: 'FPT Software', title: 'Backend Developer (Java)',
    location: 'Ha Noi', salaryRange: '15-25 trieu', tags: ['Java','Spring Boot'], postedAt: '2025-03-10', deadline: '2025-04-10' },
  { id: 'j2', enterpriseId: '1', enterpriseName: 'FPT Software', title: 'Frontend Developer (React)',
    location: 'Ha Noi', salaryRange: '12-22 trieu', tags: ['React','TypeScript'], postedAt: '2025-03-11' },
  { id: 'j3', enterpriseId: '2', enterpriseName: 'Vingroup', title: 'Ky su phan tich du lieu',
    location: 'Ha Noi', salaryRange: '18-30 trieu', tags: ['Python','SQL'], postedAt: '2025-03-08', deadline: '2025-04-05' },
  { id: 'j4', enterpriseId: '3', enterpriseName: 'Agribank', title: 'Chuyen vien tin dung',
    location: 'Ha Noi', salaryRange: '10-15 trieu', tags: ['Tai chinh','Ngan hang'], postedAt: '2025-03-12' },
  { id: 'j5', enterpriseId: '4', enterpriseName: 'Dabaco Group', title: 'Ky su chan nuoi',
    location: 'Bac Ninh', salaryRange: '12-18 trieu', tags: ['Chan nuoi','Thu y'], postedAt: '2025-03-09' },
  { id: 'j6', enterpriseId: '5', enterpriseName: 'Masan Group', title: 'Ky su nong nghiep',
    location: 'Ha Nam', salaryRange: '10-16 trieu', tags: ['Nong nghiep','R&D'], postedAt: '2025-03-07' },
  { id: 'j7', enterpriseId: '6', enterpriseName: 'KPMG Vietnam', title: 'Kiem toan vien',
    location: 'Ha Noi', salaryRange: '15-22 trieu', tags: ['Kiem toan','Excel'], postedAt: '2025-03-05' },
  { id: 'j8', enterpriseId: '2', enterpriseName: 'Vingroup', title: 'Product Manager',
    location: 'Ha Noi', salaryRange: '25-40 trieu', tags: ['Product','Agile'], postedAt: '2025-03-06' },
  { id: 'j9', enterpriseId: '4', enterpriseName: 'Dabaco Group', title: 'Ky su thu y',
    location: 'Bac Ninh', salaryRange: '11-17 trieu', tags: ['Thu y','Dieu tri'], postedAt: '2025-03-04' }
];

const mockAlumniProfiles: MockAlumniProfile[] = [
  { id: '1', studentCode: '640215001', fullName: 'Nguyen Van An', major: 'CNTT', graduationYear: 2022,
    currentPosition: 'Backend Developer', currentCompany: 'FPT Software', email: 'an.nv@fpt.com' },
  { id: '2', studentCode: '640214002', fullName: 'Tran Thi Binh', major: 'KT', graduationYear: 2023,
    currentPosition: 'Chuyen vien tin dung', currentCompany: 'Agribank' },
  { id: '3', studentCode: '630213003', fullName: 'Le Minh Cuong', major: 'NN', graduationYear: 2021,
    currentPosition: 'Ky su nong nghiep', currentCompany: 'Masan Group' },
  { id: '4', studentCode: '640215004', fullName: 'Pham Thi Dung', major: 'MT', graduationYear: 2022,
    currentPosition: 'Chuyen vien moi truong', currentCompany: 'KPMG Vietnam' }
];

// ====== Home / Dashboard Stats ======
const mockHomeStats = {
  totalAlumni: 11280,
  totalEnterprises: 320,
  totalJobs: 980,
  latestRecruitments: 62,
  monthlyAlumniGrowth: [
    { month: 'Jan', count: 85 },
    { month: 'Feb', count: 110 },
    { month: 'Mar', count: 142 },
    { month: 'Apr', count: 178 },
    { month: 'May', count: 165 },
    { month: 'Jun', count: 210 }
  ],
  facultyDistribution: [
    { faculty: 'Khoa CNTT', count: 2850 },
    { faculty: 'Khoa Nong nghiep', count: 2640 },
    { faculty: 'Khoa Kinh te', count: 2100 },
    { faculty: 'Khoa Thu y', count: 1480 },
    { faculty: 'Khoa CNTP', count: 1210 },
    { faculty: 'Khoa Moi truong', count: 1000 }
  ]
};

// ====== Reports ======
let mockReports: MockReport[] = [
  { id: 'r1', title: 'Bao cao tong hop nang luc nguoi hoc', type: 'academic', status: 'completed', createdBy: 'Admin', createdAt: '2025-03-01', totalStudents: 1180, passedRate: 91.2 },
  { id: 'r2', title: 'Thong ke viec lam sau tot nghiep', type: 'employment', status: 'completed', createdBy: 'Admin', createdAt: '2025-02-15', totalStudents: 920, employmentRate: 85.0 },
  { id: 'r3', title: 'Bao cao hop tac doanh nghiep Q1/2025', type: 'enterprise', status: 'pending', createdBy: 'Admin', createdAt: '2025-01-20', totalEnterprises: 120 },
  { id: 'r4', title: 'Danh gia chuong trinh dao tao CNTT', type: 'program', status: 'completed', createdBy: 'Truong khoa', createdAt: '2024-12-10', totalStudents: 420, score: 4.1 },
  { id: 'r5', title: 'Thong ke hoat dong co so vat chat', type: 'facility', status: 'draft', createdBy: 'Admin', createdAt: '2025-03-10' }
];

const mockReportApiResponse = {
  currentUser: {
    id: 'u1',
    name: 'Administrator',
    scope: 'school' as const,
    facultyName: '',
    majorName: '',
  },
  stats: {
    totalGraduates: 1180,
    submitted: 960,
    submissionRate: 81,
    employed: 816,
    employmentRate: 85,
    relevantJobRate: 66,
    avgSalary: '13.5 triệu',
  },
  majorRows: [
    { major: 'Cong nghe thong tin', totalGraduates: 310, submitted: 276, employed: 246, employmentRate: 89.1 },
    { major: 'Kinh te', totalGraduates: 230, submitted: 192, employed: 160, employmentRate: 83.3 },
    { major: 'Nong nghiep', totalGraduates: 300, submitted: 234, employed: 178, employmentRate: 76.1 },
    { major: 'Moi truong', totalGraduates: 170, submitted: 130, employed: 91, employmentRate: 70.0 },
  ],
  graduateRows: [
    { id: 'sv001', name: 'Nguyen Van An', major: 'CNTT', graduationYear: 2024, status: 'employed', company: 'FPT Software', position: 'Backend Developer' },
    { id: 'sv002', name: 'Tran Thi Binh', major: 'KT', graduationYear: 2024, status: 'employed', company: 'Agribank', position: 'Chuyen vien tin dung' },
    { id: 'sv003', name: 'Le Minh Cuong', major: 'NN', graduationYear: 2024, status: 'employed', company: 'Masan Group', position: 'Ky su nong nghiep' },
  ],
  responseRows: [
    { surveyId: 's1', surveyName: 'Khao sat viec lam 2024', responses: 960, completionRate: 81 },
  ],
  facultyRows: [
    { facultyName: 'Khoa CNTT', totalGraduates: 310, submitted: 276, submissionRate: 89.0 },
    { facultyName: 'Khoa Kinh te', totalGraduates: 230, submitted: 192, submissionRate: 83.5 },
    { facultyName: 'Khoa Nong nghiep', totalGraduates: 300, submitted: 234, submissionRate: 78.0 },
    { facultyName: 'Khoa Moi truong', totalGraduates: 170, submitted: 130, submissionRate: 76.5 },
  ],
  reportMeta: {
    generatedAt: new Date().toISOString(),
    surveyName: 'Khao sat viec lam 2024',
    surveyId: 's1',
  },
};

const mockReportTemplates = [
  { id: 't1', name: 'Template bao cao tot nghiep', type: 'graduation', fields: ['studentName', 'faculty', 'gpa', 'job'] },
  { id: 't2', name: 'Template thong ke viec lam', type: 'employment', fields: ['studentName', 'company', 'position', 'salary'] },
  { id: 't3', name: 'Template danh gia doanh nghiep', type: 'enterprise', fields: ['enterpriseName', 'partnership', 'jobs', 'feedback'] }
];

// ====== Statistics ======
const mockStatistics = {
  overview: {
    totalAlumni: 11280,
    totalStudents: 7650,
    totalFaculties: 8,
    totalEnterprises: 320,
    totalJobsPosted: 980
  },
  employmentRate: 85.0,
  averageSalary: 13.5,
  alumniByBatch: [
    { year: 2020, count: 1720 },
    { year: 2021, count: 1980 },
    { year: 2022, count: 2200 },
    { year: 2023, count: 2480 },
    { year: 2024, count: 2680 }
  ],
  graduatesByFaculty: [
    { faculty: 'Khoa CNTT', graduates: 2850 },
    { faculty: 'Khoa Nong nghiep', graduates: 2640 },
    { faculty: 'Khoa Kinh te', graduates: 2100 },
    { faculty: 'Khoa Thu y', graduates: 1480 }
  ],
  recentStats: [
    { label: 'Sinh vien nhap hoc', value: 2800, change: '+4.5%' },
    { label: 'Ti le bo hoc', value: 1.8, change: '-0.2%' },
    { label: 'Tham gia thuc tap', value: 85, change: '+10%' },
    { label: 'Tham du Ngay hoi viec lam', value: 130, change: '+6%' }
  ]
};

// ====== University ======
const mockUniversity = {
  name: 'Hoc vien Nong nghiep Viet Nam',
  abbr: 'VNUA',
  logo: '/assets/logo.png',
  motto: 'Trí tuệ - Sáng tạo - Hội nhập',
  founded: 1956,
  address: 'Xa Gia Lam, Thanh pho Ha Noi',
  phone: '024 6261 7538',
  email: 'hcth@vnua.edu.vn',
  website: 'https://www.vnua.edu.vn',
  totalStudents: 15000,
  totalFaculties: 8,
  totalPrograms: 36,
  faculties: ['Khoa CNTT', 'Khoa Kinh te', 'Khoa Nong nghiep', 'Khoa Thu y', 'Khoa CNTP', 'Khoa Moi truong', 'Khoa CNSH', 'Khoa QLDD'],
  latestNews: [
    { id: 'n1', title: 'Le tot nghiep dot 2 nam 2025', date: '2025-06-15' },
    { id: 'n2', title: 'Hoi thao AI trong nong nghiep thong minh', date: '2025-05-20' },
    { id: 'n3', title: 'Ky ket hop tac voi FPT Software', date: '2025-04-10' }
  ]
};

const mockUniversityCalendar = [
  { id: 'c1', event: 'Hoc ky 2 nam hoc 2024-2025 bat dau', date: '2025-06-01', type: 'academic' },
  { id: 'c2', event: 'Ngay hoi viec lam VNUA 2025', date: '2025-06-15', type: 'career' },
  { id: 'c3', event: 'Bao ve luan van tot nghiep', date: '2025-06-20', type: 'graduation' },
  { id: 'c4', event: 'Hoi thao doanh nghiep - Dabaco Group', date: '2025-06-25', type: 'enterprise' }
];

const mockUniversityNotifications = [
  { id: 'not1', title: 'Thong bao lich thi cuoi ki 2/2024-2025', date: '2025-03-01', priority: 'high', read: false },
  { id: 'not2', title: 'Dang ky thuc tap he 2025', date: '2025-02-28', priority: 'medium', read: true },
  { id: 'not3', title: 'Cap nhat lich giang vien khoa CNTT', date: '2025-02-25', priority: 'low', read: true }
];

// ====== Forms ======
let mockForms: MockForm[] = [
  { id: 1, name: 'Khao sat viec lam sau tot nghiep' },
  { id: 2, name: 'Danh gia nang luc sinh vien' },
  { id: 3, name: 'Feedback tu doanh nghiep' }
];

const mockFormQuestions: MockFormQuestion[] = [
  { id: 'q1', title: 'Trang thai viec lam sau tot nghiep', chartType: 'pie' },
  { id: 'q2', title: 'Muc luong ca nhan', chartType: 'bar' },
  { id: 'q3', title: 'Linh vuc cong tac hien tai', chartType: 'column' },
  { id: 'q4', title: 'Nhu cau dao tao them', chartType: 'bar' },
  { id: 'q5', title: 'Muc do hai long voi chuong trinh dao tao', chartType: 'line' }
];

// ====== Dashboard ======
const mockDashboardWidgets = {
  quickActions: [
    { id: 'qa1', label: 'Quan ly nguoi dung', icon: 'users', link: '/admin/users' },
    { id: 'qa2', label: 'Quan ly khoa', icon: 'building', link: '/admin/faculties' },
    { id: 'qa3', label: 'Doanh nghiep', icon: 'briefcase', link: '/admin/enterprises' },
    { id: 'qa4', label: 'Bao cao & Thong ke', icon: 'chart', link: '/reports' },
    { id: 'qa5', label: 'Hoi trang', icon: 'globe', link: '/home' },
    { id: 'qa6', label: 'Cau hinh', icon: 'settings', link: '/settings' }
  ],
  activityLog: [
    { id: 'log1', action: 'Admin cap nhat ho so sinh vien', user: 'Admin', timestamp: '2025-03-01 10:30' },
    { id: 'log2', action: 'Doanh nghiep moi dang ky: Dabaco Group', user: 'System', timestamp: '2025-03-01 09:15' },
    { id: 'log3', action: 'Xuat bao cao: Thong ke viec lam Q4/2024', user: 'Admin', timestamp: '2025-02-28 16:45' },
    { id: 'log4', action: 'Cap nhat du lieu khoa Nong nghiep', user: 'Truong khoa', timestamp: '2025-02-28 14:20' },
    { id: 'log5', action: 'Tin tuyen dung moi: Backend Developer - FPT', user: 'Enterprise', timestamp: '2025-02-27 11:00' }
  ]
};

// ====== Survey Batches ======
let mockSurveyBatches: MockSurveyBatch[] = [
  {
    id: 1, title: 'Dot khao sat thang 6/2024', description: 'Khao sat viec lam sinh vien tot nghiep 2024',
    formId: 1, formSnapshot: null, status: 'completed', startDate: '2024-06-01', endDate: '2024-06-30',
    year: 2024, graduationPeriod: '2024', totalStudents: 490, responses: [], createdAt: '2024-05-15T00:00:00', updatedAt: '2024-07-01T00:00:00'
  },
  {
    id: 2, title: 'Dot khao sat thang 12/2024', description: 'Khao sat viec lam sinh vien tot nghiep T12/2024',
    formId: 1, formSnapshot: null, status: 'active', startDate: '2024-12-01', endDate: '2024-12-31',
    year: 2024, graduationPeriod: '2024-2', totalStudents: 230, responses: [], createdAt: '2024-11-20T00:00:00', updatedAt: '2024-12-15T00:00:00'
  },
  {
    id: 3, title: 'Dot khao sat thang 6/2025', description: 'Khao sat viec lam sinh vien tot nghiep 2025',
    formId: 1, formSnapshot: null, status: 'draft', startDate: '2025-06-01', endDate: '2025-06-30',
    year: 2025, graduationPeriod: '2025', totalStudents: 0, responses: [], createdAt: '2025-05-01T00:00:00', updatedAt: '2025-05-01T00:00:00'
  },
];

// ====== Helpers ======
function genId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}

function now(): string {
  return new Date().toISOString();
}

// ====== Mock API Handler ======
export function mockApiHandler(
  method: string,
  path: string,
  body?: any,
  params?: any
): any {
  const cleanPath = path.split('?')[0];
  const upperMethod = method.toUpperCase();

  // Dynamic: /graduations/:id/students
  const gradStudentsMatch = cleanPath.match(/^\/graduations\/(\d+)\/students$/);
  if (gradStudentsMatch) return mockGradStudents;

  // Dynamic: /graduations/:id
  const graduationByIdMatch = cleanPath.match(/^\/graduations\/(\d+)$/);
  if (graduationByIdMatch) {
    const gid = parseInt(graduationByIdMatch[1]);
    if (upperMethod === 'GET') return mockGraduations.find(g => g.id === gid) ?? null;
    if (upperMethod === 'PUT' || upperMethod === 'PATCH') {
      const idx = mockGraduations.findIndex(g => g.id === gid);
      if (idx !== -1) {
        mockGraduations[idx] = { ...mockGraduations[idx], ...body, updated_at: now() };
        return mockGraduations[idx];
      }
      return null;
    }
    if (upperMethod === 'DELETE') {
      mockGraduations = mockGraduations.filter(g => g.id !== gid);
      return { success: true };
    }
  }

  // Dynamic: /enterprises/:id/jobs
  const enterpriseJobsMatch = cleanPath.match(/^\/enterprises\/(\d+|[^/]+)\/jobs$/);
  if (enterpriseJobsMatch) {
    const eid = enterpriseJobsMatch[1];
    return (mockJobs as any)[eid] ?? [];
  }

  // Dynamic: /enterprises/:id
  const enterpriseByIdMatch = cleanPath.match(/^\/enterprises\/(\d+|[^/]+)$/);
  if (enterpriseByIdMatch) {
    const eid = enterpriseByIdMatch[1];
    return mockEnterprises.find(e => e.id === eid) ?? null;
  }

  // Dynamic: /forms/:id
  const formByIdMatch = cleanPath.match(/^\/forms\/(\d+)$/);
  if (formByIdMatch) {
    const fid = parseInt(formByIdMatch[1]);
    if (upperMethod === 'GET') return mockForms.find(f => f.id === fid) ?? null;
    if (upperMethod === 'PUT' || upperMethod === 'PATCH') {
      const idx = mockForms.findIndex(f => f.id === fid);
      if (idx !== -1) {
        mockForms[idx] = { ...mockForms[idx], ...body };
        return mockForms[idx];
      }
      return null;
    }
    if (upperMethod === 'DELETE') {
      mockForms = mockForms.filter(f => f.id !== fid);
      return { success: true };
    }
  }

  // Dynamic: /users/:id
  const userByIdMatch = cleanPath.match(/^\/users\/(?!me)([^/]+)$/);
  if (userByIdMatch) {
    const uid = userByIdMatch[1];
    if (upperMethod === 'GET') return mockUsers.find(u => u._id === uid) ?? null;
    if (upperMethod === 'PUT' || upperMethod === 'PATCH') {
      const idx = mockUsers.findIndex(u => u._id === uid);
      if (idx !== -1) {
        mockUsers[idx] = { ...mockUsers[idx], ...body, updatedAt: now() };
        return mockUsers[idx];
      }
      return null;
    }
    if (upperMethod === 'DELETE') {
      mockUsers = mockUsers.filter(u => u._id !== uid);
      return { success: true };
    }
  }

  // Dynamic: /roles/:id
  const roleByIdMatch = cleanPath.match(/^\/roles\/(?!me)([^/]+)$/);
  if (roleByIdMatch) {
    const rid = roleByIdMatch[1];
    if (upperMethod === 'GET') return mockRoles.find(r => r._id === rid) ?? null;
    if (upperMethod === 'PUT' || upperMethod === 'PATCH') {
      const idx = mockRoles.findIndex(r => r._id === rid);
      if (idx !== -1) {
        mockRoles[idx] = { ...mockRoles[idx], ...body, updatedAt: now() };
        return mockRoles[idx];
      }
      return null;
    }
    if (upperMethod === 'DELETE') {
      mockRoles = mockRoles.filter(r => r._id !== rid);
      return { success: true };
    }
  }

  // Dynamic: /survey-batches/:id hoặc /batches/:id
  const surveyBatchByIdMatch = cleanPath.match(/^\/(?:survey-batches|batches)\/(\d+)$/);
  if (surveyBatchByIdMatch) {
    const bid = parseInt(surveyBatchByIdMatch[1]);
    if (upperMethod === 'GET') return mockSurveyBatches.find(b => b.id === bid) ?? null;
    if (upperMethod === 'PUT' || upperMethod === 'PATCH') {
      const idx = mockSurveyBatches.findIndex(b => b.id === bid);
      if (idx !== -1) {
        mockSurveyBatches[idx] = { ...mockSurveyBatches[idx], ...body, updatedAt: now() };
        return mockSurveyBatches[idx];
      }
      return null;
    }
    if (upperMethod === 'DELETE') {
      mockSurveyBatches = mockSurveyBatches.filter(b => b.id !== bid);
      return { success: true };
    }
  }

  // Static routes
  const routes: Record<string, () => any> = {
    // Auth / Me
    '/roles/me': () => mockRoles[0],
    '/users/me': () => mockUsers[0],

    // Roles — POST tạo mới
    '/roles': () => {
      if (upperMethod === 'POST') {
        const newRole: MockRole = {
          _id: genId(),
          ...body,
          isDeleted: false,
          createdAt: now(),
          updatedAt: now(),
          createdBy: { fullName: 'Admin' },
          updatedBy: { fullName: 'Admin' },
          permissions: body?.permissions ?? [],
        };
        mockRoles.push(newRole);
        return newRole;
      }
      return mockRoles;
    },

    // Users — POST tạo mới
    '/users': () => {
      if (upperMethod === 'POST') {
        const newUser: MockUser = {
          _id: genId(),
          ...body,
          isSupperAdmin: false,
          isSuspended: false,
          isDeleted: false,
          createdAt: now(),
          updatedAt: now(),
          createdBy: { fullName: 'Admin' },
          updatedBy: { fullName: 'Admin' },
        };
        mockUsers.push(newUser);
        return newUser;
      }
      return mockUsers;
    },

    // Resources
    '/resources': () => mockResources,

    // Faculty
    '/faculties': () => mockFaculties,
    '/majors': () => mockMajors,
    '/classes': () => mockClasses,

    // Enterprise
    '/enterprises': () => mockEnterprises,
    '/jobs': () => mockJobs,
    '/job-postings': () => mockJobPostings,
    '/alumni/profiles': () => mockAlumniProfiles,

    // Graduation — POST tạo mới
    '/graduations': () => {
      if (upperMethod === 'POST') {
        const nextId = Math.max(...mockGraduations.map(g => g.id)) + 1;
        const newGrad: MockGraduation = {
          id: nextId,
          ...body,
          created_at: now(),
          updated_at: now(),
        };
        mockGraduations.push(newGrad);
        return newGrad;
      }
      return mockGraduations;
    },
    '/grad-students': () => mockGradStudents,

    // Survey Batches — POST tạo mới
    '/survey-batches': () => {
      if (upperMethod === 'POST') {
        const nextId = Math.max(...mockSurveyBatches.map(b => b.id)) + 1;
        const newBatch: MockSurveyBatch = {
          id: nextId,
          ...body,
          responses: [],
          createdAt: now(),
          updatedAt: now(),
        };
        mockSurveyBatches.push(newBatch);
        return newBatch;
      }
      return mockSurveyBatches;
    },
    '/batches': () => mockSurveyBatches,

    // Home / Dashboard
    '/home/stats': () => mockHomeStats,
    '/survey-stats': () => mockSurveyStats,
    '/dashboard/widgets': () => mockDashboardWidgets,

    // Reports — POST /reports trả ReportApiResponse
    '/reports': () => upperMethod === 'POST' ? mockReportApiResponse : mockReports,
    '/report-templates': () => mockReportTemplates,

    // Statistics
    '/statistics': () => mockStatistics,

    // University
    '/university': () => mockUniversity,
    '/university/calendar': () => mockUniversityCalendar,
    '/university/notifications': () => mockUniversityNotifications,

    // Forms — POST tạo mới
    '/forms': () => {
      if (upperMethod === 'POST') {
        const nextId = Math.max(...mockForms.map(f => f.id)) + 1;
        const newForm: MockForm = { id: nextId, ...body };
        mockForms.push(newForm);
        return newForm;
      }
      return mockForms;
    },
    '/form-questions': () => mockFormQuestions,
    '/question-type-options': () => [],
    '/themes': () => [],
    '/fonts': () => [],
    '/radius-options': () => [],
  };

  const handler = routes[cleanPath];
  if (handler) return handler();
  return null;
}

// ====== Exports ======
export {
  mockRoles,
  mockUsers,
  mockResources,
  mockHomeEnterprises,
  mockEnterprises,
  mockJobs,
  mockJobPostings,
  mockAlumniProfiles,
  mockFaculties,
  mockMajors,
  mockClasses,
  mockGraduations,
  mockGradStudents,
  mockSurveyStats,
  mockSurveyBatches,
  mockForms,
  mockFormQuestions,
  mockHomeStats,
  mockDashboardWidgets,
  mockReports,
  mockReportTemplates,
  mockStatistics,
  mockUniversity,
  mockUniversityCalendar,
  mockUniversityNotifications
};
export default api;