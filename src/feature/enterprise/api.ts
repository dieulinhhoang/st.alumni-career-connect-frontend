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

function normalizeEntity<T>(raw: unknown): T {
  if (raw && typeof raw === "object") {
    const obj = raw as Record<string, unknown>;
    if (obj.data && typeof obj.data === "object") return obj.data as T;
  }

  return raw as T;
}

// Enterprise API
export async function fetchEnterprises(): Promise<Enterprise[]> {
  const res = await api.get("/enterprises");
  return normalizeList<Enterprise>(res.data);
}

export async function fetchEnterpriseById(id: string): Promise<Enterprise | null> {
  const res = await api.get(`/enterprises/${id}`);
  if (!res.data) return null;
  return normalizeEntity<Enterprise>(res.data);
}

export async function createEnterprise(payload: EnterpriseFormValues): Promise<Enterprise> {
  const res = await api.post("/enterprises", payload);
  return normalizeEntity<Enterprise>(res.data);
}

export async function updateEnterprise(
  id: string,
  payload: Partial<Enterprise>,
): Promise<Enterprise> {
  const res = await api.put(`/enterprises/${id}`, payload);
  return normalizeEntity<Enterprise>(res.data);
}

export async function verifyEnterprise(id: string): Promise<Enterprise> {
  const res = await api.post(`/enterprises/${id}/verify`);
  return normalizeEntity<Enterprise>(res.data);
}

export async function setPartnerStatus(
  id: string,
  status: "active" | "inactive",
): Promise<Enterprise> {
  const res = await api.patch(`/enterprises/${id}/partner-status`, { status });
  return normalizeEntity<Enterprise>(res.data);
}

// Job API — FIX: dùng enterpriseId (camelCase) để khớp với BE query param
export async function fetchJobsByEnterprise(enterpriseId: string): Promise<Job[]> {
  const res = await api.get("/jobs", { params: { enterpriseId } });
  return normalizeList<Job>(res.data);
}

export async function createJob(
  enterpriseId: string,
  payload: JobFormValues,
): Promise<Job> {
  const res = await api.post("/jobs", { ...payload, enterpriseId });
  return normalizeEntity<Job>(res.data);
}

// FIX: đổi PUT → PATCH để khớp với @Patch(':id') của BE
export async function updateJob(
  enterpriseId: string,
  jobId: string,
  payload: Partial<Job>,
): Promise<Job> {
  const res = await api.patch(`/jobs/${jobId}`, { ...payload, enterpriseId });
  return normalizeEntity<Job>(res.data);
}

export async function deleteJob(enterpriseId: string, jobId: string): Promise<void> {
  await api.delete(`/jobs/${jobId}`, { data: { enterpriseId } });
}

// Faculty API — FIX: dùng GET /faculty?page=0&size=999 và lấy items, bỏ /faculty/list
export async function fetchFaculties(): Promise<Faculty[]> {
  const res = await api.get("/faculty", { params: { page: 0, size: 999 } });
  return res.data?.items ?? [];
}
