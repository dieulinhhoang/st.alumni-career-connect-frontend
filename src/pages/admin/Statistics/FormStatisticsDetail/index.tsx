import { Empty, Skeleton, Space } from 'antd'
import AdminLayout from '../../../../components/layout/AdminLayout'
import { useFormStatisticsDetail } from '../../../../feature/statistics/hooks/useFormStatisticsDetail'
import { FilterBar } from './components/FilterBar'
import { StatsOverview } from './components/StatsOverview'
import { DetailTable } from './components/DetailTable'
import { PieColumnChart } from '../../../../components/charts/PieColumnChart'
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

  const pieData =
    detail?.data?.map((item) => ({
      name: item.label,
      value: item.value,
    })) ?? []

  const currentQuestion = questions.find((q) => q.id === questionId)
  const pieLabel = detail ? `Biểu đồ tròn · ${detail.formName}` : 'Biểu đồ tròn'
  const columnLabel = currentQuestion
    ? `Biểu đồ cột · ${currentQuestion.title}`
    : 'Biểu đồ cột'

  const handleReset = () => {
    setFormId(undefined)
    setQuestionId(undefined)
  }

  return (
    <AdminLayout>
      <div className="stats-page">
        <div className="stats-header">
          <div className="stats-header__left">
            <h1 className="stats-header__title">Biểu đồ thống kê</h1>
            <p className="stats-header__desc">
              Biểu đồ thống kê kết quả khảo sát theo từng câu hỏi.
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
            onReset={handleReset}
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

              <div className="stats-chart-card">
                <div className="stats-chart-head">
                  <div className="stats-chart-head__text">
                    <div className="stats-chart-head__title">
                      {detail.questionTitle}
                    </div>
                    <div className="stats-chart-head__sub">
                      Phân bố kết quả khảo sát
                    </div>
                  </div>
                </div>

                <div className="stats-chart-body">
                  <PieColumnChart
                    pieData={pieData}
                    latestKey={detail.questionTitle}
                    pieLabel={pieLabel}
                    columnLabel={columnLabel}
                  />
                </div>
              </div>

              <DetailTable detail={detail} />
            </>
          )}
        </Space>
      </div>
    </AdminLayout>
  )
}
