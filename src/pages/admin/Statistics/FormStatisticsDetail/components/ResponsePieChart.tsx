import { Card, Empty } from 'antd'
import { Pie } from '@ant-design/plots'
import type { ChartDatum } from '../../../../../feature/statistics/types'

interface Props {
  data: ChartDatum[]
  title?: string
}

const PIE_COLORS = [
  '#1677ff',
  '#22c55e',
  '#eab308',
  '#f97316',
  '#ef4444',
  '#6366f1',
]

export default function ResponsePieChart({
  data,
  title = 'Biểu đồ tròn',
}: Props) {
  if (!data.length) {
    return (
      <Card bordered={false} title={title}>
        <Empty description="Không có dữ liệu" />
      </Card>
    )
  }

  return (
    <Card
      bordered={false}
      title={title}
      style={{
        borderRadius: 14,
        border: '1px solid #e5e7eb',
        boxShadow:
          '0 1px 3px rgba(15, 23, 42, 0.08), 0 6px 24px rgba(15, 23, 42, 0.06)',
      }}
      bodyStyle={{ padding: 16 }}
    >
      <Pie
        data={data}
        angleField="value"
        colorField="label"
        color={PIE_COLORS}
        radius={0.82}
        innerRadius={0.55}
        style={{
          stroke: '#ffffff',
          lineWidth: 2,
        }}
        label={{
          text: (d) => `${d.percent}%`,
          position: 'outside',
          style: {
            fontSize: 11,
            fontWeight: 600,
            fill: '#374151',
          },
        }}
        legend={{
          color: {
            position: 'bottom',
            rowPadding: 8,
            itemLabelFontSize: 12,
          },
        }}
        tooltip={{
          title: (d) => d.label,
          items: [
            (d) => ({
              name: d.label,
              value: `${d.value} (${d.percent}%)`,
            }),
          ],
        }}
        height={320}
      />
    </Card>
  )
}