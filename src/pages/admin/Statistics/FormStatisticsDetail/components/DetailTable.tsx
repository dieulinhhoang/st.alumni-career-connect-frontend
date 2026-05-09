import CustomTable from '../../../../../components/common/customTable'
import type { FormStatisticsDetail } from '../../../../../feature/statistics/types'

interface Props {
  detail: FormStatisticsDetail
}

export function DetailTable({ detail }: Props) {
  const maxValue = Math.max(...detail.data.map((d) => d.value), 1)

  const columns = [
    {
      title: 'STT',
      key: 'rank',
      width: 52,
      render: (_: unknown, __: unknown, index: number) => (
        <span className={`stats-rank-badge${index === 0 ? ' stats-rank-badge--top' : ''}`}>
          {index + 1}
        </span>
      ),
    },
    {
      title: 'Lựa chọn',
      dataIndex: 'label',
      key: 'label',
      render: (label: string) => (
        <span style={{ fontSize: 14, fontWeight: 500, color: '#1e293b' }}>{label}</span>
      ),
    },
    {
      title: 'Số lượng',
      dataIndex: 'value',
      key: 'value',
      width: 120,
      render: (value: number) => (
        <span
          style={{
            fontSize: 14,
            fontWeight: 700,
            color: '#1e293b',
            fontVariantNumeric: 'tabular-nums',
          }}
        >
          {value.toLocaleString('vi-VN')}
        </span>
      ),
    },
    {
      title: 'Tỷ lệ',
      dataIndex: 'percent',
      key: 'percent',
      width: 90,
      render: (value: number) => <span className="stats-percent-pill">{value}%</span>,
    },
    {
      title: 'Mức độ',
      dataIndex: 'value',
      key: 'progress',
      render: (value: number) => (
        <div className="stats-progress-bar" style={{ minWidth: 100 }}>
          <div
            className="stats-progress-bar__fill"
            style={{ width: `${(value / maxValue) * 100}%` }}
          />
        </div>
      ),
    },
  ]

  return (
    <div className="stats-table-card">
      <div className="stats-table-head">
        <span className="stats-table-head__title">Bảng thống kê chi tiết</span>
        <span className="stats-table-head__count">{detail.data.length} nhóm</span>
      </div>

      <CustomTable
        className="stats-detail-table"
        rowKey="label"
        columns={columns}
        data={{
          data: [...detail.data].sort((a, b) => b.value - a.value),
          page: {
            total_elements: detail.data.length,
          },
        }}
        pagination={false}
        minHeight={0}
        scroll={{ x: 'max-content' }}
      />
    </div>
  )
}