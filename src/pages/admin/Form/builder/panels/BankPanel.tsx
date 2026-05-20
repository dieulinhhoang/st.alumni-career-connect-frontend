import { useState } from 'react'
import { Input } from 'antd'
import { SearchOutlined, PlusOutlined } from '@ant-design/icons'
import type { Question } from '../../../../../feature/form/types'
import { QUESTION_BANK } from '../../../../../feature/form/api'

interface BankPanelProps {
  onAddBlank: (type: string) => void
  onDropFromBank: (question: Question) => void
}

export function BankPanel({ onAddBlank, onDropFromBank }: BankPanelProps) {
  const [search, setSearch] = useState('')
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null)

  const filtered = QUESTION_BANK.filter(q =>
    !search || q.title.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>

      {/* Header */}
      <div style={{ padding: '12px 14px 10px', borderBottom: '1px solid #f0f4f8' }}>
        <div style={{ fontSize: 15  , fontWeight: 600, color: '#374151', marginBottom: 8 }}>Thư viện câu hỏi</div>
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

      {/* Question list */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '10px 14px 14px' }}>
        {filtered.length === 0 ? (
          <div style={{ padding: '24px 0', textAlign: 'center', color: '#94a3b8', fontSize: 13 }}>
            Không tìm thấy kết quả
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
            {filtered.map((q, i) => (
              <div
                key={i}
                draggable
                onDragStart={e => e.dataTransfer.setData('application/x-bank-question', JSON.stringify(q))}
                onMouseEnter={() => setHoveredIdx(i)}
                onMouseLeave={() => setHoveredIdx(null)}
                style={{
                  padding: '9px 12px',
                  borderRadius: 9,
                  border: `1px solid ${hoveredIdx === i ? '#d1d5db' : '#e5e7eb'}`,
                  background: '#fff',
                  cursor: 'grab',
                  transition: 'all .14s',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  gap: 8,
                  boxShadow: hoveredIdx === i ? '0 2px 6px rgba(0,0,0,.06)' : 'none',
                }}
              >
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 12.5, color: '#1e293b', fontWeight: 500, lineHeight: 1.4 }}>
                    {q.title}
                  </div>
                </div>

                {/* Nút + chỉ hiện khi hover */}
                <button
                  onClick={() => onDropFromBank(q)}
                  aria-label={`Thêm câu hỏi: ${q.title}`}
                  style={{
                    width: 24,
                    height: 24,
                    border: '1px solid #d1d5db',
                    borderRadius: 6,
                    background: '#f9fafb',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#6b7280',
                    flexShrink: 0,
                    transition: 'opacity .14s, background .12s',
                    opacity: hoveredIdx === i ? 1 : 0,
                    pointerEvents: hoveredIdx === i ? 'auto' : 'none',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.background = '#374151'
                    e.currentTarget.style.borderColor = '#374151'
                    e.currentTarget.style.color = '#fff'
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.background = '#f9fafb'
                    e.currentTarget.style.borderColor = '#d1d5db'
                    e.currentTarget.style.color = '#6b7280'
                  }}
                >
                  <PlusOutlined style={{ fontSize: 10 }} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}