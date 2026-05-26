import type {
	Enterprise, Job, EnterpriseFormValues, JobFormValues,
	FacultyKey,
} from "./type";
import { FACULTY_COLOR_MAP } from "./type";
import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
})

/**
 * Normalize raw BE response → typed array.
 * Accepts: raw array | { items } | { data } | { results }
 */
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
 * Normalize raw BE response → single entity.
 * Accepts: raw object | { data: object }
 */
function normalizeEntity<T>(raw: unknown): T {
	if (raw && typeof raw === "object") {
		const obj = raw as Record<string, unknown>;
		if (obj.data && typeof obj.data === "object") return obj.data as T;
	}
	return raw as T;
}

//  Enterprise API 

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
	payload: Partial<Enterprise>
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
	status: "active" | "inactive"
): Promise<Enterprise> {
	const res = await api.patch(`/enterprises/${id}/partner-status`, { status });
	return normalizeEntity<Enterprise>(res.data);
}

//  Job API 

export async function fetchJobsByEnterprise(enterpriseId: string): Promise<Job[]> {
	const res = await api.get("/jobs", { params: { enterprise_id: enterpriseId } });
	return normalizeList<Job>(res.data);
}

export async function createJob(
	enterpriseId: string,
	payload: JobFormValues
): Promise<Job> {
	const res = await api.post("/jobs", { ...payload, enterpriseId });
	return normalizeEntity<Job>(res.data);
}

export async function updateJob(
	enterpriseId: string,
	jobId: string,
	payload: Partial<Job>
): Promise<Job> {
	const res = await api.put(`/jobs/${jobId}`, payload);
	return normalizeEntity<Job>(res.data);
}

export async function deleteJob(enterpriseId: string, jobId: string): Promise<void> {
	await api.delete(`/jobs/${jobId}`);
}

//  Faculty Color 

/**
 * Trả về faculty color map từ constant local.
 * Endpoint /faculty-colors không tồn tại trong BE — dùng constant thay thế.
 */
export function getFacultyColors(): Record<FacultyKey, string> {
	return { ...FACULTY_COLOR_MAP };
}
