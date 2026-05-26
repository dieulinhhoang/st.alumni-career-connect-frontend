import type {
	Enterprise, Job, EnterpriseFormValues, JobFormValues,
	FacultyKey,
} from "./type";
import { FACULTY_COLOR_MAP } from "./type";
import {api} from "../../libs/api";

// Enterprise API

/**
 * Fetch list of all enterprises.
 */
export async function fetchEnterprises(): Promise<Enterprise[]> {
	const res = await api.get("/enterprises");
	return res.data ?? [];
}

/**
 * Fetch a single enterprise by ID.
 * @param id - Enterprise ID
 */
export async function fetchEnterpriseById(id: string): Promise<Enterprise | null> {
	const res = await api.get(`/enterprises/${id}`);
	return res.data ?? null;
}

/**
 * Create a new enterprise.
 * @param payload - Enterprise form values
 */
export async function createEnterprise(payload: EnterpriseFormValues): Promise<Enterprise> {
	const res = await api.post("/enterprises", payload);
	return res.data;
}

/**
 * Update an existing enterprise.
 * @param id - Enterprise ID
 * @param payload - Partial enterprise fields to update
 */
export async function updateEnterprise(
	id: string,
	payload: Partial<Enterprise>
): Promise<Enterprise> {
	const res = await api.put(`/enterprises/${id}`, payload);
	return res.data;
}

/**
 * Verify an enterprise profile.
 * @param id - Enterprise ID
 */
export async function verifyEnterprise(id: string): Promise<Enterprise> {
	const res = await api.post(`/enterprises/${id}/verify`);
	return res.data;
}

/**
 * Set the partner status for an enterprise.
 * @param id - Enterprise ID
 * @param status - active | inactive
 */
export async function setPartnerStatus(
	id: string,
	status: "active" | "inactive"
): Promise<Enterprise> {
	const res = await api.patch(`/enterprises/${id}/partner-status`, { status });
	return res.data;
}

// Job API

/**
 * Fetch jobs for a specific enterprise.
 * @param enterpriseId - Enterprise ID
 */
export async function fetchJobsByEnterprise(enterpriseId: string): Promise<Job[]> {
	const res = await api.get("/jobs", { params: { enterprise_id: enterpriseId } });
	return res.data ?? [];
}

/**
 * Create a new job for an enterprise.
 * @param enterpriseId - Enterprise ID
 * @param payload - Job form values
 */
export async function createJob(
	enterpriseId: string,
	payload: JobFormValues
): Promise<Job> {
	const res = await api.post("/jobs", { ...payload, enterpriseId });
	return res.data;
}

/**
 * Update a job.
 * @param enterpriseId - Enterprise ID
 * @param jobId - Job ID
 * @param payload - Partial job fields to update
 */
export async function updateJob(
	enterpriseId: string,
	jobId: string,
	payload: Partial<Job>
): Promise<Job> {
	const res = await api.put(`/jobs/${jobId}`, payload);
	return res.data;
}

/**
 * Delete a job.
 * @param enterpriseId - Enterprise ID
 * @param jobId - Job ID
 */
export async function deleteJob(enterpriseId: string, jobId: string): Promise<void> {
	await api.delete(`/jobs/${jobId}`);
}

// Faculty API

/**
 * Fetch faculty color mapping.
 */
export async function fetchFacultyColors(): Promise<Record<FacultyKey, string>> {
	const res = await api.get("/faculty-colors");
	return res.data ?? { ...FACULTY_COLOR_MAP };
}
