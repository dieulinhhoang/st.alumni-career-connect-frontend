import type { ChartMode } from "./type";
import { CHART_MODES, KHOA_OPTIONS, NGANH_BY_KHOA } from "./api";

export type FilterOption = { value: string; label: string };

export type FilterFieldSchema = {
  key: string;
  width?: number;
  size?: "small" | "middle" | "large";
  defaultValue: string;
  align?: "left" | "right";
  getOptions: (state: ChartFilterState) => FilterOption[];
  resetOnChange?: string[];
};

export type ChartFilterState = {
  khoa: string;
  nganh: string;
  chartMode: ChartMode;
};

export const CHART_FILTER_SCHEMA: FilterFieldSchema[] = [
  {
    key: "khoa",
    width: 160,
    size: "small",
    defaultValue: "all",
    align: "left",
    getOptions: () => KHOA_OPTIONS,
    resetOnChange: ["nganh"],
  },
  {
    key: "nganh",
    width: 180,
    size: "small",
    defaultValue: "all",
    align: "left",
    getOptions: state => NGANH_BY_KHOA[state.khoa] ?? NGANH_BY_KHOA.all,
  },
  {
    key: "chartMode",
    width: 270,
    size: "small",
    defaultValue: "coViec",
    align: "right",
    getOptions: () => CHART_MODES.map(m => ({ value: m.value, label: m.label })),
  },
];

export const CHART_FILTER_DEFAULTS: ChartFilterState = {
  khoa: "all",
  nganh: "all",
  chartMode: "coViec",
};
