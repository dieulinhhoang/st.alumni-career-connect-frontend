import { useEffect, useRef, useState } from "react";
import { Col, Row, Select, Button, Typography } from "antd";
import { TableOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { Pie as G2Pie, Column as G2Column } from "@antv/g2plot";
import type { ChartMode } from "../../../feature/dashboard/type";
import {
  CHART_MODES, MODE_CONFIG, KHOA_OPTIONS, NGANH_BY_KHOA,
  getFilteredDotData, getLatestDot,
} from "../../../feature/dashboard/api";
import { COLOR } from "./theme";

const { Text } = Typography;

interface Props {
  chartMode: ChartMode;
  setChartMode: (v: ChartMode) => void;
  khoa: string;
  setKhoa: (v: string) => void;
  nganh: string;
  setNganh: (v: string) => void;
}

export function ChartSection({ chartMode, setChartMode, khoa, setKhoa, nganh, setNganh }: Props) {
  const navigate = useNavigate();
  const pieRef = useRef<HTMLDivElement>(null);
  const colRef = useRef<HTMLDivElement>(null);
  const pieInst = useRef<G2Pie | null>(null);
  const colInst = useRef<G2Column | null>(null);
  const [selectedSlice, setSelectedSlice] = useState<string | null>(null);

  const cfg = MODE_CONFIG[chartMode];
  const dotData = getFilteredDotData(khoa, nganh);
  const latestKey = getLatestDot(khoa, nganh);
  const latestDot = dotData[latestKey] ?? Object.values(dotData)[0];
  const nameColorMap = Object.fromEntries(
    cfg.getPieData(latestDot).map((d, i) => [d.name, cfg.colors[i % cfg.colors.length]])
  );

  useEffect(() => {
    if (!pieRef.current || !colRef.current) return;

    try { pieInst.current?.destroy(); } catch (_) {}
    try { colInst.current?.destroy(); } catch (_) {}
    pieInst.current = null;
    colInst.current = null;
    setSelectedSlice(null);

    const currentCfg = MODE_CONFIG[chartMode];
    const currentDotData = getFilteredDotData(khoa, nganh);
    const currentLatestKey = getLatestDot(khoa, nganh);
    const latest = currentDotData[currentLatestKey] ?? Object.values(currentDotData)[0];
    const currentPieData = currentCfg.getPieData(latest);
    const currentColorMap = Object.fromEntries(
      currentPieData.map((d, i) => [d.name, currentCfg.colors[i % currentCfg.colors.length]])
    );

    const currentAllColData = Object.entries(currentDotData).flatMap(([dot, v]) =>
      currentCfg.getPieData(v).map(({ name, value }) => ({ dot, type: name, value }))
    );

    if (!pieRef.current || !colRef.current) return;

    const pie = new G2Pie(pieRef.current, {
      data: currentPieData,
      angleField: "value", colorField: "name",
      radius: 0.92, innerRadius: 0.6,
      color: currentCfg.colors,
      pieStyle: { lineWidth: 3, stroke: "#fff" },
      label: {
        type: "outer", offset: 12,
        content: ({ percent }: any) => `${(percent * 100).toFixed(0)}%`,
        style: { fontSize: 12, fontWeight: 700, fill: "#374151" },
      },
      legend: { position: "bottom", flipPage: false, itemName: { style: { fontSize: 12 } } },
      statistic: {
        title: { style: { color: COLOR.textFaint, fontWeight: 600 }, content: currentLatestKey },
        content: { style: { fontWeight: 900, color: COLOR.textDark } },
      },
      interactions: [{ type: "element-active" }, { type: "pie-statistic-active" }],
      tooltip: { formatter: (d: any) => ({ name: d.name, value: `${d.value} SV` }) },
    });
    pie.render();
    pieInst.current = pie;

    const maxVal = Math.max(...currentAllColData.map(d => d.value));

    const col = new G2Column(colRef.current, {
      data: currentAllColData,
      xField: "dot", yField: "value", seriesField: "type",
      isGroup: true,
      color: ({ type }: any) => currentColorMap[type] ?? COLOR.primary,
      columnStyle: ({ type }: any) => ({
        radius: [6, 6, 0, 0], fillOpacity: 0.9,
        shadowColor: (currentColorMap[type] ?? COLOR.primary) + "44",
        shadowBlur: 4, shadowOffsetY: 2,
      }),
      maxColumnWidth: 28,
      yAxis: {
        label: { formatter: (v: string) => v + " SV", style: { fill: COLOR.textFaint, fontSize: 11 } },
        grid: { line: { style: { stroke: "#f1f5f9", lineWidth: 1, lineDash: [4, 4] } } },
        max: Math.ceil(maxVal * 1.15),
      },
      xAxis: { label: { style: { fontWeight: 700, fill: "#374151", fontSize: 12 } } },
      legend: { position: "bottom", flipPage: false, itemName: { style: { fontSize: 12 } } },
      label: {
        position: "top",
        style: { fontSize: 11, fill: "#374151", fontWeight: 600 },
        formatter: (d: any) => d.value > 0 ? d.value + " SV" : "",
      },
      tooltip: { formatter: (d: any) => ({ name: d.type, value: d.value + " SV" }) },
      interactions: [{ type: "element-highlight" }],
    });
    col.render();
    colInst.current = col;

    pie.on("element:click", (evt: any) => {
      const name: string = evt?.data?.data?.name;
      if (!name) return;
      setSelectedSlice(prev => {
        const next = prev === name ? null : name;
        colInst.current?.changeData(
          next ? currentAllColData.filter(d => d.type === next) : currentAllColData
        );
        return next;
      });
    });

    return () => {
      try { pieInst.current?.destroy(); } catch (_) {}
      try { colInst.current?.destroy(); } catch (_) {}
      pieInst.current = null;
      colInst.current = null;
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chartMode, khoa, nganh]);

  const handleClearSlice = () => {
    setSelectedSlice(null);
    const currentDotData = getFilteredDotData(khoa, nganh);
    const allColData = Object.entries(currentDotData).flatMap(([dot, v]) =>
      MODE_CONFIG[chartMode].getPieData(v).map(({ name, value }) => ({ dot, type: name, value }))
    );
    colInst.current?.changeData(allColData);
  };

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
            <span style={{ fontSize: 14, fontWeight: 700, color: COLOR.textDark }}>
              Thống kê việc làm theo đợt tốt nghiệp
            </span>
          </div>
          <Text style={{ fontSize: 12, color: COLOR.textFaint, marginLeft: 11 }}>
            Hiển thị tỷ lệ % — so sánh qua các đợt
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

      {/* Filters */}
      <div style={{
        padding: "10px 20px",
        background: "#f8fafc",
        borderBottom: "1px solid #f1f5f9",
        display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center",
      }}>
        <Text style={{ fontSize: 12, color: COLOR.textMuted, fontWeight: 600, flexShrink: 0 }}>Lọc theo:</Text>
        <Select value={khoa} onChange={setKhoa} style={{ width: 160 }} size="small">
          {KHOA_OPTIONS.map(o => (
            <Select.Option key={o.value} value={o.value}>{o.label}</Select.Option>
          ))}
        </Select>
        <Select value={nganh} onChange={setNganh} style={{ width: 180 }} size="small">
          {(NGANH_BY_KHOA[khoa] ?? NGANH_BY_KHOA.all).map(o => (
            <Select.Option key={o.value} value={o.value}>{o.label}</Select.Option>
          ))}
        </Select>
        <div style={{ marginLeft: "auto" }}>
          <Select
            value={chartMode}
            onChange={v => setChartMode(v as ChartMode)}
            style={{ width: 270 }}
            size="small"
          >
            {CHART_MODES.map(m => (
              <Select.Option key={m.value} value={m.value}>{m.label}</Select.Option>
            ))}
          </Select>
        </div>
      </div>

      {/* Charts */}
      <div style={{ padding: "16px 20px 20px" }}>
        {/* Active filter banner */}
        {selectedSlice && (
          <div style={{
            display: "flex", alignItems: "center", justifyContent: "space-between",
            background: `${COLOR.primary}08`,
            border: `1px solid ${COLOR.primary}25`,
            borderRadius: 8, padding: "8px 14px", marginBottom: 14,
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: nameColorMap[selectedSlice] }} />
              <Text style={{ fontSize: 12, color: COLOR.primary, fontWeight: 600 }}>
                Đang lọc: <strong>{selectedSlice}</strong>
              </Text>
            </div>
            <button
              onClick={handleClearSlice}
              style={{
                background: "none", border: "none", cursor: "pointer",
                fontSize: 12, color: COLOR.primary, fontWeight: 700,
                padding: "2px 8px", borderRadius: 6,
              }}
            >
              ✕ Xoá bộ lọc
            </button>
          </div>
        )}

        <Row gutter={[16, 16]}>
          <Col xs={24} lg={8}>
            <div style={{
              background: "#fafbfc",
              borderRadius: 12, padding: "14px 14px 10px",
              border: "1px solid #e2e8f0", minHeight: 320,
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 6 }}>
                <div style={{ width: 5, height: 5, borderRadius: "50%", background: COLOR.primary }} />
                <Text style={{ fontSize: 11, color: COLOR.textMuted, fontWeight: 600 }}>
                  Đợt mới nhất · {latestKey}
                </Text>
              </div>
              <div ref={pieRef} style={{ height: 280 }} />
            </div>
          </Col>

          <Col xs={24} lg={16}>
            <div style={{
              background: "#fafbfc",
              borderRadius: 12, padding: "14px 14px 10px",
              border: "1px solid #e2e8f0", minHeight: 320,
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 6 }}>
                <div style={{ width: 5, height: 5, borderRadius: "50%", background: COLOR.primary }} />
                <Text style={{ fontSize: 11, color: COLOR.textMuted, fontWeight: 600 }}>
                  Số lượng theo từng đợt khảo sát
                  {selectedSlice && (
                    <span style={{
                      marginLeft: 8, fontSize: 10,
                      background: nameColorMap[selectedSlice] + "18",
                      color: nameColorMap[selectedSlice],
                      border: `1px solid ${nameColorMap[selectedSlice]}35`,
                      padding: "1px 8px", borderRadius: 100,
                    }}>
                      {selectedSlice}
                    </span>
                  )}
                </Text>
              </div>
              <div ref={colRef} style={{ height: 280 }} />
            </div>
          </Col>
        </Row>
      </div>
    </div>
  );
}