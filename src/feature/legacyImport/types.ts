/** 1 dòng = 1 sinh viên trong file Excel "Báo cáo tổng hợp" (format mới, 1 sheet) */
export interface FlatRow {
  rowIndex: number;
  code: string;
  fullName: string;
  isFemale: boolean;
  cccd: string;
  majorCode: string;
  majorName: string;
  phone: string;
  email: string;
  answers: Record<string, any>;
}

export interface MajorGroup {
  oldCode: string;
  industryName: string;
  total: number;
  totalNu: number;
  responded: number;
  matchedMajorId: number | null;
  suggestedCode: string | null;
  suggestedName: string;
}

export interface PreviewStatRow {
  oldCode: string;
  industryName: string;
  total: number;
  totalNu: number;
  submitted: number;
  submittedNu: number;
  dungNganh: number;
  lienQuan: number;
  khongLienQuan: number;
  tiepTucHoc: number;
  chuaCoVl: number;
  kvNhaNuoc: number;
  kvTuNhan: number;
  kvTuTao: number;
  kvYNuocNgoai: number;
}

export interface PreviewImportResult {
  formId: number;
  roster: FlatRow[];
  responses: FlatRow[];
  majorGroups: MajorGroup[];
  previewStats: PreviewStatRow[];
}

export interface NewMajorInput {
  code: string;
  name: string;
  facultyId?: number;
}

export interface MajorGroupDecision {
  oldCode: string;
  industryName: string;
  matchedMajorId?: number;
  newMajor?: NewMajorInput;
}

export interface ConfirmImportPayload {
  formId: number;
  batch: {
    title: string;
    year: number;
    startDate: string;
    endDate: string;
    // Chọn đợt tốt nghiệp có sẵn (graduationId) HOẶC nhập tên đợt mới (graduationName).
    graduationId?: number;
    graduationName?: string;
  };
  majorGroups: MajorGroupDecision[];
  roster: FlatRow[];
  responses: FlatRow[];
}

export interface ConfirmImportResult {
  batchId: number;
}
