import { Pie } from '@ant-design/plots'
import { PieChartOutlined } from '@ant-design/icons'
import type { ChartDatum } from '../../../../../feature/statistics/types'

interface Props {
  data: ChartDatum[]
  title?: string
  subtitle?: string
}

const CHART_COLORS = ['#0d7a7f', '#3b82f6', '#d97706', '#7c3aed', '#dc2626', '#059669']

export default function ResponsePieChart({ data, title = 'Biểu đồ tròn', subtitle }: Props) {
  if (!data.length) {
    return (
      <div className="stats-chart-card">
        <div className="stats-chart-head">
          <div className="stats-chart-head__icon"><PieChartOutlined /></div>
          <div className="stats-chart-head__text">
            <div className="stats-chart-head__title">{title}</div>
            {subtitle && <div className="stats-chart-head__sub">{subtitle}</div>}
          </div>
        </div>
        <div style={{ padding: '48px 16px', textAlign: 'center', color: '#94a3b8', fontSize: 14 }}>
          Không có dữ liệu
        </div>
      </div>
    )
  }

  return (
    <div className="stats-chart-card">
      <div className="stats-chart-head">
        <div className="stats-chart-head__icon"><PieChartOutlined /></div>
        <div className="stats-chart-head__text">
          <div className="stats-chart-head__title">{title}</div>
          {subtitle && <div className="stats-chart-head__sub">{subtitle}</div>}
        </div>
      </div>
      <div className="stats-chart-body">
        <Pie
          data={data}
          angleField="value"
          colorField="label"
          color={CHART_COLORS}
          radius={0.82}
          innerRadius={0.58}
          style={{ stroke: '#ffffff', lineWidth: 2.5 }}
          label={{
            text: (d: ChartDatum) => `${d.percent}%`,
            position: 'outside',
            style: { fontSize: 12, fontWeight: 600, fill: '#475569' },
          }}
          legend={{
            color: {
              position: 'bottom',
              rowPadding: 10,
              itemLabelFontSize: 13,
            },
          }}
          tooltip={{
            title: (d: ChartDatum) => d.label,
            items: [(d: ChartDatum) => ({ name: d.label, value: `${d.value.toLocaleString('vi-VN')} phản hồi (${d.percent}%)` })],
          }}
          height={320}
        />
      </div>
    </div>
  )
}
