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
  // Reused as the selected statistical question id on the dashboard chart.
  // Kept under the legacy `chartMode` key so the surrounding hook/state shape
  // does not change; type widened from ChartMode → string accordingly.
  chartMode: string;
};

// Default to the first mock question id so the chart renders immediately
// on first paint. This value is overridden by getStatisticalQuestions()
// once it resolves (or by the real API when BE is ready).
export const DEFAULT_QUEST_ID = "q_employment_status";

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
    // Visually this is the right-aligned selector from the original UI.
    // It now lists statistical questions instead of chart modes,
    // but keeps the exact same width/size/position as before.
    key: "chartMode",
    width: 270,
    size: "small",
    defaultValue: DEFAULT_QUEST_ID,
    align: "right",
    // getOptions is overridden dynamically in ChartSection.tsx once
    // the question list is loaded (see dynamicSchema useMemo).
    getOptions: () => CHART_MODES.map(m => ({ value: m.value, label: m.label })),
  },
];

export const CHART_FILTER_DEFAULTS: ChartFilterState = {
  khoa: "all",
  nganh: "all",
  chartMode: DEFAULT_QUEST_ID,
};