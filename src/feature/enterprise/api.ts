import type {
  Enterprise, Job, EnterpriseFormValues, JobFormValues,
  FacultyKey,
} from "./type";
import { FACULTY_COLOR_MAP } from "./type";

//  Helpers 

const delay = (ms = 200) => new Promise(res => setTimeout(res, ms));

function today(): string {
  return new Date().toLocaleDateString("vi-VN", {
    day: "2-digit", month: "2-digit", year: "numeric",
  });
}

// Seed data

const _enterprises: Enterprise[] = [
  { id: "1", name: "FPT Software",  abbr: "FPT",  color: "#7c3aed", industry: "Công nghệ thông tin",   website: "fpt.com.vn",     email: "hr@fpt.com.vn",     phone: "024 7300 7300", jobs: 42, verified: true,  joinedDate: "01/2023", faculties: ["Faculty of IT", "Faculty of Economics"],                                          partnerStatus: "active",   size: "10.000+ nhân viên",  address: "Tòa FPT, 17 Duy Tân, Cầu Giấy, Hà Nội",                           description: "FPT Software là công ty con của Tập đoàn FPT, cung cấp dịch vụ và giải pháp phần mềm cho khách hàng trong và ngoài nước. Với hơn 20 năm kinh nghiệm, FPT Software là một trong những công ty CNTT hàng đầu Việt Nam." },
  { id: "2", name: "Vingroup",      abbr: "VIC",  color: "#db2777", industry: "Tập đoàn đa ngành",      website: "vingroup.net",   email: "hr@vingroup.net",   phone: "024 3974 9999", jobs: 28, verified: true,  joinedDate: "03/2023", faculties: ["Faculty of Economics", "Faculty of IT", "Faculty of Mech. & Elec. Engineering"], partnerStatus: "active",   size: "50.000+ nhân viên",  address: "Tầng 31, Keangnam Landmark 72, Phạm Hùng, Hà Nội",                description: "Vingroup là tập đoàn kinh tế tư nhân hàng đầu Việt Nam, hoạt động trong lĩnh vực công nghệ, công nghiệp và thương mại dịch vụ." },
  { id: "3", name: "Agribank",      abbr: "AGR",  color: "#059669", industry: "Ngân hàng & Tài chính",  website: "agribank.com.vn",email: "hr@agribank.vn",    phone: "1900 558 818",  jobs: 15, verified: true,  joinedDate: "06/2023", faculties: ["Faculty of Economics"],                                                           partnerStatus: "active",   size: "40.000+ nhân viên",  address: "2 Láng Hạ, Ba Đình, Hà Nội",                                      description: "Ngân hàng Nông nghiệp và Phát triển Nông thôn Việt Nam là ngân hàng thương mại nhà nước lớn nhất Việt Nam về tổng tài sản." },
  { id: "4", name: "VinFast",       abbr: "VF",   color: "#0284c7", industry: "Công nghiệp & Sản xuất", website: "vinfastauto.vn", email: "hr@vinfast.vn",     phone: "1900 232 389",  jobs: 33, verified: true,  joinedDate: "01/2024", faculties: ["Faculty of Mech. & Elec. Engineering", "Faculty of IT"],                        partnerStatus: "active",   size: "20.000+ nhân viên",  address: "Khu kinh tế Đình Vũ - Cát Hải, Hải Phòng",                        description: "VinFast là thành viên của Tập đoàn Vingroup, nhà sản xuất ô tô hàng đầu Việt Nam với tầm nhìn trở thành thương hiệu xe điện toàn cầu." },
  { id: "5", name: "Masan Group",   abbr: "MSN",  color: "#d97706", industry: "Nông nghiệp & FMCG",     website: "masangroup.com", email: "hr@masangroup.com", phone: "028 6656 6656", jobs: 19, verified: true,  joinedDate: "02/2024", faculties: ["Faculty of Agriculture", "Faculty of Food Technology", "Faculty of Veterinary Medicine"], partnerStatus: "active",   size: "30.000+ nhân viên",  address: "Tầng 12, Kumho Asiana Plaza, 39 Lê Duẩn, Q.1, TP.HCM",           description: "Masan Group là một trong những tập đoàn tư nhân lớn nhất Việt Nam với các lĩnh vực hàng tiêu dùng, tài nguyên và dịch vụ tài chính." },
  { id: "6", name: "KPMG Vietnam",  abbr: "KPMG", color: "#ea580c", industry: "Kiểm toán & Tư vấn",     website: "kpmg.com/vn",    email: "hr@kpmg.com.vn",    phone: "028 3821 9266", jobs: 11, verified: false, joinedDate: "05/2024", faculties: ["Faculty of Economics"],                                                           partnerStatus: "inactive", size: "1.000+ nhân viên",   address: "Tầng 10, Sunwah Tower, 115 Nguyễn Huệ, Q.1, TP.HCM",             description: "KPMG là một trong bốn công ty kiểm toán lớn nhất thế giới, cung cấp dịch vụ kiểm toán, thuế và tư vấn tại Việt Nam." },
  { id: "7", name: "TH True Milk",  abbr: "TH",   color: "#0891b2", industry: "Nông nghiệp & FMCG",     website: "thmilk.vn",      email: "hr@thmilk.vn",      phone: "1800 599 966",  jobs: 8,  verified: false, joinedDate: "07/2024", faculties: ["Faculty of Agriculture", "Faculty of Food Technology"],                          partnerStatus: "active",   size: "5.000+ nhân viên",   address: "Huyện Nghĩa Đàn, Nghệ An",                                        description: "TH True MILK vận hành quần thể trang trại bò sữa công nghệ cao lớn nhất châu Á với diện tích hơn 37.000 ha." },
  { id: "8", name: "Viettel Group", abbr: "VTL",  color: "#dc2626", industry: "Viễn thông",              website: "viettel.com.vn", email: "hr@viettel.com.vn", phone: "198",           jobs: 24, verified: true,  joinedDate: "08/2024", faculties: ["Faculty of IT"],                                                                  partnerStatus: "active",   size: "100.000+ nhân viên", address: "Khu phức hợp Viettel, 1 Giang Văn Minh, Ba Đình, Hà Nội",        description: "Viettel Group là công ty viễn thông lớn nhất Việt Nam và là một trong những thương hiệu viễn thông phát triển nhanh nhất thế giới." },
];

const _jobs: Record<string, Job[]> = {
  "1": [
    { id: "j1", title: "Lập trình viên Backend (Java)",    location: "Hà Nội",    salary: "15–25 triệu", tags: ["Java", "Spring Boot"],   deadline: "10/04/2024", status: "active", postedAt: "10/03/2024", faculties: ["Faculty of IT"] },
    { id: "j2", title: "Lập trình viên Frontend (React)",  location: "Hà Nội",    salary: "12–22 triệu", tags: ["React", "TypeScript"],   deadline: null,         status: "active", postedAt: "11/03/2024", faculties: ["Faculty of IT"] },
    { id: "j3", title: "Kỹ sư DevOps",                     location: "TP.HCM",    salary: "20–35 triệu", tags: ["Docker", "Kubernetes"],  deadline: "30/04/2024", status: "active", postedAt: "08/03/2024", faculties: ["Faculty of IT"] },
    { id: "j4", title: "Chuyên viên Phân tích Dữ liệu",   location: "Hà Nội",    salary: "14–22 triệu", tags: ["Python", "SQL", "Excel"],deadline: null,         status: "active", postedAt: "05/03/2024", faculties: ["Faculty of IT", "Faculty of Economics"] },
    { id: "j5", title: "Business Analyst",                  location: "Hà Nội",    salary: "16–26 triệu", tags: ["BA", "Agile", "Jira"],   deadline: "15/04/2024", status: "closed", postedAt: "01/03/2024", faculties: ["Faculty of Economics"] },
    { id: "j6", title: "Lập trình viên Mobile (Flutter)",  location: "Đà Nẵng",   salary: "13–20 triệu", tags: ["Flutter", "Dart"],       deadline: null,         status: "active", postedAt: "12/03/2024", faculties: ["Faculty of IT"] },
  ],
  "2": [
    { id: "j7", title: "Kỹ sư Dữ liệu",    location: "TP.HCM", salary: "18–30 triệu", tags: ["Python", "SQL"],    deadline: "05/04/2024", status: "active", postedAt: "08/03/2024", faculties: ["Faculty of IT", "Faculty of Economics"] },
    { id: "j8", title: "Product Manager",   location: "TP.HCM", salary: "25–40 triệu", tags: ["Product", "Agile"], deadline: null,         status: "active", postedAt: "06/03/2024", faculties: ["Faculty of Economics"] },
    { id: "j9", title: "Kỹ sư Xây dựng",   location: "Hà Nội", salary: "15–22 triệu", tags: ["AutoCAD", "Civil"], deadline: "20/04/2024", status: "active", postedAt: "07/03/2024", faculties: ["Faculty of Mech. & Elec. Engineering"] },
  ],
  "4": [
    { id: "j10", title: "Kỹ sư Cơ khí",   location: "Hải Phòng", salary: "14–20 triệu", tags: ["AutoCAD", "Mechanics"], deadline: null, status: "active", postedAt: "09/03/2024", faculties: ["Faculty of Mech. & Elec. Engineering"] },
    { id: "j11", title: "Kỹ sư Điện tử",  location: "Hải Phòng", salary: "16–24 triệu", tags: ["Electronics", "PLC"],   deadline: null, status: "active", postedAt: "04/03/2024", faculties: ["Faculty of Mech. & Elec. Engineering"] },
  ],
};

//  Enterprise API 

/** Lấy danh sách tất cả doanh nghiệp */
export async function fetchEnterprises(): Promise<Enterprise[]> {
  await delay();
  return [..._enterprises];
}

/** Lấy 1 doanh nghiệp theo id */
export async function fetchEnterpriseById(id: string): Promise<Enterprise | null> {
  await delay();
  return _enterprises.find(e => e.id === id) ?? null;
}

/** Thêm doanh nghiệp mới */
export async function createEnterprise(payload: EnterpriseFormValues): Promise<Enterprise> {
  await delay();
  const newEnt: Enterprise = {
    id: String(Date.now()),
    color: "#7c3aed",
    jobs: 0,
    verified: false,
    partnerStatus: "active",
    joinedDate: new Date().toLocaleDateString("vi-VN", { month: "2-digit", year: "numeric" }),
    ...payload,
  };
  _enterprises.unshift(newEnt);
  return newEnt;
}

/** Cập nhật doanh nghiệp */
export async function updateEnterprise(id: string, payload: Partial<Enterprise>): Promise<Enterprise> {
  await delay();
  const idx = _enterprises.findIndex(e => e.id === id);
  if (idx === -1) throw new Error(`Enterprise ${id} not found`);
  _enterprises[idx] = { ..._enterprises[idx], ...payload };
  return _enterprises[idx];
}

/** Xác minh doanh nghiệp */
export async function verifyEnterprise(id: string): Promise<Enterprise> {
  return updateEnterprise(id, { verified: true });
}

/** Đổi trạng thái đối tác */
export async function setPartnerStatus(
  id: string,
  status: "active" | "inactive",
): Promise<Enterprise> {
  return updateEnterprise(id, { partnerStatus: status });
}

// Job API  

/** Lấy danh sách job của 1 doanh nghiệp */
export async function fetchJobsByEnterprise(enterpriseId: string): Promise<Job[]> {
  await delay();
  return [...(_jobs[enterpriseId] ?? [])];
}

/** Thêm job mới */
export async function createJob(enterpriseId: string, payload: JobFormValues): Promise<Job> {
  await delay();
  const newJob: Job = {
    id: `j_${Date.now()}`,
    postedAt: today(),
    ...payload,
  };
  if (!_jobs[enterpriseId]) _jobs[enterpriseId] = [];
  _jobs[enterpriseId].unshift(newJob);
  // Cập nhật jobs count trên enterprise
  const ent = _enterprises.find(e => e.id === enterpriseId);
  if (ent) ent.jobs = _jobs[enterpriseId].length;
  return newJob;
}

/** Cập nhật job */
export async function updateJob(
  enterpriseId: string,
  jobId: string,
  payload: Partial<Job>,
): Promise<Job> {
  await delay();
  const list = _jobs[enterpriseId] ?? [];
  const idx  = list.findIndex(j => j.id === jobId);
  if (idx === -1) throw new Error(`Job ${jobId} not found`);
  list[idx] = { ...list[idx], ...payload };
  return list[idx];
}

/** Xóa job */
export async function deleteJob(enterpriseId: string, jobId: string): Promise<void> {
  await delay();
  if (_jobs[enterpriseId]) {
    _jobs[enterpriseId] = _jobs[enterpriseId].filter(j => j.id !== jobId);
    const ent = _enterprises.find(e => e.id === enterpriseId);
    if (ent) ent.jobs = _jobs[enterpriseId].length;
  }
}

// Faculty API   
/** Lấy màu theo khoa (giả lập async) */
export async function fetchFacultyColors(): Promise<Record<FacultyKey, string>> {
  await delay(120);
  return { ...FACULTY_COLOR_MAP };
}