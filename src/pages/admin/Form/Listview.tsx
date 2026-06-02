import { useState } from 'react'
import { Tooltip, Tag, Button, Input, Space, Typography, Flex } from 'antd'
import {
  EyeOutlined, EditOutlined, CopyOutlined, DeleteOutlined,
  SearchOutlined, FileOutlined, PlusOutlined, ThunderboltOutlined,
  QrcodeOutlined,
} from '@ant-design/icons'
import type { Form } from '../../../feature/form/types'
import CustomTable from '../../../components/common/customTable'
import { QRCodeModal } from './QRCodeModal'

const { Title, Text } = Typography

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

  const columns = [
    {
      title: 'STT',
      key: 'index',
      width: 48,
      align: 'center' as const,
      render: (_: any, __: Form, i: number) => (
        <Text type="secondary" style={{ fontSize: 12, fontVariantNumeric: 'tabular-nums', fontWeight: 500 }}>
          {String(i + 1).padStart(2, '0')}
        </Text>
      ),
    },
    {
      title: 'Form',
      dataIndex: 'name',
      key: 'name',
      render: (text: string, record: Form) => {
        const ac = getAccent(record.themeId as string)
        return (
          <Flex align="center" gap={11}>
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
                fontWeight: 600, fontSize: 14, color: '#0d1117',
                overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
              }}>
                {text}
              </div>
              <Text type="secondary" style={{ fontSize: 12 }}>
                {record.description || 'Chưa có mô tả'}
              </Text>
            </div>
          </Flex>
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
        <Tag color="teal" style={{ borderRadius: 20, fontWeight: 600, padding: '1px 10px', margin: 0 }}>
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
        <Text type="secondary" style={{ fontSize: 13, fontVariantNumeric: 'tabular-nums' }}>
          {fmt(date)}
        </Text>
      ),
    },
    {
      title: '',
      key: 'actions',
      width: 160,
      align: 'center' as const,
      render: (_: any, record: Form) => (
        <Space size={2}>
          <Tooltip title="Xem trước" mouseEnterDelay={0.4}>
            <Button type="text" size="small" icon={<EyeOutlined />}
              onClick={(e) => { e.stopPropagation(); onPreview(record) }} />
          </Tooltip>
          <Tooltip title="Chỉnh sửa" mouseEnterDelay={0.4}>
            <Button type="text" size="small" icon={<EditOutlined />}
              onClick={(e) => { e.stopPropagation(); onEdit(record) }} />
          </Tooltip>
          <Tooltip title="QR Code" mouseEnterDelay={0.4}>
            <Button type="text" size="small" icon={<QrcodeOutlined />}
              onClick={(e) => { e.stopPropagation(); setQrForm(record) }} />
          </Tooltip>
          <Tooltip title="Nhân bản" mouseEnterDelay={0.4}>
            <Button type="text" size="small" icon={<CopyOutlined />}
              onClick={(e) => { e.stopPropagation(); onDup(record) }} />
          </Tooltip>
          <Tooltip title="Xóa" mouseEnterDelay={0.4}>
            <Button type="text" size="small" danger icon={<DeleteOutlined />}
              onClick={(e) => { e.stopPropagation(); onDelete(record.id as number) }} />
          </Tooltip>
        </Space>
      ),
    },
  ]

  return (
    <div style={{ padding: '28px 32px 48px', minHeight: '100vh' }}>

      {/* Page header */}
      <Flex justify="space-between" align="flex-end" wrap="wrap" gap={12} style={{ marginBottom: 24 }}>
        <div>
          <Text style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.09em', textTransform: 'uppercase', color: '#0f766e', display: 'block', marginBottom: 5 }}>
            Quản lý
          </Text>
          <Title level={3} style={{ margin: 0, letterSpacing: '-0.5px', lineHeight: 1 }}>
            Form khảo sát
          </Title>
          <Text type="secondary" style={{ fontSize: 13, marginTop: 5, display: 'block' }}>
            {forms.length} form · Tạo và quản lý bộ câu hỏi khảo sát
          </Text>
        </div>

        <Space>
          <Button
            icon={<ThunderboltOutlined />}
            onClick={onAI}
            style={{ borderColor: '#fcd34d', color: '#b45309', background: '#fffbeb' }}
          >
            Tạo bằng AI
          </Button>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={onCreate}
            style={{ background: '#1D9E75', borderColor: '#1D9E75' }}
          >
            Form mới
          </Button>
        </Space>
      </Flex>

      {/* Card wrapper */}
      <div style={{ background: '#fff' }}>
        {/* Toolbar */}
        <Flex align="center" gap={8} style={{ padding: '10px 16px', borderBottom: '1px solid #e2e8f0' }}>
          <Input
            prefix={<SearchOutlined style={{ color: '#94a3b8', fontSize: 12 }} />}
            placeholder="Tìm kiếm form..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ width: 220 }}
            allowClear
          />
          <Text type="secondary" style={{ marginLeft: 'auto', fontSize: 12, fontVariantNumeric: 'tabular-nums' }}>
            {filtered.length} / {forms.length} form
          </Text>
        </Flex>

        {/* Table */}
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
