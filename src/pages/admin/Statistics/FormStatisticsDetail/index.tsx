import { Col, Empty, Row, Skeleton, Space } from 'antd'
import AdminLayout from '../../../../components/layout/AdminLayout'
import { useFormStatisticsDetail } from '../../../../feature/statistics/hooks/useFormStatisticsDetail'
import { FilterBar } from './components/FilterBar'
import { StatsOverview } from './components/StatsOverview'
import ResponsePieChart from './components/ResponsePieChart'
import ResponseColumnChart from './components/ResponseColumnChart'
import { DetailTable } from './components/DetailTable'
import './styles.css'

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
      <div className="stats-page">
        {/* Page header */}
        <div className="stats-header">
          <div className="stats-header__left">
            <span className="stats-header__badge">Thống kê</span>
            <h1 className="stats-header__title">Thống kê biểu mẫu</h1>
            <p className="stats-header__desc">
              Chọn biểu mẫu và câu hỏi để xem dữ liệu phân tích theo từng form khảo sát.
            </p>
          </div>
        </div>

        <Space direction="vertical" size={20} style={{ width: '100%' }}>
          <FilterBar
            forms={forms}
            questions={questions}
            formId={formId}
            questionId={questionId}
            onChangeForm={setFormId}
            onChangeQuestion={setQuestionId}
          />

          {loading ? (
            <div className="stats-skeleton-grid">
              {[0, 1, 2, 3].map((i) => (
                <div key={i} className="stats-skeleton-card">
                  <Skeleton active paragraph={{ rows: 2 }} />
                </div>
              ))}
            </div>
          ) : !detail ? (
            <div className="stats-empty">
              <Empty
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                description={
                  <span style={{ color: '#64748b' }}>
                    Chưa có dữ liệu thống kê cho lựa chọn này
                  </span>
                }
              />
            </div>
          ) : (
            <>
              <StatsOverview detail={detail} />

              <Row gutter={[20, 20]}>
                <Col xs={24} xl={12}>
                  <ResponsePieChart
                    data={detail.data}
                    title={detail.questionTitle}
                    subtitle="Biểu đồ tròn"
                  />
                </Col>
                <Col xs={24} xl={12}>
                  <ResponseColumnChart
                    data={detail.data}
                    title={detail.questionTitle}
                    subtitle="Biểu đồ cột"
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
