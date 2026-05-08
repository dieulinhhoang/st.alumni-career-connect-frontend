import { useMemo } from 'react'
import type { StatisticsChartResult } from '../../../../feature/statistics/types'
import { PieColumnChart } from '../../../../components/charts/PieColumnChart'
import { COLOR } from '../../DashBoard/theme'
import { Typography } from 'antd'

const { Text } = Typography

interface Props {
  chart: StatisticsChartResult
}

export default function StatisticsCharts({ chart }: Props) {
  const pieData = useMemo(() => chart?.data ?? [], [chart])
  const latestKey = chart?.latestLabel ?? '—'

  return (
    <div
      style={{
        background: '#fff',
        borderRadius: 14,
        border: '1px solid #e2e8f0',
        boxShadow: '0 1px 3px rgba(0,0,0,0.06), 0 4px 16px rgba(0,0,0,0.06)',
        overflow: 'hidden',
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: '16px 20px',
          borderBottom: '1px solid #f1f5f9',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 3 }}>
          <div
            style={{
              width: 3,
              height: 20,
              borderRadius: 99,
              background: COLOR.primary,
            }}
          />
          <span style={{ fontSize: 18, fontWeight: 700, color: COLOR.textDark }}>
            {chart.title}
          </span>
        </div>
        <Text style={{ fontSize: 12, color: COLOR.textFaint, marginLeft: 11 }}>
          Hiển thị tỷ lệ % — so sánh qua các đợt
        </Text>
      </div>

      {/* Charts */}
      <div style={{ padding: '16px 20px 20px' }}>
        <PieColumnChart
          pieData={pieData}
          dotData={chart?.dotData}
          latestKey={latestKey}
        />
      </div>
    </div>
  )
}
