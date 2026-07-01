import { useEffect, useMemo, useRef, useState } from 'react'
import { Col, Row, Typography } from 'antd'
import { Pie as G2Pie, Column as G2Column } from '@antv/g2plot'
import { COLOR } from '../../pages/system/DashBoard/theme'

const { Text } = Typography

export const CHART_COLORS = [
  '#0dac64', // VNUA green đậm
  '#f59e0b', // vàng cam
  '#457be6', // blue
  '#e9480e', // cam đậm
  '#60a5fa', // blue
  '#06b6d4', // cyan
  '#f43f5e', // rose
]

export interface PieColumnChartData {
  name: string
  value: number
}

export interface PieColumnChartProps {
  pieData: PieColumnChartData[]
  dotData?: Record<string, PieColumnChartData[]>
  /** Label hiển thị giữa donut và sub-label của pie */
  latestKey: string
  /** Label tiêu đề phía trên biểu đồ tròn */
  pieLabel?: string
  /** Label tiêu đề phía trên biểu đồ cột */
  columnLabel?: string
}

export function PieColumnChart({
  pieData,
  dotData,
  latestKey,
  pieLabel = 'Đợt mới nhất',
  columnLabel = 'Số lượng theo đợt khảo sát',
}: PieColumnChartProps) {
  const pieRef = useRef<HTMLDivElement>(null)
  const colRef = useRef<HTMLDivElement>(null)
  const pieInst = useRef<G2Pie | null>(null)
  const colInst = useRef<G2Column | null>(null)
  const [selectedSlice, setSelectedSlice] = useState<string | null>(null)
  // Ref phản chiếu selectedSlice để đọc giá trị hiện tại trong event handler
  // mà không cần đưa selectedSlice vào deps của effect (tránh rebuild chart).
  const selectedRef = useRef<string | null>(null)

  // Pie chỉ có ý nghĩa khi tổng giá trị > 0. Nếu đợt mới nhất chưa có số liệu
  // (tất cả = 0), G2Pie vẫn vẽ các lát bằng nhau kèm nhãn "0%" gây hiểu nhầm.
  const pieHasData = useMemo(() => pieData.some((d) => d.value > 0), [pieData])

  // Tính colorMap từ pieData — dùng cả cho pie lẫn column để đồng màu
  const nameColorMap = useMemo(
    () =>
      Object.fromEntries(
        pieData.map((d, i) => [d.name, CHART_COLORS[i % CHART_COLORS.length]]),
      ),
    [pieData],
  )

  useEffect(() => {
    if (!pieRef.current || !colRef.current) return
    if (!pieData || pieData.length === 0) return

    // Destroy trước khi render lại
    try { pieInst.current?.destroy() } catch (_) {}
    try { colInst.current?.destroy() } catch (_) {}
    pieInst.current = null
    colInst.current = null
    selectedRef.current = null
    setSelectedSlice(null)

    // colorMap tính lại trong effect để đảm bảo đồng bộ với pieData hiện tại
    const colorMap = Object.fromEntries(
      pieData.map((d, i) => [d.name, CHART_COLORS[i % CHART_COLORS.length]]),
    )

    const rawDotData = dotData ?? { [latestKey]: pieData }
    const colData = Object.entries(rawDotData).flatMap(([dot, items]) =>
      items.map(({ name, value }) => ({ dot, type: name, value })),
    )

    // ---- Pie chart ----
    // Bỏ qua pie khi tất cả giá trị = 0 để tránh vẽ lát giả kèm nhãn "0%".
    const hasPie = pieData.some((d) => d.value > 0)
    const pie = !hasPie ? null : new G2Pie(pieRef.current, {
      data: pieData,
      angleField: 'value',
      colorField: 'name',
      radius: 0.92,
      innerRadius: 0.6,
      // FIX: dùng colorMap để đảm bảo màu pie khớp với màu cột
      color: ({ name }: { name: string }) => colorMap[name] ?? CHART_COLORS[0],
      pieStyle: { lineWidth: 3, stroke: '#fff' },
      appendPadding: [8, 0, 0, 0],
      label: {
        type: 'outer',
        offset: 12,
        content: ({ percent }: { percent: number }) => `${(percent * 100).toFixed(0)}%`,
        style: { fontSize: 12, fontWeight: 700, fill: '#374151' },
      },
      legend: {
        position: 'bottom',
        flipPage: false,
        itemName: { style: { fontSize: 11 } },
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
            maxWidth: '110px',
          },
          content: latestKey,
        },
        content: {
          style: {
            fontWeight: 900,
            color: COLOR.textDark,
            fontSize: 20,
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            maxWidth: '110px',
          },
        },
      },
      interactions: [{ type: 'element-active' }, { type: 'pie-statistic-active' }],
      tooltip: {
        formatter: (d: { name: string; value: number }) => ({ name: d.name, value: `${d.value} SV` }),
      },
    })

    if (pie) {
      pie.render()
      pieInst.current = pie
    }

    // ---- Column chart ----
    const maxVal = Math.max(...colData.map((d) => d.value), 1)

    const col = new G2Column(colRef.current, {
      data: colData,
      xField: 'dot',
      yField: 'value',
      seriesField: 'type',
      isGroup: true,
      // FIX: dùng colorMap (tính từ pieData) thay vì mảng màu tuần tự
      // để cột và pie luôn đồng màu dù thứ tự category trong dotData khác pieData
      color: ({ type }: { type: string }) => colorMap[type] ?? COLOR.primary,
      columnStyle: ({ type }: { type: string }) => ({
        radius: [6, 6, 0, 0],
        fillOpacity: 0.92,
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
        formatter: (d: { value: number }) => (d.value > 0 ? `${d.value} SV` : ''),
      },
      tooltip: {
        formatter: (d: { type: string; value: number }) => ({ name: d.type, value: `${d.value} SV` }),
      },
      interactions: [{ type: 'element-highlight' }],
    })

    col.render()
    colInst.current = col

    // Khi click vào slice pie → lọc cột theo loại đó
    pie?.on('element:click', (evt: { data?: { data?: { name?: string } } }) => {
      const name = evt?.data?.data?.name
      if (!name) return
      // Tính next ngoài state updater để updater luôn thuần (pure) —
      // side effect changeData không bị double-fire dưới StrictMode/concurrent.
      const next = selectedRef.current === name ? null : name
      selectedRef.current = next
      setSelectedSlice(next)
      colInst.current?.changeData(
        next ? colData.filter((d) => d.type === next) : colData,
      )
    })

    // FIX: dùng requestAnimationFrame để tránh ResizeObserver loop
    // (G2Plot tự trigger resize → observer gọi changeSize → lại trigger → lặp vô hạn)
    const observers: ResizeObserver[] = []
    const observe = (el: HTMLDivElement, chart: G2Pie | G2Column) => {
      let rafId: number | null = null
      const ro = new ResizeObserver(() => {
        if (rafId !== null) return
        rafId = requestAnimationFrame(() => {
          rafId = null
          try { chart.changeSize(el.offsetWidth, el.offsetHeight) } catch (_) {}
        })
      })
      ro.observe(el)
      observers.push(ro)
    }
    if (pie) observe(pieRef.current, pie as unknown as G2Pie)
    observe(colRef.current, col as unknown as G2Pie)

    return () => {
      observers.forEach(ro => ro.disconnect())
      try { pieInst.current?.destroy() } catch (_) {}
      try { colInst.current?.destroy() } catch (_) {}
      pieInst.current = null
      colInst.current = null
    }
  }, [pieData, dotData, latestKey])

  const handleClearSlice = () => {
    selectedRef.current = null
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
              Bộ lọc: <strong>{selectedSlice}</strong>
            </Text>
          </div>
          <button
            onClick={handleClearSlice}
            aria-label="Xóa bộ lọc"
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
            <div style={{ position: 'relative', height: 280 }}>
              <div ref={pieRef} style={{ height: 280, visibility: pieHasData ? 'visible' : 'hidden' }} />
              {!pieHasData && (
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 4,
                    color: COLOR.textFaint,
                  }}
                >
                  <div style={{ fontSize: 13, fontWeight: 600 }}>Chưa có số liệu</div>
                  <div style={{ fontSize: 11 }}>Đợt {latestKey} chưa có phản hồi việc làm</div>
                </div>
              )}
            </div>
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
