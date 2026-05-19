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
interface MockSurveyResponse {
 key: string; totalResponses: number; completionRate: number; formName: string;
 questionTitle: string; chartType: string;
 data: { label: string; value: number; percent: number }[];
}
interface MockDotEntry {
 coViec: number; chuaCoViec: number; dungNganh: number; lienQuan: number;
 traiNganh: number; tiepTucHoc: number; tuNhan: number; nhaNuoc: number;
 tuTaoViec: number; nuocNgoai: number;
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
// ============ MOCK DATA ============
// ====== Roles ======
const mockRoles: MockRole[] = [
 { _id: '1', code: 'ADMIN', name: 'Quan tri vien', description: 'Toan quyen he thong', isDeleted: false,
  createdAt: '2025-01-01T00:00:00Z', updatedAt: '2025-01-01T00:00:00Z',
  createdBy: { fullName: 'System' }, updatedBy: { fullName: 'System' },
  permissions: [
   { resource: 'users', action: 'create' }, { resource: 'users', action: 'read' },
   { resource: 'users', action: 'update' }, { resource: 'users', action: 'delete' },
   { resource: 'roles', action: 'create' }, { resource: 'roles', action: 'read' },
   { resource: 'roles', action: 'update' }, { resource: 'roles', action: 'delete' },
   { resource: 'resources', action: 'create' }, { resource: 'resources', action: 'read' },
   { resource: 'resources', action: 'update' }, { resource: 'resources', action: 'delete' },
  ] },
 { _id: '2', code: 'TEACHER', name: 'Giao vien', description: 'Quan ly hoc sinh va bai giang', isDeleted: false,
  createdAt: '2025-01-01T00:00:00Z', updatedAt: '2025-01-01T00:00:00Z',
  createdBy: { fullName: 'Admin' }, updatedBy: { fullName: 'Admin' },
  permissions: [
   { resource: 'students', action: 'read' }, { resource: 'students', action: 'update' },
   { resource: 'courses', action: 'read' }, { resource: 'courses', action: 'create' },
  ] },
 { _id: '3', code: 'STUDENT', name: 'Hoc sinh', description: 'Xem thong tin khoa hoc', isDeleted: false,
  createdAt: '2025-01-01T00:00:00Z', updatedAt: '2025-01-01T00:00:00Z',
  createdBy: { fullName: 'Admin' }, updatedBy: { fullName: 'Admin' },
  permissions: [{ resource: 'courses', action: 'read' }]
 }
];
// ====== Users ======
let mockUsers: MockUser[] = [
 { _id: '1', userName: 'admin', fullName: 'Administrator', email: 'admin@example.com',
  mobile: '0912345678', address: 'Hanoi', age: 30, sex: '0', bod: '1994-01-01',
  isSupperAdmin: true, roles: ['1'], isSuspended: false, isDeleted: false,
  createdAt: '2025-01-01T00:00:00Z', updatedAt: '2025-01-01T00:00:00Z',
  createdBy: { fullName: 'System' }, updatedBy: { fullName: 'System' } },
 { _id: '2', userName: 'teacher1', fullName: 'Nguyen Van A', email: 'teacher1@example.com',
  mobile: '0987654321', address: 'HCMC', age: 35, sex: '0', bod: '1989-05-15',
  isSupperAdmin: false, roles: ['2'], isSuspended: false, isDeleted: false,
  createdAt: '2025-01-01T00:00:00Z', updatedAt: '2025-01-01T00:00:00Z',
  createdBy: { fullName: 'Admin' }, updatedBy: { fullName: 'Admin' } },
 { _id: '3', userName: 'student1', fullName: 'Tran Thi B', email: 'student1@example.com',
  mobile: '0934567890', address: 'Da Nang', age: 20, sex: '1', bod: '2004-03-20',
  isSupperAdmin: false, roles: ['3'], isSuspended: false, isDeleted: false,
  createdAt: '2025-01-01T00:00:00Z', updatedAt: '2025-01-01T00:00:00Z',
  createdBy: { fullName: 'Admin' }, updatedBy: { fullName: 'Admin' } }
];
// ====== Resources ======
const mockResources: MockResource[] = [
 { _id: '1', code: 'users', name: 'Quan ly nguoi dung', actions: ['create','read','update','delete'] },
 { _id: '2', code: 'roles', name: 'Quan ly vai tro', actions: ['create','read','update','delete'] },
 { _id: '3', code: 'resources', name: 'Quan ly tai nguyen', actions: ['create','read','update','delete'] },
 { _id: '4', code: 'students', name: 'Quan ly hoc sinh', actions: ['create','read','update','delete'] },
 { _id: '5', code: 'courses', name: 'Quan ly khoa hoc', actions: ['create','read','update','delete'] }
];
// ====== Faculty ======
const mockFaculties: MockFaculty[] = [
 { id: '1', slug: 'cong-nghe-thong-tin', name: 'Cong nghe thong tin', abbr: 'CNTT', color: '#7c3aed', majors: 5, classes: 24, students: 1200 },
 { id: '2', slug: 'kinh-te', name: 'Kinh te', abbr: 'KT', color: '#0ea5e9', majors: 4, classes: 18, students: 980 },
 { id: '3', slug: 'nong-nghiep', name: 'Nong nghiep', abbr: 'NN', color: '#16a34a', majors: 6, classes: 30, students: 1540 },
 { id: '4', slug: 'cong-nghe-sinh-hoc', name: 'Cong nghe sinh hoc', abbr: 'CNSH', color: '#f59e0b', majors: 3, classes: 14, students: 620 },
 { id: '5', slug: 'quan-ly-dat-dai', name: 'Quan ly dat dai', abbr: 'QLDD', color: '#ef4444', majors: 2, classes: 10, students: 430 },
 { id: '6', slug: 'thu-y', name: 'Thu y', abbr: 'TY', color: '#8b5cf6', majors: 3, classes: 12, students: 510 },
 { id: '7', slug: 'cong-nghe-thuc-pham', name: 'Cong nghe thuc pham', abbr: 'CNTP', color: '#ec4899', majors: 4, classes: 16, students: 720 },
 { id: '8', slug: 'moi-truong', name: 'Moi truong', abbr: 'MT', color: '#14b8a6', majors: 3, classes: 11, students: 490 }
];
const mockMajors: MockMajor[] = [
 { id: '1', slug: 'ky-thuat-phan-mem', facultySlug: 'cong-nghe-thong-tin', name: 'Ky thuat phan mem', code: 'KTPM', khoa: [2021,2022,2023,2024], classes: 8, students: 320 },
 { id: '2', slug: 'he-thong-thong-tin', facultySlug: 'cong-nghe-thong-tin', name: 'He thong thong tin', code: 'HTTT', khoa: [2021,2022,2023], classes: 6, students: 240 },
 { id: '3', slug: 'an-toan-thong-tin', facultySlug: 'cong-nghe-thong-tin', name: 'An toan thong tin', code: 'ATTT', khoa: [2022,2023,2024], classes: 4, students: 160 },
 { id: '4', slug: 'khoa-hoc-may-tinh', facultySlug: 'cong-nghe-thong-tin', name: 'Khoa hoc may tinh', code: 'KHMT', khoa: [2021,2022,2023,2024], classes: 4, students: 200 },
 { id: '5', slug: 'tri-tue-nhan-tao', facultySlug: 'cong-nghe-thong-tin', name: 'Tri tue nhan tao', code: 'TTNT', khoa: [2023,2024], classes: 2, students: 80 }
];
const mockClasses: MockClass[] = [
 { id: '1', name: 'KTPM66A', khoa: 2021, students: 42, advisor: 'TS. Nguyen Van A' },
 { id: '2', name: 'KTPM66B', khoa: 2021, students: 38, advisor: 'TS. Tran Thi B' },
 { id: '3', name: 'KTPM67A', khoa: 2022, students: 45, advisor: 'PGS. Le Van C' },
 { id: '4', name: 'KTPM67B', khoa: 2022, students: 40, advisor: 'TS. Pham Thi D' },
 { id: '5', name: 'KTPM68A', khoa: 2023, students: 50, advisor: 'TS. Hoang Van E' },
 { id: '6', name: 'KTPM68B', khoa: 2023, students: 47, advisor: 'TS. Vu Thi F' },
 { id: '7', name: 'KTPM69A', khoa: 2024, students: 52, advisor: 'TS. Do Van G' },
 { id: '8', name: 'KTPM69B', khoa: 2024, students: 48, advisor: 'TS. Bui Thi H' }
];
// ====== Enterprise ======
const mockEnterprises: MockEnterprise[] = [
 { id: '1', name: 'FPT Software', abbr: 'FPT', color: '#7c3aed', industry: 'Cong nghe thong tin',
  website: 'fpt.com.vn', email: 'hr@fpt.com.vn', phone: '024 7300 7300', jobs: 42, verified: true,
  joinedDate: '01/2023', faculties: ['Faculty of IT','Faculty of Economics'], partnerStatus: 'active',
  size: '10.000+', address: 'Ha Noi', description: 'FPT Software cong ty CNTT' },
 { id: '2', name: 'Vingroup', abbr: 'VIC', color: '#db2777', industry: 'Tap doan da nganh',
  website: 'vingroup.net', email: 'hr@vingroup.net', phone: '024 3974 9999', jobs: 28, verified: true,
  joinedDate: '03/2023', faculties: ['Faculty of Economics','Faculty of IT'], partnerStatus: 'active',
  size: '50.000+', address: 'Ha Noi', description: 'Vingroup tap doan kinh te' },
 { id: '3', name: 'Agribank', abbr: 'AGR', color: '#059669', industry: 'Ngan hang & Tai chinh',
  website: 'agribank.com.vn', email: 'hr@agribank.vn', phone: '1900 558 818', jobs: 15, verified: true,
  joinedDate: '06/2023', faculties: ['Faculty of Economics'], partnerStatus: 'active',
  size: '40.000+', address: 'Ha Noi', description: 'Ngan hang Agribank' },
 { id: '4', name: 'VinFast', abbr: 'VF', color: '#0284c7', industry: 'Cong nghiep & San xuat',
  website: 'vinfastauto.vn', email: 'hr@vinfast.vn', phone: '1900 232 389', jobs: 33, verified: true,
  joinedDate: '01/2024', faculties: ['Faculty of Mech. & Elec.'], partnerStatus: 'active',
  size: '20.000+', address: 'Hai Phong', description: 'VinFast nha san xuat o to' },
 { id: '5', name: 'Masan Group', abbr: 'MSN', color: '#d97706', industry: 'Nong nghiep & FMCG',
  website: 'masangroup.com', email: 'hr@masangroup.com', phone: '028 6656 6656', jobs: 19, verified: true,
  joinedDate: '02/2024', faculties: ['Faculty of Agriculture'], partnerStatus: 'active',
  size: '30.000+', address: 'TP.HCM', description: 'Masan Group tap doan' },
 { id: '6', name: 'KPMG Vietnam', abbr: 'KPMG', color: '#ea580c', industry: 'Kiem toan & Tu van',
  website: 'kpmg.com/vn', email: 'hr@kpmg.com.vn', phone: '028 3821 9266', jobs: 11, verified: false,
  joinedDate: '05/2024', faculties: ['Faculty of Economics'], partnerStatus: 'inactive',
  size: '1.000+', address: 'TP.HCM', description: 'KPMG cong ty kiem toan' }
];
const mockJobs: Record<string, MockJob[]> = {
 '1': [
  { id: 'j1', title: 'Lap trinh vien Backend (Java)', location: 'Ha Noi', salary: '15-25 trie',
   tags: ['Java','Spring Boot'], deadline: '10/04/2024', status: 'active',
   postedAt: '10/03/2024', faculties: ['Faculty of IT'] },
  { id: 'j2', title: 'Lap trinh vien Frontend (React)', location: 'Ha Noi', salary: '12-22 trie',
   tags: ['React','TypeScript'], deadline: null, status: 'active',
   postedAt: '11/03/2024', faculties: ['Faculty of IT'] },
  { id: 'j3', title: 'Ky su DevOps', location: 'TP.HCM', salary: '20-35 trie',
   tags: ['Docker','Kubernetes'], deadline: '30/04/2024', status: 'active',
   postedAt: '08/03/2024', faculties: ['Faculty of IT'] }
 ],
 '2': [
  { id: 'j7', title: 'Ky su Du lieu', location: 'TP.HCM', salary: '18-30 trie',
   tags: ['Python','SQL'], deadline: '05/04/2024', status: 'active',
   postedAt: '08/03/2024', faculties: ['Faculty of IT','Faculty of Economics'] },
  { id: 'j8', title: 'Product Manager', location: 'TP.HCM', salary: '25-40 trie',
   tags: ['Product','Agile'], deadline: null, status: 'active',
   postedAt: '06/03/2024', faculties: ['Faculty of Economics'] }
 ],
 '4': [
  { id: 'j10', title: 'Ky su Co khi', location: 'Hai Phong', salary: '14-20 trie',
   tags: ['AutoCAD','Mechanics'], deadline: null, status: 'active',
   postedAt: '09/03/2024', faculties: ['Faculty of Mech. & Elec.'] }
 ]
};
// ====== Graduation ======
const mockGraduations: MockGraduation[] = [
 { id: 1, name: 'DSSVTN nganh MMT&TTDL va KHDL&TTNT KSVL cho kiem dinh 2026',
  school_year: '2025', student_count: 13, certification: 'QD-123/DHBK',
  certification_date: '2026-01-15T00:00:00', faculty_id: 1,
  created_at: '2026-01-01T00:00:00', updated_at: '2026-03-18T01:12:00' },
 { id: 2, name: 'Dot tot nghiep thang 6 nam 2025 - Khoa CNTT',
  school_year: '2025', student_count: 248, certification: 'QD-456/CNTT',
  certification_date: '2025-06-01T00:00:00', faculty_id: 2,
  created_at: '2025-05-01T00:00:00', updated_at: '2026-02-10T08:30:00' },
 { id: 3, name: 'Dot tot nghiep thang 12 nam 2024 - Toan truong',
  school_year: '2024', student_count: 512, certification: 'QD-789/DHBK',
  certification_date: '2024-12-05T00:00:00', faculty_id: 1,
  created_at: '2024-11-01T00:00:00', updated_at: '2025-12-20T14:00:00' }
];
const mockGradStudents: MockGraduationStudent[] = [
 { id: 1, code: '2001215001', full_name: 'Nguyen Van An', first_name: 'An', last_name: 'Nguyen Van',
  email: 'an.nguyen@student.edu.vn', phone: '0901234567', dob: '2002-05-10', gender: 'male',
  citizen_identification: '001202012345', training_industry_id: 1, training_industry_code: '7480201',
  training_industry_name: 'Mang may tinh va truyen thong du lieu', school_year_end: '2025' },
 { id: 2, code: '2001215002', full_name: 'Tran Thi Bich', first_name: 'Bich', last_name: 'Tran Thi',
  email: 'bich.tran@student.edu.vn', phone: '0912345678', dob: '2002-08-22', gender: 'female',
  citizen_identification: '001202098765', training_industry_id: 1, training_industry_code: '7480201',
  training_industry_name: 'Mang may tinh va truyen thong du lieu', school_year_end: '2025' },
 { id: 3, code: '2001215003', full_name: 'Le Hoang Duy', first_name: 'Duy', last_name: 'Le Hoang',
  email: 'duy.le@student.edu.vn', phone: '0923456789', dob: '2001-12-03', gender: 'male',
  citizen_identification: '001201056789', training_industry_id: 2, training_industry_code: '7480104',
  training_industry_name: 'He thong thong tin', school_year_end: '2025' }
];
// ====== Home/Stats ======
const mockSurveyStats = {
 totalRespondents: 4218, overallEmploymentRate: 87, avgSalaryMillionVND: 14.2,
 partnerCompanies: 50, stillStudying: 480,
 byMajor: [
  { major: 'Cong nghe thong tin', majorCode: 'CNTT', employmentRate: 87, avgSalaryMillionVND: 18.5, respondents: 620 },
  { major: 'Nong nghiep & Sinh hoc', majorCode: 'NN', employmentRate: 74, avgSalaryMillionVND: 11.2, respondents: 980 },
  { major: 'Kinh te & Quan tri', majorCode: 'KT', employmentRate: 81, avgSalaryMillionVND: 14.8, respondents: 870 },
  { major: 'Moi truong & Tai nguyen', majorCode: 'MT', employmentRate: 68, avgSalaryMillionVND: 10.5, respondents: 540 }
 ],
 byYear: [
  { year: 2020, employmentRate: 79 }, { year: 2021, employmentRate: 82 },
  { year: 2022, employmentRate: 84 }, { year: 2023, employmentRate: 86 }, { year: 2024, employmentRate: 87 }
 ],
 statusDistribution: {
  employed_relevant: 1820, employed_irrelevant: 830, seeking: 312, postgrad: 480, self_employed: 540, other: 236
 }
};
const mockHomeEnterprises: MockEnterprise[] = [
 { id: '1', name: 'FPT Software', abbr: 'FPT', color: '#6366f1', industry: 'Cong nghe thong tin',
  website: '', email: '', phone: '', jobs: 42, verified: true, joinedDate: '', faculties: [],
  partnerStatus: '', size: '', address: '', description: '' },
 { id: '2', name: 'Vingroup', abbr: 'VIC', color: '#ec4899', industry: 'Tap doan da nganh',
  website: '', email: '', phone: '', jobs: 28, verified: true, joinedDate: '', faculties: [],
  partnerStatus: '', size: '', address: '', description: '' },
 { id: '3', name: 'Agribank', abbr: 'AGR', color: '#10b981', industry: 'Ngan hang & Tai chinh',
  website: '', email: '', phone: '', jobs: 15, verified: true, joinedDate: '', faculties: [],
  partnerStatus: '', size: '', address: '', description: '' },
 { id: '4', name: 'VinFast', abbr: 'VF', color: '#0ea5e9', industry: 'Cong nghiep & San xuat',
  website: '', email: '', phone: '', jobs: 33, verified: true, joinedDate: '', faculties: [],
  partnerStatus: '', size: '', address: '', description: '' },
 { id: '5', name: 'Masan Group', abbr: 'MSN', color: '#f59e0b', industry: 'Nong nghiep & FMCG',
  website: '', email: '', phone: '', jobs: 19, verified: true, joinedDate: '', faculties: [],
  partnerStatus: '', size: '', address: '', description: '' },
 { id: '6', name: 'KPMG Vietnam', abbr: 'KPMG', color: '#f97316', industry: 'Kiem toan & Tu van',
  website: '', email: '', phone: '', jobs: 11, verified: false, joinedDate: '', faculties: [],
  partnerStatus: '', size: '', address: '', description: '' }
];
const mockJobPostings: MockJobPosting[] = [
 { id: 'j1', enterpriseId: '1', enterpriseName: 'FPT Software', title: 'Backend Developer (Java)',
  location: 'Ha Noi', salaryRange: '15-25 trie', tags: ['Java','Spring Boot'], postedAt: '2025-03-10', deadline: '2025-04-10' },
 { id: 'j2', enterpriseId: '1', enterpriseName: 'FPT Software', title: 'Frontend Developer (React)',
  location: 'Ha Noi', salaryRange: '12-22 trie', tags: ['React','TypeScript'], postedAt: '2025-03-11' },
 { id: 'j3', enterpriseId: '2', enterpriseName: 'Vingroup', title: 'Ky su phan tich du lieu',
  location: 'TP.HCM', salaryRange: '18-30 trie', tags: ['Python','SQL'], postedAt: '2025-03-08', deadline: '2025-04-05' },
 { id: 'j4', enterpriseId: '3', enterpriseName: 'Agribank', title: 'Chuyen vien tin dung',
  location: 'Ha Noi', salaryRange: '10-15 trie', tags: ['Tai chinh','Ngan hang'], postedAt: '2025-03-12' },
 { id: 'j5', enterpriseId: '4', enterpriseName: 'VinFast', title: 'Ky su co khi',
  location: 'Hai Phong', salaryRange: '14-20 trie', tags: ['AutoCAD','Co khi'], postedAt: '2025-03-09' },
 { id: 'j6', enterpriseId: '5', enterpriseName: 'Masan Group', title: 'Ky su nong nghiep',
  location: 'Nghe An', salaryRange: '10-16 trie', tags: ['Nong nghiep','R&D'], postedAt: '2025-03-07' },
 { id: 'j7', enterpriseId: '6', enterpriseName: 'KPMG Vietnam', title: 'Kiem toan vien',
  location: 'Ha Noi', salaryRange: '15-22 trie', tags: ['Kiem toan','Excel'], postedAt: '2025-03-05' },
 { id: 'j8', enterpriseId: '2', enterpriseName: 'Vingroup', title: 'Product Manager',
  location: 'TP.HCM', salaryRange: '25-40 trie', tags: ['Product','Agile'], postedAt: '2025-03-06' },
 { id: 'j9', enterpriseId: '4', enterpriseName: 'VinFast', title: 'Ky su dien tu',
  location: 'Hai Phong', salaryRange: '16-24 trie', tags: ['Dien tu','PLC'], postedAt: '2025-03-04' }
];
const mockAlumniProfiles: MockAlumniProfile[] = [
 { id: '1', studentCode: 'SV001', fullName: 'Nguyen Van An', major: 'CNTT', graduationYear: 2022,
  currentPosition: 'Backend Developer', currentCompany: 'FPT Software', email: 'an.nv@fpt.com' },
 { id: '2', studentCode: 'SV002', fullName: 'Tran Thi Binh', major: 'KT', graduationYear: 2023,
  currentPosition: 'Chuyen vien tin dung', currentCompany: 'Agribank' },
 { id: '3', studentCode: 'SV003', fullName: 'Le Minh Cuong', major: 'NN', graduationYear: 2021,
  currentPosition: 'Ky su nong nghiep', currentCompany: 'Masan Group' },
 { id: '4', studentCode: 'SV004', fullName: 'Pham Thi Dung', major: 'MT', graduationYear: 2022,
  currentPosition: 'Chuyen vien moi truong', currentCompany: 'KPMG Vietnam' }
];


// ====== Home / Dashboard Stats ======
const mockHomeStats = {
  totalAlumni: 12540,
  totalEnterprises: 847,
  totalJobs: 1523,
  latestRecruitments: 89,
  monthlyAlumniGrowth: [
    { month: 'Jan', count: 98 },
    { month: 'Feb', count: 124 },
    { month: 'Mar', count: 156 },
    { month: 'Apr', count: 201 },
    { month: 'May', count: 189 },
    { month: 'Jun', count: 233 }
  ],
  facultyDistribution: [
    { faculty: 'Faculty of IT', count: 3420 },
    { faculty: 'Faculty of Economics', count: 2890 },
    { faculty: 'Faculty of Mech. & Elec.', count: 2150 },
    { faculty: 'Faculty of Agriculture', count: 1780 },
    { faculty: 'Faculty of Environment', count: 1200 },
    { faculty: 'Faculty of Languages', count: 1100 }
  ]
};

// ====== Reports ======
const mockReports: MockReport[] = [
  { id: 'r1', title: 'Bao cao tong hop nang luc nguoi hoc', type: 'academic', status: 'completed', createdBy: 'Admin', createdAt: '2025-03-01', totalStudents: 1234, passedRate: 92.5 },
  { id: 'r2', title: 'Thong ke viec lam sau tot nghiep', type: 'employment', status: 'completed', createdBy: 'Admin', createdAt: '2025-02-15', totalStudents: 980, employmentRate: 78.3 },
  { id: 'r3', title: 'Bao cao hop tac doanh nghiep Q1/2025', type: 'enterprise', status: 'pending', createdBy: 'Admin', createdAt: '2025-01-20', totalEnterprises: 156 },
  { id: 'r4', title: 'Danh gia chuong trinh dao tao CNTT', type: 'program', status: 'completed', createdBy: 'Dean', createdAt: '2024-12-10', totalStudents: 450, score: 4.2 },
  { id: 'r5', title: 'Thong ke hoat dong co so vat chat', type: 'facility', status: 'draft', createdBy: 'Admin', createdAt: '2025-03-10' }
];

const mockReportTemplates = [
  { id: 't1', name: 'Template bao cao tot nghiep', type: 'graduation', fields: ['studentName', 'faculty', 'gpa', 'job'] },
  { id: 't2', name: 'Template thong ke viec lam', type: 'employment', fields: ['studentName', 'company', 'position', 'salary'] },
  { id: 't3', name: 'Template danh gia doanh nghiep', type: 'enterprise', fields: ['enterpriseName', 'partnership', 'jobs', 'feedback'] }
];

// ====== Statistics ======
const mockStatistics = {
  overview: {
    totalAlumni: 12540,
    totalStudents: 8920,
    totalFaculties: 12,
    totalEnterprises: 847,
    totalJobsPosted: 1523
  },
  employmentRate: 78.3,
  averageSalary: 15.5,
  alumniByBatch: [
    { year: 2020, count: 1890 },
    { year: 2021, count: 2120 },
    { year: 2022, count: 2450 },
    { year: 2023, count: 2680 },
    { year: 2024, count: 2900 }
  ],
  graduatesByFaculty: [
    { faculty: 'Faculty of IT', graduates: 3420 },
    { faculty: 'Faculty of Economics', graduates: 2890 },
    { faculty: 'Faculty of Mech. & Elec.', graduates: 2150 },
    { faculty: 'Faculty of Agriculture', graduates: 1780 }
  ],
  recentStats: [
    { label: 'Incoming Freshmen', value: 3200, change: '+5.2%' },
    { label: 'Dropout Rate', value: 2.1, change: '-0.3%' },
    { label: 'Internship Participation', value: 87, change: '+12%' },
    { label: 'Career Fair Attendees', value: 156, change: '+8%' }
  ]
};

// ====== University ======
const mockUniversity = {
  name: 'Dai hoc Nong Lam Thanh pho HCM',
  abbr: 'ULST',
  logo: '/assets/logo.png',
  motto: 'Học tập - Sáng tạo - Phát triển',
  founded: 1955,
  address: 'Khu pho 6, Phuong Linh Trung, Thanh pho Thu Duc, TP. Ho Chi Minh',
  phone: '028 3724 5378',
  email: 'info@ulst.edu.vn',
  website: 'https://www.ulst.edu.vn',
  totalStudents: 28500,
  totalFaculties: 12,
  totalPrograms: 48,
  faculties: ['Faculty of IT', 'Faculty of Economics', 'Faculty of Mech. & Elec.', 'Faculty of Agriculture', 'Faculty of Environment', 'Faculty of Languages'],
  latestNews: [
    { id: 'n1', title: 'Ky le tot nghiep thang 6.2025', date: '2025-06-15' },
    { id: 'n2', title: 'Hoi thao chuyen de AI trong giao duc', date: '2025-05-20' },
    { id: 'n3', title: 'Hop tac doanh nghiep FPT Software', date: '2025-04-10' }
  ]
};

const mockUniversityCalendar = [
  { id: 'c1', event: 'Lop hoc ky moi - Nganh CNTT', date: '2025-06-01', type: 'academic' },
  { id: 'c2', event: 'Ngay hoi viec lam', date: '2025-06-15', type: 'career' },
  { id: 'c3', event: 'Bao ve luan van tot nghiep', date: '2025-06-20', type: 'graduation' },
  { id: 'c4', event: 'Hoi thao doanh nghiep - KPMG Vietnam', date: '2025-06-25', type: 'enterprise' }
];

const mockUniversityNotifications = [
  { id: 'not1', title: 'Thong bao lich diem ky 2/2025', date: '2025-03-01', priority: 'high', read: false },
  { id: 'not2', title: 'Dang ky mon hoc phong van xin viec', date: '2025-02-28', priority: 'medium', read: true },
  { id: 'not3', title: 'Thay doi lich giang giang vien', date: '2025-02-25', priority: 'low', read: true }
];

// ====== Forms ======
const mockForms: MockForm[] = [
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
    { id: 'log1', action: 'Admin updated student record', user: 'Admin', timestamp: '2025-03-01 10:30' },
    { id: 'log2', action: 'New enterprise registered', user: 'System', timestamp: '2025-03-01 09:15' },
    { id: 'log3', action: 'Report generated: Employment Stats Q4/2024', user: 'Admin', timestamp: '2025-02-28 16:45' },
    { id: 'log4', action: 'Faculty data updated', user: 'Dean', timestamp: '2025-02-28 14:20' },
    { id: 'log5', action: 'New job posting: Backend Developer', user: 'Enterprise', timestamp: '2025-02-27 11:00' }
  ]
};

// ====== Mock API Handler ======
export function mockApiHandler(
  path: string,
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH' = 'GET',
  body?: any,
  _id?: string
): any {
  // ----- ROUTES -----
  const routes: Record<string, any> = {
    // Roles
    '/roles': () => ({ data: mockRoles }),
    '/roles/me': () => ({ data: mockRoles[0] }),

    // Users
    '/users': () => ({ data: mockUsers }),
    '/users/me': () => ({ data: mockUsers[0] }),

    // Resources
    '/resources': () => ({ data: mockResources }),

    // Faculty
    '/faculties': () => ({ data: mockFaculties }),
    '/majors': () => ({ data: mockMajors }),
    '/classes': () => ({ data: mockClasses }),

    // Enterprise
    '/enterprises': () => ({ data: mockHomeEnterprises }),
    '/jobs': () => ({ data: mockJobs }),
    '/job-postings': () => ({ data: mockJobPostings }),
    '/alumni/profiles': () => ({ data: mockAlumniProfiles }),

    // Graduation
    '/graduations': () => ({ data: mockGraduations }),
    '/grad-students': () => ({ data: mockGradStudents }),

    // Home / Dashboard
    '/home/stats': () => ({ data: mockHomeStats }),
    '/dashboard/widgets': () => ({ data: mockDashboardWidgets }),

    // Reports
    '/reports': () => ({ data: mockReports }),
    '/report-templates': () => ({ data: mockReportTemplates }),

    // Statistics
    '/statistics': () => ({ data: mockStatistics }),

    // University
    '/university': () => ({ data: mockUniversity }),
    '/university/calendar': () => ({ data: mockUniversityCalendar }),
    '/university/notifications': () => ({ data: mockUniversityNotifications }),

    // Forms
    '/forms': () => ({ data: mockForms }),
    '/form-questions': () => ({ data: mockFormQuestions })
  };

  const handler = routes[path];
  if (handler) return handler();
  return { data: null };
}

// ====== Exports ======
export {
  mockRoles,
  mockUsers,
  mockResources,
  mockHomeEnterprises,
  mockJobs,
  mockJobPostings,
  mockAlumniProfiles,
  mockFaculties,
  mockMajors,
  mockClasses,
  mockGraduations,
  mockGradStudents,
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
