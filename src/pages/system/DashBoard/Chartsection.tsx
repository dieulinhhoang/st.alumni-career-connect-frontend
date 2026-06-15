import { useEffect, useMemo, useState } from "react";
import { Button, Spin, Empty, Typography } from "antd";
import { TableOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import {
  CHART_FILTER_SCHEMA,
  type ChartFilterState,
  type FilterFieldSchema,
  type FilterOption,
} from "../../../feature/dashboard/filterSchema";
import { DynamicFilterBar } from "../../../feature/dashboard/DynamicFilterBar";
import {
  CHART_MODES,
  MODE_CONFIG,
  fetchEmploymentChartData,
  type EmploymentChartResponse,
} from "../../../feature/dashboard/api";
import type { ChartMode } from "../../../feature/dashboard/type";
import { COLOR } from "./theme";
import { PieColumnChart } from "../../../components/charts/PieColumnChart";

const { Text } = Typography;

interface Props {
  state: ChartFilterState;
  setField: (key: string, value: string) => void;
  khoaOptions?: FilterOption[];
  nganhOptions?: FilterOption[];
}

export function ChartSection({ state, setField, khoaOptions = [], nganhOptions = [] }: Props) {
  const { khoa, nganh, chartMode } = state;
  const navigate = useNavigate();
  const [employmentData, setEmploymentData] = useState<EmploymentChartResponse | null>(null);
  const [chartLoading, setChartLoading] = useState(false);

  const mode = (chartMode as ChartMode) || "coViec";

  // Tải lại dữ liệu khi khoa / nganh thay đổi (data đã chứa đủ cho mọi chartMode)
  useEffect(() => {
    let cancelled = false;
    setChartLoading(true);
    fetchEmploymentChartData(khoa, nganh).then(res => {
      if (cancelled) return;
      setEmploymentData(res);
      setChartLoading(false);
    }).catch(() => {
      if (cancelled) return;
      setEmploymentData(null);
      setChartLoading(false);
    });
    return () => { cancelled = true; };
  }, [khoa, nganh]);

  const dynamicSchema = useMemo<FilterFieldSchema[]>(() => {
    const modeOpts = CHART_MODES.map(m => ({ value: m.value, label: m.label }));

    const safeKhoaOptions = khoaOptions.length
      ? khoaOptions
      : [{ value: "all", label: "Tất cả khoa" }];
    const safeNganhOptions = nganhOptions.length
      ? nganhOptions
      : [{ value: "all", label: "Tất cả ngành" }];

    return CHART_FILTER_SCHEMA.map(f => {
      if (f.key === "chartMode") return { ...f, getOptions: () => modeOpts };
      if (f.key === "khoa") return { ...f, getOptions: () => safeKhoaOptions };
      if (f.key === "nganh") return { ...f, getOptions: () => safeNganhOptions };
      return f;
    });
  }, [khoaOptions, nganhOptions]);

  const dotData = employmentData?.dotData ?? {};
  const latestKey = employmentData?.latestKey ?? "—";

  const getPieData = MODE_CONFIG[mode].getPieData;

  const pieData = useMemo(
    () => (dotData[latestKey] ? getPieData(dotData[latestKey]) : []),
    [dotData, latestKey, getPieData],
  );

  const chartDotData = useMemo(
    () => Object.fromEntries(
      Object.entries(dotData).map(([dot, entry]) => [dot, getPieData(entry)]),
    ),
    [dotData, getPieData],
  );

  const pieLabel = `Đợt khảo sát mới nhất · ${latestKey}`;
  const columnLabel = "Số lượng theo từng đợt khảo sát";

  return (
    <div style={{
      background: "#fff",
      borderRadius: 14,
      border: `1px solid #e2e8f0`,
      boxShadow: "0 1px 3px rgba(0,0,0,0.06), 0 4px 16px rgba(0,0,0,0.06)",
      overflow: "hidden",
    }}>
      {/* Header */}
      <div style={{
        padding: "16px 20px",
        borderBottom: "1px solid #f1f5f9",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        flexWrap: "wrap", gap: 12,
      }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 3 }}>
            <div style={{ width: 3, height: 20, borderRadius: 99, background: COLOR.primary }} />
            <span style={{ fontSize: 18, fontWeight: 700, color: COLOR.textDark }}>
              Thống kê sinh viên theo đợt khảo sát
            </span>
          </div>
          {/* <Text style={{ fontSize: 12, color: COLOR.textFaint, marginLeft: 11 }}>
            Phân bố tỷ lệ phần trăm – so sánh giữa các đợt khảo sát
          </Text> */}
        </div>
        <Button
          icon={<TableOutlined />}
          onClick={() => navigate("/admin/employment-stats")}
          style={{
            borderRadius: 8, fontWeight: 600, fontSize: 12, height: 34,
            background: `${COLOR.primary}08`, borderColor: `${COLOR.primary}30`,
            color: COLOR.primary,
          }}
        >
          Xem chi tiết
        </Button>
      </div>

      {/* Filters */}
      <DynamicFilterBar
        schema={dynamicSchema}
        state={state as unknown as Record<string, string>}
        setField={setField}
        label="Lọc theo:"
        labelColor={COLOR.textMuted}
      />

      {/* Charts */}
      <div style={{ padding: "16px 20px 20px", minHeight: 320, position: "relative" }}>
        {chartLoading ? (
          <div style={{
            minHeight: 280,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}>
            <Spin tip="Đang tải dữ liệu…" />
          </div>
        ) : pieData.length === 0 ? (
          <div style={{
            minHeight: 280,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}>
            <Empty
              description={<Text style={{ color: COLOR.textMuted }}>Không có dữ liệu cho bộ lọc này</Text>}
              image={Empty.PRESENTED_IMAGE_SIMPLE}
            />
          </div>
        ) : (
          <PieColumnChart
            pieData={pieData}
            dotData={chartDotData}
            latestKey={latestKey}
            pieLabel={pieLabel}
            columnLabel={columnLabel}
          />
        )}
      </div>
    </div>
  );
}