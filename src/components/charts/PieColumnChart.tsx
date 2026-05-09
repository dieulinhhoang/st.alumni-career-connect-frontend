import { useEffect, useMemo, useRef, useState } from 'react'
import { Col, Row, Typography } from 'antd'
import { Pie as G2Pie, Column as G2Column } from '@antv/g2plot'
import { COLOR } from '../../pages/admin/DashBoard/theme'

const { Text } = Typography

export const CHART_COLORS = [
  '#6366f1',
  '#06b6d4',
  '#10b981',
  '#f59e0b',
  '#f43f5e',
  '#8b5cf6',
  '#ec4899',
]

export interface PieColumnChartData {
  name: string
  value: number
}

export interface PieColumnChartProps {
  pieData: PieColumnChartData[]
  dotData?: Record<string, PieColumnChartData[]>
  /**
   * Label shown in the donut centre and as the pie sub-label.
   * In the dashboard this is the question label (e.g. "Tình trạng việc làm").
   * In the statistics page this is the question title.
   */
  latestKey: string
  /**
   * Label shown above the pie chart (left column header).
   * Defaults to "Latest batch".
   */
  pieLabel?: string
  /**
   * Label shown above the column chart (right column header).
   * Defaults to "Count by survey batch".
   */
  columnLabel?: string
}

export function PieColumnChart({
  pieData,
  dotData,
  latestKey,
  pieLabel = 'Latest batch',
  columnLabel = 'Count by survey batch',
}: PieColumnChartProps) {
  const pieRef = useRef<HTMLDivElement>(null)
  const colRef = useRef<HTMLDivElement>(null)
  const pieInst = useRef<G2Pie | null>(null)
  const colInst = useRef<G2Column | null>(null)
  const [selectedSlice, setSelectedSlice] = useState<string | null>(null)

  const nameColorMap = useMemo(
    () =>
      Object.fromEntries(
        pieData.map((d, i) => [d.name, CHART_COLORS[i % CHART_COLORS.length]]),
      ),
    [pieData],
  )

  useEffect(() => {
    if (!pieRef.current || !colRef.current) return

    try { pieInst.current?.destroy() } catch (_) {}
    try { colInst.current?.destroy() } catch (_) {}
    pieInst.current = null
    colInst.current = null
    setSelectedSlice(null)

    if (!pieData || pieData.length === 0) return

    const colorMap = Object.fromEntries(
      pieData.map((d, i) => [d.name, CHART_COLORS[i % CHART_COLORS.length]]),
    )

    const rawDotData = dotData ?? { [latestKey]: pieData }
    const colData = Object.entries(rawDotData).flatMap(([dot, items]) =>
      items.map(({ name, value }) => ({ dot, type: name, value })),
    )

    const pie = new G2Pie(pieRef.current, {
      data: pieData,
      angleField: 'value',
      colorField: 'name',
      radius: 0.92,
      innerRadius: 0.6,
      color: CHART_COLORS,
      pieStyle: { lineWidth: 3, stroke: '#fff' },
      label: {
        type: 'outer',
        offset: 12,
        content: ({ percent }: any) => `${(percent * 100).toFixed(0)}%`,
        style: { fontSize: 12, fontWeight: 700, fill: '#374151' },
      },
      legend: {
        position: 'bottom',
        flipPage: false,
        itemName: { style: { fontSize: 10 } },
      },
      statistic: {
        title: {
          style: {
            color: COLOR.textFaint,
            fontWeight: 400,
            fontSize: 11,
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            maxWidth: '120px',
          },
          content: latestKey,
        },
        content: {
          style: {
            fontWeight: 900,
            color: COLOR.textDark,
            fontSize: 22,
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            maxWidth: '120px',
          },
        },
      },
      interactions: [{ type: 'element-active' }, { type: 'pie-statistic-active' }],
      tooltip: {
        formatter: (d: any) => ({ name: d.name, value: `${d.value} SV` }),
      },
    })

    pie.render()
    pieInst.current = pie

    const maxVal = Math.max(...colData.map((d) => d.value), 1)

    const col = new G2Column(colRef.current, {
      data: colData,
      xField: 'dot',
      yField: 'value',
      seriesField: 'type',
      isGroup: true,
      color: ({ type }: any) => colorMap[type] ?? COLOR.primary,
      columnStyle: ({ type }: any) => ({
        radius: [6, 6, 0, 0],
        fillOpacity: 0.9,
        shadowColor: (colorMap[type] ?? COLOR.primary) + '44',
        shadowBlur: 4,
        shadowOffsetY: 2,
      }),
      maxColumnWidth: 28,
      yAxis: {
        label: {
          formatter: (v: string) => `${v} SV`,
          style: { fill: COLOR.textFaint, fontSize: 11 },
        },
        grid: {
          line: {
            style: { stroke: '#f1f5f9', lineWidth: 1, lineDash: [4, 4] },
          },
        },
        max: Math.ceil(maxVal * 1.15),
      },
      xAxis: {
        label: {
          style: { fontWeight: 700, fill: '#374151', fontSize: 12 },
        },
      },
      legend: {
        position: 'bottom',
        flipPage: false,
        itemName: { style: { fontSize: 12 } },
      },
      label: {
        position: 'top',
        style: { fontSize: 11, fill: '#374151', fontWeight: 600 },
        formatter: (d: any) => (d.value > 0 ? `${d.value} SV` : ''),
      },
      tooltip: {
        formatter: (d: any) => ({ name: d.type, value: `${d.value} SV` }),
      },
      interactions: [{ type: 'element-highlight' }],
    })

    col.render()
    colInst.current = col

    pie.on('element:click', (evt: any) => {
      const name: string = evt?.data?.data?.name
      if (!name) return
      setSelectedSlice((prev) => {
        const next = prev === name ? null : name
        colInst.current?.changeData(
          next ? colData.filter((d) => d.type === next) : colData,
        )
        return next
      })
    })

    return () => {
      try { pieInst.current?.destroy() } catch (_) {}
      try { colInst.current?.destroy() } catch (_) {}
      pieInst.current = null
      colInst.current = null
    }
  }, [pieData, dotData, latestKey])

  const handleClearSlice = () => {
    setSelectedSlice(null)
    const rawDotData = dotData ?? { [latestKey]: pieData }
    const colData = Object.entries(rawDotData).flatMap(([dot, items]) =>
      items.map(({ name, value }) => ({ dot, type: name, value })),
    )
    colInst.current?.changeData(colData)
  }

  return (
    <>
      {selectedSlice && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: `${COLOR.primary}08`,
            border: `1px solid ${COLOR.primary}25`,
            borderRadius: 8,
            padding: '8px 14px',
            marginBottom: 14,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div
              style={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                background: nameColorMap[selectedSlice],
              }}
            />
            <Text style={{ fontSize: 12, color: COLOR.primary, fontWeight: 600 }}>
              Bộ lọc : <strong>{selectedSlice}</strong>
            </Text>
          </div>
          <button
            onClick={handleClearSlice}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              fontSize: 12,
              color: COLOR.primary,
              fontWeight: 700,
              padding: '2px 8px',
              borderRadius: 6,
            }}
          >
            ✕ 
          </button>
        </div>
      )}

      <Row gutter={[16, 16]}>
        <Col xs={24} lg={8}>
          <div
            style={{
              background: '#fafbfc',
              borderRadius: 12,
              padding: '14px 14px 10px',
              border: '1px solid #e2e8f0',
              minHeight: 320,
            }}
          >
            {pieLabel && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
                <div
                  style={{
                    width: 5,
                    height: 5,
                    borderRadius: '50%',
                    background: COLOR.primary,
                  }}
                />
                <Text style={{ fontSize: 11, color: COLOR.textMuted, fontWeight: 600 }}>
                  {pieLabel}
                </Text>
              </div>
            )}
            <div ref={pieRef} style={{ height: 280 }} />
          </div>
        </Col>

        <Col xs={24} lg={16}>
          <div
            style={{
              background: '#fafbfc',
              borderRadius: 12,
              padding: '14px 14px 10px',
              border: '1px solid #e2e8f0',
              minHeight: 320,
            }}
          >
            {columnLabel && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
                <div
                  style={{
                    width: 5,
                    height: 5,
                    borderRadius: '50%',
                    background: COLOR.primary,
                  }}
                />
                <Text style={{ fontSize: 11, color: COLOR.textMuted, fontWeight: 600 }}>
                  {columnLabel}
                  {selectedSlice && (
                    <span
                      style={{
                        marginLeft: 8,
                        fontSize: 10,
                        background: nameColorMap[selectedSlice] + '18',
                        color: nameColorMap[selectedSlice],
                        border: `1px solid ${nameColorMap[selectedSlice]}35`,
                        padding: '1px 8px',
                        borderRadius: 100,
                      }}
                    >
                      {selectedSlice}
                    </span>
                  )}
                </Text>
              </div>
            )}
            <div ref={colRef} style={{ height: 280 }} />
          </div>
        </Col>
      </Row>
    </>
  )
}
