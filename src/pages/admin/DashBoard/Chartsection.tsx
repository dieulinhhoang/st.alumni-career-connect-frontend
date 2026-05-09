import { useEffect, useMemo, useState } from "react";
import { Button, Typography } from "antd";
import { TableOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import {
  CHART_FILTER_SCHEMA,
  type ChartFilterState,
  type FilterFieldSchema,
} from "../../../feature/dashboard/filterSchema";
import { DynamicFilterBar } from "../../../feature/dashboard/DynamicFilterBar";
import {
  getChartByQuestionId,
  getStatisticalQuestions,
} from "../../../feature/dashboard/statisticalQuestionApi";
import type {
  ChartResult,
  StatisticalQuestion,
} from "../../../feature/dashboard/statisticalQuestion";
import { COLOR } from "./theme";
import { PieColumnChart } from "../../../components/charts/PieColumnChart";

const { Text } = Typography;

interface Props {
  state: ChartFilterState;
  setField: (key: string, value: string) => void;
}

export function ChartSection({ state, setField }: Props) {
  const { khoa, nganh, chartMode } = state;
  const navigate = useNavigate();
  const [questions, setQuestions] = useState<StatisticalQuestion[]>([]);
  const [chart, setChart] = useState<ChartResult | null>(null);

  const questionId = chartMode;

  useEffect(() => {
    let cancelled = false;
    getStatisticalQuestions().then(list => {
      if (cancelled) return;
      setQuestions(list);
      const isKnown = list.some(q => q.questionId === chartMode);
      if (!isKnown && list[0]) setField("chartMode", list[0].questionId);
    });
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    let cancelled = false;
    if (!questionId) {
      setChart(null);
      return;
    }
    getChartByQuestionId(questionId).then(res => {
      if (cancelled) return;
      setChart(res);
    });
    return () => { cancelled = true; };
  }, [questionId, khoa, nganh]);

  const dynamicSchema = useMemo<FilterFieldSchema[]>(() => {
    const opts = questions.length
      ? questions.map(q => ({ value: q.questionId, label: q.label }))
      : [{ value: questionId, label: "Loading…" }];
    return CHART_FILTER_SCHEMA.map(f =>
      f.key === "chartMode"
        ? { ...f, getOptions: () => opts }
        : f,
    );
  }, [questions, questionId]);

  const pieData = chart?.data ?? [];

  const currentQuestion = useMemo(
    () => questions.find(x => x.questionId === questionId),
    [questions, questionId],
  );

  const latestKey = currentQuestion?.label ?? "—";
  const pieLabel = currentQuestion
    ? `Latest batch · ${currentQuestion.label}`
    : "Latest batch";
  const columnLabel = "Count by survey batch";

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
              Student statistics by survey batch
            </span>
          </div>
          <Text style={{ fontSize: 12, color: COLOR.textFaint, marginLeft: 11 }}>
            Percentage distribution — comparison across batches
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
          View details
        </Button>
      </div>

      {/* Filters */}
      <DynamicFilterBar
        schema={dynamicSchema}
        state={state as unknown as Record<string, string>}
        setField={setField}
        label="Filter by:"
        labelColor={COLOR.textMuted}
      />

      {/* Charts */}
      <div style={{ padding: "16px 20px 20px" }}>
        <PieColumnChart
          pieData={pieData}
          dotData={chart?.dotData}
          latestKey={latestKey}
          pieLabel={pieLabel}
          columnLabel={columnLabel}
        />
      </div>
    </div>
  );
}
