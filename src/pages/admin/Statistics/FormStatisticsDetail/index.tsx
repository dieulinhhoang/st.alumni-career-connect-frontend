import { Card, Col, Empty, Row, Space, Spin, Typography } from 'antd'
import AdminLayout from '../../../../components/layout/AdminLayout'
import { useFormStatisticsDetail } from '../../../../feature/statistics/hooks/useFormStatisticsDetail'
import { FilterBar } from './components/FilterBar'
import { StatsOverview } from './components/StatsOverview'
import ResponsePieChart from './components/ResponsePieChart'
import ResponseColumnChart from './components/ResponseColumnChart'
import { DetailTable } from './components/DetailTable'

const { Title, Text } = Typography

export default function FormStatisticsDetailPage() {
  const {
    forms,
    questions,
    detail,
    formId,
    questionId,
    setFormId,
    setQuestionId,
    loading,
  } = useFormStatisticsDetail(1)

  return (
    <AdminLayout>
      <div style={{ padding: 24 }}>
        <Space direction="vertical" size={20} style={{ width: '100%' }}>
          <div>
            <Title level={4} style={{ marginBottom: 4 }}>
              Thống kê chi tiết biểu mẫu
            </Title>
            <Text type="secondary">
              Chọn biểu mẫu và câu hỏi thống kê để xem dữ liệu trực quan theo từng form.
            </Text>
          </div>

          <FilterBar
            forms={forms}
            questions={questions}
            formId={formId}
            questionId={questionId}
            onChangeForm={setFormId}
            onChangeQuestion={setQuestionId}
          />

          {loading ? (
            <Card bordered={false}>
              <div
                style={{
                  minHeight: 320,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Spin size="large" />
              </div>
            </Card>
          ) : !detail ? (
            <Card bordered={false}>
              <Empty description="Chưa có dữ liệu thống kê cho lựa chọn này" />
            </Card>
          ) : (
            <>
              <StatsOverview detail={detail} />

              <Row gutter={[16, 16]}>
                <Col xs={24} xl={12}>
                  <ResponsePieChart
                    data={detail.data}
                    title={`${detail.questionTitle} - Biểu đồ tròn`}
                  />
                </Col>

                <Col xs={24} xl={12}>
                  <ResponseColumnChart
                    data={detail.data}
                    title={`${detail.questionTitle} - Biểu đồ cột`}
                  />
                </Col>
              </Row>

              <DetailTable detail={detail} />
            </>
          )}
        </Space>
      </div>
    </AdminLayout>
  )
}