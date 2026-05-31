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
  chartMode: string;
};

export const DEFAULT_QUEST_ID = "q_employment_status";

export const CHART_FILTER_SCHEMA: FilterFieldSchema[] = [
  {
    key: "khoa",
    width: 160,
    size: "small",
    defaultValue: "all",
    align: "left",
    getOptions: () => [],
    resetOnChange: ["nganh"],
  },
  {
    key: "nganh",
    width: 180,
    size: "small",
    defaultValue: "all",
    align: "left",
    getOptions: () => [],
  },
  {
    key: "chartMode",
    width: 270,
    size: "small",
    defaultValue: DEFAULT_QUEST_ID,
    align: "right",
    getOptions: () => [],
  },
];

export const CHART_FILTER_DEFAULTS: ChartFilterState = {
  khoa: "all",
  nganh: "all",
  chartMode: DEFAULT_QUEST_ID,
};