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

/** Thông tin đầy đủ của sinh viên từ backend */
export interface StudentData {
  id: number
  code: string
  full_name: string
  email: string | null
  phone: string | null
  dob: string | null
  gender: 'male' | 'female' | 'other' | null
  citizen_identification: string | null
  training_industry_code: string | null
  training_industry_name: string | null
  school_year_end: string | null
}

/**
 * Kiểm tra mã SV trong đợt tốt nghiệp và trả về data đầy đủ nếu tìm thấy.
 * Trả về null nếu không tìm thấy hoặc lỗi mạng.
 */
export async function getStudentFromGraduation(
  graduationId: number,
  studentCode: string,
): Promise<StudentData | null> {
  try {
    const res = await api.get('/grad-students', {
      params: { graduation_id: graduationId, per_page: 9999 },
    });
    const rows: any[] = Array.isArray(res.data) ? res.data : (res.data?.data ?? []);
    const found = rows.find(
      (r) => (r.student?.code ?? r.studentCode ?? r.code ?? '').toString() === studentCode.trim(),
    );
    if (!found) return null;
    // Backend có thể wrap trong .student hoặc trả thẳng
    const s = found.student ?? found;
    return {
      id:                     s.id,
      code:                   s.code ?? studentCode,
      full_name:              s.full_name ?? s.fullName ?? '',
      email:                  s.email ?? null,
      phone:                  s.phone ?? null,
      dob:                    s.dob ?? null,
      gender:                 s.gender ?? null,
      citizen_identification: s.citizen_identification ?? s.citizenIdentification ?? null,
      training_industry_code: s.training_industry_code ?? s.trainingIndustryCode ?? null,
      training_industry_name: s.training_industry_name ?? s.trainingIndustryName ?? null,
      school_year_end:        s.school_year_end ?? s.schoolYearEnd ?? null,
    };
  } catch {
    return null;
  }
}

/** Validate xem một mã SV có thuộc đợt tốt nghiệp (graduationId) không */
export async function checkStudentInGraduation(
  graduationId: number,
  studentCode: string,
): Promise<boolean> {
  const student = await getStudentFromGraduation(graduationId, studentCode);
  return student !== null;
}