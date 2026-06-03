import api from '../../../libs/api';

export interface SubmitIdentity {
  studentId: string;
  studentName: string;
  studentEmail: string;
  studentPhone?: string;
}

/**
 * Gửi câu trả lời khảo sát – dùng chung instance api
 * (backend không có global guard cho route này)
 */
export async function submitResponse(
  batchId: number,
  identity: SubmitIdentity,
  answers: Record<string, any>,
): Promise<void> {
  await api.post(`/alumni/batches/${batchId}/responses`, {
    studentId: identity.studentId,
    studentName: identity.studentName,
    studentEmail: identity.studentEmail,
    studentPhone: identity.studentPhone ?? undefined,
    answers,
  });
}