import api from '../../libs/api';
import type {
  SurveyBatch,
  CreateBatchPayload,
  UpdateBatchPayload,
  BatchStats,
  AlumniResponse,
} from './types';

export async function getBatches(): Promise<(SurveyBatch & { submittedCount: number })[]> {
  const res = await api.get('/alumni/batches');
  console.log('Fetched batches:', res.data);
  return res.data;
}

export async function getBatchById(id: number): Promise<SurveyBatch> {
  const res = await api.get(`/alumni/batches/${id}`);
  return res.data;
}

/**
 * Lấy batch cho trang public survey – dùng chung instance api
 * vì backend không có global JwtAuthGuard
 */
export async function getBatchByIdPublic(id: number): Promise<SurveyBatch> {
  const res = await api.get(`/alumni/batches/${id}`);
  return res.data;
}

export async function createBatch(payload: CreateBatchPayload): Promise<SurveyBatch> {
  const res = await api.post('/alumni/batches', payload);
  
  return res.data;
}

export async function updateBatch(id: number, updates: UpdateBatchPayload): Promise<SurveyBatch> {
  const res = await api.put(`/alumni/batches/${id}`, updates);
  return res.data;
}

export async function deleteBatch(id: number): Promise<void> {
  await api.delete(`/alumni/batches/${id}`);
}

export async function getBatchStats(batchId: number): Promise<BatchStats> {
  const res = await api.get(`/alumni/batches/${batchId}/stats`);
  return res.data;
}

export async function getBatchResponses(batchId: number): Promise<AlumniResponse[]> {
  const res = await api.get(`/alumni/batches/${batchId}/responses`);
  return res.data;
}

//  Graduation API 
export interface GraduationOption {
  id: number;
  name: string;
  certification: string;
  certificationDate: string;
  schoolYear: number;
  studentCount: number;
}

export async function getGraduations(page = 1, perPage = 100): Promise<GraduationOption[]> {
  const res = await api.get('/graduation', { params: { page, per_page: perPage } });
  // Backend returns { data: [...], total, page, perPage }
  const raw = res.data;
  const list: any[] = Array.isArray(raw) ? raw : (raw.data ?? []);
  return list.map((g: any) => ({
    id: g.id,
    name: g.name,
    certification: g.certification,
    certificationDate: g.certification_date ?? g.certificationDate,
    schoolYear: g.school_year ?? g.schoolYear,
    studentCount: g.student_count ?? g.studentCount ?? 0,
  }));
}

/** Validate xem một mã SV có thuộc đợt tốt nghiệp (graduationId) không */
export async function checkStudentInGraduation(
  graduationId: number,
  studentCode: string,
): Promise<boolean> {
  try {
    // GET /grad-students?graduation_id=X&per_page=9999 rồi tìm trong danh sách
    const res = await api.get('/grad-students', {
      params: { graduation_id: graduationId, per_page: 9999 },
    });
    const rows: any[] = Array.isArray(res.data) ? res.data : (res.data?.data ?? []);
    return rows.some(
      (r) => (r.student?.code ?? r.studentCode ?? r.code ?? '').toString() === studentCode.trim(),
    );
  } catch {
    return false;
  }
}