import { Column, Pie } from '@antv/g2plot'
import { each, groupBy } from '@antv/util'
import React, { useEffect, useRef } from 'react'

interface Props {
  apiURL: string
  collapsed?: boolean
}

type OriginDatum = {
  city: string
  type: string
  value: number
}

type PieDatum = {
  type: string
  value: number
}

const COLORS = ['#6366f1', '#06b6d4', '#10b981', '#f59e0b', '#f43f5e', '#8b5cf6']

const Chart: React.FC<Props> = ({ apiURL, collapsed }) => {
  const container1 = useRef<HTMLDivElement>(null)
  const container2 = useRef<HTMLDivElement>(null)

  const pieRef = useRef<Pie | null>(null)
  const colRef = useRef<Column | null>(null)

  const originalPieData = useRef<PieDatum[]>([])
  const originalColData = useRef<OriginDatum[]>([])
  const activeType = useRef<string | null>(null)

  useEffect(() => {
    if (!container1.current || !container2.current) return

    let mounted = true

    const buildCharts = async () => {
      try {
        const res = await fetch(apiURL)
        const originData: OriginDatum[] = await res.json()
        if (!mounted) return

        const grouped = groupBy(originData, 'type')
        const pieData: PieDatum[] = []

        each(grouped, (values: OriginDatum[], key: string) => {
          pieData.push({
            type: key,
            value: values.reduce((sum, item) => sum + item.value, 0),
          })
        })

        originalPieData.current = pieData
        originalColData.current = originData
        activeType.current = null

        pieRef.current?.destroy()
        colRef.current?.destroy()

        pieRef.current = new Pie(container1.current!, {
          data: pieData,
          angleField: 'value',
          colorField: 'type',
          color: COLORS,
          radius: 0.88,
          innerRadius: 0.56,
          autoFit: true,
          height: 240,
          pieStyle: {
            lineWidth: 2,
            stroke: '#fff',
          },
          label: {
            type: 'outer',
            offset: 10,
            content: ({ percent }: any) => `${(percent * 100).toFixed(0)}%`,
            style: {
              fontSize: 12,
              fontWeight: 600,
              fill: '#374151',
            },
          },
          legend: {
            position: 'bottom',
          },
          tooltip: {
            formatter: (d: any) => ({
              name: d.type,
              value: d.value,
            }),
          },
          interactions: [{ type: 'element-active' }],
        })

        pieRef.current.render()

        colRef.current = new Column(container2.current!, {
          data: originData,
          xField: 'city',
          yField: 'value',
          seriesField: 'type',
          isGroup: true,
          autoFit: true,
          height: 240,
          color: COLORS,
          columnStyle: {
            radius: [6, 6, 0, 0],
          },
          yAxis: {
            nice: true,
          },
          legend: {
            position: 'bottom',
          },
          label: {
            position: 'top',
            style: {
              fill: '#374151',
              fontWeight: 600,
            },
          },
          state: {
            active: {
              style: {
                lineWidth: 1,
                stroke: '#111827',
              },
            },
            inactive: {
              style: {
                opacity: 0.25,
              },
            },
          },
          interactions: [{ type: 'element-highlight' }],
        })

        colRef.current.render()

        pieRef.current.on('element:mouseenter', (evt: any) => {
          if (activeType.current) return
          const type = evt?.data?.data?.type
          if (!type) return

          colRef.current?.setState('active', (d: any) => d.type === type)
          colRef.current?.setState('inactive', (d: any) => d.type !== type)
        })

        pieRef.current.on('element:mouseleave', () => {
          if (activeType.current) return
          colRef.current?.setState('active', () => false, false)
          colRef.current?.setState('inactive', () => false, false)
        })

        pieRef.current.on('element:click', (evt: any) => {
          const type = evt?.data?.data?.type
          if (!type) return

          const nextType = activeType.current === type ? null : type
          activeType.current = nextType

          const nextPieData = nextType
            ? originalPieData.current.filter(d => d.type === nextType)
            : originalPieData.current

          const nextColData = nextType
            ? originalColData.current.filter(d => d.type === nextType)
            : originalColData.current

          pieRef.current?.changeData(nextPieData)
          colRef.current?.changeData(nextColData)

          colRef.current?.setState('active', () => false, false)
          colRef.current?.setState('inactive', () => false, false)
        })
      } catch (err) {
        console.error(err)
      }
    }

    buildCharts()

    return () => {
      mounted = false
      pieRef.current?.destroy()
      colRef.current?.destroy()
      pieRef.current = null
      colRef.current = null
    }
  }, [apiURL])

  useEffect(() => {
    const timer = setTimeout(() => {
      pieRef.current?.forceFit?.()
      colRef.current?.forceFit?.()
    }, 250)

    return () => clearTimeout(timer)
  }, [collapsed])

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'row',
        width: '100%',
        minHeight: 240,
        gap: 20,
      }}
    >
      <div ref={container1} style={{ flex: 1, minWidth: 0 }} />
      <div ref={container2} style={{ flex: 2, minWidth: 0 }} />
    </div>
  )
}

export default Chart