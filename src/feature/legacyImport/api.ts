import api from '../../libs/api';
import type { ConfirmImportPayload, ConfirmImportResult, PreviewImportResult } from './types';

export async function previewLegacyImport(file: File, formId: number): Promise<PreviewImportResult> {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('formId', String(formId));
  const res = await api.post('/alumni/legacy-import/preview', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return res.data;
}

export async function confirmLegacyImport(payload: ConfirmImportPayload): Promise<ConfirmImportResult> {
  const res = await api.post('/alumni/legacy-import/confirm', payload);
  return res.data;
}

export interface MajorOption {
  id: number;
  code: string;
  name: string;
  facultyId: number | null;
}

export async function fetchMajors(): Promise<MajorOption[]> {
  const res = await api.get('/majors', { params: { size: 999 } });
  const items: any[] = res.data?.items ?? (Array.isArray(res.data) ? res.data : []);
  return items.map((m) => ({ id: m.id, code: m.code, name: m.name, facultyId: m.facultyId ?? null }));
}

export interface FacultyOption {
  id: number;
  name: string;
}

export async function fetchFaculties(): Promise<FacultyOption[]> {
  const res = await api.get('/faculty', { params: { size: 999 } });
  const items: any[] = res.data?.items ?? (Array.isArray(res.data) ? res.data : []);
  return items.map((f) => ({ id: f.id, name: f.name }));
}
