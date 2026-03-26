import type { DotEntry, KhoaItem, EnterpriseItem, ChartMode, ChartModeConfig } from "./type";

// ─── Khoa list ──────────────────────────────────────────────────────────────

export const KHOA_LIST: KhoaItem[] = [
  { ten: "Khoa CNTT",            viet_tat: "CNTT", mau: "#6366f1", ngayNop: "15/03/2024", daNop: true,  soSV: 298, tongSV: 320 },
  { ten: "Khoa Kinh tế",         viet_tat: "KT",   mau: "#0ea5e9", ngayNop: "18/03/2024", daNop: true,  soSV: 386, tongSV: 410 },
  { ten: "Khoa Nông nghiệp",     viet_tat: "NN",   mau: "#10b981", ngayNop: null,         daNop: false, soSV: 0,   tongSV: 520 },
  { ten: "Khoa Môi trường",      viet_tat: "MT",   mau: "#06b6d4", ngayNop: null,         daNop: false, soSV: 0,   tongSV: 280 },
  { ten: "Khoa Thú y",           viet_tat: "TY",   mau: "#ec4899", ngayNop: "20/03/2024", daNop: true,  soSV: 185, tongSV: 190 },
  { ten: "Khoa CN Thực phẩm",    viet_tat: "TP",   mau: "#f97316", ngayNop: null,         daNop: false, soSV: 0,   tongSV: 240 },
  { ten: "Khoa Cơ điện",         viet_tat: "CĐ",   mau: "#8b5cf6", ngayNop: "22/03/2024", daNop: true,  soSV: 210, tongSV: 230 },
  { ten: "Khoa Quản lý đất đai", viet_tat: "QĐ",   mau: "#f59e0b", ngayNop: null,         daNop: false, soSV: 0,   tongSV: 180 },
];

// ─── Enterprise list ────────────────────────────────────────────────────────

export const ENTERPRISE_LIST: EnterpriseItem[] = [
  { name: "FPT Software",  viet_tat: "FPT",  mau: "#6366f1", industry: "Công nghệ thông tin",    jobs: 42, verified: true  },
  { name: "Vingroup",      viet_tat: "VIC",  mau: "#ec4899", industry: "Tập đoàn đa ngành",      jobs: 28, verified: true  },
  { name: "Agribank",      viet_tat: "AGR",  mau: "#10b981", industry: "Ngân hàng & Tài chính",  jobs: 15, verified: true  },
  { name: "VinFast",       viet_tat: "VF",   mau: "#0ea5e9", industry: "Công nghiệp & Sản xuất", jobs: 33, verified: true  },
  { name: "Masan Group",   viet_tat: "MSN",  mau: "#f59e0b", industry: "Nông nghiệp & FMCG",     jobs: 19, verified: true  },
  { name: "KPMG Vietnam",  viet_tat: "KPMG", mau: "#f97316", industry: "Kiểm toán & Tư vấn",     jobs: 11, verified: false },
];

// ─── Chart modes ────────────────────────────────────────────────────────────

export const CHART_MODES: { value: ChartMode; label: string }[] = [
  { value: "coViec",    label: "Tỉ lệ có việc làm / chưa có việc" },
  { value: "tinhHinh", label: "Chi tiết tình hình việc làm"        },
  { value: "khuVuc",   label: "Chi tiết khu vực làm việc"          },
];

export const MODE_CONFIG: Record<ChartMode, ChartModeConfig> = {
  coViec: {
    colors: ["#6366f1", "#f472b6"],
    getPieData: d => [
      { name: "Có việc làm",  value: d.coViec     },
      { name: "Chưa có việc", value: d.chuaCoViec },
    ],
    getColKey: n => n === "Có việc làm" ? "coViec" : n === "Chưa có việc" ? "chuaCoViec" : null,
  },
  tinhHinh: {
    colors: ["#6366f1", "#06b6d4", "#10b981", "#f59e0b", "#f43f5e"],
    getPieData: d => [
      { name: "Đúng ngành",   value: d.dungNganh  },
      { name: "Liên quan",    value: d.lienQuan   },
      { name: "Trái ngành",   value: d.traiNganh  },
      { name: "Tiếp tục học", value: d.tiepTucHoc },
      { name: "Chưa có việc", value: d.chuaCoViec },
    ],
    getColKey: n => (({ "Đúng ngành": "dungNganh", "Liên quan": "lienQuan", "Trái ngành": "traiNganh", "Tiếp tục học": "tiepTucHoc", "Chưa có việc": "chuaCoViec" } as any)[n] ?? null),
  },
  khuVuc: {
    colors: ["#6366f1", "#06b6d4", "#10b981", "#f59e0b"],
    getPieData: d => [
      { name: "Tư nhân",     value: d.tuNhan    },
      { name: "Nhà nước",    value: d.nhaNuoc   },
      { name: "Tự tạo việc", value: d.tuTaoViec },
      { name: "Nước ngoài",  value: d.nuocNgoai },
    ],
    getColKey: n => (({ "Tư nhân": "tuNhan", "Nhà nước": "nhaNuoc", "Tự tạo việc": "tuTaoViec", "Nước ngoài": "nuocNgoai" } as any)[n] ?? null),
  },
};

// ─── Filter options ─────────────────────────────────────────────────────────

export const KHOA_OPTIONS = [
  { value: "all",  label: "Tất cả khoa"     },
  { value: "CNTT", label: "Khoa CNTT"        },
  { value: "KT",   label: "Khoa Kinh tế"     },
  { value: "NN",   label: "Khoa Nông nghiệp" },
  { value: "MT",   label: "Khoa Môi trường"  },
];

export const NGANH_BY_KHOA: Record<string, { value: string; label: string }[]> = {
  all:  [{ value: "all", label: "Tất cả ngành" }],
  CNTT: [{ value: "all", label: "Tất cả ngành" }, { value: "CNTT", label: "Công nghệ thông tin" }, { value: "HTTT", label: "Hệ thống thông tin" }],
  KT:   [{ value: "all", label: "Tất cả ngành" }, { value: "QTKD", label: "Quản trị kinh doanh" }, { value: "KT",   label: "Kế toán"           }],
  NN:   [{ value: "all", label: "Tất cả ngành" }, { value: "KHCT", label: "Khoa học cây trồng"  }, { value: "TV",   label: "Thú y"              }],
  MT:   [{ value: "all", label: "Tất cả ngành" }, { value: "KHMT", label: "Khoa học môi trường" }, { value: "QLTN", label: "Quản lý tài nguyên"  }],
};

// ─── Survey dot data ─────────────────────────────────────────────────────────

const DETAIL_DATA: Record<string, Record<string, DotEntry>> = {
  "all|all|all": {
    "T12/2024": { coViec: 993, chuaCoViec: 86,  dungNganh: 720, lienQuan: 155, traiNganh: 118, tiepTucHoc: 62,  tuNhan: 740, nhaNuoc: 58,  tuTaoViec: 160, nuocNgoai: 35 },
    "T3/2025":  { coViec: 950, chuaCoViec: 95,  dungNganh: 688, lienQuan: 148, traiNganh: 114, tiepTucHoc: 58,  tuNhan: 710, nhaNuoc: 54,  tuTaoViec: 148, nuocNgoai: 30 },
    "T6/2025":  { coViec: 912, chuaCoViec: 98,  dungNganh: 655, lienQuan: 140, traiNganh: 117, tiepTucHoc: 55,  tuNhan: 680, nhaNuoc: 50,  tuTaoViec: 140, nuocNgoai: 28 },
  },
  "CNTT|all|all": {
    "T12/2024": { coViec: 58, chuaCoViec: 4, dungNganh: 48, lienQuan: 7, traiNganh: 3, tiepTucHoc: 4, tuNhan: 45, nhaNuoc: 2, tuTaoViec: 9, nuocNgoai: 2 },
    "T3/2025":  { coViec: 28, chuaCoViec: 5, dungNganh: 22, lienQuan: 4, traiNganh: 2, tiepTucHoc: 3, tuNhan: 20, nhaNuoc: 2, tuTaoViec: 5, nuocNgoai: 1 },
    "T6/2025":  { coViec: 22, chuaCoViec: 3, dungNganh: 17, lienQuan: 3, traiNganh: 2, tiepTucHoc: 2, tuNhan: 16, nhaNuoc: 1, tuTaoViec: 4, nuocNgoai: 1 },
  },
  "CNTT|CNTT|all": {
    "T12/2024": { coViec: 35, chuaCoViec: 2, dungNganh: 30, lienQuan: 4, traiNganh: 1, tiepTucHoc: 2, tuNhan: 27, nhaNuoc: 1, tuTaoViec: 6, nuocNgoai: 1 },
    "T3/2025":  { coViec: 17, chuaCoViec: 2, dungNganh: 14, lienQuan: 2, traiNganh: 1, tiepTucHoc: 1, tuNhan: 12, nhaNuoc: 1, tuTaoViec: 3, nuocNgoai: 1 },
    "T6/2025":  { coViec: 13, chuaCoViec: 2, dungNganh: 10, lienQuan: 2, traiNganh: 1, tiepTucHoc: 1, tuNhan: 10, nhaNuoc: 1, tuTaoViec: 2, nuocNgoai: 0 },
  },
  "CNTT|HTTT|all": {
    "T12/2024": { coViec: 23, chuaCoViec: 2, dungNganh: 18, lienQuan: 3, traiNganh: 2, tiepTucHoc: 2, tuNhan: 18, nhaNuoc: 1, tuTaoViec: 3, nuocNgoai: 1 },
    "T3/2025":  { coViec: 11, chuaCoViec: 3, dungNganh: 8,  lienQuan: 2, traiNganh: 1, tiepTucHoc: 2, tuNhan: 8,  nhaNuoc: 1, tuTaoViec: 2, nuocNgoai: 0 },
    "T6/2025":  { coViec: 9,  chuaCoViec: 1, dungNganh: 7,  lienQuan: 1, traiNganh: 1, tiepTucHoc: 1, tuNhan: 6,  nhaNuoc: 0, tuTaoViec: 2, nuocNgoai: 1 },
  },
  "KT|all|all": {
    "T12/2024": { coViec: 72, chuaCoViec: 6, dungNganh: 52, lienQuan: 12, traiNganh: 8, tiepTucHoc: 4, tuNhan: 55, nhaNuoc: 8, tuTaoViec: 7, nuocNgoai: 2 },
    "T3/2025":  { coViec: 34, chuaCoViec: 8, dungNganh: 24, lienQuan: 6,  traiNganh: 4, tiepTucHoc: 3, tuNhan: 26, nhaNuoc: 4, tuTaoViec: 4, nuocNgoai: 0 },
    "T6/2025":  { coViec: 28, chuaCoViec: 6, dungNganh: 20, lienQuan: 5,  traiNganh: 3, tiepTucHoc: 2, tuNhan: 21, nhaNuoc: 3, tuTaoViec: 3, nuocNgoai: 1 },
  },
  "KT|QTKD|all": {
    "T12/2024": { coViec: 40, chuaCoViec: 4, dungNganh: 28, lienQuan: 7, traiNganh: 5, tiepTucHoc: 2, tuNhan: 31, nhaNuoc: 4, tuTaoViec: 4, nuocNgoai: 1 },
    "T3/2025":  { coViec: 18, chuaCoViec: 5, dungNganh: 13, lienQuan: 3, traiNganh: 2, tiepTucHoc: 2, tuNhan: 14, nhaNuoc: 2, tuTaoViec: 2, nuocNgoai: 0 },
    "T6/2025":  { coViec: 15, chuaCoViec: 3, dungNganh: 11, lienQuan: 3, traiNganh: 1, tiepTucHoc: 1, tuNhan: 11, nhaNuoc: 2, tuTaoViec: 2, nuocNgoai: 0 },
  },
  "KT|KT|all": {
    "T12/2024": { coViec: 32, chuaCoViec: 2, dungNganh: 24, lienQuan: 5, traiNganh: 3, tiepTucHoc: 2, tuNhan: 24, nhaNuoc: 4, tuTaoViec: 3, nuocNgoai: 1 },
    "T3/2025":  { coViec: 16, chuaCoViec: 3, dungNganh: 11, lienQuan: 3, traiNganh: 2, tiepTucHoc: 1, tuNhan: 12, nhaNuoc: 2, tuTaoViec: 2, nuocNgoai: 0 },
    "T6/2025":  { coViec: 13, chuaCoViec: 3, dungNganh: 9,  lienQuan: 2, traiNganh: 2, tiepTucHoc: 1, tuNhan: 10, nhaNuoc: 1, tuTaoViec: 1, nuocNgoai: 1 },
  },
  "NN|all|all": {
    "T12/2024": { coViec: 48, chuaCoViec: 10, dungNganh: 30, lienQuan: 9, traiNganh: 9, tiepTucHoc: 5, tuNhan: 32, nhaNuoc: 6, tuTaoViec: 8, nuocNgoai: 2 },
    "T3/2025":  { coViec: 22, chuaCoViec: 7,  dungNganh: 14, lienQuan: 4, traiNganh: 4, tiepTucHoc: 3, tuNhan: 15, nhaNuoc: 3, tuTaoViec: 4, nuocNgoai: 0 },
    "T6/2025":  { coViec: 18, chuaCoViec: 5,  dungNganh: 11, lienQuan: 4, traiNganh: 3, tiepTucHoc: 2, tuNhan: 12, nhaNuoc: 2, tuTaoViec: 3, nuocNgoai: 1 },
  },
  "NN|KHCT|all": {
    "T12/2024": { coViec: 28, chuaCoViec: 6, dungNganh: 18, lienQuan: 5, traiNganh: 5, tiepTucHoc: 3, tuNhan: 19, nhaNuoc: 4, tuTaoViec: 4, nuocNgoai: 1 },
    "T3/2025":  { coViec: 13, chuaCoViec: 4, dungNganh: 8,  lienQuan: 2, traiNganh: 3, tiepTucHoc: 2, tuNhan: 9,  nhaNuoc: 2, tuTaoViec: 2, nuocNgoai: 0 },
    "T6/2025":  { coViec: 11, chuaCoViec: 3, dungNganh: 7,  lienQuan: 2, traiNganh: 2, tiepTucHoc: 1, tuNhan: 7,  nhaNuoc: 1, tuTaoViec: 2, nuocNgoai: 1 },
  },
  "NN|TV|all": {
    "T12/2024": { coViec: 20, chuaCoViec: 4, dungNganh: 12, lienQuan: 4, traiNganh: 4, tiepTucHoc: 2, tuNhan: 13, nhaNuoc: 2, tuTaoViec: 4, nuocNgoai: 1 },
    "T3/2025":  { coViec: 9,  chuaCoViec: 3, dungNganh: 6,  lienQuan: 2, traiNganh: 1, tiepTucHoc: 1, tuNhan: 6,  nhaNuoc: 1, tuTaoViec: 2, nuocNgoai: 0 },
    "T6/2025":  { coViec: 7,  chuaCoViec: 2, dungNganh: 4,  lienQuan: 2, traiNganh: 1, tiepTucHoc: 1, tuNhan: 5,  nhaNuoc: 1, tuTaoViec: 1, nuocNgoai: 0 },
  },
  "MT|all|all": {
    "T12/2024": { coViec: 35, chuaCoViec: 7, dungNganh: 22, lienQuan: 8, traiNganh: 5, tiepTucHoc: 4, tuNhan: 24, nhaNuoc: 5, tuTaoViec: 5, nuocNgoai: 1 },
    "T3/2025":  { coViec: 16, chuaCoViec: 5, dungNganh: 10, lienQuan: 4, traiNganh: 2, tiepTucHoc: 2, tuNhan: 11, nhaNuoc: 2, tuTaoViec: 3, nuocNgoai: 0 },
    "T6/2025":  { coViec: 13, chuaCoViec: 4, dungNganh: 8,  lienQuan: 3, traiNganh: 2, tiepTucHoc: 2, tuNhan: 9,  nhaNuoc: 2, tuTaoViec: 2, nuocNgoai: 0 },
  },
  "MT|KHMT|all": {
    "T12/2024": { coViec: 20, chuaCoViec: 4, dungNganh: 13, lienQuan: 4, traiNganh: 3, tiepTucHoc: 2, tuNhan: 13, nhaNuoc: 3, tuTaoViec: 3, nuocNgoai: 1 },
    "T3/2025":  { coViec: 9,  chuaCoViec: 3, dungNganh: 6,  lienQuan: 2, traiNganh: 1, tiepTucHoc: 1, tuNhan: 6,  nhaNuoc: 1, tuTaoViec: 2, nuocNgoai: 0 },
    "T6/2025":  { coViec: 7,  chuaCoViec: 2, dungNganh: 5,  lienQuan: 1, traiNganh: 1, tiepTucHoc: 1, tuNhan: 5,  nhaNuoc: 1, tuTaoViec: 1, nuocNgoai: 0 },
  },
  "MT|QLTN|all": {
    "T12/2024": { coViec: 15, chuaCoViec: 3, dungNganh: 9, lienQuan: 4, traiNganh: 2, tiepTucHoc: 2, tuNhan: 11, nhaNuoc: 2, tuTaoViec: 2, nuocNgoai: 0 },
    "T3/2025":  { coViec: 7,  chuaCoViec: 2, dungNganh: 4, lienQuan: 2, traiNganh: 1, tiepTucHoc: 1, tuNhan: 5,  nhaNuoc: 1, tuTaoViec: 1, nuocNgoai: 0 },
    "T6/2025":  { coViec: 6,  chuaCoViec: 2, dungNganh: 3, lienQuan: 2, traiNganh: 1, tiepTucHoc: 1, tuNhan: 4,  nhaNuoc: 1, tuTaoViec: 1, nuocNgoai: 0 },
  },
  // Khoa  -> không có data -> getSoSVPhanhoi trả 0
};

export function getLatestDot(khoa = "all", nganh = "all"): string {
  const data = getFilteredDotData(khoa, nganh);
  const keys = Object.keys(data);
  return keys[keys.length - 1] ?? "T12/2024";
}

export const LATEST_DOT = getLatestDot();
 
export function getSoSVPhanhoi(khoaVietTat: string): number {
  const key = `${khoaVietTat}|all|all`;
  const dotData = DETAIL_DATA[key];
  if (!dotData) return 0;
  const keys = Object.keys(dotData);
  if (!keys.length) return 0;
  const latest = dotData[keys[keys.length - 1]];
  return latest.coViec + latest.chuaCoViec;
}

export function getFilteredDotData(khoa: string, nganh: string): Record<string, DotEntry> {
  const key = `${khoa}|${nganh}|all`;
  return DETAIL_DATA[key] ?? DETAIL_DATA["all|all|all"];
}