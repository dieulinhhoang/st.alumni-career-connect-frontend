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
  // console.log('Fetched batches:', res.data);
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

export async function updateResponse(
  batchId: number,
  responseId: number,
  answers: Record<string, any>,
): Promise<AlumniResponse> {
  const res = await api.patch(`/alumni/batches/${batchId}/responses/${responseId}`, { answers });
  return res.data;
}

export interface ResponseFieldChange {
  questionId: string;
  questionTitle: string;
  before: any;
  after: any;
}

export interface ResponseHistoryEntry {
  id: number;
  responseId: number;
  batchId: number;
  action: 'submit' | 'create' | 'update';
  actorId: number | null;
  actorName: string | null;
  changes: ResponseFieldChange[] | null;
  createdAt: string;
}

export async function getResponseHistory(
  batchId: number,
  responseId: number,
): Promise<ResponseHistoryEntry[]> {
  const res = await api.get(`/alumni/batches/${batchId}/responses/${responseId}/history`);
  return res.data;
}

export async function createResponseByAdmin(
  batchId: number,
  payload: {
    studentId: string;
    studentName: string;
    studentEmail: string;
    studentPhone?: string;
    answers: Record<string, any>;
  },
): Promise<AlumniResponse> {
  const res = await api.post(`/alumni/batches/${batchId}/responses/admin`, payload);
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
    schoolYear: g.school_year ? Number(g.school_year) : (g.schoolYear ? Number(g.schoolYear) : 0),
    studentCount: g.student_count ?? g.studentCount ?? 0,
  }));
}

export interface FacultyBreakdownItem {
  facultyId: number | null;
  facultyName: string;
  studentCount: number;
}

export interface FacultyBreakdown {
  graduationId: number;
  totalStudents: number;
  faculties: FacultyBreakdownItem[];
}

export async function getFacultyBreakdown(graduationId: number): Promise<FacultyBreakdown> {
  const res = await api.get(`/graduation/${graduationId}/faculty-breakdown`);
  return res.data;
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
  citizen_identification_issue_date: string | null
  citizen_identification_issue_place: string | null
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
      citizen_identification_issue_date: s.citizen_identification_issue_date ?? s.citizenIdentificationIssueDate ?? null,
      citizen_identification_issue_place: s.citizen_identification_issue_place ?? s.citizenIdentificationIssuePlace ?? null,
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

export async function sendInviteEmails(
  batchId: number,
  payload: { subject: string; htmlBody: string },
): Promise<{ sent: number; failed: number; skipped: number }> {
  const res = await api.post(`/alumni/batches/${batchId}/send-email`, payload);
  return res.data;
}

export async function verifyStudentByFields(
  graduationId: number,
  fields: { fullName?: string; dob?: string; phone?: string; studentCode?: string },
): Promise<StudentData | null> {
    // console.log('verifyStudentByFields called:', { graduationId, ...fields }) // thêm dòng này

  try {
    const res = await api.post('/graduation/verify-student', { graduationId: Number(graduationId), ...fields });
    const s = res.data;
    // console.log('verifyStudentByFields response:', res.data);
    if (!s) return null;
    return {
      id: s.id,
      code: s.code,
      full_name: s.fullName ?? s.full_name ?? '',
      email: s.email ?? null,
      phone: s.phone ?? null,
      dob: s.dob ?? null,
      gender: s.gender ?? null,
      citizen_identification: s.citizenIdentification ?? s.citizen_identification ?? null,
      citizen_identification_issue_date: s.citizenIdentificationIssueDate ?? s.citizen_identification_issue_date ?? null,
      citizen_identification_issue_place: s.citizenIdentificationIssuePlace ?? s.citizen_identification_issue_place ?? null,
      training_industry_code: s.trainingIndustryCode ?? s.training_industry_code ?? null,
      training_industry_name: s.trainingIndustryName ?? s.training_industry_name ?? null,
      school_year_end: s.schoolYearEnd ?? s.school_year_end ?? null,
    };
    
  } catch {
    return null;
  }
}