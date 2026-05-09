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

  return (
    <AdminLayout>
      <div >
        <div className="stats-header">
          <div className="stats-header__left">
            {/* <span className="stats-header__badge">Thống kê</span> */}
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

              <div className="stats-chart-card">
                <div className="stats-chart-head">
                  <div className="stats-chart-head__text">
                    <div className="stats-chart-head__title">{detail.questionTitle}</div>
                    <div className="stats-chart-head__sub">
                      Biểu đồ thống kê 
                    </div>
                  </div>
                </div>

                <div className="stats-chart-body">
                  <PieColumnChart
                    pieData={pieData}
                    latestKey={detail.questionTitle}
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