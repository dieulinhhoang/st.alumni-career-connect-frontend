import { Input, Spin, Button, Typography } from 'antd'
import { SearchOutlined, PlusOutlined } from '@ant-design/icons'
import type { Question } from '../../../../../feature/form/types'
import { useQuestionBank } from '../../../../../feature/form/hooks/useQuestionBank'
import { useState } from 'react'

const { Text } = Typography

interface BankPanelProps {
  onAddBlank: (type: string) => void
  onDropFromBank: (question: Question) => void
}

export function BankPanel({ onAddBlank: _onAddBlank, onDropFromBank }: BankPanelProps) {
  const { questions, loading, error, search, setSearch } = useQuestionBank()
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
      {/* Header */}
      <div style={{ padding: '12px 14px 10px', borderBottom: '1px solid #f0f4f8' }}>
        <Text strong style={{ fontSize: 15, display: 'block', marginBottom: 8 }}>Thư viện câu hỏi</Text>
        <Input
          prefix={<SearchOutlined style={{ color: '#94a3b8', fontSize: 12 }} />}
          placeholder="Tìm câu hỏi mẫu..."
          size="small"
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ borderRadius: 8 }}
          allowClear
        />
      </div>

      {/* Body */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '10px 14px 14px' }}>
        {loading && (
          <div style={{ padding: '32px 0', display: 'flex', justifyContent: 'center' }}>
            <Spin size="small" />
          </div>
        )}

        {!loading && error && (
          <Text type="danger" style={{ display: 'block', padding: '16px 0', textAlign: 'center', fontSize: 12 }}>
            {error}
          </Text>
        )}

        {!loading && !error && questions.length === 0 && (
          <Text type="secondary" style={{ display: 'block', padding: '24px 0', textAlign: 'center', fontSize: 13 }}>
            {search ? 'Không tìm thấy kết quả' : 'Thư viện câu hỏi trống'}
          </Text>
        )}

        {!loading && !error && questions.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
            {questions.map((q, i) => {
              const asQuestion: Question = {
                id: q.id, type: q.type, title: q.title,
                required: false, options: q.options ?? [],
                sectionId: '', order: 0,
              }
              const isHovered = hoveredIdx === i
              return (
                <div
                  key={q.id ?? i}
                  draggable
                  onDragStart={e => e.dataTransfer.setData('application/x-bank-question', JSON.stringify(asQuestion))}
                  onMouseEnter={() => setHoveredIdx(i)}
                  onMouseLeave={() => setHoveredIdx(null)}
                  style={{
                    padding: '9px 12px', borderRadius: 9,
                    border: `1px solid ${isHovered ? '#d1d5db' : '#e5e7eb'}`,
                    background: '#fff', cursor: 'grab',
                    transition: 'all .14s',
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8,
                    boxShadow: isHovered ? '0 2px 6px rgba(0,0,0,.06)' : 'none',
                  }}
                >
                  <div style={{ flex: 1, minWidth: 0 }}>
                    {/* {q.category && (
                      <Text type="secondary" style={{ fontSize: 10.5, display: 'block', marginBottom: 2, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                        {q.category}
                      </Text>
                    )} */}
                    <Text style={{ fontSize: 12.5, fontWeight: 500, lineHeight: 1.4 }}>{q.title}</Text>
                  </div>
                  <Button
                    size="small"
                    icon={<PlusOutlined  />}
                    onClick={() => onDropFromBank(asQuestion)}
                    aria-label={`Thêm câu hỏi: ${q.title}`}
                    style={{ flexShrink: 0, opacity: isHovered ? 1 : 0, pointerEvents: isHovered ? 'auto' : 'none', transition: 'opacity .14s', width: 24, height: 24, padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                  />
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
