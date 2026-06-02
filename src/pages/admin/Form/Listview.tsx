import { useState } from 'react'
import { Tooltip, Tag } from 'antd'
import {
  EyeOutlined, EditOutlined, CopyOutlined, DeleteOutlined,
  SearchOutlined, FileOutlined, PlusOutlined, ThunderboltOutlined,
  QrcodeOutlined,
} from '@ant-design/icons'
import type { Form } from '../../../feature/form/types'
import CustomTable from '../../../components/common/customTable'
import { QRCodeModal } from './QRCodeModal'

//  Design tokens 
const T = {
  accent:      '#0f766e',
  accentHover: '#0d6b63',
  accentSoft:  '#f0fdfa',
  accentMid:   '#99f6e4',
  text:        '#0d1117',
  textSub:     '#536178',
  muted:       '#94a3b8',
  border:      '#e2e8f0',
  borderFocus: '#0f766e',
  surface:     '#ffffff',
  bg:          '#f8fafc',
  bgAlt:       '#f1f5f9',
  danger:      '#dc2626',
  dangerSoft:  '#fef2f2',
  ai:          '#b45309',
  aiSoft:      '#fffbeb',
  aiBorder:    '#fcd34d',
  shadow:      '0 1px 3px rgba(15,118,110,0.08), 0 1px 2px rgba(0,0,0,0.04)',
}

const ACCENT_MAP: Record<string, { base: string; soft: string }> = {
  blue:   { base: '#2563eb', soft: '#eff6ff' },
  green:  { base: '#0f766e', soft: '#f0fdfa' },
  red:    { base: '#dc2626', soft: '#fef2f2' },
  purple: { base: '#7c3aed', soft: '#f5f3ff' },
  orange: { base: '#ea580c', soft: '#fff7ed' },
  teal:   { base: '#0d9488', soft: '#f0fdfa' },
  brown:  { base: '#78716c', soft: '#fafaf9' },
  gray:   { base: '#475569', soft: '#f8fafc' },
}

const getAccent = (id?: string) => ACCENT_MAP[id as string] ?? ACCENT_MAP.blue
const fmt = (d?: string) =>
  d ? new Date(d).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' }) : '—'

interface ListViewProps {
  forms: Form[]
  onCreate: () => void
  onAI: () => void
  onEdit: (f: Form) => void
  onPreview: (f: Form) => void
  onDup: (f: Form) => void
  onDelete: (id: number) => void
}

const ActionBtn = ({
  icon, label, onClick, danger = false,
}: {
  icon: React.ReactNode
  label: string
  onClick: (e: React.MouseEvent<HTMLButtonElement>) => void
  danger?: boolean
}) => (
  <Tooltip title={label} mouseEnterDelay={0.4}>
    <button
      onClick={onClick}
      aria-label={label}
      style={{
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        width: 30, height: 30, borderRadius: 7,
        border: 'none', background: 'transparent',
        color: danger ? T.danger : T.muted,
        cursor: 'pointer', fontSize: 13,
        transition: 'background 0.15s, color 0.15s',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = danger ? T.dangerSoft : T.accentSoft
        e.currentTarget.style.color      = danger ? T.danger     : T.accent
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = 'transparent'
        e.currentTarget.style.color      = danger ? T.danger : T.muted
      }}
    >
      {icon}
    </button>
  </Tooltip>
)

export default function ListView({
  forms, onCreate, onAI, onEdit, onPreview, onDup, onDelete,
}: ListViewProps) {
  const [search, setSearch] = useState('')
  const [qrForm, setQrForm] = useState<Form | null>(null)

  const filtered = forms.filter((f) =>
    f.name.toLowerCase().includes(search.toLowerCase())
  )

  const getSurveyUrl = (form: Form) =>
    `${window.location.origin}/survey/${form.id}`

  //  Columns 
  const columns = [
    {
      title: 'STT',
      key: 'index',
      width: 48,
      align: 'center' as const,
      render: (_: any, __: Form, i: number) => (
        <span style={{ fontSize: 12, color: T.muted, fontVariantNumeric: 'tabular-nums', fontWeight: 500 }}>
          {String(i + 1).padStart(2, '0')}
        </span>
      ),
    },
    {
      title: 'Form',
      dataIndex: 'name',
      key: 'name',
      render: (text: string, record: Form) => {
        const ac = getAccent(record.themeId as string)
        return (
          <div style={{ display: 'flex', alignItems: 'center', gap: 11 }}>
            <div style={{
              width: 36, height: 36, borderRadius: 9, flexShrink: 0,
              background: ac.soft, color: ac.base,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              border: `1.5px solid ${ac.base}22`, fontSize: 14,
            }}>
              <FileOutlined />
            </div>
            <div style={{ minWidth: 0 }}>
              <div style={{
                fontWeight: 600, fontSize: 14, color: T.text,
                overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                letterSpacing: '-0.15px',
              }}>
                {text}
              </div>
              <div style={{ fontSize: 12, color: T.muted, marginTop: 2 }}>
                {record.description || 'Chưa có mô tả'}
              </div>
            </div>
          </div>
        )
      },
    },
    {
      title: 'Câu hỏi',
      dataIndex: 'questions',
      key: 'questions',
      width: 110,
      align: 'center' as const,
      render: (qs: any[]) => (
        <Tag style={{
          background: T.accentSoft, color: T.accent,
          border: `1px solid ${T.accentMid}`,
          borderRadius: 20, fontSize: 12, fontWeight: 600,
          padding: '1px 10px', margin: 0,
        }}>
          {qs.length} câu
        </Tag>
      ),
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'createdat',
      key: 'createdat',
      width: 120,
      align: 'center' as const,
      render: (date: string) => (
        <span style={{ fontSize: 13, color: T.textSub, fontVariantNumeric: 'tabular-nums' }}>
          {fmt(date)}
        </span>
      ),
    },
    {
      title: '',
      key: 'actions',
      width: 160,
      align: 'center' as const,
      render: (_: any, record: Form) => (
        <div style={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
          <ActionBtn icon={<EyeOutlined />}      label="Xem trước"   onClick={(e) => { e.stopPropagation(); onPreview(record) }} />
          <ActionBtn icon={<EditOutlined />}     label="Chỉnh sửa"   onClick={(e) => { e.stopPropagation(); onEdit(record) }} />
          <ActionBtn icon={<QrcodeOutlined />}   label="QR Code"     onClick={(e) => { e.stopPropagation(); setQrForm(record) }} />
          <ActionBtn icon={<CopyOutlined />}     label="Nhân bản"    onClick={(e) => { e.stopPropagation(); onDup(record) }} />
          <ActionBtn icon={<DeleteOutlined />}   label="Xóa"         onClick={(e) => { e.stopPropagation(); onDelete(record.id as number) }} danger />
        </div>
      ),
    },
  ]

  return (
    <div style={{
      padding: '28px 32px 48px',
      minHeight: '100vh', fontFamily: "'Geist', 'DM Sans', sans-serif",
    }}>

      {/*  Page header  */}
      <div style={{
        display: 'flex', justifyContent: 'space-between',
        alignItems: 'flex-end', flexWrap: 'wrap', gap: 12, marginBottom: 24,
      }}>
        <div>
          <p style={{
            margin: 0, fontSize: 11, fontWeight: 700,
            letterSpacing: '0.09em', textTransform: 'uppercase',
            color: T.accent, marginBottom: 5,
          }}>
            Quản lý
          </p>
          <h2 style={{
            margin: 0, fontSize: 22, fontWeight: 700,
            color: T.text, letterSpacing: '-0.5px', lineHeight: 1,
          }}>
            Form khảo sát
          </h2>
          <p style={{ margin: '5px 0 0', fontSize: 13, color: T.muted }}>
            {forms.length} form · Tạo và quản lý bộ câu hỏi khảo sát
          </p>
        </div>

        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          {/* AI button */}
          <button
            onClick={onAI}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              height: 36, padding: '0 14px', borderRadius: 8,
              border: `1.5px solid ${T.aiBorder}`, background: T.aiSoft,
              color: T.ai, fontWeight: 600, fontSize: 13,
              cursor: 'pointer', transition: 'box-shadow 0.15s',
              fontFamily: 'inherit', letterSpacing: '-0.1px',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.boxShadow = '0 4px 12px #f59e0b22' }}
            onMouseLeave={(e) => { e.currentTarget.style.boxShadow = 'none' }}
          >
            <ThunderboltOutlined style={{ fontSize: 13 }} />
            Tạo bằng AI
          </button>

          {/* New form button */}
          <button
            onClick={onCreate}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              height: 36, padding: '0 16px', borderRadius: 8,
              border: 'none', background: T.accent,
              color: '#fff',
              background: '#1D9E75', borderColor: '#1D9E75', fontWeight: 600, fontSize: 13,
              cursor: 'pointer', letterSpacing: '-0.1px',
              fontFamily: 'inherit',
            } as React.CSSProperties}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = T.accentHover
              e.currentTarget.style.boxShadow  = '0 4px 16px rgba(15,118,110,0.36)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = T.accent
              e.currentTarget.style.boxShadow  = '0 2px 8px rgba(15,118,110,0.28)'
            }}
          >
            <PlusOutlined style={{ fontSize: 13 }} />
            Form mới
          </button>
        </div>
      </div>

      {/*  Card wrapper  */}
      <div style={{ background: T.surface }}>

        {/*  Toolbar  */}
        <div style={{
          padding: '10px 16px',
          borderBottom: `1px solid ${T.border}`,
          display: 'flex', alignItems: 'center', gap: 8,
          background: T.surface,
        }}>
          {/* Search input */}
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
            <SearchOutlined style={{
              position: 'absolute', left: 10, fontSize: 12,
              color: T.muted, zIndex: 1, pointerEvents: 'none',
            }} />
            <input
              placeholder="Tìm kiếm form..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                height: 32, paddingLeft: 30, paddingRight: 10, width: 220,
                border: `1.5px solid ${T.border}`, borderRadius: 8,
                fontSize: 13, color: T.text, background: T.bg,
                outline: 'none', transition: 'border 0.15s, background 0.15s',
                fontFamily: 'inherit',
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = T.borderFocus
                e.currentTarget.style.background  = '#fff'
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = T.border
                e.currentTarget.style.background  = T.bg
              }}
            />
          </div>

          {/* Count */}
          <span style={{
            marginLeft: 'auto', fontSize: 12, color: T.muted,
            fontVariantNumeric: 'tabular-nums',
          }}>
            {filtered.length} / {forms.length} form
          </span>
        </div>

        {/*  Table  */}
        <CustomTable
          columns={columns}
          data={{ data: filtered }}
          pagination={{
            pageSize: 10,
            total: filtered.length,
            showTotal: (total: number, range: [number, number]) =>
              `Hiển thị ${range[0]}–${range[1]} trong ${total} form`,
            position: ['bottomCenter'],
          }}
          onRow={(record: Form) => ({
            onClick: () => onPreview(record),
            style: { cursor: 'pointer' },
          })}
          rowKey="id"
        />
      </div>

      {/* QR Code Modal */}
      {qrForm && (
        <QRCodeModal
          open={!!qrForm}
          onClose={() => setQrForm(null)}
          surveyUrl={getSurveyUrl(qrForm)}
          formName={qrForm.name}
        />
      )}
    </div>
  )
}
