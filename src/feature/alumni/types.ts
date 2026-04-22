import { Form } from '../form/types';

export type BatchStatus = 'draft' | 'active' | 'ended';

export interface AlumniResponse {
  id: number;
  batchId: number;
  studentId: string;
  studentName: string;
  studentEmail: string;
  studentPhone?: string;
  answers: Record<string, any>;
  submittedAt: string;
  status: 'draft' | 'submitted';
}

export interface SurveyBatch {
  id: number;
  title: string;
  description: string;
  formId: number;           // original published form id
  formSnapshot: Form;       // cloned form at batch creation
  status: BatchStatus;
  startDate: string;
  endDate: string;
  year: number;
  graduationPeriod: string;
  totalStudents: number;
  responses: AlumniResponse[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateBatchPayload {
  title: string;
  description?: string;
  formId: number;
  formSnapshot: Form;
  startDate: string;
  endDate: string;
  year: number;
  graduationPeriod: string;
  totalStudents?: number;
}

export interface UpdateBatchPayload {
  title?: string;
  description?: string;
  status?: BatchStatus;
  startDate?: string;
  endDate?: string;
  formSnapshot?: Form;
  totalStudents?: number;
}

export interface BatchStats {
  total: number;
  submitted: number;
  rate: number;
  employmentRate?: number;
  suitableRate?: number;
}