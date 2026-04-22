import type { Graduation, GraduationStudent, PaginatedResponse } from "./type";

const BASE_URL = import.meta.env.VITE_API_URL ?? "";

const USE_MOCK = true; // Tắt cái này khi API sẵn sàng

// ─── Mock Graduations ─────────────────────────────────────────────────────────
const MOCK_GRADUATIONS: Graduation[] = [
  {
    id: 1,
    name: "DSSVTN ngành MMT&TTDL và KHDL&TTNT KSVL cho kiểm định 2026",
    school_year: "2025",
    student_count: 13,
    certification: "QĐ-123/ĐHBK",
    certification_date: "2026-01-15T00:00:00",
    faculty_id: 1,
    created_at: "2026-01-01T00:00:00",
    updated_at: "2026-03-18T01:12:00",
  },
  {
    id: 2,
    name: "Đợt tốt nghiệp tháng 6 năm 2025 - Khoa Công nghệ thông tin",
    school_year: "2025",
    student_count: 248,
    certification: "QĐ-456/CNTT",
    certification_date: "2025-06-01T00:00:00",
    faculty_id: 2,
    created_at: "2025-05-01T00:00:00",
    updated_at: "2026-02-10T08:30:00",
  },
  {
    id: 3,
    name: "Đợt tốt nghiệp tháng 12 năm 2024 - Toàn trường",
    school_year: "2024",
    student_count: 512,
    certification: "QĐ-789/ĐHBK",
    certification_date: "2024-12-05T00:00:00",
    faculty_id: 1,
    created_at: "2024-11-01T00:00:00",
    updated_at: "2025-12-20T14:00:00",
  },
  {
    id: 4,
    name: "Đợt tốt nghiệp tháng 6 năm 2024 - Khoa Điện - Điện tử",
    school_year: "2024",
    student_count: 187,
    certification: "QĐ-321/ĐĐT",
    certification_date: "2024-06-10T00:00:00",
    faculty_id: 3,
    created_at: "2024-05-01T00:00:00",
    updated_at: "2025-06-18T09:45:00",
  },
  {
    id: 5,
    name: "Đợt tốt nghiệp tháng 3 năm 2024 - Khoa Cơ khí",
    school_year: "2024",
    student_count: 95,
    certification: "QĐ-654/CK",
    certification_date: "2024-03-01T00:00:00",
    faculty_id: 4,
    created_at: "2024-02-01T00:00:00",
    updated_at: "2025-03-05T11:20:00",
  },
];

// ─── Mock Students ────────────────────────────────────────────────────────────
const MOCK_STUDENTS: GraduationStudent[] = [
  {
    id: 1,
    code: "2001215001",
    full_name: "Nguyễn Văn An",
    first_name: "An",
    last_name: "Nguyễn Văn",
    email: "an.nguyen@student.edu.vn",
    phone: "0901234567",
    dob: "2002-05-10",
    gender: "male",
    citizen_identification: "001202012345",
    training_industry_id: 1,
    training_industry_code: "7480201",
    training_industry_name: "Mạng máy tính và truyền thông dữ liệu",
    school_year_end: "2025",
  },
  {
    id: 2,
    code: "2001215002",
    full_name: "Trần Thị Bích",
    first_name: "Bích",
    last_name: "Trần Thị",
    email: "bich.tran@student.edu.vn",
    phone: "0912345678",
    dob: "2002-08-22",
    gender: "female",
    citizen_identification: "001202098765",
    training_industry_id: 1,
    training_industry_code: "7480201",
    training_industry_name: "Mạng máy tính và truyền thông dữ liệu",
    school_year_end: "2025",
  },
  {
    id: 3,
    code: "2001215003",
    full_name: "Lê Hoàng Duy",
    first_name: "Duy",
    last_name: "Lê Hoàng",
    email: "duy.le@student.edu.vn",
    phone: "0923456789",
    dob: "2001-12-03",
    gender: "male",
    citizen_identification: "001201056789",
    training_industry_id: 2,
    training_industry_code: "7480104",
    training_industry_name: "Hệ thống thông tin",
    school_year_end: "2025",
  },
  {
    id: 4,
    code: "2001215004",
    full_name: "Phạm Thị Cẩm Tú",
    first_name: "Tú",
    last_name: "Phạm Thị Cẩm",
    email: "tu.pham@student.edu.vn",
    phone: "0934567890",
    dob: "2002-03-17",
    gender: "female",
    citizen_identification: "001202034567",
    training_industry_id: 2,
    training_industry_code: "7480104",
    training_industry_name: "Hệ thống thông tin",
    school_year_end: "2025",
  },
  {
    id: 5,
    code: "2001215005",
    full_name: "Võ Minh Khoa",
    first_name: "Khoa",
    last_name: "Võ Minh",
    email: "khoa.vo@student.edu.vn",
    phone: "0945678901",
    dob: "2001-07-29",
    gender: "male",
    citizen_identification: "001201078901",
    training_industry_id: 3,
    training_industry_code: "7480301",
    training_industry_name: "Khoa học dữ liệu và trí tuệ nhân tạo",
    school_year_end: "2025",
  },
  {
    id: 6,
    code: "2001215006",
    full_name: "Đặng Thị Lan Anh",
    first_name: "Anh",
    last_name: "Đặng Thị Lan",
    email: "anh.dang@student.edu.vn",
    phone: "0956789012",
    dob: "2002-01-14",
    gender: "female",
    citizen_identification: "001202011234",
    training_industry_id: 3,
    training_industry_code: "7480301",
    training_industry_name: "Khoa học dữ liệu và trí tuệ nhân tạo",
    school_year_end: "2025",
  },
  {
    id: 7,
    code: "2001215007",
    full_name: "Huỳnh Tấn Phát",
    first_name: "Phát",
    last_name: "Huỳnh Tấn",
    email: "phat.huynh@student.edu.vn",
    phone: "0967890123",
    dob: "2001-09-05",
    gender: "male",
    citizen_identification: "001201089012",
    training_industry_id: 1,
    training_industry_code: "7480201",
    training_industry_name: "Mạng máy tính và truyền thông dữ liệu",
    school_year_end: "2025",
  },
  {
    id: 8,
    code: "2001215008",
    full_name: "Ngô Thị Thu Hà",
    first_name: "Hà",
    last_name: "Ngô Thị Thu",
    email: "ha.ngo@student.edu.vn",
    phone: "0978901234",
    dob: "2002-06-20",
    gender: "female",
    citizen_identification: "001202067890",
    training_industry_id: 2,
    training_industry_code: "7480104",
    training_industry_name: "Hệ thống thông tin",
    school_year_end: "2025",
  },
];

 async function getToken(): Promise<string> {
  return localStorage.getItem("st_students_token") ?? "";
}

function paginate<T>(data: T[], page: number, perPage = 10): PaginatedResponse<T> {
  const start = (page - 1) * perPage;
  return {
    data: data.slice(start, start + perPage),
    meta: {
      total: data.length,
      per_page: perPage,
      current_page: page,
      last_page: Math.ceil(data.length / perPage),
    },
  };
}

 export async function fetchGraduations(page = 1): Promise<PaginatedResponse<Graduation>> {
  if (USE_MOCK) return paginate(MOCK_GRADUATIONS, page);

  const token = await getToken();
  const res = await fetch(
    `${BASE_URL}/api/v1/graduation-ceremonies?page=${page}`,
    { headers: { Authorization: `Bearer ${token}` } }
  );
  if (!res.ok) throw new Error("Không thể tải danh sách đợt tốt nghiệp.");
  const json = await res.json();
  return {
    data: json.data ?? [],
    meta: json.meta ?? { total: 0, per_page: 10, current_page: 1, last_page: 1 },
  };
}

export async function fetchGraduationStudents(
  graduationId: number,
  page = 1
): Promise<PaginatedResponse<GraduationStudent>> {
  if (USE_MOCK) return paginate(MOCK_STUDENTS, page);

  const token = await getToken();
  const res = await fetch(
    `${BASE_URL}/api/v1/graduation-ceremonies/${graduationId}/students?page=${page}`,
    { headers: { Authorization: `Bearer ${token}` } }
  );
  if (!res.ok) throw new Error("Không thể tải danh sách sinh viên.");
  const json = await res.json();
  return {
    data: json.data ?? [],
    meta: json.meta ?? { total: 0, per_page: 10, current_page: 1, last_page: 1 },
  };
}