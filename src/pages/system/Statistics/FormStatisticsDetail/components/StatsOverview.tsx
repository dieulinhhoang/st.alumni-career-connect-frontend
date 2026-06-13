import {
  FileTextOutlined,
  CheckCircleOutlined,
  PieChartOutlined,
  TrophyOutlined,
} from '@ant-design/icons'
import type { FormStatisticsDetail } from '../../../../../feature/statistics/types'

interface Props {
  detail: FormStatisticsDetail
}

interface KpiConfig {
  icon: React.ReactNode
  iconClass: string
  label: string
  value: string | number
  sub: string
}

export function StatsOverview({ detail }: Props) {
  const data = Array.isArray(detail?.data) ? detail.data : []

  const topOption =
    data.length > 0
      ? data.reduce((a, b) => (a.percent > b.percent ? a : b))
      : { label: '', value: 0, percent: 0 }

  const kpis: KpiConfig[] = [
    {
      icon: <FileTextOutlined />,
      iconClass: 'stats-kpi-icon--teal',
      label: 'Tổng phản hồi',
      value: detail?.totalResponses ?? 0,
      sub: 'lượt tham gia khảo sát',
    },
    {
      icon: <CheckCircleOutlined />,
      iconClass: 'stats-kpi-icon--blue',
      label: 'Tỷ lệ hoàn thành',
      value: `${detail?.completionRate ?? 0}%`,
      sub: 'phiếu hoàn chỉnh',
    },
    {
      icon: <PieChartOutlined />,
      iconClass: 'stats-kpi-icon--amber',
      label: 'Số nhóm trả lời',
      value: data.length,
      sub: 'lựa chọn khác nhau',
    },
    {
      icon: <TrophyOutlined />,
      iconClass: 'stats-kpi-icon--purple',
      label: 'Nhóm nổi bật',
      value: data.length > 0 ? `${topOption.percent ?? 0}%` : '—',
      sub: data.length > 0 ? topOption.label ?? '' : '',
    },
  ]

  return (
    <div className="stats-kpi-grid">
      {kpis.map((kpi, i) => (
        <div className="stats-kpi-card" key={i}>
          <div className={`stats-kpi-icon ${kpi.iconClass}`}>{kpi.icon}</div>
          <div className="stats-kpi-body">
            <div className="stats-kpi-label">{kpi.label}</div>
            <div className="stats-kpi-value">{kpi.value}</div>
            <div className="stats-kpi-sub">{kpi.sub}</div>
          </div>
        </div>
      ))}
    </div>
  )
}