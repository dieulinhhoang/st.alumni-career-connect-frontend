import api from "../../libs/api";
import type {
  Enterprise,
  Job,
  EnterpriseFormValues,
  JobFormValues,
  Faculty,
} from "./type";

function normalizeList<T>(raw: unknown): T[] {
  if (Array.isArray(raw)) return raw as T[];

  if (raw && typeof raw === "object") {
    const obj = raw as Record<string, unknown>;
    if (Array.isArray(obj.items)) return obj.items as T[];
    if (Array.isArray(obj.data)) return obj.data as T[];
    if (Array.isArray(obj.results)) return obj.results as T[];
  }

  return [];
}

/**
 * BE findOne trả về { ...enterprise, faculties: [{id, name, color}] }
 * (map từ enterpriseFaculties relation trong service)
 * Hàm này đảm bảo FE luôn nhận được đúng shape.
 */
function normalizeEnterprise(raw: unknown): Enterprise {
  if (!raw || typeof raw !== "object") return raw as Enterprise;
  const obj = raw as Record<string, unknown>;
  // Unwrap lồng data
  const ent = (obj.data && typeof obj.data === "object" ? obj.data : obj) as Record<string, unknown>;

  // BE có thể trả enterpriseFaculties thành faculties ngay trong service,
  // hoặc có thể vẫn còn có enterpriseFaculties thô. Hàm này xử lý cả hai trường hợp.
  let faculties: Faculty[] = [];
  if (Array.isArray(ent.faculties)) {
    faculties = ent.faculties as Faculty[];
  } else if (Array.isArray(ent.enterpriseFaculties)) {
    // fallback: map từ relation entity
    faculties = (ent.enterpriseFaculties as any[]).map((ef) => ({
      id: String(ef.faculty?.id ?? ef.facultyId ?? ""),
      name: ef.faculty?.name ?? "",
      color: ef.faculty?.color ?? null,
      code: ef.faculty?.code,
    }));
  }

  return { ...ent, faculties } as unknown as Enterprise;
}

// Enterprise API
export async function fetchEnterprises(params?: { facultyId?: string; page?: number; size?: number }): Promise<Enterprise[]> {
  const res = await api.get("/enterprises", { params });
  return normalizeList<Enterprise>(res.data);
}

export async function fetchEnterpriseById(id: string): Promise<Enterprise | null> {
  const res = await api.get(`/enterprises/${id}`);
  if (!res.data) return null;
  return normalizeEnterprise(res.data);
}

export async function createEnterprise(payload: EnterpriseFormValues): Promise<Enterprise> {
  const res = await api.post("/enterprises", payload);
  return normalizeEnterprise(res.data);
}

// FIX: đổi PUT → PATCH để khớp với @Patch(':id') của BE
export async function updateEnterprise(
  id: string,
  payload: Partial<EnterpriseFormValues>,
): Promise<Enterprise> {
  const res = await api.patch(`/enterprises/${id}`, payload);
  return normalizeEnterprise(res.data);
}

export async function verifyEnterprise(id: string): Promise<Enterprise> {
  const res = await api.post(`/enterprises/${id}/verify`);
  return normalizeEnterprise(res.data);
}

export async function setPartnerStatus(
  id: string,
  status: "active" | "inactive",
): Promise<Enterprise> {
  const res = await api.patch(`/enterprises/${id}/partner-status`, { status });
  return normalizeEnterprise(res.data);
}

// ─── Đăng ký đối tác + duyệt hồ sơ ──────────────────────────────────────────

/** DN đối tác tự gửi hồ sơ đăng ký (API công khai) → vào hàng đợi chờ duyệt. */
export async function registerEnterprise(
  payload: Partial<EnterpriseFormValues> & { name: string; contactPerson?: string },
): Promise<{ id: string; status: string; message: string }> {
  const res = await api.post("/enterprises/register", payload);
  return res.data?.data ?? res.data;
}

/** Danh sách hồ sơ đối tác đang chờ duyệt. */
export async function fetchPendingEnterprises(params?: {
  page?: number;
  size?: number;
}): Promise<Enterprise[]> {
  const res = await api.get("/enterprises/pending", { params });
  return normalizeList<Enterprise>(res.data);
}

/** Duyệt hồ sơ đối tác. */
export async function approveEnterprise(id: string): Promise<Enterprise> {
  const res = await api.post(`/enterprises/${id}/approve`);
  return normalizeEnterprise(res.data);
}

/** Từ chối hồ sơ đối tác kèm lý do. */
export async function rejectEnterprise(id: string, reason?: string): Promise<Enterprise> {
  const res = await api.post(`/enterprises/${id}/reject`, { reason });
  return normalizeEnterprise(res.data);
}

// Job API — dùng enterpriseId (camelCase) để khớp với BE query param
export async function fetchJobsByEnterprise(enterpriseId: string): Promise<Job[]> {
  const res = await api.get("/jobs", { params: { enterpriseId } });
  return normalizeList<Job>(res.data);
}

export async function createJob(
  enterpriseId: string,
  payload: JobFormValues,
): Promise<Job> {
  const res = await api.post("/jobs", { ...payload, enterpriseId });
  const raw = res.data;
  if (raw?.data) return raw.data as Job;
  return raw as Job;
}

// FIX: dùng PATCH để khớp với @Patch(':id') của BE
export async function updateJob(
  enterpriseId: string,
  jobId: string,
  payload: Partial<Job>,
): Promise<Job> {
  const res = await api.patch(`/jobs/${jobId}`, { ...payload, enterpriseId });
  const raw = res.data;
  if (raw?.data) return raw.data as Job;
  return raw as Job;
}

export async function deleteJob(enterpriseId: string, jobId: string): Promise<void> {
  await api.delete(`/jobs/${jobId}`, { data: { enterpriseId } });
}

export async function approveJob(jobId: string): Promise<Job> {
  const res = await api.post(`/jobs/${jobId}/approve`);
  return res.data?.data ?? res.data;
}

export async function rejectJob(jobId: string, reason?: string): Promise<Job> {
  const res = await api.post(`/jobs/${jobId}/reject`, { reason });
  return res.data?.data ?? res.data;
}

export type UnemployedAlumnus = {
  studentCode: string;
  fullName: string;
  email: string;
  majorName?: string;
  facultyName?: string;
};

export type UnemployedAlumniPreview = {
  batchTitle: string;
  alumni: UnemployedAlumnus[];
};

export type NotifyUnemployedAlumniResult = {
  batchTitle: string;
  total: number;
  sentCount: number;
  failedCount: number;
};

/** Xem trước danh sách cựu SV "chưa có việc làm" theo đợt khảo sát (trước khi gửi email). */
export async function fetchUnemployedAlumniPreview(
  jobId: string,
  surveyId?: string,
): Promise<UnemployedAlumniPreview> {
  const res = await api.get(`/jobs/${jobId}/unemployed-alumni`, {
    params: surveyId ? { surveyId } : undefined,
  });
  return res.data;
}

/** Gửi email thông báo tin tuyển dụng cho các cựu SV đã chọn (chưa có việc làm theo khảo sát). */
export async function notifyUnemployedAlumni(
  jobId: string,
  surveyId?: string,
  emails?: string[],
): Promise<NotifyUnemployedAlumniResult> {
  const res = await api.post(`/jobs/${jobId}/notify-unemployed-alumni`, { surveyId, emails });
  return res.data;
}

export type EmailPreview = { subject: string; html: string };

/** Xem trước nội dung email (subject + HTML) sẽ được gửi cho tin tuyển dụng này. */
export async function fetchNotifyEmailPreview(jobId: string): Promise<EmailPreview> {
  const res = await api.get(`/jobs/${jobId}/notify-email-preview`);
  return res.data;
}

// Faculty API
export async function fetchFaculties(): Promise<Faculty[]> {
  const res = await api.get("/faculty", { params: { page: 0, size: 999 } });
  return res.data?.items ?? [];
}
