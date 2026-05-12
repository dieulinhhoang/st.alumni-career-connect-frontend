import { api } from '../../../libs/api';
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
} from './types';

export interface FileInput {
  name: string;
  content: string;
}

export interface BankQuestion {
  id: number;
  title: string;
  type: QuestionType;
  options?: string[];
}

// ============ Form CRUD ============
export const getForms = async (params: GetFormsParams = {}): Promise<PaginatedResponse<Form>> => {
  const { data } = await api.get('/api/v1/forms', { params });
  return data;
};

export const getFormById = async (id: number): Promise<Form> => {
  const { data } = await api.get(`/api/v1/forms/${id}`);
  return data;
};

export const createForm = async (payload: CreateFormPayload): Promise<Form> => {
  const { data } = await api.post('/api/v1/forms', payload);
  return data;
};

export const updateForm = async (id: number, updates: UpdateFormPayload): Promise<Form> => {
  const { data } = await api.put(`/api/v1/forms/${id}`, updates);
  return data;
};

export const deleteForm = async (id: number): Promise<void> => {
  await api.delete(`/api/v1/forms/${id}`);
};

export const duplicateForm = async (id: number): Promise<Form> => {
  const { data } = await api.post(`/api/v1/forms/${id}/duplicate`);
  return data;
};

// ============ AI Form Generation (keeps external Gemini call) ============
const _buildAIPrompt = (prompt: string, file?: FileInput): string => {
  let sysPrompt = 'You are an expert survey builder. Return a JSON object with: name, status, description, questions.';
  let userPrompt = prompt;
  if (file) {
    sysPrompt += ' The user will provide a document. Extract the most important information and build a survey form from it.';
    userPrompt += `\n\nDocument content:\n${file.content}`;
  }
  return `System: ${sysPrompt}\n\nUser: ${userPrompt}`;
};

const _parseAIResponse = (text: string): AIFormResult => {
  try {
    const block = text.match(/```(?:json)?\s*([\s\S]*?)```/i);
    if (block) text = block[1];
    const json = JSON.parse(text);
    return { form: json as unknown as Form, prompt: '' };
  } catch {
    return { form: null, prompt: text };
  }
};

export const generateFormWithAI = async (
  prompt: string,
  file?: FileInput,
): Promise<AIFormResult> => {
  const fullPrompt = _buildAIPrompt(prompt, file);
  const reqBody = {
    contents: [{ role: 'user', parts: [{ text: fullPrompt }] }],
  };
  const res = await fetch(
    'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent',
    { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(reqBody) },
  );
  const json = await res.json();
  const text = json?.candidates?.[0]?.content?.parts?.[0]?.text ?? '';
  return _parseAIResponse(text);
};

// ============ FORM CONSTANTS ============
export const Q_TYPES: QuestionTypeOption[] = [
  { id: 'short', name: 'Tra loi ngan' },
  { id: 'paragraph', name: 'Doan van' },
  { id: 'radio', name: 'Mot lua chon' },
  { id: 'checkbox', name: 'Nhieu lua chon' },
  { id: 'dropdown', name: 'Menu chon' },
  { id: 'date', name: 'Ngay' },
  { id: 'time', name: 'Gio' },
  { id: 'rating', name: 'Danh gia' },
  { id: 'scale', name: 'Thang do' },
];

export const THEMES: Theme[] = [
  { id: 'blue', name: 'Xanh duong', primary: '#1976d2', secondary: '#bbdefb' },
  { id: 'green', name: 'Xanh la', primary: '#2e7d32', secondary: '#c8e6c9' },
  { id: 'purple', name: 'Tim', primary: '#7b1fa2', secondary: '#e1bee7' },
  { id: 'orange', name: 'Cam', primary: '#f57c00', secondary: '#ffe0b2' },
  { id: 'red', name: 'Do', primary: '#c62828', secondary: '#ffcdd2' },
  { id: 'slate', name: 'Xam', primary: '#455a64', secondary: '#cfd8dc' },
];

export const ACCENT_COLORS = [
  '#1976d2', '#2e7d32', '#f57c00', '#c62828', '#7b1fa2', '#455a64',
];

export const FONTS: FontOption[] = [
  { id: 'roboto', name: 'Roboto' },
  { id: 'open-sans', name: 'Open Sans' },
  { id: 'lato', name: 'Lato' },
  { id: 'poppins', name: 'Poppins' },
  { id: 'montserrat', name: 'Montserrat' },
];

export const RADIUS_OPTIONS: RadiusOption[] = [
  { id: 'none', name: 'Goc canh', value: 0 },
  { id: 'small', name: 'Nho', value: 4 },
  { id: 'medium', name: 'Vua', value: 8 },
  { id: 'large', name: 'Lon', value: 12 },
];

export const SUGGESTIONS = [
  'Khao sat viec lam sau tot nghiep',
  'Danh gia chuong trinh dao tao',
  'Phan hoi ve hoc phan',
  'Khao sat doanh nghiep doi tac',
  'Danh gia giang vien',
  'Khuon yeu cau thuc tap',
  'Khao sat sau su kien',
];

export const QUESTION_BANK: BankQuestion[] = [
  { id: 1, title: 'Ho va ten', type: 'short', options: [] },
  { id: 2, title: 'Ngay sinh', type: 'date', options: [] },
  { id: 3, title: 'Gioi tinh', type: 'radio', options: ['Nam', 'Nu', 'Khac'] },
  { id: 4, title: 'Email', type: 'short', options: [] },
  { id: 5, title: 'So dien thoai', type: 'short', options: [] },
  { id: 6, title: 'Lop', type: 'dropdown', options: ['MHTA', 'KHTB', 'CNTT2020'] },
  { id: 7, title: 'Nganh hoc', type: 'radio', options: ['MMT&TTDL', 'KHDL&TTNT'] },
  { id: 8, title: 'Nam hoc', type: 'dropdown', options: ['Nam 1', 'Nam 2', 'Nam 3', 'Nam 4'] },
  { id: 9, title: 'Tinh trang viec lam', type: 'radio', options: ['Da co viec lam', 'Tiep tuc hoc', 'Chua co viec lam'] },
  { id: 10, title: 'Muc do hai long', type: 'rating', options: [] },
  { id: 11, title: 'Y kien dong gop', type: 'paragraph', options: [] },
];
