import { useEffect, useMemo, useRef, useState } from "react";
import { Col, Row, Button, Select, Spin, Typography, Empty } from "antd";
import { TableOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { Pie as G2Pie, Column as G2Column } from "@antv/g2plot";
import {
  getChartByQuestionId,
  getStatisticalQuestions,
} from "../../../feature/dashboard/statisticalQuestionApi";
import type {
  ChartResult,
  StatisticalQuestion,
} from "../../../feature/dashboard/statisticalQuestion";
import { COLOR } from "./theme";

const { Text } = Typography;

const PIE_COLORS = ["#6366f1", "#06b6d4", "#10b981", "#f59e0b", "#f43f5e", "#8b5cf6", "#ec4899"];
const COLUMN_COLORS = ["#6366f1", "#06b6d4", "#10b981", "#f59e0b", "#f43f5e", "#8b5cf6", "#ec4899"];

export function ChartSection() {
  const navigate = useNavigate();
  const chartRef = useRef<HTMLDivElement>(null);
  const instRef = useRef<G2Pie | G2Column | null>(null);

  const [questions, setQuestions] = useState<StatisticalQuestion[]>([]);
  const [questionId, setQuestionId] = useState<string | null>(null);
  const [chart, setChart] = useState<ChartResult | null>(null);
  const [loadingQuestions, setLoadingQuestions] = useState(true);
  const [loadingChart, setLoadingChart] = useState(false);

  // MOCK: load question list (replace with real API later)
  useEffect(() => {
    let cancelled = false;
    Promise.resolve().then(() => {
      if (cancelled) return;
      return getStatisticalQuestions().then(list => {
        if (cancelled) return;
        setQuestions(list);
        setQuestionId(prev => prev ?? list[0]?.questionId ?? null);
        setLoadingQuestions(false);
      });
    });
    return () => { cancelled = true; };
  }, []);

  // MOCK: load chart for selected question (replace with real API later)
  useEffect(() => {
    let cancelled = false;
    if (!questionId) {
      Promise.resolve().then(() => { if (!cancelled) setChart(null); });
      return () => { cancelled = true; };
    }
    Promise.resolve().then(() => {
      if (cancelled) return;
      setLoadingChart(true);
      return getChartByQuestionId(questionId).then(res => {
        if (cancelled) return;
        setChart(res);
        setLoadingChart(false);
      });
    });
    return () => { cancelled = true; };
  }, [questionId]);

  const currentQuestion = useMemo(
    () => questions.find(q => q.questionId === questionId) ?? null,
    [questions, questionId],
  );

  // Render g2plot chart whenever the chart payload changes
  useEffect(() => {
    if (!chartRef.current || !chart) return;

    try { instRef.current?.destroy(); } catch { /* already disposed */ }
    instRef.current = null;

    if (chart.chartType === "pie") {
      const pie = new G2Pie(chartRef.current, {
        data: chart.data,
        angleField: "value",
        colorField: "name",
        radius: 0.92,
        innerRadius: 0.6,
        color: PIE_COLORS,
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
        statistic: {
          title: { style: { color: COLOR.textFaint, fontWeight: 600 }, content: "Tổng" },
          content: {
            style: { fontWeight: 900, color: COLOR.textDark },
            content: chart.totalResponses != null ? String(chart.totalResponses) : "",
          },
        },
        interactions: [{ type: "element-active" }, { type: "pie-statistic-active" }],
        tooltip: {
          formatter: (d: { name: string; value: number }) => ({
            name: d.name,
            value: `${d.value} SV`,
          }),
        },
      });
      pie.render();
      instRef.current = pie;
    } else {
      const maxVal = Math.max(0, ...chart.data.map(d => d.value));
      const col = new G2Column(chartRef.current, {
        data: chart.data,
        xField: "name",
        yField: "value",
        color: ({ name }: { name: string }) => {
          const idx = chart.data.findIndex(d => d.name === name);
          return COLUMN_COLORS[idx % COLUMN_COLORS.length];
        },
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
          grid: { line: { style: { stroke: "#f1f5f9", lineWidth: 1, lineDash: [4, 4] } } },
          max: Math.ceil(maxVal * 1.15) || undefined,
        },
        xAxis: {
          label: { style: { fontWeight: 600, fill: "#374151", fontSize: 12 } },
        },
        legend: false,
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
        interactions: [{ type: "element-highlight" }],
      });
      col.render();
      instRef.current = col;
    }

    return () => {
      try { instRef.current?.destroy(); } catch { /* already disposed */ }
      instRef.current = null;
    };
  }, [chart]);

  const headerTitle = currentQuestion?.title ?? "Biểu đồ thống kê khảo sát";

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
        <div style={{ minWidth: 0, flex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 3 }}>
            <div style={{ width: 3, height: 20, borderRadius: 99, background: COLOR.primary }} />
            <span style={{
              fontSize: 18, fontWeight: 700, color: COLOR.textDark,
              overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
            }}>
              {headerTitle}
            </span>
          </div>
          <Text style={{ fontSize: 12, color: COLOR.textFaint, marginLeft: 11 }}>
            Chọn câu hỏi khảo sát (đã đánh dấu thống kê) để hiển thị biểu đồ
          </Text>
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

      {/* Question selector */}
      <div style={{
        padding: "10px 20px",
        background: "#f8fafc",
        borderBottom: "1px solid #f1f5f9",
        display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center",
      }}>
        <Text style={{ fontSize: 12, color: COLOR.textMuted, fontWeight: 600, flexShrink: 0 }}>
          Câu hỏi thống kê:
        </Text>
        <Select
          value={questionId ?? undefined}
          onChange={v => setQuestionId(v as string)}
          loading={loadingQuestions}
          placeholder="Chọn câu hỏi"
          size="small"
          style={{ minWidth: 320, maxWidth: "100%" }}
          options={questions.map(q => ({ value: q.questionId, label: q.label }))}
        />
        {currentQuestion && (
          <Text style={{ fontSize: 11, color: COLOR.textFaint }}>
            Loại: {currentQuestion.questionType} · Biểu đồ: {currentQuestion.chartType}
          </Text>
        )}
      </div>

      {/* Chart */}
      <div style={{ padding: "16px 20px 20px" }}>
        <Row gutter={[16, 16]}>
          <Col xs={24}>
            <div style={{
              background: "#fafbfc",
              borderRadius: 12, padding: "14px 14px 10px",
              border: "1px solid #e2e8f0", minHeight: 360,
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 6 }}>
                <div style={{ width: 5, height: 5, borderRadius: "50%", background: COLOR.primary }} />
                <Text style={{ fontSize: 11, color: COLOR.textMuted, fontWeight: 600 }}>
                  {chart?.totalResponses != null
                    ? `Tổng phản hồi: ${chart.totalResponses} SV`
                    : "Dữ liệu thống kê theo câu hỏi"}
                  <span style={{ marginLeft: 8, color: "#f59e0b", fontWeight: 700 }}>
                    · Dữ liệu mẫu (chờ kết nối API)
                  </span>
                </Text>
              </div>
              {loadingChart ? (
                <div style={{ height: 320, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Spin />
                </div>
              ) : chart ? (
                <div ref={chartRef} style={{ height: 320 }} />
              ) : (
                <div style={{ height: 320, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Empty description="Chưa có dữ liệu cho câu hỏi này" />
                </div>
              )}
            </div>
          </Col>
        </Row>
      </div>
    </div>
  );
}
