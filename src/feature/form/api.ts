import axios from "axios";
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
 const api = axios.create({
   baseURL: import.meta.env.VITE_API_URL,
 })
// ====== Question Bank ======
export interface BankQuestion {
	id: string;
	category: string;
	title: string;
	type: QuestionType;
	options?: Array<{ id: string; label: string }>;
}

// export const QUESTION_BANK: BankQuestion[] = [
// 	{ id: 'bq1', category: 'Việc làm', title: 'Tình trạng việc làm hiện tại', type: 'single_choice' },
// 	{ id: 'bq2', category: 'Việc làm', title: 'Mức thu nhập bình quân hàng tháng', type: 'single_choice' },
// 	{ id: 'bq3', category: 'Đào tạo', title: 'Công việc có phù hợp với ngành đào tạo không?', type: 'single_choice' },
// 	{ id: 'bq4', category: 'Kỹ năng', title: 'Kỹ năng mềm cần bổ sung thêm', type: 'multiple_choice' },
// 	{ id: 'bq5', category: 'Việc làm', title: 'Khu vực làm việc hiện tại', type: 'single_choice' },
// 	{ id: 'bq6', category: 'Đào tạo', title: 'Mức độ hài lòng với chương trình đào tạo', type: 'single_choice' },
// 	{ id: 'bq7', category: 'Kỹ năng', title: 'Kỹ năng chuyên môn được đào tạo có đáp ứng yêu cầu công việc?', type: 'single_choice' },
// 	{ id: 'bq8', category: 'Việc làm', title: 'Thời gian tìm được việc làm sau tốt nghiệp', type: 'single_choice' },
// ];

/**
 * Fetch all forms with optional filtering and pagination.
 */
export async function getForms(
	params?: GetFormsParams
): Promise<PaginatedResponse<Form>> {
	const res = await api.get("/forms", { params });
	return res.data;
}

/**
 * Fetch a single form by ID.
 */
export async function getFormById(id: number): Promise<Form> {
	const res = await api.get(`/forms/${id}`);
	return res.data;
}

/**
 * Create a new form.
 */
export async function createForm(payload: CreateFormPayload): Promise<Form> {
	const res = await api.post("/forms", payload);
	return res.data;
}

/**
 * Update an existing form.
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
 */
export async function deleteForm(id: number): Promise<void> {
	await api.delete(`/forms/${id}`);
}

/**
 * Duplicate an existing form.
 */
export async function duplicateForm(id: number): Promise<Form> {
	const res = await api.post(`/forms/${id}/duplicate`);
	return res.data;
}

/**
 * Generate a form using AI based on a prompt.
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
	return Array.isArray(res.data) ? res.data : (res.data?.items ?? []);
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
