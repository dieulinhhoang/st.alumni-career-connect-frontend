export type DotEntry = {
  coViec: number;
  chuaCoViec: number;
  dungNganh: number;
  lienQuan: number;
  traiNganh: number;
  tiepTucHoc: number;
  tuNhan: number;
  nhaNuoc: number;
  tuTaoViec: number;
  nuocNgoai: number;
};

export type KhoaItem = {
  ten: string;
  viet_tat: string;
  mau: string;
  ngayNop: string | null;
  daNop: boolean;
  soSV: number;
  tongSV: number;
};

export type EnterpriseItem = {
  name: string;
  viet_tat: string;
  mau: string;
  industry: string;
  jobs: number;
  verified: boolean;
};

export type ChartMode = "coViec" | "tinhHinh" | "khuVuc";
export type KhoaFilter = "all" | "daNop" | "chuaNop";

export type ChartModeConfig = {
  colors: string[];
  getPieData: (d: DotEntry) => { name: string; value: number }[];
  getColKey: (name: string) => keyof DotEntry | null;
};