import type { Faculty, Major, ClassItem } from "./types";

// ── Mock data ────────────────────────────────────────────────────
const FACULTIES: Faculty[] = [
  { id: "1", slug: "cong-nghe-thong-tin",  name: "Công nghệ thông tin",  abbr: "CNTT", color: "#7c3aed", majors: 5, classes: 24, students: 1200 },
  { id: "2", slug: "kinh-te",              name: "Kinh tế",              abbr: "KT",   color: "#0ea5e9", majors: 4, classes: 18, students: 980  },
  { id: "3", slug: "nong-nghiep",          name: "Nông nghiệp",          abbr: "NN",   color: "#16a34a", majors: 6, classes: 30, students: 1540 },
  { id: "4", slug: "cong-nghe-sinh-hoc",   name: "Công nghệ sinh học",   abbr: "CNSH", color: "#f59e0b", majors: 3, classes: 14, students: 620  },
  { id: "5", slug: "quan-ly-dat-dai",      name: "Quản lý đất đai",      abbr: "QLĐD", color: "#ef4444", majors: 2, classes: 10, students: 430  },
  { id: "6", slug: "thu-y",               name: "Thú y",                abbr: "TY",   color: "#8b5cf6", majors: 3, classes: 12, students: 510  },
  { id: "7", slug: "cong-nghe-thuc-pham", name: "Công nghệ thực phẩm",  abbr: "CNTP", color: "#ec4899", majors: 4, classes: 16, students: 720  },
  { id: "8", slug: "moi-truong",          name: "Môi trường",            abbr: "MT",   color: "#14b8a6", majors: 3, classes: 11, students: 490  },
];

const MAJORS: Major[] = [
  { id: "1", slug: "ky-thuat-phan-mem",   facultySlug: "cong-nghe-thong-tin", name: "Kỹ thuật phần mềm",  code: "KTPM", khoa: [2021, 2022, 2023, 2024], classes: 8, students: 320 },
  { id: "2", slug: "he-thong-thong-tin",  facultySlug: "cong-nghe-thong-tin", name: "Hệ thống thông tin", code: "HTTT", khoa: [2021, 2022, 2023],       classes: 6, students: 240 },
  { id: "3", slug: "an-toan-thong-tin",   facultySlug: "cong-nghe-thong-tin", name: "An toàn thông tin",  code: "ATTT", khoa: [2022, 2023, 2024],       classes: 4, students: 160 },
  { id: "4", slug: "khoa-hoc-may-tinh",   facultySlug: "cong-nghe-thong-tin", name: "Khoa học máy tính",  code: "KHMT", khoa: [2021, 2022, 2023, 2024], classes: 4, students: 200 },
  { id: "5", slug: "tri-tue-nhan-tao",    facultySlug: "cong-nghe-thong-tin", name: "Trí tuệ nhân tạo",   code: "TTNT", khoa: [2023, 2024],             classes: 2, students: 80  },
];

const CLASSES: ClassItem[] = [
  { id: "1", name: "KTPM66A", khoa: 2021, students: 42, advisor: "TS. Nguyễn Văn A" },
  { id: "2", name: "KTPM66B", khoa: 2021, students: 38, advisor: "TS. Trần Thị B"   },
  { id: "3", name: "KTPM67A", khoa: 2022, students: 45, advisor: "PGS. Lê Văn C"    },
  { id: "4", name: "KTPM67B", khoa: 2022, students: 40, advisor: "TS. Phạm Thị D"   },
  { id: "5", name: "KTPM68A", khoa: 2023, students: 50, advisor: "TS. Hoàng Văn E"  },
  { id: "6", name: "KTPM68B", khoa: 2023, students: 47, advisor: "TS. Vũ Thị F"     },
  { id: "7", name: "KTPM69A", khoa: 2024, students: 52, advisor: "TS. Đỗ Văn G"     },
  { id: "8", name: "KTPM69B", khoa: 2024, students: 48, advisor: "TS. Bùi Thị H"    },
];

// Simulate network latency
const delay = (ms = 300) => new Promise(res => setTimeout(res, ms));

// ── API functions ────────────────────────────────────────────────
export async function fetchFaculties(): Promise<Faculty[]> {
  await delay();
  return FACULTIES;
}

export async function fetchFacultyBySlug(slug: string): Promise<Faculty | undefined> {
  await delay();
  return FACULTIES.find(f => f.slug === slug);
}

export async function fetchMajorsByFacultySlug(facultySlug: string): Promise<Major[]> {
  await delay();
  return MAJORS.filter(m => m.facultySlug === facultySlug);
}

export async function fetchMajorBySlug(majorSlug: string): Promise<Major | undefined> {
  await delay();
  return MAJORS.find(m => m.slug === majorSlug);
}

// In a real app, filter by majorSlug
export async function fetchClassesByMajorSlug(_majorSlug: string): Promise<ClassItem[]> {
  await delay();
  return CLASSES;
}