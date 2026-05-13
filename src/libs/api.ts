// src/libs/api.ts
import axios from 'axios';
import { errorInterceptor, requestInterceptor, successInterceptor } from './interceptors';

// ========== MOCK DATA ==========
// Bat/tat mock mode (true = dung mock, false = goi API that)
const USE_MOCK = true;

// ============ Mock Roles (EXISTING) ============
const mockRoles = [
  {
    _id: '1',
    code: 'ADMIN',
    name: 'Quan tri vien',
    description: 'Toan quyen he thong',
    isDeleted: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    createdBy: { fullName: 'System' },
    updatedBy: { fullName: 'System' },
    permissions: [
      { resource: 'users', action: 'create' },
      { resource: 'users', action: 'read' },
      { resource: 'users', action: 'update' },
      { resource: 'users', action: 'delete' },
      { resource: 'roles', action: 'create' },
      { resource: 'roles', action: 'read' },
      { resource: 'roles', action: 'update' },
      { resource: 'roles', action: 'delete' },
      { resource: 'resources', action: 'create' },
      { resource: 'resources', action: 'read' },
      { resource: 'resources', action: 'update' },
      { resource: 'resources', action: 'delete' },
    ],
  },
  {
    _id: '2',
    code: 'TEACHER',
    name: 'Giao vien',
    description: 'Quan ly hoc sinh va bai giang',
    isDeleted: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    createdBy: { fullName: 'Admin' },
    updatedBy: { fullName: 'Admin' },
    permissions: [
      { resource: 'students', action: 'read' },
      { resource: 'students', action: 'update' },
      { resource: 'courses', action: 'read' },
      { resource: 'courses', action: 'create' },
    ],
  },
  {
    _id: '3',
    code: 'STUDENT',
    name: 'Sinh vien',
    description: 'Xem thong tin ca nhan va hoc tap',
    isDeleted: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    createdBy: { fullName: 'Admin' },
    updatedBy: { fullName: 'Admin' },
    permissions: [
      { resource: 'courses', action: 'read' },
      { resource: 'profile', action: 'read' },
      { resource: 'profile', action: 'update' },
    ],
  },
];

// ========== Mock Users (EXISTING) ==========
const mockUsers = [
  {
    _id: '1',
    email: 'admin@example.com',
    fullName: 'Nguyen Van Admin',
    role: { _id: '1', code: 'ADMIN', name: 'Quan tri vien' },
    avatar: 'https://ui-avatars.com/api/?name=Admin',
    isDeleted: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    _id: '2',
    email: 'teacher1@example.com',
    fullName: 'Tran Thi Giao',
    role: { _id: '2', code: 'TEACHER', name: 'Giao vien' },
    avatar: 'https://ui-avatars.com/api/?name=Teacher',
    isDeleted: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    _id: '3',
    email: 'student1@example.com',
    fullName: 'Le Van Sinh',
    role: { _id: '3', code: 'STUDENT', name: 'Sinh vien' },
    avatar: 'https://ui-avatars.com/api/?name=Student',
    isDeleted: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

// ========== Mock Resources (EXISTING) ==========
const mockResources = [
  {
    _id: '1',
    title: 'Tai lieu hoc tap - Lap trinh web',
    type: 'document',
    url: 'https://example.com/resource1',
    description: 'Tai lieu huong dan lap trinh web co ban',
    isPublished: true,
    createdAt: new Date().toISOString(),
  },
  {
    _id: '2',
    title: 'Video bai giang - ReactJS',
    type: 'video',
    url: 'https://example.com/resource2',
    description: 'Video bai giang ve ReactJS co ban',
    isPublished: true,
    createdAt: new Date().toISOString(),
  },
  {
    _id: '3',
    title: 'Bai tap thuc hanh - TypeScript',
    type: 'assignment',
    url: 'https://example.com/resource3',
    description: 'Bai tap thuc hanh TypeScript',
    isPublished: false,
    createdAt: new Date().toISOString(),
  },
  {
    _id: '4',
    title: 'Slide trinh bay - NodeJS',
    type: 'document',
    url: 'https://example.com/resource4',
    description: 'Slide bai giang NodeJS',
    isPublished: true,
    createdAt: new Date().toISOString(),
  },
  {
    _id: '5',
    title: 'Project mau - E-commerce',
    type: 'project',
    url: 'https://example.com/resource5',
    description: 'Project mau website thuong mai dien tu',
    isPublished: true,
    createdAt: new Date().toISOString(),
  },
];

// ========== Mock Forms (NEW) ==========
const mockForms = [
  {
    id: 1,
    themeId: 'blue',
    name: 'Khao sat viec lam sau tot nghiep',
    status: 'published',
    description: 'Khao sat tinh trang viec lam cua sinh vien sau khi tot nghiep',
    questions: [
      { id: 'q1', type: 'short', title: 'Ho va ten', required: true, options: [] },
      { id: 'q2', type: 'short', title: 'Ma so sinh vien', required: true, options: [] },
      { id: 'q3', type: 'date', title: 'Ngay tot nghiep', required: true, options: [] },
      { id: 'q4', type: 'radio', title: 'Ban hien dang lam viec dau?', required: true, options: [
        { id: 'o1', label: 'Doanh nghiep trong nuoc' },
        { id: 'o2', label: 'Doanh nghiep nuoc ngoai' },
        { id: 'o3', label: 'Tu kinh doanh' },
        { id: 'o4', label: 'Hoc tiep / Nghien cuu sinh' },
      ]},
      { id: 'q5', type: 'rating', title: 'Muc do hai long voi chuong trinh dao tao', required: false, options: [] },
    ],
    created_at: '2024-06-15T08:00:00.000Z',
    updated_at: '2024-06-20T10:00:00.000Z',
  },
  {
    id: 2,
    themeId: 'green',
    name: 'Danh gia chuong trinh dao tao',
    status: 'published',
    description: 'Danh gia chat luong chuong trinh dao tao cua khoa',
    questions: [
      { id: 'q1', type: 'rating', title: 'Muc do hai long ve noi dung mon hoc', required: true, options: [] },
      { id: 'q2', type: 'rating', title: 'Muc do hai long ve phuong phap giang day', required: true, options: [] },
      { id: 'q3', type: 'paragraph', title: 'Y kien dong gop', required: false, options: [] },
    ],
    created_at: '2024-05-10T08:00:00.000Z',
    updated_at: '2024-05-15T10:00:00.000Z',
  },
  {
    id: 3,
    themeId: 'purple',
    name: 'Khao sat doanh nghiep doi tac',
    status: 'draft',
    description: 'Khao sat muc do hai long cua doanh nghiep ve chat luong sinh vien',
    questions: [
      { id: 'q1', type: 'rating', title: 'Chat luong kien thuc chuyen mon', required: true, options: [] },
      { id: 'q2', type: 'rating', title: 'Ky nang mem', required: true, options: [] },
      { id: 'q3', type: 'radio', title: 'Co tiep tuc nhan sinh vien tu truong?', required: true, options: [
        { id: 'o1', label: 'Co' },
        { id: 'o2', label: 'Khong' },
        { id: 'o3', label: 'Can xem xet' },
      ]},
    ],
    created_at: '2024-07-01T08:00:00.000Z',
    updated_at: '2024-07-01T08:00:00.000Z',
  },
];

// ========== Mock Alumni Batches (NEW) ==========
const mockAlumniBatches = [
  {
    id: 1,
    title: 'Khao sat tinh hinh viec lam cua sinh vien tot nghiep nam 2025',
    description: 'Khao sat viec lam cho sinh vien tot nghiep nam 2025',
    formId: 1,
    status: 'active',
    startDate: '2026-03-18T08:30:00.000Z',
    endDate: '2026-03-31T17:00:00.000Z',
    year: 2025,
    graduationPeriod: 'DSSVTN nganh MMT&TTDL va KHDL&TTNT KSVL cho kien dinh 2026',
    totalStudents: 13,
    responses: [
      {
        id: 101,
        batchId: 1,
        studentId: '650968',
        studentName: 'Nguyen Thi Thao',
        studentEmail: 'nthaoit2@gmail.com',
        studentPhone: '0886096932',
        khoa: 'cntt',
        nganh: 'mmt',
        lop: 'MHTA',
        answers: { q1: 'Da co viec lam', q5: 'Phu hop voi chuong trinh do chuyen mon' },
        submittedAt: '2026-03-28T08:26:00.000Z',
        status: 'submitted',
      },
      {
        id: 102,
        batchId: 1,
        studentId: '650969',
        studentName: 'Tran Van Minh',
        studentEmail: 'minhtran@gmail.com',
        studentPhone: '0912345678',
        khoa: 'cntt',
        nganh: 'khdl',
        lop: 'KHTB',
        answers: { q1: 'Chua co viec lam', q5: 'Can cai thien them' },
        submittedAt: '2026-03-27T14:00:00.000Z',
        status: 'submitted',
      },
    ],
  },
];

// ========== Mock Graduations (NEW) ==========
const mockGraduations = [
  {
    id: 1,
    name: 'DSSVTN nganh MMT&TTDL va KHDL&TTNT KSVL cho kien dinh 2026',
    school_year: '2025',
    student_count: 13,
    certification: 'QD-123/DHBK',
    certification_date: '2026-01-01T00:00:00.000Z',
    faculty_id: 1,
    created_at: '2026-01-01T00:00:00.000Z',
    updated_at: '2026-03-18T01:12:00.000Z',
  },
  {
    id: 2,
    name: 'Dot tot nghiep thang 6 nam 2025 - Khoa Cong nghe thong tin',
    school_year: '2025',
    student_count: 248,
    certification: 'QD-456/CNTT',
    certification_date: '2025-06-01T00:00:00.000Z',
    faculty_id: 2,
    created_at: '2025-05-15T00:00:00.000Z',
    updated_at: '2025-06-01T00:00:00.000Z',
  },
];

// Mock Graduation Students
const mockGraduationStudents = [
  {
    id: 1,
    graduation_id: 1,
    student_code: '650968',
    student_name: 'Nguyen Thi Thao',
    faculty_name: 'CNTT',
    major_name: 'MMT&TTDL',
    class_name: 'MHTA',
    gpa: '3.45',
    graduation_status: 'tot nghiep',
  },
  {
    id: 2,
    graduation_id: 1,
    student_code: '650969',
    student_name: 'Tran Van Minh',
    faculty_name: 'CNTT',
    major_name: 'KHDL&TTNT',
    class_name: 'KHTB',
    gpa: '3.78',
    graduation_status: 'tot nghiep',
  },
  {
    id: 3,
    graduation_id: 2,
    student_code: '640123',
    student_name: 'Le Van Hung',
    faculty_name: 'CNTT',
    major_name: 'Khoa hoc may tinh',
    class_name: 'CNTT2020',
    gpa: '3.92',
    graduation_status: 'tot nghiep',
  },
];

// ========== Mock Statistics (NEW) ==========
const mockStatsForms = [
  { id: 1, name: 'Khao sat tinh hinh viec lam sinh vien tot nghiep 2024' },
  { id: 2, name: 'Danh gia chuong trinh dao tao' },
  { id: 3, name: 'Khao sat doanh nghiep doi tac' },
];

const mockStatsQuestions: Record<number, any[]> = {
  1: [
    { id: 'q09', title: 'Tinh trang viec lam hien tai', chartType: 'pie' },
    { id: 'q03', title: 'Gioi tinh', chartType: 'pie' },
    { id: 'q13', title: 'Khu vuc lam viec', chartType: 'column' },
    { id: 'q19', title: 'Muc thu nhap binh quan/thang hien nay', chartType: 'column' },
  ],
  2: [
    { id: 'q1', title: 'Muc do hai long ve chuong trinh dao tao', chartType: 'column' },
  ],
  3: [
    { id: 'q1', title: 'Muc do hai long cua doanh nghiep doi tac', chartType: 'column' },
  ],
};

const mockStatsDetails: Record<string, Record<string, { count: number; percent: number }>> = {
  '1-q09': {
    'Da co viec lam': { count: 85, percent: 65.4 },
    'Tiep tuc hoc': { count: 30, percent: 23.1 },
    'Chua co viec lam': { count: 15, percent: 11.5 },
  },
  '1-q03': {
    'Nam': { count: 70, percent: 53.8 },
    'Nu': { count: 60, percent: 46.2 },
  },
  '1-q13': {
    'Ha Noi': { count: 50, percent: 38.5 },
    'TP HCM': { count: 40, percent: 30.8 },
    'Da Nang': { count: 20, percent: 15.4 },
    'Khu vuc khac': { count: 20, percent: 15.4 },
  },
};

// ========== AXIOS INSTANCE (MODULE SCOPE) ==========
// Khai bao o day de dung cho ca Proxy wrapper va fallback trong mockApiHandler
const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});
requestInterceptor(axiosInstance);
successInterceptor(axiosInstance);
errorInterceptor(axiosInstance);

// ========== HELPER & MOCK API HANDLER ==========
const delay = (ms: number = 500) => new Promise((resolve) => setTimeout(resolve, ms));

// Helper function for pagination
function paginate<T>(array: T[], page: number, size: number) {
  const total = array.length;
  const start = page * size;
  const paginatedData = array.slice(start, start + size);
  return {
    data: paginatedData,
    page: {
      total_pages: Math.ceil(total / size),
      has_next: start + size < total,
      has_previous: page > 0,
      current_page: page,
      total_elements: total,
    },
  };
}

// Mock API Handler - routes requests to mock data
const mockApiHandler = async (method: string, url: string, data?: any, params?: any) => {
  await delay();
  console.log('[MOCK]', method, url, { data, params });

  // ========== Roles API (EXISTING) ==========
  if (url === '/roles' && method === 'GET') {
    let filtered = [...mockRoles];
    const { page = 0, size = 10, code, name } = params || {};
    if (code) filtered = filtered.filter((r) => r.code.toLowerCase().includes(code.toLowerCase()));
    if (name) filtered = filtered.filter((r) => r.name.toLowerCase().includes(name.toLowerCase()));
    return paginate(filtered, page, size);
  }
  if (url.match(/^\/v1\.0\/roles\/.+$/) && method === 'GET') {
    const id = url.split('/').pop();
    return mockRoles.find((r) => r._id === id);
  }
  if (url === '/roles' && method === 'POST') {
    const newRole = { ...data, _id: String(mockRoles.length + 1), createdAt: new Date().toISOString() };
    return newRole;
  }
  if (url.match(/^\/v1\.0\/roles\/.+$/) && method === 'PUT') {
    const id = url.split('/').pop();
    return { ...data, _id: id, updatedAt: new Date().toISOString() };
  }
  if (url.match(/^\/v1\.0\/roles\/.+$/) && method === 'DELETE') {
    return { success: true };
  }

  // ========== Users API (EXISTING) ==========
  if (url === '/users' && method === 'GET') {
    let filtered = [...mockUsers];
    const { page = 0, size = 10, email, role } = params || {};
    if (email) filtered = filtered.filter((u) => u.email.toLowerCase().includes(email.toLowerCase()));
    if (role) filtered = filtered.filter((u) => u.role.code === role);
    return paginate(filtered, page, size);
  }
  if (url.match(/^\/v1\.0\/users\/.+$/) && method === 'GET') {
    const id = url.split('/').pop();
    return mockUsers.find((u) => u._id === id);
  }
  if (url === '/users' && method === 'POST') {
    return { ...data, _id: String(mockUsers.length + 1), createdAt: new Date().toISOString() };
  }
  if (url.match(/^\/v1\.0\/users\/.+$/) && method === 'PUT') {
    const id = url.split('/').pop();
    if (url.includes('change-password')) return { success: true, message: 'Password changed' };
    if (url.includes('suspend')) return { success: true, message: 'User suspended' };
    return { ...data, _id: id, updatedAt: new Date().toISOString() };
  }
  if (url.match(/^\/v1\.0\/users\/.+$/) && method === 'DELETE') {
    return { success: true };
  }

  // ========== Resources API (EXISTING) ==========
  if (url === '/resources' && method === 'GET') {
    return paginate([...mockResources], params?.page || 0, params?.size || 10);
  }
  if (url === '/resources' && method === 'POST') {
    return { ...data, _id: String(mockResources.length + 1), createdAt: new Date().toISOString() };
  }
  if (url.match(/^\/v1\.0\/resources\/.+$/) && method === 'PUT') {
    const id = url.split('/').pop();
    return { ...data, _id: id, updatedAt: new Date().toISOString() };
  }
  if (url.match(/^\/v1\.0\/resources\/.+$/) && method === 'DELETE') {
    return { success: true };
  }

  // ========== Forms API (NEW) ==========
  if (url === '/forms' && method === 'GET') {
    let filtered = [...mockForms];
    const { page = 0, size = 10, status } = params || {};
    if (status) filtered = filtered.filter((f) => f.status === status);
    return paginate(filtered, page, size);
  }
  if (url.match(/^\/v1\.0\/forms\/.+$/) && !url.includes('/duplicate') && !url.includes('/ai') && method === 'GET') {
    const id = parseInt(url.split('/').pop() || '0', 10);
    return mockForms.find((f) => f.id === id);
  }
  if (url === '/forms' && method === 'POST') {
    const newForm = { ...data, id: mockForms.length + 1, created_at: new Date().toISOString() };
    return newForm;
  }
  if (url.match(/^\/v1\.0\/forms\/.+$/) && !url.includes('/duplicate') && !url.includes('/ai') && method === 'PUT') {
    const id = parseInt(url.split('/').pop() || '0', 10);
    const form = mockForms.find((f) => f.id === id);
    return form ? { ...form, ...data, updated_at: new Date().toISOString() } : null;
  }
  if (url.match(/^\/v1\.0\/forms\/.+$/) && !url.includes('/duplicate') && !url.includes('/ai') && method === 'DELETE') {
    return { success: true };
  }
  if (url.match(/^\/v1\.0\/forms\/.+\/duplicate$/) && method === 'POST') {
    const id = parseInt(url.split('/')[3], 10);
    const original = mockForms.find((f) => f.id === id);
    if (!original) return null;
    return { ...original, id: mockForms.length + 1, name: original.name + ' (Copy)', created_at: new Date().toISOString() };
  }
  if (url.match(/^\/api\/v1\/forms\/.+\/ai\/generateContent$/) || url.match(/^\/api\/v1\/forms\/ai\/generate$/) && method === 'POST') {
    return {
      form: {
        id: mockForms.length + 1,
        name: 'Generated Form from AI',
        status: 'draft',
        description: 'Form duoc tao tu AI',
        questions: [
          { id: 'gq1', type: 'short', title: 'Generated Question 1', required: true, options: [] },
        ],
        created_at: new Date().toISOString(),
      },
      prompt: data?.prompt || '',
    };
  }

  // ========== Alumni API (NEW) ==========
  if (url === '/alumni' && method === 'GET') {
    return paginate([...mockAlumniBatches], params?.page || 0, params?.size || 10);
  }
  if (url.match(/^\/v1\.0\/alumni\/.+$/) && !url.includes('/stats') && method === 'GET') {
    const id = parseInt(url.split('/').pop() || '0', 10);
    return mockAlumniBatches.find((b) => b.id === id);
  }
  if (url === '/alumni' && method === 'POST') {
    return { ...data, id: mockAlumniBatches.length + 1 };
  }
  if (url.match(/^\/v1\.0\/alumni\/.+$/) && !url.includes('/stats') && method === 'PUT') {
    const id = parseInt(url.split('/').pop() || '0', 10);
    return { ...data, id: id, updatedAt: new Date().toISOString() };
  }
  if (url.match(/^\/v1\.0\/alumni\/.+$/) && !url.includes('/stats') && method === 'DELETE') {
    return { success: true };
  }
  if (url.match(/^\/v1\.0\/alumni\/.+\/stats$/) && method === 'GET') {
    const id = parseInt(url.split('/')[3], 10);
    const batch = mockAlumniBatches.find((b) => b.id === id);
    if (!batch) return null;
    const responses = batch.responses || [];
    return {
      totalStudents: batch.totalStudents || 0,
      totalResponses: responses.length,
      responseRate: responses.length / (batch.totalStudents || 1) * 100,
      submittedCount: responses.filter((r) => r.status === 'submitted').length,
      pendingCount: responses.filter((r) => r.status === 'pending').length,
    };
  }

  // ========== Graduation API (NEW) ==========
  if (url.match(/^\/api\/v1\/graduation-ceremonies$/) && method === 'GET') {
    const page = params?.page || 0;
    return paginate([...mockGraduations], page, 10);
  }
  if (url.match(/^\/api\/v1\/graduation-ceremonies\/.+\/students$/) && method === 'GET') {
    const graduationId = parseInt(url.split('/')[4], 10);
    const page = params?.page || 0;
    const students = mockGraduationStudents.filter((s) => s.graduation_id === graduationId);
    return paginate(students, page, 10);
  }

  // ========== Statistics API (NEW) ==========
  if (url.match(/^\/v1\.0\/statistics\/forms$/) && method === 'GET') {
    return [...mockStatsForms];
  }
  if (url.match(/^\/v1\.0\/statistics\/questions\/.+$/) && method === 'GET') {
    const formId = parseInt(url.split('/').pop() || '0', 10);
    return mockStatsQuestions[formId] || [];
  }
  if (url.match(/^\/v1\.0\/statistics\/detail\/.+$/) && method === 'GET') {
    const parts = url.split('/');
    const formId = parts[4];
    const questionId = parts[5];
    const key = `${formId}-${questionId}`;
    return mockStatsDetails[key] || null;
  }

  // Fallback - su dung axiosInstance tu module scope
  const response = await axiosInstance({ method, url, data, params });
  return response.data;
};

// Proxy wrapper - intercepts API calls and routes to mock handler when USE_MOCK is true
const api = new Proxy(axiosInstance, {
  get(target, prop) {
    const targetProp = target[prop];
    if (typeof targetProp === 'function') {
      return async (...args: any[]) => {
        if (!USE_MOCK) {
          return targetProp.apply(target, args);
        }
        const [url, config] = args;
        const data = config?.data;
        const params = config?.params;
        const method = prop.toString().toUpperCase();
        return mockApiHandler(method, url, data, params);
      };
    }
    return targetProp;
  },
});

export { api };
