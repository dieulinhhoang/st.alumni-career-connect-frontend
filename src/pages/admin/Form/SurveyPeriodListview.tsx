import { useState } from 'react'
import {
  Button, Input, Space, Typography, Flex, Tag, Tooltip,
  Progress, Badge,
} from 'antd'
import {
  PlusOutlined, SearchOutlined, EditOutlined, DeleteOutlined,
  CalendarOutlined, TeamOutlined, FormOutlined,
} from '@ant-design/icons'
import type { SurveyPeriod } from '../../../feature/form/types'
import { MOCK_SURVEY_PERIODS, SURVEY_PERIOD_STATUS_CONFIG } from '../../../feature/form/constants'
import CustomTable from '../../../components/common/customTable'
import SurveyPeriodModal from './SurveyPeriodModal'

const { Title, Text } = Typography

const fmt = (d?: string) =>
  d ? new Date(d).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' }) : '—'

export default function SurveyPeriodListview() {
  const [search, setSearch] = useState('')
  const [periods, setPeriods] = useState<SurveyPeriod[]>(MOCK_SURVEY_PERIODS)
  const [modalOpen, setModalOpen] = useState(false)
  const [editTarget, setEditTarget] = useState<SurveyPeriod | null>(null)

  const filtered = periods.filter((p) =>
    p.title.toLowerCase().includes(search.toLowerCase()) ||
    p.formName.toLowerCase().includes(search.toLowerCase())
  )

  const handleCreate = () => {
    setEditTarget(null)
    setModalOpen(true)
  }

  const handleEdit = (p: SurveyPeriod) => {
    setEditTarget(p)
    setModalOpen(true)
  }

  const handleDelete = (id: number) => {
    setPeriods((prev) => prev.filter((p) => p.id !== id))
  }

  const handleSave = (data: Omit<SurveyPeriod, 'id' | 'totalResponses' | 'created_at' | 'createdBy'>) => {
    if (editTarget) {
      setPeriods((prev) =>
        prev.map((p) => p.id === editTarget.id ? { ...p, ...data, updated_at: new Date().toISOString().slice(0, 10) } : p)
      )
    } else {
      const newPeriod: SurveyPeriod = {
        ...data,
        id: Date.now(),
        totalResponses: 0,
        createdBy: 'admin@vnua.edu.vn',
        created_at: new Date().toISOString().slice(0, 10),
        status: 'draft',
      }
      setPeriods((prev) => [newPeriod, ...prev])
    }
    setModalOpen(false)
  }

  const columns = [
    {
      title: 'STT',
      key: 'index',
      width: 52,
      align: 'center' as const,
      render: (_: any, __: SurveyPeriod, i: number) => (
        <Text type="secondary" style={{ fontSize: 12, fontVariantNumeric: 'tabular-nums', fontWeight: 500 }}>
          {String(i + 1).padStart(2, '0')}
        </Text>
      ),
    },
    {
      title: 'Đợt khảo sát',
      dataIndex: 'title',
      key: 'title',
      render: (text: string, record: SurveyPeriod) => {
        const cfg = SURVEY_PERIOD_STATUS_CONFIG[record.status]
        return (
          <Flex align="center" gap={12}>
            <div style={{
              width: 36, height: 36, borderRadius: 9, flexShrink: 0,
              background: '#f0fdf4', color: '#0f766e',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              border: '1.5px solid #0f766e22', fontSize: 15,
            }}>
              <FormOutlined />
            </div>
            <div style={{ minWidth: 0 }}>
              <Flex align="center" gap={6}>
                <span style={{ fontWeight: 600, fontSize: 14, color: '#0d1117' }}>{text}</span>
                <Badge status={cfg.color} text={cfg.label} style={{ fontSize: 12 }} />
              </Flex>
              <Text type="secondary" style={{ fontSize: 12 }}>
                <FormOutlined style={{ marginRight: 4 }} />{record.formName}
              </Text>
            </div>
          </Flex>
        )
      },
    },
    {
      title: 'Đối tượng',
      dataIndex: 'targetAudience',
      key: 'targetAudience',
      width: 200,
      render: (v: string) => (
        <Flex align="center" gap={5}>
          <TeamOutlined style={{ color: '#64748b', fontSize: 12 }} />
          <Text style={{ fontSize: 13 }}>{v}</Text>
        </Flex>
      ),
    },
    {
      title: 'Thời gian',
      key: 'date',
      width: 190,
      render: (_: any, r: SurveyPeriod) => (
        <Flex align="center" gap={5}>
          <CalendarOutlined style={{ color: '#64748b', fontSize: 12 }} />
          <Text style={{ fontSize: 13, fontVariantNumeric: 'tabular-nums' }}>
            {fmt(r.startDate)} – {fmt(r.endDate)}
          </Text>
        </Flex>
      ),
    },
    {
      title: 'Tỉ lệ phản hồi',
      key: 'responses',
      width: 180,
      render: (_: any, r: SurveyPeriod) => {
        const pct = r.totalInvited > 0 ? Math.round((r.totalResponses / r.totalInvited) * 100) : 0
        return (
          <div style={{ minWidth: 120 }}>
            <Flex justify="space-between" style={{ marginBottom: 3 }}>
              <Text style={{ fontSize: 12, fontVariantNumeric: 'tabular-nums' }}>
                {r.totalResponses.toLocaleString('vi-VN')} / {r.totalInvited.toLocaleString('vi-VN')}
              </Text>
              <Text style={{ fontSize: 12, fontWeight: 600, color: pct >= 60 ? '#0f766e' : '#64748b' }}>
                {pct}%
              </Text>
            </Flex>
            <Progress
              percent={pct}
              showInfo={false}
              size="small"
              strokeColor={pct >= 60 ? '#0f766e' : pct >= 30 ? '#f59e0b' : '#e2e8f0'}
              trailColor="#f1f5f9"
            />
          </div>
        )
      },
    },
    {
      title: '',
      key: 'actions',
      width: 90,
      align: 'center' as const,
      render: (_: any, record: SurveyPeriod) => (
        <Space size={2}>
          <Tooltip title="Chỉnh sửa" mouseEnterDelay={0.4}>
            <Button type="text" size="small" icon={<EditOutlined />}
              onClick={(e) => { e.stopPropagation(); handleEdit(record) }} />
          </Tooltip>
          <Tooltip title="Xóa" mouseEnterDelay={0.4}>
            <Button type="text" size="small" danger icon={<DeleteOutlined />}
              onClick={(e) => { e.stopPropagation(); handleDelete(record.id) }} />
          </Tooltip>
        </Space>
      ),
    },
  ]

  const statusCounts = {
    active:    periods.filter((p) => p.status === 'active').length,
    scheduled: periods.filter((p) => p.status === 'scheduled').length,
    closed:    periods.filter((p) => p.status === 'closed').length,
    draft:     periods.filter((p) => p.status === 'draft').length,
  }

  return (
    <div style={{ padding: '28px 32px 48px', minHeight: '100vh' }}>
      {/* Page header */}
      <Flex justify="space-between" align="flex-end" wrap="wrap" gap={12} style={{ marginBottom: 20 }}>
        <div>
          <Text style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.09em', textTransform: 'uppercase', color: '#0f766e', display: 'block', marginBottom: 5 }}>
            Quản lý
          </Text>
          <Title level={3} style={{ margin: 0, letterSpacing: '-0.5px', lineHeight: 1 }}>
            Đợt khảo sát
          </Title>
          <Text type="secondary" style={{ fontSize: 13, marginTop: 5, display: 'block' }}>
            {periods.length} đợt · Lên lịch và phát hành đợt khảo sát cho cựu sinh viên
          </Text>
        </div>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={handleCreate}
          style={{ background: '#1D9E75', borderColor: '#1D9E75' }}
        >
          Tạo đợt mới
        </Button>
      </Flex>

      {/* Status summary chips */}
      <Flex gap={8} wrap="wrap" style={{ marginBottom: 16 }}>
        <Tag color="success" style={{ borderRadius: 20, padding: '2px 12px', fontWeight: 600 }}>
          Đang diễn ra: {statusCounts.active}
        </Tag>
        <Tag color="processing" style={{ borderRadius: 20, padding: '2px 12px', fontWeight: 600 }}>
          Đã lên lịch: {statusCounts.scheduled}
        </Tag>
        <Tag color="error" style={{ borderRadius: 20, padding: '2px 12px', fontWeight: 600 }}>
          Đã đóng: {statusCounts.closed}
        </Tag>
        <Tag style={{ borderRadius: 20, padding: '2px 12px', fontWeight: 600 }}>
          Nháp: {statusCounts.draft}
        </Tag>
      </Flex>

      {/* Card + table */}
      <div style={{ background: '#fff' }}>
        <Flex align="center" gap={8} style={{ padding: '10px 16px', borderBottom: '1px solid #e2e8f0' }}>
          <Input
            prefix={<SearchOutlined style={{ color: '#94a3b8', fontSize: 12 }} />}
            placeholder="Tìm kiếm đợt khảo sát..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ width: 260 }}
            allowClear
          />
          <Text type="secondary" style={{ marginLeft: 'auto', fontSize: 12, fontVariantNumeric: 'tabular-nums' }}>
            {filtered.length} / {periods.length} đợt
          </Text>
        </Flex>
        <CustomTable
          columns={columns}
          data={{ data: filtered }}
          pagination={{
            pageSize: 10,
            total: filtered.length,
            showTotal: (total: number, range: [number, number]) =>
              `Hiển thị ${range[0]}–${range[1]} trong ${total} đợt`,
            position: ['bottomCenter'],
          }}
          rowKey="id"
        />
      </div>

      <SurveyPeriodModal
        open={modalOpen}
        initialValues={editTarget}
        onClose={() => setModalOpen(false)}
        onSave={handleSave}
      />
    </div>
  )
}
