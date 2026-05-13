import { api } from '../../libs/api';
import type {
  Form,
  Question,
  QuestionOption,
  CreateFormPayload,
  UpdateFormPayload,
  GetFormsParams,
  PaginatedResponse,
  AIFormResult,
} from './types';

export interface FileInput {
  name: string;
  content: string;
}

// ============ Form CRUD ============
export const getForms = async (
  params: GetFormsParams = {},
): Promise<PaginatedResponse<Form>> => {
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

export const updateForm = async (
  id: number,
  updates: UpdateFormPayload,
): Promise<Form> => {
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

// ============ AI Form Generation ============
const _buildAIPrompt = (prompt: string, file?: FileInput): string => {
  let sysPrompt =
    'You are an expert survey builder. Return a JSON object with: name, status, description, questions.';
  let userPrompt = prompt;
  if (file) {
    sysPrompt +=
      ' The user will provide a document. Extract the most important information and build a survey form from it.';
    userPrompt += `\n\nDocument content:\n${file.content}`;
  }
  return `System: ${sysPrompt}\n\nUser: ${userPrompt}`;
};

const _parseAIResponse = (text: string): AIFormResult => {
  try {
    const block = text.match(/```(?:json)?\s*([\s\S]*?)```/i);
    if (block) text = block[1];
    const json = JSON.parse(text);
    return json as AIFormResult;
  } catch {
    return { name: '', description: '', questions: [] };
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
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(reqBody),
    },
  );
  const json = await res.json();
  const text = json?.candidates?.[0]?.content?.parts?.[0]?.text ?? '';
  return _parseAIResponse(text);
};
