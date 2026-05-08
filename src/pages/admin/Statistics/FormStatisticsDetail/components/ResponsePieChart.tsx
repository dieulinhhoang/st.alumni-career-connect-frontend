import { Card, Empty } from 'antd'
import { Pie } from '@ant-design/plots'
import type { ChartDatum } from '../../../../../feature/statistics/types'

interface Props {
  data: ChartDatum[]
  title?: string
}

export function ResponsePieChart({ data, title = 'Biểu đồ tròn' }: Props) {
  if (!data.length) {
    return (
      <Card bordered={false} title={title}>
        <Empty description="Không có dữ liệu" />
      </Card>
    )
  }

  return (
    <Card bordered={false} title={title}>
      <Pie
        data={data}
        angleField="value"
        colorField="label"
        radius={0.8}
        innerRadius={0.55}
        label={{
          text: (d) => `${d.label}: ${d.percent}%`,
          position: 'outside',
        }}
        legend={{
          color: {
            position: 'bottom',
            rowPadding: 8,
          },
        }}
        tooltip={{
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