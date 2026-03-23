import { useEffect, useRef, useState } from "react";
import { Col, Row, Select, Button, Typography } from "antd";
import { TableOutlined } from "@ant-design/icons";
import { Pie as G2Pie, Column as G2Column } from "@antv/g2plot";
import type { ChartMode } from "../../../feature/dashboard/type";
import {
  CHART_MODES, MODE_CONFIG, KHOA_OPTIONS, NGANH_BY_KHOA,
  getFilteredDotData, LATEST_DOT, getLatestDot,
} from "../../../feature/dashboard/api";

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
  const pieRef = useRef<HTMLDivElement>(null);
  const colRef = useRef<HTMLDivElement>(null);
  const pieInst = useRef<G2Pie | null>(null);
  const colInst = useRef<G2Column | null>(null);
  const [selectedSlice, setSelectedSlice] = useState<string | null>(null);

  // nameColorMap for JSX badge colors
  const cfg = MODE_CONFIG[chartMode];
  const latestDot = getFilteredDotData(khoa, nganh)[LATEST_DOT] ?? Object.values(getFilteredDotData(khoa, nganh))[0];
  const nameColorMap = Object.fromEntries(cfg.getPieData(latestDot).map((d, i) => [d.name, cfg.colors[i % cfg.colors.length]]));

  useEffect(() => {
    if (!pieRef.current || !colRef.current) return;

    const prevPie = pieInst.current;
    const prevCol = colInst.current;
    pieInst.current = null;
    colInst.current = null;
    setTimeout(() => {
      try { prevPie?.destroy(); } catch (_) {}
      try { prevCol?.destroy(); } catch (_) {}
    }, 0);

    setSelectedSlice(null);

    const currentCfg = MODE_CONFIG[chartMode];
    const dotData = getFilteredDotData(khoa, nganh);
    const latestKey = getLatestDot(khoa, nganh);
    const latest = dotData[latestKey] ?? Object.values(dotData)[0];
    const currentPieData = currentCfg.getPieData(latest);
    const currentColorMap = Object.fromEntries(currentPieData.map((d, i) => [d.name, currentCfg.colors[i % currentCfg.colors.length]]));
    const currentAllColData = Object.entries(dotData).flatMap(([dot, v]) => {
      const total = v.coViec + v.chuaCoViec || 1;
      return currentCfg.getPieData(v).map(({ name, value }) => ({
        dot, type: name, value: value,
      }));
    });

    if (!pieRef.current || !colRef.current) return;

    // Pie
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
        title: { style: { color: "#94a3b8", fontWeight: 600 }, content: getLatestDot(khoa, nganh) },
        content: { style: {   fontWeight: 900, color: "#0f172a" } },
      },
      interactions: [{ type: "element-active" }, { type: "pie-statistic-active" }],
      tooltip: { formatter: (d: any) => ({ name: d.name, value: `${d.value} SV` }) },
    });
    pie.render();
    pieInst.current = pie;
    const maxVal = Math.max(...currentAllColData.map(d => d.value));

    // Column
    const col = new G2Column(colRef.current, {
      data: currentAllColData,
      xField: "dot", yField: "value", seriesField: "type",
      isGroup: true,
      color: ({ type }: any) => currentColorMap[type] ?? "#6366f1",
      columnStyle: ({ type }: any) => ({
        radius: [8, 8, 0, 0], fillOpacity: 0.92,
        shadowColor: (currentColorMap[type] ?? "#6366f1") + "55",
        shadowBlur: 6, shadowOffsetY: 3,
      }),
      maxColumnWidth: 32,
      yAxis: {
        label: { formatter: (v: string) => v + " SV", style: { fill: "#94a3b8", fontSize: 11 } },
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
        colInst.current?.changeData(next
          ? currentAllColData.filter(d => d.type === next)
          : currentAllColData
        );
        return next;
      });
    });

    return () => {
      const p = pieInst.current;
      const c = colInst.current;
      pieInst.current = null;
      colInst.current = null;
      setTimeout(() => {
        try { p?.destroy(); } catch (_) {}
        try { c?.destroy(); } catch (_) {}
      }, 0);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chartMode, khoa, nganh]);

  return (
    <div style={{
      background: "#fff", borderRadius: 16,
      border: "1px solid #f1f5f9",
      boxShadow: "0 1px 4px rgba(0,0,0,0.05), 0 4px 16px rgba(0,0,0,0.04)",
      overflow: "hidden",
    }}>
      {/* Header */}
      <div style={{
        padding: "16px 20px", borderBottom: "1px solid #f8fafc",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        flexWrap: "wrap", gap: 12,
      }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 2 }}>
            <div style={{ width: 3, height: 18, borderRadius: 99, background: "#6366f1" }} />
            <span style={{ fontSize: 15, fontWeight: 700, color: "#0f172a" }}>Thống kê việc làm theo đợt tốt nghiệp</span>
          </div>
          <Text style={{ fontSize: 12, color: "#94a3b8", marginLeft: 11 }}>Hiển thị tỷ lệ % — so sánh qua các đợt</Text>
        </div>
        <Button icon={<TableOutlined />} style={{ borderRadius: 8, fontWeight: 600, fontSize: 12, height: 34 }}>
          Xem chi tiết
        </Button>
      </div>

      {/* Filters */}
      <div style={{
        padding: "12px 20px", background: "#fafbfc", borderBottom: "1px solid #f1f5f9",
        display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center",
      }}>
        <Text style={{ fontSize: 12, color: "#64748b", fontWeight: 600 }}>Lọc theo:</Text>
        <Select value={khoa} onChange={setKhoa} style={{ width: 160, borderRadius: 20 }} size="small">
          {KHOA_OPTIONS.map(o => <Select.Option key={o.value} value={o.value}>{o.label}</Select.Option>)}
        </Select>
        <Select value={nganh} onChange={setNganh} style={{ width: 180, borderRadius: 20 }} size="small">
          {(NGANH_BY_KHOA[khoa] ?? NGANH_BY_KHOA.all).map(o => (
            <Select.Option key={o.value} value={o.value}>{o.label}</Select.Option>
          ))}
        </Select>
        <div style={{ marginLeft: "auto" }}>
          <Select value={chartMode} onChange={v => setChartMode(v as ChartMode)} style={{ width: 270, borderRadius: 20 }} size="small">
            {CHART_MODES.map(m => <Select.Option key={m.value} value={m.value}>{m.label}</Select.Option>)}
          </Select>
        </div>
      </div>

      {/* Charts */}
      <div style={{ padding: "16px 20px 20px" }}>
        {/* Active filter banner */}
        {selectedSlice && (
          <div style={{
            display: "flex", alignItems: "center", justifyContent: "space-between",
            background: "#eef2ff", border: "1px solid #c7d2fe",
            borderRadius: 10, padding: "8px 14px", marginBottom: 14,
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: nameColorMap[selectedSlice] }} />
              <Text style={{ fontSize: 12, color: "#4338ca", fontWeight: 600 }}>
                Đang lọc: <strong>{selectedSlice}</strong>
              </Text>
            </div>
            <button onClick={() => {
              setSelectedSlice(null);
              const dotData = getFilteredDotData(khoa, nganh);
              const allColData = Object.entries(dotData).flatMap(([dot, v]) => {
                const total = v.coViec + v.chuaCoViec || 1;
                return MODE_CONFIG[chartMode].getPieData(v).map(({ name, value }) => ({
                  dot, type: name, value: value,
                }));
              });
              colInst.current?.changeData(allColData);
            }} style={{
              background: "none", border: "none", cursor: "pointer",
              fontSize: 12, color: "#6366f1", fontWeight: 700, padding: "2px 8px", borderRadius: 6,
            }}>
              ✕ Xoá bộ lọc
            </button>
          </div>
        )}

        <Row gutter={[16, 16]}>
          <Col xs={24} lg={8}>
            <div style={{
              background: "linear-gradient(145deg, #fafbff 0%, #f8fafc 100%)",
              borderRadius: 14, padding: "14px 14px 10px",
              border: "1px solid #ede9fe", minHeight: 320,
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 6 }}>
                <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#6366f1" }} />
                <Text style={{ fontSize: 11, color: "#64748b", fontWeight: 600 }}>Đợt mới nhất · {getLatestDot(khoa, nganh)}</Text>
              </div>
              <div ref={pieRef} style={{ height: 280 }} />
            </div>
          </Col>
          <Col xs={24} lg={16}>
            <div style={{
              background: "linear-gradient(145deg, #fafbff 0%, #f8fafc 100%)",
              borderRadius: 14, padding: "14px 14px 10px",
              border: "1px solid #ede9fe", minHeight: 320,
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 6 }}>
                <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#6366f1" }} />
                <Text style={{ fontSize: 11, color: "#64748b", fontWeight: 600 }}>
                    Số lượng theo từng đợt khảo sát
                  {selectedSlice && (
                    <span style={{
                      marginLeft: 8, fontSize: 10,
                      background: nameColorMap[selectedSlice] + "20",
                      color: nameColorMap[selectedSlice],
                      border: `1px solid ${nameColorMap[selectedSlice]}40`,
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