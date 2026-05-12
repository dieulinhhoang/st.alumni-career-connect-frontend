import { api } from '../../../libs/api';
import type { DotEntry, KhoaItem, EnterpriseItem, ChartMode, ChartModeConfig } from './type';

// ============ KHOA LIST ============
export const KHOA_LIST: KhoaItem[] = [
  { ten: 'Khoa CNTT', viet_tat: 'CNTT', mau: '#6366f1', ngayNop: '15/03/2024', daNop: true, soSV: 298, tongSV: 320 },
  { ten: 'Khoa Kinh te', viet_tat: 'KT', mau: '#0ea5e9', ngayNop: '18/03/2024', daNop: true, soSV: 386, tongSV: 410 },
  { ten: 'Khoa Nong nghiep', viet_tat: 'NN', mau: '#10b981', ngayNop: null, daNop: false, soSV: 0, tongSV: 520 },
  { ten: 'Khoa Moi truong', viet_tat: 'MT', mau: '#06b6d4', ngayNop: null, daNop: false, soSV: 0, tongSV: 280 },
  { ten: 'Khoa Thuy', viet_tat: 'TY', mau: '#ec4899', ngayNop: '20/03/2024', daNop: true, soSV: 185, tongSV: 190 },
  { ten: 'Khoa CN Thuc pham', viet_tat: 'TP', mau: '#f97316', ngayNop: null, daNop: false, soSV: 0, tongSV: 240 },
  { ten: 'Khoa Co dien', viet_tat: 'CD', mau: '#8b5cf6', ngayNop: '22/03/2024', daNop: true, soSV: 210, tongSV: 230 },
  { ten: 'Khoa Quan ly dat dai', viet_tat: 'QD', mau: '#f59e0b', ngayNop: null, daNop: false, soSV: 0, tongSV: 180 },
];

// ============ ENTERPRISE LIST ============
export const ENTERPRISE_LIST: EnterpriseItem[] = [
  { name: 'FPT Software', viet_tat: 'FPT', mau: '#6366f1', industry: 'Cong nghe thong tin', jobs: 42, verified: true },
  { name: 'Vingroup', viet_tat: 'VIC', mau: '#ec4899', industry: 'Tap doan da nganh', jobs: 28, verified: true },
  { name: 'Agribank', viet_tat: 'AGR', mau: '#10b981', industry: 'Ngan hang & Tai chinh', jobs: 15, verified: true },
  { name: 'VinFast', viet_tat: 'VF', mau: '#0ea5e9', industry: 'Cong nghiep & San xuat', jobs: 33, verified: true },
  { name: 'Masan Group', viet_tat: 'MSN', mau: '#f59e0b', industry: 'Nong nghiep & FMCG', jobs: 19, verified: true },
  { name: 'KPMG Vietnam', viet_tat: 'KPMG', mau: '#f97316', industry: 'Kiem toan & Tu van', jobs: 11, verified: false },
];

// ============ CHART MODES ============
export const CHART_MODES: { value: ChartMode; label: string }[] = [
  { value: 'overview', label: 'Tong quan' },
  { value: 'khoa', label: 'Theo khoa' },
  { value: 'sinhvien', label: 'Theo sinh vien' },
  { value: 'doanhnghiep', label: 'Theo doanh nghiep' },
];

// ============ API FUNCTIONS (sau nay thay bang api.get khi co backend) ============
// Sau nay se thay: api.get('/v1.0/dashboard/stats'), api.get('/v1.0/dashboard/faculties'), etc.

export const getDashboardStats = async () => {
  const { data } = await api.get('/v1.0/dashboard/stats');
  return data;
};

export const getFacultiesDashboard = async () => {
  const { data } = await api.get('/v1.0/dashboard/faculties');
  return data;
};

export const getEnterprisesDashboard = async () => {
  const { data } = await api.get('/v1.0/dashboard/enterprises');
  return data;
};
