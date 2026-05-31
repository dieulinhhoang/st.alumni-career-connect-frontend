import axios from "axios";
import type {
  DotEntry,
  KhoaItem,
  EnterpriseItem,
  ChartMode,
  ChartModeConfig,
} from "./type";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

// Giữ lại để tương thích với các component/dashboard cũ còn import
export const CHART_MODES: { value: ChartMode; label: string }[] = [
  { value: "coViec", label: "Tỉ lệ có việc làm / chưa có việc" },
  { value: "tinhHinh", label: "Chi tiết tình hình việc làm" },
  { value: "khuVuc", label: "Chi tiết khu vực làm việc" },
];

export const MODE_CONFIG: Record<ChartMode, ChartModeConfig> = {
  coViec: {
    colors: ["#6366f1", "#f472b6"],
    getPieData: (d: DotEntry) => [
      { name: "Có việc làm", value: d.coViec },
      { name: "Chưa có việc", value: d.chuaCoViec },
    ],
    getColKey: (n: string) =>
      n === "Có việc làm"
        ? "coViec"
        : n === "Chưa có việc"
        ? "chuaCoViec"
        : null,
  },
  tinhHinh: {
    colors: ["#6366f1", "#06b6d4", "#10b981", "#f59e0b", "#f43f5e"],
    getPieData: (d: DotEntry) => [
      { name: "Đúng ngành", value: d.dungNganh },
      { name: "Liên quan", value: d.lienQuan },
      { name: "Trái ngành", value: d.traiNganh },
      { name: "Tiếp tục học", value: d.tiepTucHoc },
      { name: "Chưa có việc", value: d.chuaCoViec },
    ],
    getColKey: (n: string) =>
      (
        {
          "Đúng ngành": "dungNganh",
          "Liên quan": "lienQuan",
          "Trái ngành": "traiNganh",
          "Tiếp tục học": "tiepTucHoc",
          "Chưa có việc": "chuaCoViec",
        } as Record<string, keyof DotEntry>
      )[n] ?? null,
  },
  khuVuc: {
    colors: ["#6366f1", "#06b6d4", "#10b981", "#f59e0b"],
    getPieData: (d: DotEntry) => [
      { name: "Tư nhân", value: d.tuNhan },
      { name: "Nhà nước", value: d.nhaNuoc },
      { name: "Tự tạo việc", value: d.tuTaoViec },
      { name: "Nước ngoài", value: d.nuocNgoai },
    ],
    getColKey: (n: string) =>
      (
        {
          "Tư nhân": "tuNhan",
          "Nhà nước": "nhaNuoc",
          "Tự tạo việc": "tuTaoViec",
          "Nước ngoài": "nuocNgoai",
        } as Record<string, keyof DotEntry>
      )[n] ?? null,
  },
};

export interface DashboardWidget {
  id: string;
  title: string;
  type: "stat" | "chart" | "list" | "table";
  data?: Record<string, unknown>;
}

export interface ChartDataPoint {
  label: string;
  value: number;
}

export interface DashboardSummaryMetric {
  value: number;
  total?: number;
  trend?: string;
}

export interface DashboardSummary {
  latestDot: string;
  responseRate: DashboardSummaryMetric;
  employedRateOnResponses: DashboardSummaryMetric;
  employedRateOnGraduates: DashboardSummaryMetric;
  relevantJobRate: DashboardSummaryMetric;
}

/**
 * Dashboard summary cards + latest dot
 */
export async function fetchDashboardSummary(): Promise<DashboardSummary> {
  const res = await api.get("/dashboard/summary");
  return res.data as DashboardSummary;
}

export async function fetchDashboardWidgets(): Promise<DashboardWidget[]> {
  const res = await api.get("/dashboard/widgets");
  return res.data as DashboardWidget[];
}

export async function fetchDashboardChartData(
  khoaFilter: string | { khoa?: string; nganh?: string } = "all",
  mode: string = "coviec"
): Promise<ChartDataPoint[]> {
  const res = await api.get("/dashboard/chart-data", {
    params: {
      khoa:
        typeof khoaFilter === "string"
          ? khoaFilter
          : khoaFilter.khoa ?? "all",
      nganh:
        typeof khoaFilter === "object"
          ? khoaFilter.nganh ?? "all"
          : "all",
      mode,
    },
  });
  return res.data as ChartDataPoint[];
}

export async function fetchKhoaList(): Promise<KhoaItem[]> {
  const res = await api.get("/khoa");
  return res.data as KhoaItem[];
}

/** Normalize response: API có thể trả về array thẳng hoặc paginated object { data/items: [] } */
function toArray<T>(raw: unknown): T[] {
  if (Array.isArray(raw)) return raw as T[];
  if (raw && typeof raw === "object") {
    const obj = raw as Record<string, unknown>;
    if (Array.isArray(obj.data)) return obj.data as T[];
    if (Array.isArray(obj.items)) return obj.items as T[];
    if (Array.isArray(obj.result)) return obj.result as T[];
  }
  return [];
}

export async function fetchEnterpriseList(): Promise<EnterpriseItem[]> {
  const res = await api.get("/enterprises");
  return toArray<EnterpriseItem>(res.data);
}
