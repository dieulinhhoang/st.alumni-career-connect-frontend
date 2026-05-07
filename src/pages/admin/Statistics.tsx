import { useEffect, useMemo, useRef } from "react";
import { Typography } from "antd";
import { Pie as G2Pie, Column as G2Column } from "@antv/g2plot";
import AdminLayout from "../../components/layout/AdminLayout";
import { DynamicFilterBar } from "../../feature/dashboard/DynamicFilterBar";
import { useDynamicFilter } from "../../feature/dashboard/hooks/useChartFilter";
import {
  CHART_ATTRIBUTE_OPTIONS,
  REPORT_CHART_FILTER_SCHEMA,
  REPORT_FILTER_DEFAULTS,
  type ReportFilterState,
} from "../../feature/dashboard/reportFilterSchema";
import { COLOR } from "./DashBoard/theme";

const { Title, Text } = Typography;

type AttrChart = {
  /** "pie" → donut breakdown, "column" → vertical bars. */
  kind: "pie" | "column";
  colors: string[];
  data: { name: string; value: number }[];
};

/**
 * Placeholder dataset per attribute. Shape matches what BE is expected to
 * return for each statistic key. Replace `ATTRIBUTE_PLACEHOLDER_DATA[key]`
 * with the result of e.g. `GET /api/statistics/{attribute}` when the
 * endpoint exists. The selector keys are the BE contract — see
 * `reportFilterSchema.ts`.
 */
const ATTRIBUTE_PLACEHOLDER_DATA: Record<string, AttrChart> = {
  employment_status: {
    kind: "pie",
    colors: ["#6366f1", "#06b6d4", "#10b981", "#f59e0b", "#f43f5e"],
    data: [
      { name: "Đúng ngành",    value: 0 },
      { name: "Liên quan",     value: 0 },
      { name: "Trái ngành",    value: 0 },
      { name: "Tiếp tục học",  value: 0 },
      { name: "Chưa có việc",  value: 0 },
    ],
  },
  work_area: {
    kind: "pie",
    colors: ["#6366f1", "#06b6d4", "#10b981", "#f59e0b"],
    data: [
      { name: "Tư nhân",     value: 0 },
      { name: "Nhà nước",    value: 0 },
      { name: "Tự tạo việc", value: 0 },
      { name: "Nước ngoài",  value: 0 },
    ],
  },
  employed_since: {
    kind: "column",
    colors: ["#6366f1"],
    data: [
      { name: "Trước tốt nghiệp", value: 0 },
      { name: "< 3 tháng",        value: 0 },
      { name: "3 – 6 tháng",      value: 0 },
      { name: "6 – 12 tháng",     value: 0 },
      { name: "> 12 tháng",       value: 0 },
    ],
  },
  trained_field: {
    kind: "pie",
    colors: ["#10b981", "#6366f1", "#f59e0b"],
    data: [
      { name: "Phù hợp",        value: 0 },
      { name: "Tương đối",      value: 0 },
      { name: "Không phù hợp",  value: 0 },
    ],
  },
  professional_qualification_field: {
    kind: "pie",
    colors: ["#10b981", "#6366f1", "#f59e0b", "#f43f5e"],
    data: [
      { name: "Cao hơn",      value: 0 },
      { name: "Phù hợp",      value: 0 },
      { name: "Thấp hơn",     value: 0 },
      { name: "Không liên quan", value: 0 },
    ],
  },
  level_knowledge_acquired: {
    kind: "column",
    colors: ["#6366f1"],
    data: [
      { name: "Rất tốt", value: 0 },
      { name: "Tốt",     value: 0 },
      { name: "Khá",     value: 0 },
      { name: "Trung bình", value: 0 },
      { name: "Yếu",     value: 0 },
    ],
  },
  average_income: {
    kind: "column",
    colors: ["#06b6d4"],
    data: [
      { name: "< 5",     value: 0 },
      { name: "5 – 10",  value: 0 },
      { name: "10 – 15", value: 0 },
      { name: "15 – 20", value: 0 },
      { name: "> 20",    value: 0 },
    ],
  },
  recruitment_type: {
    kind: "column",
    colors: ["#6366f1"],
    data: [
      { name: "Người thân giới thiệu", value: 0 },
      { name: "Tự ứng tuyển",          value: 0 },
      { name: "Trang tuyển dụng",      value: 0 },
      { name: "Hội chợ việc làm",      value: 0 },
      { name: "Khác",                  value: 0 },
    ],
  },
  job_search_method: {
    kind: "column",
    colors: ["#10b981"],
    data: [
      { name: "Thi tuyển",    value: 0 },
      { name: "Phỏng vấn",    value: 0 },
      { name: "Hồ sơ",        value: 0 },
      { name: "Giới thiệu",   value: 0 },
      { name: "Khác",         value: 0 },
    ],
  },
  soft_skills_required: {
    kind: "column",
    colors: ["#8b5cf6"],
    data: [
      { name: "Giao tiếp",         value: 0 },
      { name: "Làm việc nhóm",     value: 0 },
      { name: "Giải quyết vấn đề", value: 0 },
      { name: "Tin học",           value: 0 },
      { name: "Ngoại ngữ",         value: 0 },
    ],
  },
  must_attended_courses: {
    kind: "column",
    colors: ["#f59e0b"],
    data: [
      { name: "Chuyên môn",       value: 0 },
      { name: "Ngoại ngữ",        value: 0 },
      { name: "Tin học",          value: 0 },
      { name: "Kỹ năng mềm",      value: 0 },
      { name: "Khác",             value: 0 },
    ],
  },
  solutions_get_job: {
    kind: "column",
    colors: ["#ec4899"],
    data: [
      { name: "Cập nhật CTĐT",    value: 0 },
      { name: "Tăng thực hành",   value: 0 },
      { name: "Liên kết DN",      value: 0 },
      { name: "Tư vấn nghề",      value: 0 },
      { name: "Khác",             value: 0 },
    ],
  },
};

function Statistic() {
  const { state, setField } = useDynamicFilter<ReportFilterState>(
    REPORT_CHART_FILTER_SCHEMA,
    REPORT_FILTER_DEFAULTS,
  );

  const chartRef = useRef<HTMLDivElement>(null);
  const instRef = useRef<G2Pie | G2Column | null>(null);

  const currentLabel = useMemo(
    () => CHART_ATTRIBUTE_OPTIONS.find(o => o.value === state.attribute)?.label ?? "",
    [state.attribute],
  );

  const chartCfg = ATTRIBUTE_PLACEHOLDER_DATA[state.attribute];

  useEffect(() => {
    if (!chartRef.current || !chartCfg) return;

    try {
      instRef.current?.destroy();
    } catch {
      /* g2plot chart already disposed */
    }
    instRef.current = null;

    if (chartCfg.kind === "pie") {
      const pie = new G2Pie(chartRef.current, {
        data: chartCfg.data,
        angleField: "value",
        colorField: "name",
        radius: 0.92,
        innerRadius: 0.6,
        color: chartCfg.colors,
        pieStyle: { lineWidth: 3, stroke: "#fff" },
        label: {
          type: "outer",
          offset: 12,
          content: ({ percent }: { percent: number }) =>
            `${(percent * 100).toFixed(0)}%`,
          style: { fontSize: 12, fontWeight: 700, fill: "#374151" },
        },
        legend: {
          position: "bottom",
          flipPage: false,
          itemName: { style: { fontSize: 12 } },
        },
        tooltip: {
          formatter: (d: { name: string; value: number }) => ({
            name: d.name,
            value: `${d.value} SV`,
          }),
        },
        interactions: [{ type: "element-active" }],
      });
      pie.render();
      instRef.current = pie;
    } else {
      const col = new G2Column(chartRef.current, {
        data: chartCfg.data.map(d => ({ name: d.name, value: d.value })),
        xField: "name",
        yField: "value",
        color: chartCfg.colors[0],
        columnStyle: {
          radius: [6, 6, 0, 0],
          fillOpacity: 0.9,
        },
        maxColumnWidth: 38,
        yAxis: {
          label: {
            formatter: (v: string) => `${v} SV`,
            style: { fill: COLOR.textFaint, fontSize: 11 },
          },
          grid: {
            line: { style: { stroke: "#f1f5f9", lineWidth: 1, lineDash: [4, 4] } },
          },
        },
        xAxis: {
          label: { style: { fontWeight: 600, fill: "#374151", fontSize: 12 } },
        },
        label: {
          position: "top",
          style: { fontSize: 11, fill: "#374151", fontWeight: 600 },
          formatter: (d: { value: number }) => (d.value > 0 ? `${d.value}` : ""),
        },
        tooltip: {
          formatter: (d: { name: string; value: number }) => ({
            name: d.name,
            value: `${d.value} SV`,
          }),
        },
      });
      col.render();
      instRef.current = col;
    }

    return () => {
      try {
        instRef.current?.destroy();
      } catch {
        /* g2plot chart already disposed */
      }
      instRef.current = null;
    };
  }, [chartCfg]);

  return (
    <AdminLayout>
      <div style={{
        marginBottom: 24,
        background: "linear-gradient(135deg, #eef2ff 0%, #f5f3ff 50%, #fdf4ff 100%)",
        borderRadius: 20, padding: "20px 24px",
        position: "relative", overflow: "hidden",
        border: "1px solid #e8e5ff",
      }}>
        <div style={{ position: "absolute", top: -30, right: -30, width: 160, height: 160, borderRadius: "50%", background: "rgba(99,102,241,0.06)" }} />
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12, position: "relative" }}>
          <div>
            <Title level={4} style={{ margin: 0, color: "#1e1b4b", fontWeight: 800, fontSize: 20 }}>
              Thống kê khảo sát việc làm
            </Title>
            <Text style={{ fontSize: 13, color: COLOR.textMuted }}>
              Chọn chỉ tiêu thống kê để hiển thị biểu đồ tương ứng
            </Text>
          </div>
        </div>
      </div>

      <div style={{
        background: "#fff",
        borderRadius: 14,
        border: "1px solid #e2e8f0",
        boxShadow: "0 1px 3px rgba(0,0,0,0.06), 0 4px 16px rgba(0,0,0,0.06)",
        overflow: "hidden",
      }}>
        <div style={{
          padding: "16px 20px",
          borderBottom: "1px solid #f1f5f9",
          display: "flex", alignItems: "center", gap: 8,
        }}>
          <div style={{ width: 3, height: 20, borderRadius: 99, background: COLOR.primary }} />
          <span style={{ fontSize: 18, fontWeight: 700, color: COLOR.textDark }}>
            {currentLabel}
          </span>
        </div>

        <DynamicFilterBar
          schema={REPORT_CHART_FILTER_SCHEMA}
          state={state as unknown as Record<string, string>}
          setField={setField}
          label="Chỉ tiêu thống kê:"
          labelColor={COLOR.textMuted}
        />

        <div style={{ padding: "16px 20px 20px" }}>
          <div style={{
            background: "#fafbfc",
            borderRadius: 12, padding: "14px 14px 10px",
            border: "1px solid #e2e8f0", minHeight: 360,
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 6 }}>
              <div style={{ width: 5, height: 5, borderRadius: "50%", background: COLOR.primary }} />
              <Text style={{ fontSize: 11, color: COLOR.textMuted, fontWeight: 600 }}>
                Dữ liệu chờ kết nối API · hiển thị cấu trúc biểu đồ tương ứng
              </Text>
            </div>
            <div ref={chartRef} style={{ height: 320 }} />
          </div>
        </div>
      </div>

      <style>{`
        .ant-select-selector { border-radius: 8px !important; }
      `}</style>
    </AdminLayout>
  );
}

export default Statistic;
