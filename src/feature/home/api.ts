import { api } from '../../libs/api';
import type {
  ApiResponse,
  PaginatedResponse,
  SurveyStats,
  Enterprise,
  JobPosting,
  AlumniProfile,
} from './type';

// Helper for mock API response
const ok = <T>(data: T) => ({ data, success: true });
const paginate = <T>(items: T[], page: number, size: number) => ({
  data: items.slice((page - 1) * size, page * size),
  total: items.length,
  page,
  size,
});

// ============ FAKE DATA ============
const FAKE_STATS: SurveyStats = {
  totalRespondents: 4218,
  overallEmploymentRate: 87,
  avgSalaryMillionVND: 14.2,
  byMajor: [
    { major: 'Cong nghe thong tin', majorCode: 'CNTT', employmentRate: 87, avgSalaryMillionVND: 18.5, respondents: 620 },
    { major: 'Nong nghiep & Sinh hoc', majorCode: 'NN', employmentRate: 74, avgSalaryMillionVND: 11.2, respondents: 980 },
    { major: 'Kinh te & Quan tri', majorCode: 'KT', employmentRate: 81, avgSalaryMillionVND: 14.8, respondents: 870 },
    { major: 'Moi truong & Tai nguyen', majorCode: 'MT', employmentRate: 68, avgSalaryMillionVND: 10.5, respondents: 540 },
  ],
  byYear: [
    { year: 2020, employmentRate: 79 },
    { year: 2021, employmentRate: 82 },
    { year: 2022, employmentRate: 84 },
    { year: 2023, employmentRate: 86 },
  ],
  statusDistribution: {
    daCoViecLam: 3670,
    tiepTucHoc: 400,
    chuaCoViecLam: 148,
  },
};

const FAKE_ENTERPRISES: Enterprise[] = [
  { id: 'e1', name: 'FPT Software', industry: 'Cong nghe thong tin', location: 'Ha Noi', logo: '/logos/fpt.png' },
  { id: 'e2', name: 'VNG Corporation', industry: 'Cong nghe thong tin', location: 'TP HCM', logo: '/logos/vng.png' },
  { id: 'e3', name: 'Viettel', industry: 'Vien thong', location: 'Ha Noi', logo: '/logos/viettel.png' },
  { id: 'e4', name: 'Tiki', industry: 'Thuong mai dien tu', location: 'TP HCM', logo: '/logos/tiki.png' },
  { id: 'e5', name: 'Momo', industry: 'Tai chinh cong nghe', location: 'TP HCM', logo: '/logos/momo.png' },
  { id: 'e6', name: 'Saigon Co.op', industry: 'Ban le', location: 'TP HCM', logo: '/logos/coop.png' },
];

const FAKE_JOBS: JobPosting[] = [
  { id: 'j1', title: 'Lap trinh vien Frontend', enterpriseId: 'e1', enterpriseName: 'FPT Software', location: 'Ha Noi', salary: '15-25M', tags: ['React', 'TypeScript'], postedAt: '2024-03-15' },
  { id: 'j2', title: 'Lap trinh vien Backend', enterpriseId: 'e2', enterpriseName: 'VNG Corporation', location: 'TP HCM', salary: '18-30M', tags: ['NodeJS', 'MongoDB'], postedAt: '2024-03-14' },
  { id: 'j3', title: 'DevOps Engineer', enterpriseId: 'e3', enterpriseName: 'Viettel', location: 'Da Nang', salary: '20-35M', tags: ['AWS', 'Docker', 'Kubernetes'], postedAt: '2024-03-13' },
  { id: 'j4', title: 'UI/UX Designer', enterpriseId: 'e4', enterpriseName: 'Tiki', location: 'TP HCM', salary: '12-20M', tags: ['Figma', 'Research'], postedAt: '2024-03-12' },
  { id: 'j5', title: 'Mobile Developer', enterpriseId: 'e5', enterpriseName: 'Momo', location: 'TP HCM', salary: '20-32M', tags: ['Flutter', 'React Native'], postedAt: '2024-03-11' },
  { id: 'j6', title: 'Data Analyst', enterpriseId: 'e1', enterpriseName: 'FPT Software', location: 'Ha Noi', salary: '15-22M', tags: ['SQL', 'Python'], postedAt: '2024-03-10' },
];

const FAKE_ALUMNI: AlumniProfile[] = [
  { id: 'a1', studentCode: '650968', fullName: 'Nguyen Thi Thao', majorCode: 'CNTT', graduationYear: 2025, position: 'Lap trinh vien Frontend', enterprise: 'FPT Software', city: 'Ha Noi', salary: '18M' },
  { id: 'a2', studentCode: '650969', fullName: 'Tran Van Minh', majorCode: 'NN', graduationYear: 2024, position: 'Nhan vien phat trien', enterprise: 'Syngenta', city: 'TP HCM', salary: '12M' },
  { id: 'a3', studentCode: '640123', fullName: 'Le Van Hung', majorCode: 'KT', graduationYear: 2023, position: 'Chuyen vien phan tich', enterprise: 'Vietcombank', city: 'Ha Noi', salary: '16M' },
  { id: 'a4', studentCode: '640456', fullName: 'Pham Thi Lan', majorCode: 'MT', graduationYear: 2023, position: 'Chuyen vien moi truong', enterprise: 'URENCO', city: 'Ha Noi', salary: '11M' },
];

// ============ API FACES (sau nay thay bang api.get/post khi co backend) ============
// Sau nay se thay: api.get('/home/stats'), api.get('/enterprises'), v.v.

export const statsApi = {
  getOverall: () => Promise.resolve(ok(FAKE_STATS)),
  getByYear: (year: number) =>
    Promise.resolve(ok({ ...FAKE_STATS, byYear: FAKE_STATS.byYear.filter((b) => b.year === year) })),
  getByMajor: (majorCode: string) =>
    Promise.resolve(ok({ ...FAKE_STATS, byMajor: FAKE_STATS.byMajor.filter((m) => m.majorCode === majorCode) })),
};

export const enterpriseApi = {
  list: (page = 1, pageSize = 6) => Promise.resolve(paginate(FAKE_ENTERPRISES, page, pageSize)),
  getById: (id: string) => Promise.resolve(ok(FAKE_ENTERPRISES.find((e) => e.id === id)!)),
  getJobs: (enterpriseId: string) => Promise.resolve(ok(FAKE_JOBS.filter((j) => j.enterpriseId === enterpriseId))),
};

export const jobsApi = {
  list: (params?: { page?: number; pageSize?: number; location?: string; tag?: string }) => {
    let jobs = FAKE_JOBS;
    if (params?.location) jobs = jobs.filter((j) => j.location === params.location);
    if (params?.tag) jobs = jobs.filter((j) => j.tags.includes(params.tag!));
    return Promise.resolve(paginate(jobs, params?.page ?? 1, params?.pageSize ?? 9));
  },
  getById: (id: string) => Promise.resolve(ok(FAKE_JOBS.find((j) => j.id === id)!)),
};

export const alumniApi = {
  getProfile: (studentCode: string) =>
    Promise.resolve(ok(FAKE_ALUMNI.find((a) => a.studentCode === studentCode)!)),
  search: (query: string) =>
    Promise.resolve(ok(FAKE_ALUMNI.filter((a) => a.fullName.toLowerCase().includes(query.toLowerCase())))),
};
