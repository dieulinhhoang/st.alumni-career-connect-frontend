import { Card, Col, Row, Statistic } from 'antd'
import {
  FileTextOutlined,
  CheckCircleOutlined,
  PieChartOutlined,
  BarChartOutlined,
} from '@ant-design/icons'
import type { FormStatisticsDetail } from '../../../../../feature/statistics/types'

interface Props {
  detail: FormStatisticsDetail
}

export function StatsOverview({ detail }: Props) {
  const topOption = detail.data[0]

  return (
    <Row gutter={[16, 16]}>
      <Col xs={24} sm={12} xl={6}>
        <Card bordered={false}>
          <Statistic
            title="Tổng phản hồi"
            value={detail.totalResponses}
            prefix={<FileTextOutlined />}
          />
        </Card>
      </Col>

      <Col xs={24} sm={12} xl={6}>
        <Card bordered={false}>
          <Statistic
            title="Tỷ lệ hoàn thành"
            value={detail.completionRate}
            suffix="%"
            prefix={<CheckCircleOutlined />}
          />
        </Card>
      </Col>

      <Col xs={24} sm={12} xl={6}>
        <Card bordered={false}>
          <Statistic
            title="Số nhóm trả lời"
            value={detail.data.length}
            prefix={<PieChartOutlined />}
          />
        </Card>
      </Col>

      <Col xs={24} sm={12} xl={6}>
        <Card bordered={false}>
          <Statistic
            title="Nhóm nổi bật"
            value={topOption?.percent || 0}
            suffix="%"
            prefix={<BarChartOutlined />}
          />
        </Card>
      </Col>
    </Row>
  )
}