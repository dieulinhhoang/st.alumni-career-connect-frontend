import type {
  ApiResponse,
  PaginatedResponse,
  SurveyStats,
  Enterprise,
  JobPosting,
  AlumniProfile,
} from "./type.ts";

//  Fake data 

const FAKE_STATS: SurveyStats = {
  totalRespondents: 4218,
  overallEmploymentRate: 87,
  avgSalaryMillionVND: 14.2,
  byMajor: [
    { major: "Công nghệ thông tin",     majorCode: "CNTT", employmentRate: 87, avgSalaryMillionVND: 18.5, respondents: 620 },
    { major: "Nông nghiệp & Sinh học",  majorCode: "NN",   employmentRate: 74, avgSalaryMillionVND: 11.2, respondents: 980 },
    { major: "Kinh tế & Quản trị",      majorCode: "KT",   employmentRate: 81, avgSalaryMillionVND: 14.8, respondents: 870 },
    { major: "Môi trường & Tài nguyên", majorCode: "MT",   employmentRate: 68, avgSalaryMillionVND: 10.5, respondents: 540 },
  ],
  byYear: [
    { year: 2020, employmentRate: 79 },
    { year: 2021, employmentRate: 82 },
    { year: 2022, employmentRate: 84 },
    { year: 2023, employmentRate: 86 },
    { year: 2024, employmentRate: 87 },
  ],
  statusDistribution: {
    employed_relevant:   1820,
    employed_irrelevant: 830,
    seeking:             312,
    postgrad:            480,
    self_employed:       540,
    other:               236,
  },
};

const FAKE_ENTERPRISES: Enterprise[] = [
  { id: "1", name: "FPT Software",  logo: "🔷", industry: "Công nghệ thông tin",    openPositions: 42, verified: true  },
  { id: "2", name: "Vingroup",      logo: "🟣", industry: "Tập đoàn đa ngành",      openPositions: 28, verified: true  },
  { id: "3", name: "Agribank",      logo: "🟢", industry: "Ngân hàng & Tài chính",  openPositions: 15, verified: true  },
  { id: "4", name: "VinFast",       logo: "🔵", industry: "Công nghiệp & Sản xuất", openPositions: 33, verified: true  },
  { id: "5", name: "Masan Group",   logo: "🔴", industry: "Nông nghiệp & FMCG",     openPositions: 19, verified: true  },
  { id: "6", name: "KPMG Vietnam",  logo: "🟡", industry: "Kiểm toán & Tư vấn",     openPositions: 11, verified: false },
];

const FAKE_JOBS: JobPosting[] = [
  { id: "j1", enterpriseId: "1", enterpriseName: "FPT Software", title: "Backend Developer (Java)",   location: "Hà Nội",    salaryRange: "15–25 triệu", tags: ["Java", "Spring Boot"],    postedAt: "2025-03-10T08:00:00Z", deadline: "2025-04-10T23:59:00Z" },
  { id: "j2", enterpriseId: "1", enterpriseName: "FPT Software", title: "Frontend Developer (React)", location: "Hà Nội",    salaryRange: "12–22 triệu", tags: ["React", "TypeScript"],    postedAt: "2025-03-11T08:00:00Z" },
  { id: "j3", enterpriseId: "2", enterpriseName: "Vingroup",     title: "Kỹ sư phân tích dữ liệu",   location: "TP.HCM",    salaryRange: "18–30 triệu", tags: ["Python", "SQL"],          postedAt: "2025-03-08T08:00:00Z", deadline: "2025-04-05T23:59:00Z" },
  { id: "j4", enterpriseId: "3", enterpriseName: "Agribank",     title: "Chuyên viên tín dụng",       location: "Hà Nội",    salaryRange: "10–15 triệu", tags: ["Tài chính", "Ngân hàng"], postedAt: "2025-03-12T08:00:00Z" },
  { id: "j5", enterpriseId: "4", enterpriseName: "VinFast",      title: "Kỹ sư cơ khí",              location: "Hải Phòng", salaryRange: "14–20 triệu", tags: ["AutoCAD", "Cơ khí"],      postedAt: "2025-03-09T08:00:00Z" },
  { id: "j6", enterpriseId: "5", enterpriseName: "Masan Group",  title: "Kỹ sư nông nghiệp",         location: "Nghệ An",   salaryRange: "10–16 triệu", tags: ["Nông nghiệp", "R&D"],     postedAt: "2025-03-07T08:00:00Z" },
  { id: "j7", enterpriseId: "6", enterpriseName: "KPMG Vietnam", title: "Kiểm toán viên",             location: "Hà Nội",    salaryRange: "15–22 triệu", tags: ["Kiểm toán", "Excel"],     postedAt: "2025-03-05T08:00:00Z" },
  { id: "j8", enterpriseId: "2", enterpriseName: "Vingroup",     title: "Product Manager",            location: "TP.HCM",    salaryRange: "25–40 triệu", tags: ["Product", "Agile"],       postedAt: "2025-03-06T08:00:00Z" },
  { id: "j9", enterpriseId: "4", enterpriseName: "VinFast",      title: "Kỹ sư điện tử",             location: "Hải Phòng", salaryRange: "16–24 triệu", tags: ["Điện tử", "PLC"],         postedAt: "2025-03-04T08:00:00Z" },
];

const FAKE_ALUMNI: AlumniProfile[] = [
  { id: "1", studentCode: "SV001", fullName: "Nguyễn Văn An",  major: "CNTT", graduationYear: 2022, currentPosition: "Backend Developer",      currentCompany: "FPT Software",  email: "an.nv@fpt.com" },
  { id: "2", studentCode: "SV002", fullName: "Trần Thị Bình",  major: "KT",   graduationYear: 2023, currentPosition: "Chuyên viên tín dụng",   currentCompany: "Agribank" },
  { id: "3", studentCode: "SV003", fullName: "Lê Minh Cường",  major: "NN",   graduationYear: 2021, currentPosition: "Kỹ sư nông nghiệp",     currentCompany: "Masan Group" },
  { id: "4", studentCode: "SV004", fullName: "Phạm Thị Dung",  major: "MT",   graduationYear: 2022, currentPosition: "Chuyên viên môi trường", currentCompany: "KPMG Vietnam" },
];

//  Helpers 

function ok<T>(data: T): ApiResponse<T> {
  return { success: true, message: "OK", data };
}

function paginate<T>(items: T[], page: number, pageSize: number): PaginatedResponse<T> {
  const start = (page - 1) * pageSize;
  return { success: true, message: "OK", data: items.slice(start, start + pageSize), total: items.length, page, pageSize };
}

//  APIs (luôn dùng fake data) 

export const statsApi = {
  getOverall: () => Promise.resolve(ok(FAKE_STATS)),
  getByYear:  (year: number) =>
    Promise.resolve(ok({ ...FAKE_STATS, byYear: FAKE_STATS.byYear.filter((b) => b.year === year) })),
  getByMajor: (majorCode: string) =>
    Promise.resolve(ok({ ...FAKE_STATS, byMajor: FAKE_STATS.byMajor.filter((m) => m.majorCode === majorCode) })),
};

export const enterpriseApi = {
  list:     (page = 1, pageSize = 6) => Promise.resolve(paginate(FAKE_ENTERPRISES, page, pageSize)),
  getById:  (id: string)             => Promise.resolve(ok(FAKE_ENTERPRISES.find((e) => e.id === id)!)),
  getJobs:  (enterpriseId: string)   => Promise.resolve(ok(FAKE_JOBS.filter((j) => j.enterpriseId === enterpriseId))),
};

export const jobsApi = {
  list: (params?: { page?: number; pageSize?: number; location?: string; tag?: string }) => {
    let jobs = FAKE_JOBS;
    if (params?.location) jobs = jobs.filter((j) => j.location === params.location);
    if (params?.tag)      jobs = jobs.filter((j) => j.tags.includes(params.tag!));
    return Promise.resolve(paginate(jobs, params?.page ?? 1, params?.pageSize ?? 9));
  },
  getById: (id: string) => Promise.resolve(ok(FAKE_JOBS.find((j) => j.id === id)!)),
};

export const alumniApi = {
  getProfile:    (studentCode: string)                          =>
    Promise.resolve(ok(FAKE_ALUMNI.find((a) => a.studentCode === studentCode)!)),
  search:        (query: string)                                =>
    Promise.resolve(ok(FAKE_ALUMNI.filter((a) => a.fullName.toLowerCase().includes(query.toLowerCase())))),
  updateProfile: (studentCode: string, data: Partial<AlumniProfile>) =>
    Promise.resolve(ok({ ...FAKE_ALUMNI.find((a) => a.studentCode === studentCode)!, ...data })),
};