import type { SurveyBatch, CreateBatchPayload, UpdateBatchPayload, BatchStats } from './types';
import { MOCK_FORMS } from '../form/constants';

let batchesStore: SurveyBatch[] = [
  {
    id: 1,
    title: 'Khảo sát tình hình việc làm của sinh viên tốt nghiệp năm 2025',
    description: 'Khảo sát việc làm cho sinh viên tốt nghiệp năm 2025',
    formId: 1,
    formSnapshot: MOCK_FORMS[0],
    status: 'active',
    startDate: '2026-03-18T08:30:00',
    endDate: '2026-03-31T17:00:00',
    year: 2025,
    graduationPeriod: 'DSSVTN ngành MMT&TTDL và KHDL&TTNT KSVL cho kiến định 2026',
    totalStudents: 13,
    responses: [
      {
        id: 101, batchId: 1,
        studentId: '650968', studentName: 'Nguyễn Thị Thảo',
        studentEmail: 'nthaott2@gmail.com', studentPhone: '0886096932',
        khoa: 'cntt', nganh: 'mmt', lop: 'MMTA',
        answers: { q09: 'Đã có việc làm', q15: 'Phù hợp với trình độ chuyên môn' },
        submittedAt: '2026-03-28T08:26:00', status: 'submitted',
      },
      {
        id: 102, batchId: 1,
        studentId: '650101', studentName: 'Trần Văn Nam',
        studentEmail: 'namtv@vnu.edu.vn',
        khoa: 'cntt', nganh: 'khdl', lop: 'KHDLA',
        answers: { q09: 'Đã có việc làm', q15: 'Phù hợp với trình độ chuyên môn' },
        submittedAt: '2026-03-29T14:12:00', status: 'submitted',
      },
      {
        id: 103, batchId: 1,
        studentId: '650205', studentName: 'Lê Thị Hương',
        studentEmail: 'huonglt@vnu.edu.vn',
        khoa: 'cntt', nganh: 'cnpm', lop: 'CNPMA',
        answers: { q09: 'Đã có việc làm', q15: 'Đúng ngành đào tạo' },
        submittedAt: '2026-03-30T09:45:00', status: 'submitted',
      },
      {
        id: 104, batchId: 1,
        studentId: '650312', studentName: 'Phạm Minh Đức',
        studentEmail: 'ducpm@vnu.edu.vn',
        answers: {}, submittedAt: '', status: 'draft',
      },
    ],
    createdAt: '2026-03-01T10:00:00',
    updatedAt: '2026-03-18T08:30:00',
  },
];

const delay = (ms = 300) => new Promise<void>(resolve => setTimeout(resolve, ms));

export async function getBatches(): Promise<SurveyBatch[]> {
  await delay();
  return batchesStore.map(b => ({ ...b, responses: [...b.responses] }));
}

export async function getBatchById(id: number): Promise<SurveyBatch> {
  await delay();
  const batch = batchesStore.find(b => b.id === id);
  if (!batch) throw new Error(`Batch ${id} not found`);
  return { ...batch, responses: [...batch.responses] };
}

export async function createBatch(payload: CreateBatchPayload): Promise<SurveyBatch> {
  await delay();
  const now = new Date().toISOString();
  const newBatch: SurveyBatch = {
    id: Date.now(),
    description: '',
    ...payload,
    status: 'draft',
    responses: [],
    createdAt: now,
    updatedAt: now,
    totalStudents: payload.totalStudents ?? 0,
  };
  batchesStore.push(newBatch);
  return { ...newBatch };
}

export async function updateBatch(id: number, updates: UpdateBatchPayload): Promise<SurveyBatch> {
  await delay();
  const idx = batchesStore.findIndex(b => b.id === id);
  if (idx === -1) throw new Error(`Batch ${id} not found`);
  batchesStore[idx] = { ...batchesStore[idx], ...updates, updatedAt: new Date().toISOString() };
  return { ...batchesStore[idx] };
}

export async function deleteBatch(id: number): Promise<void> {
  await delay();
  batchesStore = batchesStore.filter(b => b.id !== id);
}

export async function getBatchStats(batchId: number): Promise<BatchStats> {
  const batch     = await getBatchById(batchId);
  const submitted = batch.responses.filter(r => r.status === 'submitted');
  const hasJob    = submitted.filter(r => r.answers?.q09 === 'Đã có việc làm').length;
  const suitable  = submitted.filter(r =>
    r.answers?.q15 === 'Phù hợp với trình độ chuyên môn' ||
    r.answers?.q15 === 'Đúng ngành đào tạo',
  ).length;
  const total = batch.totalStudents;
  return {
    total,
    submitted:      submitted.length,
    rate:           total ? parseFloat(((submitted.length / total) * 100).toFixed(1)) : 0,
    employmentRate: total ? (hasJob    / total) * 100 : 0,
    suitableRate:   total ? (suitable  / total) * 100 : 0,
  };
}