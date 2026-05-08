import { Card, Empty } from 'antd'
import { Column } from '@ant-design/plots'
import type { ChartDatum } from '../../../../../feature/statistics/types'

interface Props {
  data: ChartDatum[]
  title?: string
}

export function ResponseColumnChart({ data, title = 'Biểu đồ cột' }: Props) {
  if (!data.length) {
    return (
      <Card bordered={false} title={title}>
        <Empty description="Không có dữ liệu" />
      </Card>
    )
  }

  return (
    <Card bordered={false} title={title}>
      <Column
        data={data}
        xField="label"
        yField="value"
        color="#1677ff"
        style={{
          radiusTopLeft: 8,
          radiusTopRight: 8,
        }}
        label={{
          text: 'value',
          position: 'top',
        }}
        axis={{
          x: {
            labelAutoRotate: true,
          },
          y: {
            title: false,
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