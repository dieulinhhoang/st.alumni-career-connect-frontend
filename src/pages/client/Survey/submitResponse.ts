import api from '../../../libs/api';

export interface SubmitIdentity {
  studentId: string;
  studentName: string;
  studentEmail: string;
  studentPhone?: string;
}

/**
 * Gửi câu trả lời khảo sát lên backend để lưu vào DB.
 * POST /alumni/batches/:batchId/responses
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
