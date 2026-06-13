export interface RosterRow {
  tt: number | null;
  code: string;
  fullName: string;
  isFemale: boolean;
  cccd: string;
  majorCode: string;
  decisionNo: string;
  decisionDate: string;
  phone: string;
  email: string;
  hasResponse: boolean;
  note: string;
}

export interface ResponseRow {
  tt: number | null;
  code: string;
  fullName: string;
  dob: any;
  gender: string;
  cccd: string;
  majorCode: string;
  phone: string;
  email: string;
  city: string;
  salary: any;
  marked: number[];
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
  roster: RosterRow[];
  responses: ResponseRow[];
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
    graduationName: string;
  };
  majorGroups: MajorGroupDecision[];
  roster: RosterRow[];
  responses: ResponseRow[];
}

export interface ConfirmImportResult {
  batchId: number;
}
