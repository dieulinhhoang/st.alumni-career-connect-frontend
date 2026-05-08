import { Card, Progress, Table, Tag, Typography } from 'antd'
import type { FormStatisticsDetail } from '../../../../../feature/statistics/types'

const { Text } = Typography

interface Props {
  detail: FormStatisticsDetail
}

export function DetailTable({ detail }: Props) {
  const columns = [
    {
      title: 'Lựa chọn',
      dataIndex: 'label',
      key: 'label',
    },
    {
      title: 'Số lượng',
      dataIndex: 'value',
      key: 'value',
      render: (value: number) => <Text strong>{value}</Text>,
    },
    {
      title: 'Tỷ lệ',
      dataIndex: 'percent',
      key: 'percent',
      render: (value: number) => <Tag color="blue">{value}%</Tag>,
    },
    {
      title: 'Mức độ',
      dataIndex: 'percent',
      key: 'progress',
      render: (value: number) => (
        <Progress percent={value} size="small" showInfo={false} />
      ),
    },
  ]

  return (
    <Card bordered={false} title="Bảng thống kê chi tiết">
      <Table
        rowKey="label"
        columns={columns}
        dataSource={detail.data.map((item) => ({
          ...item,
          key: item.label,
        }))}
        pagination={false}
      />
    </Card>
  )
}