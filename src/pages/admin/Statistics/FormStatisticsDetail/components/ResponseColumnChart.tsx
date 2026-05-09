import { Card, Empty } from 'antd'
import { Column } from '@ant-design/plots'
import type { ChartDatum } from '../../../../../feature/statistics/types'

interface Props {
  data: ChartDatum[]
  title?: string
}

export default function ResponseColumnChart({
  data,
  title = 'Biểu đồ cột',
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
      <Column
        data={data}
        xField="label"
        yField="value"
        color="#1677ff"
        style={{
          radiusTopLeft: 8,
          radiusTopRight: 8,
          fillOpacity: 0.9,
          stroke: '#ffffff',
          lineWidth: 1,
          shadowColor: 'rgba(22, 119, 255, 0.25)',
          shadowBlur: 6,
          shadowOffsetY: 3,
        }}
        label={{
          text: 'value',
          position: 'top',
          style: {
            fill: '#374151',
            fontWeight: 600,
            fontSize: 11,
          },
        }}
        axis={{
          x: {
            labelAutoRotate: true,
            labelSpacing: 4,
            labelFontSize: 11,
            labelFill: '#4b5563',
          },
          y: {
            title: false,
            labelFill: '#9ca3af',
            grid: true,
          },
        }}
        tooltip={{
          title: (d) => d.label,
          items: [
            (d) => ({
              name: 'Giá trị',
              value: `${d.value} (${d.percent}%)`,
            }),
          ],
        }}
        interaction={{
          elementHighlight: true,
        }}
        state={{
          active: {
            style: {
              fillOpacity: 1,
            },
          },
        }}
        padding="auto"
        height={320}
      />
    </Card>
  )
}