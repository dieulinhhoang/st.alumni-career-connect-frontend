import type {
	Form,
	Question,
	QuestionOption,
	CreateFormPayload,
	UpdateFormPayload,
	GetFormsParams,
	PaginatedResponse,
	AIFormResult,
	QuestionTypeOption,
	QuestionType,
	Theme,
	FontOption,
	RadiusOption,
} from "./types";
import {api} from "../../libs/api";

// AI Question Bank interface (kept for TypeScript definitions)
export interface BankQuestion {
	id: string;
	category: string;
	title: string;
	type: QuestionType;
	options?: Array<{ id: string; label: string }>;
}

/**
 * Fetch all forms with optional filtering and pagination.
 * @param params - Query parameters for filtering forms
 */
export async function getForms(
	params?: GetFormsParams
): Promise<PaginatedResponse<Form>> {
	const res = await api.get("/forms", { params });
	return res.data;
}

/**
 * Fetch a single form by ID.
 * @param id - Form ID
 */
export async function getFormById(id: number): Promise<Form> {
	const res = await api.get(`/forms/${id}`);
	return res.data;
}

/**
 * Create a new form.
 * @param payload - Form creation data
 */
export async function createForm(payload: CreateFormPayload): Promise<Form> {
	const res = await api.post("/forms", payload);
	return res.data;
}

/**
 * Update an existing form.
 * @param id - Form ID
 * @param payload - Form update data
 */
export async function updateForm(
	id: number,
	payload: UpdateFormPayload
): Promise<Form> {
	const res = await api.put(`/forms/${id}`, payload);
	return res.data;
}

/**
 * Delete a form.
 * @param id - Form ID
 */
export async function deleteForm(id: number): Promise<void> {
	await api.delete(`/forms/${id}`);
}

/**
 * Duplicate an existing form.
 * @param id - Form ID to duplicate
 */
export async function duplicateForm(id: number): Promise<Form> {
	const res = await api.post(`/forms/${id}/duplicate`);
	return res.data;
}

/**
 * Generate a form using AI based on a prompt.
 * @param prompt - AI generation prompt
 */
export async function generateFormWithAI(prompt: string): Promise<AIFormResult> {
	const res = await api.post("/forms/generate-ai", { prompt });
	return res.data;
}

/**
 * Fetch all forms (alias for getForms without params).
 */
export async function fetchAllForms(): Promise<Form[]> {
	const res = await api.get("/forms");
	return res.data?.items ?? res.data ?? [];
}

/**
 * Fetch all question type options.
 */
export async function getQuestionTypeOptions(): Promise<QuestionTypeOption[]> {
	const res = await api.get("/question-type-options");
	return res.data ?? [];
}

/**
 * Fetch available themes for forms.
 */
export async function getThemes(): Promise<Theme[]> {
	const res = await api.get("/themes");
	return res.data ?? [];
}

/**
 * Fetch available font options.
 */
export async function getFonts(): Promise<FontOption[]> {
	const res = await api.get("/fonts");
	return res.data ?? [];
}

/**
 * Fetch available radius options.
 */
export async function getRadiusOptions(): Promise<RadiusOption[]> {
	const res = await api.get("/radius-options");
	return res.data ?? [];
}
