import { Column } from '@ant-design/plots'
import { BarChartOutlined } from '@ant-design/icons'
import type { ChartDatum } from '../../../../../feature/statistics/types'

interface Props {
  data: ChartDatum[]
  title?: string
  subtitle?: string
}

export default function ResponseColumnChart({ data, title = 'Biểu đồ cột', subtitle }: Props) {
  if (!data.length) {
    return (
      <div className="stats-chart-card">
        <div className="stats-chart-head">
          <div className="stats-chart-head__icon"><BarChartOutlined /></div>
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
        <div className="stats-chart-head__icon"><BarChartOutlined /></div>
        <div className="stats-chart-head__text">
          <div className="stats-chart-head__title">{title}</div>
          {subtitle && <div className="stats-chart-head__sub">{subtitle}</div>}
        </div>
      </div>
      <div className="stats-chart-body">
        <Column
          data={data}
          xField="label"
          yField="value"
          color="#0d7a7f"
          style={{
            radiusTopLeft: 6,
            radiusTopRight: 6,
            fillOpacity: 0.9,
          }}
          label={{
            text: 'value',
            position: 'top',
            style: { fill: '#475569', fontWeight: 600, fontSize: 12 },
          }}
          axis={{
            x: {
              labelAutoRotate: true,
              labelSpacing: 4,
              labelFontSize: 12,
              labelFill: '#64748b',
            },
            y: {
              title: false,
              labelFill: '#94a3b8',
              grid: true,
            },
          }}
          tooltip={{
            title: (d: ChartDatum) => d.label,
            items: [
              (d: ChartDatum) => ({
                name: 'Số phản hồi',
                value: `${d.value.toLocaleString('vi-VN')} (${d.percent}%)`,
              }),
            ],
          }}
          interaction={{ elementHighlight: true }}
          state={{
            active: { style: { fillOpacity: 1, fill: '#1a9ea5' } },
          }}
          height={320}
        />
      </div>
    </div>
  )
}
