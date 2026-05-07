import { useCallback, useMemo, useState } from "react";
import {
  CHART_FILTER_DEFAULTS,
  CHART_FILTER_SCHEMA,
  type ChartFilterState,
  type FilterFieldSchema,
} from "../filterSchema";

function buildDefaults(schema: FilterFieldSchema[], base: Record<string, string>) {
  const out: Record<string, string> = { ...base };
  for (const f of schema) {
    if (out[f.key] === undefined) out[f.key] = f.defaultValue;
  }
  return out;
}

export function useDynamicFilter<S extends Record<string, string>>(
  schema: FilterFieldSchema[],
  defaults: S,
) {
  const initial = useMemo(() => buildDefaults(schema, defaults) as S, [schema, defaults]);
  const [state, setState] = useState<S>(initial);

  const setField = useCallback((key: string, value: string) => {
    setState(prev => {
      const field = schema.find(f => f.key === key);
      const next: Record<string, string> = { ...prev, [key]: value };
      if (field?.resetOnChange?.length) {
        for (const resetKey of field.resetOnChange) {
          const target = schema.find(f => f.key === resetKey);
          if (target) next[resetKey] = target.defaultValue;
        }
      }
      return next as S;
    });
  }, [schema]);

  const reset = useCallback(() => setState(initial), [initial]);

  return { state, setField, reset, setState };
}

export function useChartFilter() {
  const { state, setField, reset } = useDynamicFilter<ChartFilterState>(
    CHART_FILTER_SCHEMA,
    CHART_FILTER_DEFAULTS,
  );

  return {
    state,
    setField,
    reset,
    // chartMode now holds a statistical questionId (string), not the legacy ChartMode union
    chartMode: state.chartMode,
    khoa: state.khoa,
    nganh: state.nganh,
    setChartMode: (v: string) => setField("chartMode", v),
    setKhoa: (v: string) => setField("khoa", v),
    setNganh: (v: string) => setField("nganh", v),
  };
}