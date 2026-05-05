import { useState } from 'react'
import { Button, Input, Tooltip, Table, Tag, Space } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import {
  EyeOutlined, EditOutlined, CopyOutlined, DeleteOutlined,
  SearchOutlined, FileOutlined, PlusOutlined, ThunderboltOutlined,
  AppstoreOutlined, UnorderedListOutlined, CalendarOutlined,
} from '@ant-design/icons'
import type { Form } from '../../../../feature/form/types'

const ACCENT_MAP: Record<string, string> = {
  blue: '#2563eb', green: '#16a34a', red: '#dc2626', purple: '#7c3aed',
  orange: '#ea580c', teal: '#0d9488', brown: '#78716c', gray: '#6b7280',
}
const getAccent = (id?: string) => ACCENT_MAP[id as string] ?? '#2563eb'
const fmt = (d?: string) =>
  d ? new Date(d).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' }) : '—'

type ViewMode = 'grid' | 'table'

interface ListViewProps {
  forms: Form[]
  onCreate: () => void
  onAI: () => void
  onEdit: (f: Form) => void
  onPreview: (f: Form) => void
  onDup: (f: Form) => void
  onDelete: (id: number) => void
}

export default function ListView({ forms, onCreate, onAI, onEdit, onPreview, onDup, onDelete }: ListViewProps) {
  const [search, setSearch] = useState('')
  const [viewMode, setViewMode] = useState<ViewMode>('grid')
  const filtered = forms.filter((f) => f.name.toLowerCase().includes(search.toLowerCase()))

  //  table columns 
  const columns: ColumnsType<Form> = [
    {
      title: 'STT', key: 'index', width: 50,
      render: (_, __, index) => <span style={{ color: '#9ca3af' }}>{index + 1}</span>,
    },
    {
      title: 'Tên form', dataIndex: 'name', key: 'name',
      render: (text, record) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 36, height: 36, borderRadius: 8, background: `${getAccent(record.themeId)}1a`, color: getAccent(record.themeId), display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <FileOutlined />
          </div>
          <div>
            <div style={{ fontWeight: 700, color: '#111827', marginBottom: 2 }}>{text}</div>
            <div style={{ fontSize: 12, color: '#6b7280' }}>{record.description || 'Chưa có mô tả'}</div>
          </div>
        </div>
      ),
    },
    {
      title: 'Số câu hỏi', dataIndex: 'questions', key: 'questions', width: 110,
      render: (qs) => <Tag>{qs.length} câu</Tag>,
    },
    {
      title: 'Ngày tạo', dataIndex: 'createdat', key: 'createdat', width: 130,
      render: (date) => <Space size={4}><CalendarOutlined /><span>{fmt(date)}</span></Space>,
    },
    {
      title: 'Thao tác', key: 'actions', width: 160,
      render: (_, record) => (
        <Space>
          <Tooltip title="Xem trước"><Button type="text" icon={<EyeOutlined />} onClick={(e) => { e.stopPropagation(); onPreview(record) }} aria-label="Xem trước" /></Tooltip>
          <Tooltip title="Chỉnh sửa"><Button type="text" icon={<EditOutlined />} onClick={(e) => { e.stopPropagation(); onEdit(record) }} aria-label="Chỉnh sửa" /></Tooltip>
          <Tooltip title="Nhân bản"><Button type="text" icon={<CopyOutlined />} onClick={(e) => { e.stopPropagation(); onDup(record) }} aria-label="Nhân bản" /></Tooltip>
          <Tooltip title="Xóa"><Button type="text" danger icon={<DeleteOutlined />} onClick={(e) => { e.stopPropagation(); onDelete(record.id as number) }} aria-label="Xóa" /></Tooltip>
        </Space>
      ),
    },
  ]

  //  render 
  return (
    <div className="page">
      {/* Header */}
      <div className="topbar">
        <div>
          <div className="eyebrow" style={{ marginBottom: 4 }}>Quản lý</div>
          <div className="page-title">Form khảo sát</div>
        </div>
        <Space>
          <Button icon={<ThunderboltOutlined />} onClick={onAI} className="btn-gold">Tạo bằng AI</Button>
          <Button type="primary" icon={<PlusOutlined />} onClick={onCreate}>Form mới</Button>
        </Space>
      </div>

      {/* Toolbar */}
      <div className="toolbar" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <Input
          placeholder="Tìm kiếm form..."
          prefix={<SearchOutlined style={{ color: '#9ca3af' }} />}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ maxWidth: 380 }}
          allowClear
        />
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <Tooltip title="Chế độ lưới">
            <Button type={viewMode === 'grid' ? 'primary' : 'default'} icon={<AppstoreOutlined />}
              onClick={() => setViewMode('grid')} aria-pressed={viewMode === 'grid'} aria-label="Chế độ lưới" />
          </Tooltip>
          <Tooltip title="Chế độ danh sách">
            <Button type={viewMode === 'table' ? 'primary' : 'default'} icon={<UnorderedListOutlined />}
              onClick={() => setViewMode('table')} aria-pressed={viewMode === 'table'} aria-label="Chế độ danh sách" />
          </Tooltip>
          <Tag color="blue">{filtered.length} form</Tag>
        </div>
      </div>

      {/* Grid view */}
      {viewMode === 'grid' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 14 }}>
          {/* AI card */}
          <div className="ai-card" onClick={onAI} role="button" aria-label="Tạo form bằng AI" tabIndex={0}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') onAI() }}>
            <div className="ai-title">Tạo form thông minh<br />bằng trí tuệ nhân tạo</div>
            <div className="ai-desc">Upload PDF hoặc nhập mô tả — AI phân tích và sinh câu hỏi tự động.</div>
            <div className="ai-cta">Bắt đầu ngay</div>
          </div>

          {/* New blank card */}
          <div className="new-card" onClick={onCreate} role="button" aria-label="Tạo form mới" tabIndex={0}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') onCreate() }}>
            <div className="new-ring"><PlusOutlined /></div>
            <span>Tạo form mới</span>
          </div>

          {/* Form cards */}
          {filtered.map((form) => {
            const accent = getAccent(form.themeId as string)
            return (
              <div key={form.id} className="form-card" onClick={() => onPreview(form)}
                role="button" aria-label={`Xem trước form: ${form.name}`} tabIndex={0}
                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') onPreview(form) }}>
                <div className="form-card-accent" style={{ background: accent }} />
                <div className="form-card-body">
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: 12 }}>
                    <div className="form-icon" style={{ background: `${accent}1a`, color: accent }}><FileOutlined /></div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div className="form-name">{form.name}</div>
                      <div className="form-desc">{form.description || 'Chưa có mô tả'}</div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
                    <Tag>{form.questions.length} câu hỏi</Tag>
                    <Tag icon={<CalendarOutlined />}>{fmt(form.createdat)}</Tag>
                  </div>
                </div>
                <div className="form-card-actions" onClick={(e) => e.stopPropagation()}>
                  <Tooltip title="Xem trước">
                    <button className="fa-btn" onClick={() => onPreview(form)} aria-label="Xem trước"><EyeOutlined /></button>
                  </Tooltip>
                  <span className="fa-sep" />
                  <Tooltip title="Chỉnh sửa">
                    <button className="fa-btn" onClick={() => onEdit(form)} aria-label="Chỉnh sửa"><EditOutlined /></button>
                  </Tooltip>
                  <span className="fa-sep" />
                  <Tooltip title="Nhân bản">
                    <button className="fa-btn" onClick={() => onDup(form)} aria-label="Nhân bản"><CopyOutlined /></button>
                  </Tooltip>
                  <span className="fa-sep" />
                  <Tooltip title="Xóa">
                    <button className="fa-btn danger" onClick={() => onDelete(form.id as number)} aria-label="Xóa"><DeleteOutlined /></button>
                  </Tooltip>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Table view */}
      {viewMode === 'table' && (
        <Table
          columns={columns}
          dataSource={filtered}
          rowKey="id"
          pagination={{ pageSize: 10 }}
          onRow={(record) => ({ onClick: () => onPreview(record), style: { cursor: 'pointer' } })}
        />
      )}
    </div>
  )
}
