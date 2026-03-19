import { useState } from "react";
import type { ChartMode } from "../../../feature/dashboard/type";

export function useChartFilter() {
  const [chartMode, setChartMode] = useState<ChartMode>("coViec");
  const [khoa, setKhoaRaw] = useState("all");
  const [nganh, setNganh] = useState("all");

  const setKhoa = (v: string) => {
    setKhoaRaw(v);
    setNganh("all");
  };

  return { chartMode, setChartMode, khoa, setKhoa, nganh, setNganh };
}