import { api } from '../../libs/api';
import type {
  Enterprise,
  Job,
  EnterpriseFormValues,
  JobFormValues,
  FacultyKey,
} from './type';
import { FACULTY_COLOR_MAP } from './type';

// ============ SEED DATA ============
const _enterprises: Enterprise[] = [
  { id: '1', name: 'FPT Software', abbr: 'FPT', color: '#7c3aed', industry: 'Cong nghe thong tin', website: 'fpt.com.vn', email: 'careers@fpt.com.vn', jobs: 42, verified: true, description: 'Cong ty phan mem FPT' },
  { id: '2', name: 'Vingroup', abbr: 'VIC', color: '#db2777', industry: 'Tap doan da nganh', website: 'vingroup.net', email: 'hr@vingroup.net', jobs: 28, verified: true, description: 'Tap doan kinh te tu nhan Viet Nam' },
  { id: '3', name: 'Agribank', abbr: 'AGR', color: '#059669', industry: 'Ngan hang & Tai chinh', website: 'agribank.com.vn', email: 'tuyendung@agribank.com.vn', jobs: 15, verified: true, description: 'Ngan hang Thuong mai Co phan' },
  { id: '4', name: 'VinFast', abbr: 'VF', color: '#0284c7', industry: 'Cong nghiep & San xuat', website: 'vinfastauto.vn', email: 'careers@vinfast.vn', jobs: 33, verified: true, description: 'Nha san xuat o to dien' },
  { id: '5', name: 'Masan Group', abbr: 'MSN', color: '#d97706', industry: 'Nong nghiep & FMCG', website: 'masangroup.com', email: 'hr@masan.com.vn', jobs: 19, verified: true, description: 'Tap doan hang tieu dung' },
  { id: '6', name: 'KPMG Vietnam', abbr: 'KPMG', color: '#ea580c', industry: 'Kiem toan & Tu van', website: 'kpmg.com/vn', email: 'vietnamcareers@kpmg.com.vn', jobs: 11, verified: false, description: 'Cong ty kiem toan quoc te' },
  { id: '7', name: 'TH True Milk', abbr: 'TH', color: '#0891b2', industry: 'Nong nghiep & FMCG', website: 'thmilk.vn', email: 'tuyendung@thmilk.vn', jobs: 8, verified: true, description: 'Nha san xuat sua' },
  { id: '8', name: 'VNPT', abbr: 'VNPT', color: '#4f46e5', industry: 'Vien thong', website: 'vnpt.com.vn', email: 'careers@vnpt.vn', jobs: 22, verified: true, description: 'Tap doan Buu chinh Vien thong' },
];

const _jobs: Job[] = [
  { id: 'j1', enterpriseId: '1', title: 'Frontend Developer', salary: '15-25M', location: 'Ha Noi', postedAt: '2024-03-15', isOpen: true },
  { id: 'j2', enterpriseId: '1', title: 'Backend Developer', salary: '18-30M', location: 'Ha Noi', postedAt: '2024-03-14', isOpen: true },
  { id: 'j3', enterpriseId: '2', title: 'Software Engineer', salary: '20-35M', location: 'TP HCM', postedAt: '2024-03-13', isOpen: true },
  { id: 'j4', enterpriseId: '3', title: 'Data Analyst', salary: '12-18M', location: 'Ha Noi', postedAt: '2024-03-12', isOpen: true },
  { id: 'j5', enterpriseId: '4', title: 'DevOps Engineer', salary: '25-40M', location: 'Ha Noi', postedAt: '2024-03-11', isOpen: true },
  { id: 'j6', enterpriseId: '5', title: 'Product Manager', salary: '30-50M', location: 'TP HCM', postedAt: '2024-03-10', isOpen: true },
  { id: 'j7', enterpriseId: '6', title: 'Audit Associate', salary: '10-15M', location: 'Ha Noi', postedAt: '2024-03-09', isOpen: true },
];

// Helper
const delay = (ms = 200) => new Promise((res) => setTimeout(res, ms));
const today = () => new Date().toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });

// ============ API FUNCTIONS (sau nay thay bang api.get khi co backend) ============
// Sau nay se thay: api.get('/enterprises'), api.get('/jobs'), etc.

export const listEnterprises = async () => {
  const { data } = await api.get('/enterprises');
  return data;
};

export const getEnterpriseById = async (id: string) => {
  const { data } = await api.get(`/enterprises/${id}`);
  return data;
};

export const listJobs = async (enterpriseId?: string) => {
  const url = enterpriseId ? `/enterprises/${enterpriseId}/jobs` : '/jobs';
  const { data } = await api.get(url);
  return data;
};

export const getJobById = async (id: string) => {
  const { data } = await api.get(`/jobs/${id}`);
  return data;
};

export const searchEnterprises = async (term: string) => {
  const { data } = await api.get('/enterprises', { params: { q: term } });
  return data;
};

// ============ CRUD MISSING EXPORTS (consultant code needs these) ============
export const createEnterprise = async (payload: EnterpriseFormValues): Promise<Enterprise> => {
  const { data } = await api.post('/api/v1/enterprises', payload);
  return data;
};

export const updateEnterprise = async (id: string, payload: EnterpriseFormValues): Promise<Enterprise> => {
  const { data } = await api.put(`/api/v1/enterprises/${id}`, payload);
  return data;
};

export const deleteEnterprise = async (id: string): Promise<void> => {
  await api.delete(`/api/v1/enterprises/${id}`);
};

export const updateEnterpriseVerified = async (id: string, verified: boolean): Promise<Enterprise> => {
  const { data } = await api.patch(`/api/v1/enterprises/${id}/verified`, { verified });
  return data;
};

// Seed helpers for render/initial data
export const getSeedEnterprises = (): Enterprise[] => [..._enterprises];
export const getSeedJobs = (): Job[] => [..._jobs];
