// src/libs/api.ts
import axios from 'axios';
import { errorInterceptor, requestInterceptor, successInterceptor } from './interceptors';

// ============ MOCK DATA ============
// Bật/tắt mock mode (true = dùng mock, false = gọi API thật)
const USE_MOCK = true;

// Mock Roles
const mockRoles = [
  {
    _id: '1',
    code: 'ADMIN',
    name: 'Quản trị viên',
    description: 'Toàn quyền hệ thống',
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
    ]
  },
  {
    _id: '2',
    code: 'TEACHER',
    name: 'Giáo viên',
    description: 'Quản lý học sinh và bài giảng',
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
    ]
  },
  {
    _id: '3',
    code: 'STUDENT',
    name: 'Học sinh',
    description: 'Xem thông tin khóa học',
    isDeleted: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    createdBy: { fullName: 'Admin' },
    updatedBy: { fullName: 'Admin' },
    permissions: [
      { resource: 'courses', action: 'read' },
    ]
  }
];

// Mock Users
let mockUsers = [
  {
    _id: '1',
    userName: 'admin',
    fullName: 'Administrator',
    email: 'admin@example.com',
    mobile: '0912345678',
    address: 'Hanoi',
    age: 30,
    sex: '0',
    bod: '1994-01-01',
    isSupperAdmin: true,
    roles: ['1'],
    isSuspended: false,
    isDeleted: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    createdBy: { fullName: 'System' },
    updatedBy: { fullName: 'System' }
  },
  {
    _id: '2',
    userName: 'teacher1',
    fullName: 'Nguyễn Văn A',
    email: 'teacher1@example.com',
    mobile: '0987654321',
    address: 'HCMC',
    age: 35,
    sex: '0',
    bod: '1989-05-15',
    isSupperAdmin: false,
    roles: ['2'],
    isSuspended: false,
    isDeleted: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    createdBy: { fullName: 'Admin' },
    updatedBy: { fullName: 'Admin' }
  },
  {
    _id: '3',
    userName: 'student1',
    fullName: 'Trần Thị B',
    email: 'student1@example.com',
    mobile: '0934567890',
    address: 'Da Nang',
    age: 20,
    sex: '1',
    bod: '2004-03-20',
    isSupperAdmin: false,
    roles: ['3'],
    isSuspended: false,
    isDeleted: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    createdBy: { fullName: 'Admin' },
    updatedBy: { fullName: 'Admin' }
  }
];

// Mock Resources
const mockResources = [
  {
    _id: '1',
    code: 'users',
    name: 'Quản lý người dùng',
    actions: ['create', 'read', 'update', 'delete']
  },
  {
    _id: '2',
    code: 'roles',
    name: 'Quản lý vai trò',
    actions: ['create', 'read', 'update', 'delete']
  },
  {
    _id: '3',
    code: 'resources',
    name: 'Quản lý tài nguyên',
    actions: ['create', 'read', 'update', 'delete']
  },
  {
    _id: '4',
    code: 'students',
    name: 'Quản lý học sinh',
    actions: ['create', 'read', 'update', 'delete']
  },
  {
    _id: '5',
    code: 'courses',
    name: 'Quản lý khóa học',
    actions: ['create', 'read', 'update', 'delete']
  }
];

// Helper: delay để simulate network
const delay = (ms: number = 500) => new Promise(resolve => setTimeout(resolve, ms));

// Mock API handlers
const mockApiHandler = async (method: string, url: string, data?: any, params?: any) => {
  await delay();
  
  console.log(`[MOCK] ${method} ${url}`, { data, params });

  // Roles API
  if (url === '/v1.0/roles' && method === 'GET') {
    let filtered = [...mockRoles];
    const { page = 0, size = 10, code, name } = params || {};
    
    if (code) filtered = filtered.filter(r => r.code.toLowerCase().includes(code.toLowerCase()));
    if (name) filtered = filtered.filter(r => r.name.toLowerCase().includes(name.toLowerCase()));
    
    const total = filtered.length;
    const start = page * size;
    const pagedData = filtered.slice(start, start + size);
    
    return {
      data: pagedData,
      page: {
        total_pages: Math.ceil(total / size),
        has_next: start + size < total,
        has_previous: page > 0,
        current_page: page,
        total_elements: total
      }
    };
  }

  if (url.match(/\/v1.0\/roles\/\w+/) && method === 'GET') {
    const id = url.split('/').pop();
    const role = mockRoles.find(r => r._id === id);
    if (!role) throw new Error('Role not found');
    return { data: role };
  }

  if (url === '/v1.0/roles' && method === 'POST') {
    const newRole = {
      _id: String(mockRoles.length + 1),
      ...data,
      isDeleted: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: { fullName: 'Current User' },
      updatedBy: { fullName: 'Current User' }
    };
    mockRoles.push(newRole);
    return { data: newRole };
  }

  if (url.match(/\/v1.0\/roles\/\w+/) && method === 'PUT') {
    const id = url.split('/').pop();
    const index = mockRoles.findIndex(r => r._id === id);
    if (index !== -1) {
      mockRoles[index] = { ...mockRoles[index], ...data, updatedAt: new Date().toISOString() };
    }
    return { data: mockRoles[index] };
  }

  if (url.match(/\/v1.0\/roles\/\w+/) && method === 'DELETE') {
    const id = url.split('/').pop();
    const index = mockRoles.findIndex(r => r._id === id);
    if (index !== -1) mockRoles.splice(index, 1);
    return { data: { success: true } };
  }

  // Users API
  if (url === '/v1.0/users' && method === 'GET') {
    let filtered = [...mockUsers];
    const { page = 0, size = 10, fullName, userName, email, mobile, roleId } = params || {};
    
    if (fullName) filtered = filtered.filter(u => u.fullName.toLowerCase().includes(fullName.toLowerCase()));
    if (userName) filtered = filtered.filter(u => u.userName.toLowerCase().includes(userName.toLowerCase()));
    if (email) filtered = filtered.filter(u => u.email.toLowerCase().includes(email.toLowerCase()));
    if (mobile) filtered = filtered.filter(u => u.mobile.includes(mobile));
    if (roleId) filtered = filtered.filter(u => u.roles.includes(roleId));
    
    const total = filtered.length;
    const start = page * size;
    const pagedData = filtered.slice(start, start + size);
    
    // Enrich with role names
    const enrichedData = pagedData.map(user => ({
      ...user,
      roles: user.roles.map(roleId => mockRoles.find(r => r._id === roleId)).filter(Boolean)
    }));
    
    return {
      data: enrichedData,
      page: {
        total_pages: Math.ceil(total / size),
        has_next: start + size < total,
        has_previous: page > 0,
        current_page: page,
        total_elements: total
      }
    };
  }

  if (url.match(/\/v1.0\/users\/\w+/) && method === 'GET') {
    const id = url.split('/').pop();
    const user = mockUsers.find(u => u._id === id);
    if (!user) throw new Error('User not found');
    return { data: user };
  }

  if (url === '/v1.0/users' && method === 'POST') {
    const newUser = {
      _id: String(mockUsers.length + 1),
      ...data,
      isSuspended: false,
      isDeleted: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: { fullName: 'Current User' },
      updatedBy: { fullName: 'Current User' }
    };
    mockUsers.push(newUser);
    return { data: newUser };
  }

  if (url.match(/\/v1.0\/users\/\w+/) && method === 'PUT') {
    const id = url.split('/').pop();
    const index = mockUsers.findIndex(u => u._id === id);
    if (index !== -1) {
      mockUsers[index] = { ...mockUsers[index], ...data, updatedAt: new Date().toISOString() };
    }
    return { data: mockUsers[index] };
  }

  if (url.match(/\/v1.0\/users\/\w+\/change-password/) && method === 'PUT') {
    return { data: { success: true } };
  }

  if (url.match(/\/v1.0\/users\/\w+\/suspend/) && method === 'PUT') {
    const id = url.split('/')[3];
    const index = mockUsers.findIndex(u => u._id === id);
    if (index !== -1) {
      mockUsers[index].isSuspended = data.isSuspended;
    }
    return { data: { success: true } };
  }

  // Resources API
  if (url === '/v1.0/resources' && method === 'GET') {
    let filtered = [...mockResources];
    const { code, action, name, page = 0, size = 10 } = params || {};
    
    if (code) filtered = filtered.filter(r => r.code.toLowerCase().includes(code.toLowerCase()));
    if (name) filtered = filtered.filter(r => r.name.toLowerCase().includes(name.toLowerCase()));
    if (action) filtered = filtered.filter(r => r.actions.some(a => a.toLowerCase().includes(action.toLowerCase())));
    
    const total = filtered.length;
    const start = page * size;
    const pagedData = filtered.slice(start, start + size);
    
    return {
      data: pagedData,
      page: {
        total_pages: Math.ceil(total / size),
        has_next: start + size < total,
        has_previous: page > 0,
        current_page: page,
        total_elements: total
      }
    };
  }

  if (url === '/v1.0/resources' && method === 'POST') {
    const newResource = {
      _id: String(mockResources.length + 1),
      ...data
    };
    mockResources.push(newResource);
    return { data: newResource };
  }

  if (url.match(/\/v1.0\/resources\/\w+/) && method === 'PUT') {
    const id = url.split('/').pop();
    const index = mockResources.findIndex(r => r._id === id);
    if (index !== -1) {
      mockResources[index] = { ...mockResources[index], ...data };
    }
    return { data: mockResources[index] };
  }

  if (url.match(/\/v1.0\/resources\/\w+/) && method === 'DELETE') {
    const id = url.split('/').pop();
    const index = mockResources.findIndex(r => r._id === id);
    if (index !== -1) mockResources.splice(index, 1);
    return { data: { success: true } };
  }

  throw new Error(`Mock API not found: ${method} ${url}`);
};

// Tạo axios instance
const axiosRequestConfig = {
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
};

const axiosInstance = axios.create(axiosRequestConfig);

// Interceptors
axiosInstance.interceptors.request.use(requestInterceptor);
axiosInstance.interceptors.response.use(successInterceptor, errorInterceptor);

// Wrapper để chuyển hướng sang mock nếu cần
const api = new Proxy(axiosInstance, {
  get(target, prop) {
    const original = target[prop as keyof typeof target];
    if (USE_MOCK && (prop === 'get' || prop === 'post' || prop === 'put' || prop === 'delete')) {
      return async (url: string, config?: any) => {
        try {
          const mockData = await mockApiHandler(
            (prop as string).toUpperCase(),
            url,
            config?.data,
            prop === 'get' ? config?.params : config?.data
          );
          return { data: mockData };
        } catch (error) {
          console.error('Mock API error:', error);
          throw error;
        }
      };
    }
    return typeof original === 'function' ? original.bind(target) : original;
  }
});

export { api };